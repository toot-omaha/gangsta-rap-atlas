#!/usr/bin/env python3
"""Various Artists名義のコンピ盤(style=Gangsta/G-Funk)から、収録曲のアーティストが
既にdata.jsに登録済みの場合だけ、そのアーティストの既存地域へ1曲=1エントリとして
取り込む(ユーザー指示、2026-08-07)。

背景: コンピ盤自体は複数アーティストのため単一の出身地を持たず、通常の収集
(collect_grap.py)では意図的に除外している。だが収録曲を1曲ずつ見れば、
そのアーティストは既に地図上のどこかに存在していることが多い。新たな
出身地判定は不要で、「既に確定済みのアーティスト・地域にもう1本刺す」だけ
なので、collect_grap.pyのような候補レビュー(WebSearchエージェント)は挟まず
自動マージする。

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
CACHE = ROOT / '.cache' / 'discogs'
CACHE.mkdir(parents=True, exist_ok=True)
UA = 'GangstaRapAtlas-collector/0.1 (o.takashix@gmail.com; learning project)'
STATE_FILE = ROOT / 'scripts' / 'collect_compilations_state.json'
NEXT_ID_FILE = ROOT / 'scripts' / 'next_album_id.json'
PROCESSED_FILE = ROOT / 'scripts' / 'processed_compilation_tracks.json'
STYLES = ['Gangsta', 'G-Funk']
LATEST_YEAR = 2010

_last = 0.0
MIN_INTERVAL = 2.6


def discogs_get(url):
    global _last
    key = re.sub(r'[^a-z0-9]+', '_', url.lower())[-150:]
    cache_file = CACHE / f'{key}.json'
    if cache_file.exists():
        return json.loads(cache_file.read_text())
    wait = MIN_INTERVAL - (time.time() - _last)
    if wait > 0:
        time.sleep(wait)
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    _last = time.time()
    with urllib.request.urlopen(req, timeout=20) as res:
        data = json.loads(res.read().decode('utf-8'))
    cache_file.write_text(json.dumps(data, ensure_ascii=False))
    return data


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
    d = json.loads(NEXT_ID_FILE.read_text())
    return d['next']


def bump_next_id(n):
    NEXT_ID_FILE.write_text(json.dumps({'next': n}, ensure_ascii=False, indent=1))


def load_data_js():
    src = (ROOT / 'data.js').read_text()
    q = r"""('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")"""
    unquote = lambda s: s[1:-1].replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\')

    # 既存の artist|title 集合(重複防止用)
    existing_titles = set()
    for a, t in re.findall(rf"artist:\s*{q},\s*title:\s*{q}", src):
        existing_titles.add((norm(unquote(a)), norm(unquote(t))))

    # アーティスト名 -> 最初に見つかった地域id のマップ(既存地域への紐付け用)。
    # レーベル名 -> 最初に見つかった地域id のマップも同様に作る(同レーベルの
    # 他作品が同じ地域に集まっている場合、そのレーベル自体がローカルレーベルの
    # 可能性が高いため、未登録アーティストの曲のフォールバックに使う)。
    artist_region = {}
    label_region = {}
    for rm in re.finditer(r"id:\s*'([a-z0-9]+)',\s*name:.*?albums:\s*\[(.*?)\n\s*\],\n\s*\},", src, re.S):
        region_id, block = rm.group(1), rm.group(2)
        for a in re.findall(rf"artist:\s*{q}", block):
            an = norm(unquote(a))
            if an and an not in artist_region:
                artist_region[an] = region_id
        for l in re.findall(rf"label:\s*{q}", block):
            ln = norm(unquote(l))
            if ln and ln not in label_region:
                label_region[ln] = region_id
    return src, existing_titles, artist_region, label_region


def search_compilations(style, year, page, per_page=100):
    style_q = urllib.parse.quote(style)
    url = (
        'https://api.discogs.com/database/search'
        f'?genre=Hip%20Hop&style={style_q}&type=release&format=Compilation&year={year}'
        f'&sort=year&sort_order=asc&per_page={per_page}&page={page}'
    )
    return discogs_get(url)


def main():
    pages = int(sys.argv[1]) if len(sys.argv) > 1 else 2
    state = load_state()
    src, existing_titles, artist_region, label_region = load_data_js()
    processed = load_processed()
    aid = next_id()

    print(f'既存ディスク {len(existing_titles)} 件 / 既知アーティスト {len(artist_region)} 名')

    additions = []  # [(region_id, entry_line)]
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
                try:
                    detail = discogs_get(f'https://api.discogs.com/releases/{rid}')
                except Exception as e:
                    print(f'  release {rid} 取得エラー: {e}', file=sys.stderr)
                    continue
                # collect_grap.pyのgangsta_consensus相当の品質ゲート:
                # このコンピ盤のgenresがHip Hop単体でなければ(Rock/Popなどが
                # 混在する寄せ集めサントラ等)、収録曲ごと丸ごとスキップする。
                # 例: 「Pump Up The Volume」サントラはgenres=['Hip Hop','Rock',
                # 'Stage & Screen']で、G-Funkタグを持ちながらPunk/Alt Rockの
                # アーティストも大量に含んでいた実例あり。
                genres = detail.get('genres') or []
                if genres != ['Hip Hop']:
                    print(f'  [ジャンル混在でスキップ] "{detail.get("title")}" genres={genres}')
                    continue
                comp_title = detail.get('title', '(無題コンピ)')
                comp_year = detail.get('year') or r.get('year')
                comp_label = (detail.get('labels') or [{}])[0].get('name', 'Various')
                label_fallback = label_region.get(norm(comp_label))

                # 1パス目: 曲ごとにアーティスト名を集め、登録済みアーティストの地域を
                # 判明分として集計する(多数決の材料にするため、フォールバックより先に集める)。
                track_entries = []  # [(tname, track_title, artist_region_or_None)]
                for tr in detail.get('tracklist', []):
                    track_title = (tr.get('title') or '').strip()
                    if not track_title or tr.get('type_', 'track') != 'track':
                        continue
                    for ta in tr.get('artists') or []:
                        tname = re.sub(r'\s*\(\d+\)$', '', ta.get('name', '')).strip()
                        an = norm(tname)
                        if not an or an in ('various', 'variousartists'):
                            continue
                        track_entries.append((tname, an, track_title, tr.get('position'), artist_region.get(an)))

                # 多数決地域: このコンピ内で登録済みアーティストの地域として判明した中で最頻値
                known_regions = [t[4] for t in track_entries if t[4]]
                majority_region = None
                if known_regions:
                    majority_region = max(set(known_regions), key=known_regions.count)

                # 2パス目: 優先順位 登録済みアーティストの地域 → レーベルの地域 →
                # 同コンピ内の多数決地域 → 出身地不明、の順で確定させる。
                for tname, an, track_title, position, known in track_entries:
                    region_id = known or label_fallback or majority_region or 'unclassified'
                    key = (an, norm(track_title))
                    ledger_key = f'{rid}:{position}'
                    if key in existing_titles or ledger_key in processed:
                        continue
                    entry = (
                        f"{{ id: {aid}, artist: {json.dumps(tname, ensure_ascii=False)}, "
                        f"title: {json.dumps(track_title, ensure_ascii=False)}, year: {comp_year}, "
                        f"label: {json.dumps(comp_label, ensure_ascii=False)}, youtubeId: null,\n"
                        f"        discogsUrl: 'https://www.discogs.com/release/{rid}', stampSeed: {{}} }},"
                    )
                    additions.append((region_id, entry))
                    existing_titles.add(key)
                    processed.add(ledger_key)
                    reason = 'known' if known else ('label' if label_fallback and region_id == label_fallback else ('majority' if majority_region and region_id == majority_region else 'unclassified'))
                    print(f'  + {tname} - {track_title} (from "{comp_title}") -> {region_id} [{reason}, id={aid}]')
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
    print(f'完了: {len(additions)} 曲をdata.jsへ追加')


if __name__ == '__main__':
    main()
