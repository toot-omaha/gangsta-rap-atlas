#!/usr/bin/env python3
"""G-RAPディスクの新規収集パイプライン。

方針(重要度順):
  1. Discogs を「G-RAPデータベース」として使う。genre=Hip Hop かつ
     style=Gangsta のリリースだけを対象にする(=このリリースがG-RAPで
     あることの一次的な裏付け)。iTunes単体では絶対に判定しない。
  2. Discogsで候補になったものを iTunes Search API に照合し、ジャケ写・
     30秒試聴・実在確認を得る(iTunesは「付加情報の取得先」であって
     「G-RAP判定の根拠」にはしない)。
  3. アーティストの出身地を MusicBrainz(area/begin-area)で引き、
     取れた地名を Nominatim(OSM)でジオコーディングして緯度経度化する。
     解決できたものは既存地域(data.js)に合流、できなければ
     unclassified.json に貯めて地図には出さない(質を落とさないため)。

出力:
  scripts/candidates.json    Discogs+iTunes+地域まで解決した収集候補(レビュー用。
                              data.js には自動反映しない)
  scripts/unclassified.json  地域が解決できなかった候補。data.js の
                              UNCLASSIFIED_REGION(西海岸沖の「未確認情報」ピン)
                              にレビュー後手動で合流させる想定

レートリミット: Discogs 25/分(未認証)、MusicBrainz 1/秒、Nominatim 1/秒、
iTunes 20/分。すべて .cache/ 以下にキャッシュし、同じ問い合わせを繰り返さない。
"""

import json
import pathlib
import re
import sys
import time
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
CACHE = ROOT / '.cache'
UA = 'GangstaRapAtlas-collector/0.1 (o.takashix@gmail.com; learning project)'


class RateLimited:
    """API種別ごとに独立したレートリミット+ディスクキャッシュ付きGET。"""

    def __init__(self, name, min_interval):
        self.dir = CACHE / name
        self.dir.mkdir(parents=True, exist_ok=True)
        self.min_interval = min_interval
        self._last = 0.0

    def get(self, url, headers=None):
        key = re.sub(r'[^a-z0-9]+', '_', url.lower())[-150:]
        cache_file = self.dir / f'{key}.json'
        if cache_file.exists():
            return json.loads(cache_file.read_text())
        wait = self.min_interval - (time.time() - self._last)
        if wait > 0:
            time.sleep(wait)
        req = urllib.request.Request(url, headers={'User-Agent': UA, **(headers or {})})
        self._last = time.time()
        with urllib.request.urlopen(req, timeout=20) as res:
            data = json.loads(res.read().decode('utf-8'))
        cache_file.write_text(json.dumps(data, ensure_ascii=False))
        return data


discogs = RateLimited('discogs', 2.6)      # 25/分
musicbrainz = RateLimited('musicbrainz', 1.1)
nominatim = RateLimited('nominatim', 1.1)
itunes = RateLimited('itunes', 3.2)        # enrich.py と同じ目安

norm = lambda s: re.sub(r'[^a-z0-9]+', '', s.lower())


# ---------- 1. Discogs: G-RAP判定の一次データベース ----------
def discogs_harvest(pages=4, per_page=100, fmt='Album'):
    """style=Gangsta のリリースを人気順(community have数)に取得し、
    master_id で重複プレスを除去して (artist, title, year, label, country) を返す。"""
    seen_master = set()
    out = []
    for page in range(1, pages + 1):
        url = (
            'https://api.discogs.com/database/search'
            f'?genre=Hip%20Hop&style=Gangsta&type=release&format={fmt}'
            f'&sort=have&sort_order=desc&per_page={per_page}&page={page}'
        )
        data = discogs.get(url)
        for r in data.get('results', []):
            mid = r.get('master_id') or r.get('id')
            if mid in seen_master:
                continue
            seen_master.add(mid)
            title = r.get('title', '')
            if ' - ' not in title:
                continue
            artist, disc_title = title.split(' - ', 1)
            out.append({
                'artist': re.sub(r'\s*\(\d+\)$', '', artist).replace('*', '').strip(),
                'title': disc_title.strip(),
                'year': r.get('year'),
                'label': (r.get('label') or [None])[0],
                'country': r.get('country'),
                'discogs_id': r.get('id'),
                'discogs_style': r.get('style', []),
            })
        if page >= data.get('pagination', {}).get('pages', 1):
            break
    return out


# ---------- 2. iTunes: ジャケ写・試聴・実在確認(判定には使わない) ----------
def itunes_match(artist, title):
    na, nt = norm(artist), norm(title)
    term = urllib.parse.quote(artist)
    artists = itunes.get(
        f'https://itunes.apple.com/search?term={term}&entity=musicArtist&limit=5'
    ).get('results', [])
    candidates = [
        a for a in artists
        if norm(a.get('artistName', '')) and
        (norm(a['artistName']) in na or na in norm(a['artistName']))
    ][:3] or artists[:1]

    hits = []
    for a in candidates:
        lu = f"https://itunes.apple.com/lookup?id={a['artistId']}&entity=album&limit=200"
        for r in itunes.get(lu).get('results', []):
            rt = norm(r.get('collectionName', ''))
            if r.get('wrapperType') == 'collection' and rt and (nt in rt or rt in nt):
                hits.append(r)
        if hits:
            break
    hits.sort(key=lambda r: len(r.get('collectionName', '')))
    if not hits:
        return None
    hit = hits[0]
    return {'art': hit.get('artworkUrl100'), 'link': hit.get('collectionViewUrl')}


# ---------- 3. MusicBrainz + Nominatim: 出身地→緯度経度 ----------
def artist_hometown(artist):
    q = urllib.parse.quote(f'artist:"{artist}"')
    data = musicbrainz.get(f'https://musicbrainz.org/ws/2/artist/?query={q}&fmt=json')
    for a in data.get('artists', []):
        if norm(a.get('name', '')) == norm(artist):
            area = a.get('begin-area') or a.get('area')
            if area:
                return area.get('name')
    return None


def geocode(place):
    if not place:
        return None
    q = urllib.parse.quote(place)
    res = nominatim.get(f'https://nominatim.openstreetmap.org/search?q={q}&format=json&limit=1')
    if not res:
        return None
    return {'lng': float(res[0]['lon']), 'lat': float(res[0]['lat']), 'name': place}


# ---------- 既存データとの照合 ----------
def load_existing():
    src = (ROOT / 'data.js').read_text()
    q = r"""('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")"""
    unquote = lambda s: s[1:-1].replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\')

    albums = set()
    for a, t in re.findall(rf"artist:\s*{q},\s*title:\s*{q}", src):
        albums.add((norm(unquote(a)), norm(unquote(t))))

    regions = []
    for m in re.finditer(
        rf"id:\s*{q},\s*name:\s*{q},\s*area:\s*{q},\s*\n\s*lng:\s*(-?[\d.]+),\s*lat:\s*(-?[\d.]+)", src
    ):
        regions.append({
            'id': unquote(m.group(1)), 'name': unquote(m.group(2)),
            'lng': float(m.group(4)), 'lat': float(m.group(5)),
        })
    return albums, regions


def nearest_region(lng, lat, regions, max_km=60):
    import math
    best, best_d = None, max_km
    for r in regions:
        # 簡易な距離近似(緯度経度差→km)。地域判定の粗いスクリーニング用途なので十分。
        dx = (lng - r['lng']) * 111 * math.cos(math.radians(lat))
        dy = (lat - r['lat']) * 111
        d = math.hypot(dx, dy)
        if d < best_d:
            best, best_d = r, d
    return best


def main():
    pages = int(sys.argv[1]) if len(sys.argv) > 1 else 3
    existing_albums, regions = load_existing()
    print(f'既存ディスク {len(existing_albums)} 件 / 既存地域 {len(regions)} 件')

    print(f'[1/4] Discogsから収集中(style=Gangsta, {pages}ページ)…')
    harvested = discogs_harvest(pages=pages)
    print(f'  {len(harvested)} 件(重複プレス除去後)')

    fresh = [h for h in harvested if (norm(h['artist']), norm(h['title'])) not in existing_albums]
    print(f'  うち既存と未重複: {len(fresh)} 件')

    hometown_cache = {}
    candidates, unclassified = [], []

    for i, h in enumerate(fresh, 1):
        print(f'[2/4] iTunes照合 {i}/{len(fresh)}: {h["artist"]} - {h["title"]}', file=sys.stderr)
        try:
            enrich = itunes_match(h['artist'], h['title'])
        except Exception as e:
            print(f'    iTunesエラー: {e}', file=sys.stderr)
            enrich = None

        if h['artist'] not in hometown_cache:
            print(f'[3/4] 出身地照会: {h["artist"]}', file=sys.stderr)
            try:
                town = artist_hometown(h['artist'])
                geo = geocode(town) if town else None
            except Exception as e:
                print(f'    MusicBrainz/Nominatimエラー: {e}', file=sys.stderr)
                geo = None
            hometown_cache[h['artist']] = geo
        geo = hometown_cache[h['artist']]

        record = {**h, 'itunes': enrich}
        if geo:
            near = nearest_region(geo['lng'], geo['lat'], regions)
            record['hometown'] = geo
            record['suggested_region'] = near['id'] if near else None
            record['suggested_region_name'] = near['name'] if near else geo['name']
            candidates.append(record)
        else:
            unclassified.append(record)

    (ROOT / 'scripts' / 'candidates.json').write_text(
        json.dumps(candidates, ensure_ascii=False, indent=1))
    (ROOT / 'scripts' / 'unclassified.json').write_text(
        json.dumps(unclassified, ensure_ascii=False, indent=1))

    print(f'[4/4] 完了: candidates.json {len(candidates)}件 / unclassified.json {len(unclassified)}件')


if __name__ == '__main__':
    main()
