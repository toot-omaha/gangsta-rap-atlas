#!/usr/bin/env python3
"""Various Artists名義のコンピ盤(style=Gangsta/G-Funk)を、レーベル単位で
1コンピ=1エントリとして取り込む(ユーザー指示、2026-08-08に設計変更)。

旧仕様(曲単位で収録アーティストごとに切り出す方式)は、未登録アーティストの
曲が「同コンピ内の多数決地域」にフォールバックしてしまい、Snap!やUrban
Dance Squadのような無関係なアーティストがCompton等の人気地域に大量に
紛れ込む事故を起こした(2026-08-08発覚、113曲を削除して復旧)。

新仕様:
  - 1コンピ盤 = 1エントリ。artist は常に 'Compilation' 固定
    (曲単位の分解はしない)。
  - 採否判定は「このコンピのジャンルタグ」ではなく「レーベルがG-RAP系
    レーベルかどうか」で行う。レーベルのカタログ全体でGangsta/G-Funk
    スタイル比率を見る(collect_grap.pyのgangsta_consensusのレーベル版)。
  - 地域は収録アーティストの出身地の多数決ではなく、レーベルの拠点地
    (MusicBrainzのLabelエンティティのarea)を使う。

使い方:
  python3 scripts/collect_compilations.py [年ページ数(デフォルト2)]

collect_grap.py / rarity.py と同時に実行しない(Discogs APIレート競合のため)。
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
STATE_FILE = ROOT / 'scripts' / 'collect_compilations_state.json'
NEXT_ID_FILE = ROOT / 'scripts' / 'next_album_id.json'
PROCESSED_FILE = ROOT / 'scripts' / 'processed_compilations.json'
STYLES = ['Gangsta', 'G-Funk']
LATEST_YEAR = 2010
LABEL_MIN_HIPHOP_SAMPLE = 2   # レーベルのHip Hopリリースがこの件数未満なら判定材料不足でスキップ
LABEL_GANGSTA_RATIO = 0.4     # Gangsta/G-Funkタグの比率がこれ未満ならG-RAPレーベルと見なさない


class RateLimited:
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


discogs = RateLimited('discogs', 2.6)
musicbrainz = RateLimited('musicbrainz', 1.1)
nominatim = RateLimited('nominatim', 1.1)


def norm(s):
    s = (s or '').lower().replace('&', ' and ')
    return re.sub(r'[^a-z0-9]+', '', s)


def load_state():
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text())
    return {'cursors': {s: {'year': 1990, 'page': 0} for s in STYLES}}


def save_state(state):
    STATE_FILE.write_text(json.dumps(state, ensure_ascii=False, indent=1))


def load_processed():
    if PROCESSED_FILE.exists():
        return set(json.loads(PROCESSED_FILE.read_text()))
    return set()


def save_processed(s):
    PROCESSED_FILE.write_text(json.dumps(sorted(s), ensure_ascii=False, indent=1))


def next_id():
    return json.loads(NEXT_ID_FILE.read_text())['next']


def bump_next_id(n):
    NEXT_ID_FILE.write_text(json.dumps({'next': n}, ensure_ascii=False, indent=1))


def load_data_js():
    src = (ROOT / 'data.js').read_text()
    q = r"""('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")"""
    unquote = lambda s: s[1:-1].replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\')
    existing_titles = set()
    for a, t in re.findall(rf"artist:\s*{q},\s*title:\s*{q}", src):
        existing_titles.add((norm(unquote(a)), norm(unquote(t))))
    regions = []
    for m in re.finditer(
        rf"id:\s*{q},\s*name:\s*{q},\s*area:\s*{q},\s*\n\s*lng:\s*(-?[\d.]+),\s*lat:\s*(-?[\d.]+)", src
    ):
        regions.append({
            'id': unquote(m.group(1)), 'name': unquote(m.group(2)),
            'lng': float(m.group(4)), 'lat': float(m.group(5)),
        })
    return src, existing_titles, regions


def search_compilations(style, year, page, per_page=100):
    style_q = urllib.parse.quote(style)
    url = (
        'https://api.discogs.com/database/search'
        f'?genre=Hip%20Hop&style={style_q}&type=release&format=Compilation&year={year}'
        f'&sort=year&sort_order=asc&per_page={per_page}&page={page}'
    )
    return discogs.get(url)


def label_gangsta_ratio(label_id):
    """レーベルのカタログ(Hip Hopジャンルのみ)のうち、Gangsta/G-Funkスタイルの
    比率を返す。({'ratio': float, 'total': int} / サンプルが取れなければNone)"""
    try:
        data = discogs.get(f'https://api.discogs.com/labels/{label_id}/releases?per_page=100&page=1')
    except Exception:
        return None
    releases = data.get('releases', [])[:60]  # レート節約のため上限を切る
    hiphop = 0
    gangsta = 0
    for r in releases:
        rid = r.get('id')
        if not rid:
            continue
        try:
            detail = discogs.get(f'https://api.discogs.com/releases/{rid}')
        except Exception:
            continue
        genres = detail.get('genres') or []
        if 'Hip Hop' not in genres:
            continue
        hiphop += 1
        styles = detail.get('styles') or []
        if 'Gangsta' in styles or 'G-Funk' in styles:
            gangsta += 1
    if hiphop < LABEL_MIN_HIPHOP_SAMPLE:
        return None
    return {'ratio': gangsta / hiphop, 'total': hiphop}


def label_hometown(label_name):
    """MusicBrainzのLabelエンティティからarea/begin-areaを引き、Nominatimで
    緯度経度化する(artist_hometown()のレーベル版)。"""
    try:
        q = urllib.parse.quote(f'label:"{label_name}"')
        data = musicbrainz.get(f'https://musicbrainz.org/ws/2/label/?query={q}&fmt=json')
    except Exception:
        return None
    labels = data.get('labels') or []
    if not labels:
        return None
    lb = labels[0]
    area = lb.get('area') or {}
    place = area.get('name')
    country = None
    if not place:
        return None
    try:
        nq = urllib.parse.quote(place)
        geo = nominatim.get(f'https://nominatim.openstreetmap.org/search?q={nq}&format=json&limit=1')
    except Exception:
        return None
    if not geo:
        return None
    return {'lng': float(geo[0]['lon']), 'lat': float(geo[0]['lat']), 'name': place}


def nearest_region(lng, lat, regions, max_km=60):
    import math
    best, best_d = None, max_km
    for r in regions:
        dx = (lng - r['lng']) * 111 * math.cos(math.radians(lat))
        dy = (lat - r['lat']) * 111
        d = math.hypot(dx, dy)
        if d < best_d:
            best, best_d = r, d
    return best


def main():
    pages = int(sys.argv[1]) if len(sys.argv) > 1 else 2
    state = load_state()
    src, existing_titles, regions = load_data_js()
    processed = load_processed()
    aid = next_id()

    print(f'既存ディスク {len(existing_titles)} 件 / 既存地域 {len(regions)} 件')

    additions = []  # [(region_id, entry_line)]
    label_cache = {}  # label_id -> (qualifies: bool, hometown/None)
    seen_release_ids = set()

    for style in STYLES:
        cur = state['cursors'][style]
        year, page = cur['year'], cur['page'] + 1
        remaining = pages
        print(f'[{style}] コンピ盤検索: {year}年{page}ページ目から{pages}ページ分')
        while remaining > 0 and year <= LATEST_YEAR:
            data = search_compilations(style, year, page)
            total_pages = data.get('pagination', {}).get('pages', 1)
            for r in data.get('results', []):
                rid = r.get('id')
                if not rid or rid in seen_release_ids:
                    continue
                seen_release_ids.add(rid)
                title = r.get('title', '')
                artist_part = title.split(' - ', 1)[0] if ' - ' in title else ''
                if norm(artist_part) not in ('various', 'variousartists', ''):
                    continue  # 単独アーティストの通常盤は対象外(collect_grap.py側の仕事)
                if str(rid) in processed:
                    continue

                try:
                    detail = discogs.get(f'https://api.discogs.com/releases/{rid}')
                except Exception as e:
                    print(f'  release {rid} 取得エラー: {e}', file=sys.stderr)
                    continue

                comp_title = detail.get('title', '(無題コンピ)')
                comp_year = detail.get('year') or r.get('year')
                labels = detail.get('labels') or []
                if not labels:
                    processed.add(str(rid))
                    continue
                label_name = labels[0].get('name', 'Unknown')
                label_id = labels[0].get('id')

                if label_id not in label_cache:
                    print(f'  レーベル判定中: {label_name} (id={label_id})', file=sys.stderr)
                    ratio_info = label_gangsta_ratio(label_id) if label_id else None
                    qualifies = bool(ratio_info and ratio_info['ratio'] >= LABEL_GANGSTA_RATIO)
                    hometown = label_hometown(label_name) if qualifies else None
                    label_cache[label_id] = (qualifies, hometown, ratio_info)
                qualifies, hometown, ratio_info = label_cache[label_id]

                if not qualifies:
                    reason = f"ratio={ratio_info['ratio']:.2f}/{ratio_info['total']}件" if ratio_info else 'サンプル不足'
                    print(f'  [レーベル不適格でスキップ] "{comp_title}" label={label_name} ({reason})')
                    processed.add(str(rid))
                    continue

                key = (norm('Compilation'), norm(comp_title))
                if key in existing_titles:
                    processed.add(str(rid))
                    continue

                if hometown:
                    near = nearest_region(hometown['lng'], hometown['lat'], regions)
                    region_id = near['id'] if near else None
                else:
                    region_id = None
                if not region_id:
                    print(f'  [出身地不明でスキップ] "{comp_title}" label={label_name}')
                    processed.add(str(rid))
                    continue

                entry = (
                    f"{{ id: {aid}, artist: 'Compilation', "
                    f"title: {json.dumps(comp_title, ensure_ascii=False)}, year: {comp_year}, "
                    f"label: {json.dumps(label_name, ensure_ascii=False)}, youtubeId: null,\n"
                    f"        discogsUrl: 'https://www.discogs.com/release/{rid}', stampSeed: {{}} }},"
                )
                additions.append((region_id, entry))
                existing_titles.add(key)
                processed.add(str(rid))
                print(f'  + "{comp_title}" (label={label_name}, ratio={ratio_info["ratio"]:.2f}/{ratio_info["total"]}) -> {region_id} [id={aid}]')
                aid += 1
            remaining -= 1
            if page >= total_pages:
                year, page = year + 1, 1
            else:
                page += 1
        state['cursors'][style] = {'year': year, 'page': page - 1}

    save_state(state)
    save_processed(processed)
    bump_next_id(aid)

    if not additions:
        print('新規追加なし')
        return

    for region_id, entry_line in additions:
        pat = re.compile(r"(id: '" + re.escape(region_id) + r"', name:.*?albums: \[\n)(.*?)(\n(\s*)\],\n  \},)", re.S)
        m = pat.search(src)
        if not m:
            print(f'  [警告] 地域 {region_id} が見つからずスキップ: {entry_line}', file=sys.stderr)
            continue
        indent = '      '
        src = src[:m.start()] + m.group(1) + m.group(2) + '\n' + indent + entry_line + m.group(3) + src[m.end():]

    (ROOT / 'data.js').write_text(src)
    print(f'完了: {len(additions)} 件のコンピをdata.jsへ追加')


if __name__ == '__main__':
    main()
