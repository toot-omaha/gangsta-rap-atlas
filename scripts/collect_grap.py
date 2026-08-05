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
STATE_FILE = ROOT / 'scripts' / 'collect_state.json'
# data.js に載る/載らないに関わらず「一度レビューして判断済み」の discogs_id を
# 記録するレジャー。除外(Various、地域不明等)した候補が次のバッチで
# 再度候補として出てくるのを防ぐ。マージ済み・却下済みの両方をここに積む。
PROCESSED_FILE = ROOT / 'scripts' / 'processed_ids.json'


def load_state():
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text())
    return {'last_page': 0}


def save_state(state):
    STATE_FILE.write_text(json.dumps(state, ensure_ascii=False, indent=1))


def load_processed():
    """discogs_id と正規化artist|titleの両方でレジャーを持つ。
    同じ盤の別プレス(別id)でも artist|title が一致すれば重複として弾くため。"""
    if PROCESSED_FILE.exists():
        d = json.loads(PROCESSED_FILE.read_text())
        if isinstance(d, list):  # 旧形式(idのみのリスト)からの移行
            return {'ids': set(d), 'titles': set()}
        return {'ids': set(d.get('ids', [])), 'titles': set(d.get('titles', []))}
    return {'ids': set(), 'titles': set()}


def add_processed(items):
    """items: [(discogs_id, artist, title), ...]"""
    cur = load_processed()
    for did, artist, title in items:
        cur['ids'].add(str(did))
        cur['titles'].add(f'{norm(artist)}|{norm(title)}')
    PROCESSED_FILE.write_text(json.dumps(
        {'ids': sorted(cur['ids']), 'titles': sorted(cur['titles'])}, ensure_ascii=False, indent=1))


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
wikipedia = RateLimited('wikipedia', 1.1)

norm = lambda s: re.sub(r'[^a-z0-9]+', '', s.lower())


# ---------- 1. Discogs: G-RAP判定の一次データベース ----------
def discogs_harvest(start_page, pages, per_page=100, fmt='Album', sort='year', sort_order='asc'):
    """style=Gangsta のリリースを取得し(デフォルトは古い年代順)、
    master_id で重複プレスを除去して (artist, title, year, label, country) を返す。
    start_page から連番で pages 件、前回の続きから取得する(同じページの
    再走査を避けるため collect_state.json にページカーソルを永続化している)。"""
    seen_master = set()
    out = []
    last_page = start_page - 1
    for page in range(start_page, start_page + pages):
        url = (
            'https://api.discogs.com/database/search'
            f'?genre=Hip%20Hop&style=Gangsta&type=release&format={fmt}'
            f'&sort={sort}&sort_order={sort_order}&per_page={per_page}&page={page}'
        )
        data = discogs.get(url)
        last_page = page
        for r in data.get('results', []):
            mid = r.get('master_id') or r.get('id')
            if mid in seen_master:
                continue
            seen_master.add(mid)
            title = r.get('title', '')
            if ' - ' not in title:
                continue
            artist, disc_title = title.split(' - ', 1)
            artist = re.sub(r'\s*\(\d+\)$', '', artist).replace('*', '').strip()
            if norm(artist) in ('various', 'variousartists'):
                # コンピ盤は単一の出身地を持たないため、地域判定モデルに載らない。
                # 別プレスのIDで何度も"Japan"等に誤爆して出てくる主因でもあるため除外。
                continue
            uri = r.get('uri') or ''
            out.append({
                'artist': artist,
                'title': disc_title.strip(),
                'year': r.get('year'),
                'label': (r.get('label') or [None])[0],
                'country': r.get('country'),
                'discogs_id': r.get('id'),
                'discogs_url': f'https://www.discogs.com{uri}' if uri else None,
                'discogs_style': r.get('style', []),
            })
        if page >= data.get('pagination', {}).get('pages', 1):
            break
    return out, last_page


# ---------- 1.5 Discogsタグの多数決確認 ----------
# style=Gangsta 検索で1件でもヒットすれば候補になるが、実際には「複数ある
# プレスのうち1件だけがGangstaタグを持ち、他の大半のプレスは別ジャンル」
# というケースがある(例: Public Enemy『Fear Of A Black Planet』は
# ある1プレスにだけ誤って"Gangsta"が付いていたが、他は全て"Conscious"のみ)。
# 単発の外れタグで誤って収録されるのを防ぐため、同一作品の全プレスを
# 横断して多数決を取る。
def gangsta_consensus(artist, title):
    term = urllib.parse.quote(f'{artist} {title}')
    data = discogs.get(f'https://api.discogs.com/database/search?q={term}&type=release&per_page=15')
    na, nt = norm(artist), norm(title)
    total, gangsta = 0, 0
    for r in data.get('results', []):
        rt = norm(r.get('title', ''))
        if na not in rt or nt not in rt:
            continue
        total += 1
        if 'Gangsta' in (r.get('style') or []):
            gangsta += 1
    if total == 0:
        return None  # 照合不能(判定材料なし)
    return {'total': total, 'gangsta': gangsta, 'ratio': gangsta / total}


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


# ---------- Wikipedia: 出身地/レペゼン地の裏取り(レビュー用の参考文) ----------
# MusicBrainzのbegin-areaは「戸籍上の出生地」であって「レペゼンしている土地」
# とは限らない(例: Ice-Tは出生地ニュージャージー州ニューアークだが、実際は
# LAサウスセントラルの顔)。Wikipediaの"Early life"節はこの手の経歴が
# 文章で書かれているため、地域判定の裏取りに使う。ここでは自動判定はせず、
# レビュー時に読む参考テキストとして candidates.json に載せるだけ。
_WIKI_TAG = re.compile(r'\{\{[^{}]*\}\}|\[\[(?:[^|\]]*\|)?([^\]]*)\]\]|<ref[^>]*>.*?</ref>|<[^>]+>', re.S)

def wiki_bio(artist):
    q = urllib.parse.quote(f'{artist} rapper')
    data = wikipedia.get(
        f'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={q}&format=json&srlimit=1'
    )
    hits = data.get('query', {}).get('search', [])
    if not hits:
        return None
    title = hits[0]['title']

    sec = wikipedia.get(
        f'https://en.wikipedia.org/w/api.php?action=parse&page={urllib.parse.quote(title)}'
        f'&prop=sections&format=json'
    )
    if 'error' in sec:
        return None
    idx = next(
        (s['index'] for s in sec.get('parse', {}).get('sections', [])
         if 'early life' in s['line'].lower() or 'biography' in s['line'].lower()),
        None,
    )

    if idx is not None:
        body = wikipedia.get(
            f'https://en.wikipedia.org/w/api.php?action=parse&page={urllib.parse.quote(title)}'
            f'&prop=wikitext&section={idx}&format=json'
        )
        wt = body.get('parse', {}).get('wikitext', {}).get('*', '')
    else:
        body = wikipedia.get(
            f'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true'
            f'&explaintext=true&titles={urllib.parse.quote(title)}&format=json'
        )
        wt = next(iter(body.get('query', {}).get('pages', {}).values()), {}).get('extract', '')

    def unlink(m):
        return m.group(1) if m.group(1) is not None else ''
    plain = _WIKI_TAG.sub(unlink, wt)
    plain = re.sub(r'\n{2,}', '\n', plain).strip()
    return {'title': title, 'excerpt': plain[:600]}


# ---------- 3. MusicBrainz + Nominatim: 出身地→緯度経度 ----------
def artist_hometown(artist):
    """(都市名, 国名) を返す。国名は同名異義の地名(Crenshaw, Carson 等)を
    ジオコーディングで正しく曖昧性解消するために使う。"""
    q = urllib.parse.quote(f'artist:"{artist}"')
    data = musicbrainz.get(f'https://musicbrainz.org/ws/2/artist/?query={q}&fmt=json')
    for a in data.get('artists', []):
        if norm(a.get('name', '')) == norm(artist):
            area = a.get('begin-area') or a.get('area')
            country = (a.get('area') or {}).get('name')
            if area:
                return area.get('name'), country
    return None, None


def geocode(place, country=None):
    if not place:
        return None
    # 国名を付けて曖昧な地名(Crenshaw=LAの地区 vs アラバマの町、等)を
    # 誤爆させない。国が分からない場合のみ地名単体で検索する。
    q_text = f'{place}, {country}' if country and country != place else place
    q = urllib.parse.quote(q_text)
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
    pages = int(sys.argv[1]) if len(sys.argv) > 1 else 2
    state = load_state()
    start_page = state['last_page'] + 1
    existing_albums, regions = load_existing()
    print(f'既存ディスク {len(existing_albums)} 件 / 既存地域 {len(regions)} 件')
    print(f'前回まで {state["last_page"]} ページ処理済み → 今回は {start_page}〜{start_page + pages - 1} ページ目')

    print(f'[1/4] Discogsから収集中(style=Gangsta, 年代順)…')
    harvested, last_page = discogs_harvest(start_page, pages)
    print(f'  {len(harvested)} 件(重複プレス除去後)')

    processed = load_processed()
    fresh, skipped_existing, skipped_processed = [], [], []
    for h in harvested:
        if (norm(h['artist']), norm(h['title'])) in existing_albums:
            skipped_existing.append(h)
        elif str(h['discogs_id']) in processed['ids'] or f"{norm(h['artist'])}|{norm(h['title'])}" in processed['titles']:
            skipped_processed.append(h)
        else:
            fresh.append(h)
    for h in skipped_existing:
        print(f'  [登録済みスキップ] {h["artist"]} - {h["title"]}')
    for h in skipped_processed:
        print(f'  [判断済みスキップ] {h["artist"]} - {h["title"]}')
    print(f'  うち既存と重複: {len(skipped_existing)} 件 / 判断済み(前回除外等): {len(skipped_processed)} 件'
          f' / 新規候補: {len(fresh)} 件')

    state['last_page'] = last_page
    save_state(state)
    print(f'  ページカーソルを {last_page} まで進めました(次回は {last_page + 1} ページ目から)')

    hometown_cache = {}
    wiki_cache = {}
    candidates, unclassified = [], []

    for i, h in enumerate(fresh, 1):
        print(f'[1.5/4] Gangstaタグ多数決 {i}/{len(fresh)}: {h["artist"]} - {h["title"]}', file=sys.stderr)
        try:
            consensus = gangsta_consensus(h['artist'], h['title'])
        except Exception as e:
            print(f'    Discogs多数決エラー: {e}', file=sys.stderr)
            consensus = None
        if consensus and consensus['ratio'] < 0.5:
            print(f'    [外れタグの疑いでスキップ] {h["artist"]} - {h["title"]}'
                  f' (Gangstaタグ {consensus["gangsta"]}/{consensus["total"]} プレス)')
            continue

        print(f'[2/4] iTunes照合 {i}/{len(fresh)}: {h["artist"]} - {h["title"]}', file=sys.stderr)
        try:
            enrich = itunes_match(h['artist'], h['title'])
        except Exception as e:
            print(f'    iTunesエラー: {e}', file=sys.stderr)
            enrich = None

        if h['artist'] not in hometown_cache:
            print(f'[3/4] 出身地照会: {h["artist"]}', file=sys.stderr)
            try:
                town, country = artist_hometown(h['artist'])
                geo = geocode(town, country) if town else None
            except Exception as e:
                print(f'    MusicBrainz/Nominatimエラー: {e}', file=sys.stderr)
                geo = None
            hometown_cache[h['artist']] = geo
        geo = hometown_cache[h['artist']]

        if h['artist'] not in wiki_cache:
            print(f'    Wikipedia照合: {h["artist"]}', file=sys.stderr)
            try:
                wiki_cache[h['artist']] = wiki_bio(h['artist'])
            except Exception as e:
                print(f'    Wikipediaエラー: {e}', file=sys.stderr)
                wiki_cache[h['artist']] = None
        wiki = wiki_cache[h['artist']]

        record = {**h, 'itunes': enrich, 'wikipedia': wiki, 'gangsta_consensus': consensus}
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

    # このバッチで一度サーフェスした候補は、採用・却下どちらの判断であれ
    # 二度と自動候補に出さない(却下した理由をいちいち覚えておかなくていいように)
    add_processed((h['discogs_id'], h['artist'], h['title']) for h in fresh)

    print(f'[4/4] 完了: candidates.json {len(candidates)}件 / unclassified.json {len(unclassified)}件')


if __name__ == '__main__':
    main()
