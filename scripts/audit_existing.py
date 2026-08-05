#!/usr/bin/env python3
"""data.js に既に載っているディスクを Discogs で個別照合し、
style に Gangsta が付いていないものを一覧する監査スクリプト。

判定不能(Discogsに一致リリースが見つからない)ものは「不明」として
別枠で報告する。除外は自動実行しない — 判定材料を出すだけで、
実際に消すかどうかはレビュー後に決める。
"""

import json
import pathlib
import re
import sys
import time
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
UA = 'GangstaRapAtlas-audit/0.1 (o.takashix@gmail.com; learning project)'
CACHE = ROOT / '.cache' / 'discogs_audit'
CACHE.mkdir(parents=True, exist_ok=True)

_last = [0.0]
def get(url):
    key = re.sub(r'[^a-z0-9]+', '_', url.lower())[-150:]
    f = CACHE / f'{key}.json'
    if f.exists():
        return json.loads(f.read_text())
    wait = 2.6 - (time.time() - _last[0])
    if wait > 0:
        time.sleep(wait)
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    _last[0] = time.time()
    with urllib.request.urlopen(req, timeout=20) as res:
        data = json.loads(res.read().decode('utf-8'))
    f.write_text(json.dumps(data, ensure_ascii=False))
    return data


def parse_albums(data_js: str):
    q = r"""('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")"""
    pat = re.compile(rf"artist:\s*{q},\s*title:\s*{q}")
    unquote = lambda s: s[1:-1].replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\')
    return [(unquote(a), unquote(t)) for a, t in pat.findall(data_js)]


def check(artist, title):
    term = urllib.parse.quote(f'{artist} {title}')
    url = f'https://api.discogs.com/database/search?q={term}&type=release&per_page=10'
    data = get(url)
    na, nt = re.sub(r'[^a-z0-9]', '', artist.lower()), re.sub(r'[^a-z0-9]', '', title.lower())
    for r in data.get('results', []):
        rt = re.sub(r'[^a-z0-9]', '', r.get('title', '').lower())
        if na in rt and nt in rt:
            styles = r.get('style', [])
            return {'found': True, 'styles': styles, 'is_gangsta': 'Gangsta' in styles, 'uri': r.get('uri')}
    return {'found': False}


def main():
    albums = parse_albums((ROOT / 'data.js').read_text())
    print(f'{len(albums)} 件を照合します\n')

    not_gangsta, unknown, ok = [], [], []
    for i, (artist, title) in enumerate(albums, 1):
        r = check(artist, title)
        tag = '?' if not r['found'] else ('OK' if r['is_gangsta'] else 'NG')
        print(f'[{i}/{len(albums)}] {tag:2} {artist} - {title}  {r.get("styles", "")}', file=sys.stderr)
        if not r['found']:
            unknown.append((artist, title))
        elif r['is_gangsta']:
            ok.append((artist, title))
        else:
            not_gangsta.append((artist, title, r['styles']))

    print('\n===== Gangstaタグなし(除外候補) =====')
    for a, t, styles in not_gangsta:
        print(f'  {a} - {t}  styles={styles}')

    print('\n===== Discogsで未特定(判定不能) =====')
    for a, t in unknown:
        print(f'  {a} - {t}')

    print(f'\nOK: {len(ok)} / NG: {len(not_gangsta)} / 不明: {len(unknown)}')


if __name__ == '__main__':
    main()
