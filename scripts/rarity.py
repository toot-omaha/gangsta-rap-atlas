#!/usr/bin/env python3
"""Discogsのcommunityデータ(have/want・出品数・最安値)から実測レア度を作る。

data.js の discogsUrl を持つ全アルバムについて
  https://api.discogs.com/releases/{id}
を叩き、rarity.js に { "artist|title": {have, want, sale, price} } を書き出す。
発掘度の計算はフロント側(app.js)が have数の対数スケールで行う。

レートリミット: 未認証 25/分(2.6s間隔)。全件で30分程度。
レスポンスは .cache/discogs_release/ にキャッシュされ、再実行は差分のみ。
実行: python3 scripts/rarity.py
"""
import json
import re
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / '.cache' / 'discogs_release'
CACHE.mkdir(parents=True, exist_ok=True)
UA = 'GangstaRapAtlas/1.0 +https://github.com/toot-omaha/gangsta-rap-atlas'

_last = 0.0
def fetch(release_id):
    global _last
    cache_file = CACHE / f'{release_id}.json'
    if cache_file.exists():
        return json.loads(cache_file.read_text())
    wait = 2.6 - (time.time() - _last)
    if wait > 0:
        time.sleep(wait)
    url = f'https://api.discogs.com/releases/{release_id}'
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    _last = time.time()
    with urllib.request.urlopen(req, timeout=20) as res:
        data = json.loads(res.read().decode('utf-8'))
    cache_file.write_text(json.dumps(data, ensure_ascii=False))
    return data

def main():
    src = (ROOT / 'data.js').read_text()
    entries = re.findall(
        r"artist: (['\"])(.*?)\1, title: (['\"])(.*?)\3,.*?discogs\.com/release/(\d+)",
        src, re.DOTALL)
    # 正規表現の.*?が隣のエントリまで跨がないよう、エントリ単位で拾い直す
    entries = []
    for m in re.finditer(r"\{ artist: (['\"])((?:\\.|(?!\1).)*)\1, title: (['\"])((?:\\.|(?!\3).)*)\3[^}]*?discogsUrl: '[^']*?/release/(\d+)'", src):
        artist = m.group(2).replace("\\'", "'")
        title = m.group(4).replace("\\'", "'")
        entries.append((artist, title, m.group(5)))
    print(f'{len(entries)} discs with discogs release ids')

    out = {}
    for i, (artist, title, rid) in enumerate(entries, 1):
        try:
            d = fetch(rid)
        except Exception as e:
            print(f'  [{i}/{len(entries)}] {artist} - {title}: ERROR {e}')
            continue
        c = d.get('community', {})
        out[f'{artist}|{title}'] = {
            'have': c.get('have', 0),
            'want': c.get('want', 0),
            'sale': d.get('num_for_sale', 0),
            'price': (d.get('lowest_price') or 0),
        }
        if i % 25 == 0 or i == len(entries):
            print(f'  [{i}/{len(entries)}] {artist} - {title}: have={c.get("have",0)} want={c.get("want",0)}')

    js = 'const RARITY = ' + json.dumps(out, ensure_ascii=False) + ';\n'
    (ROOT / 'rarity.js').write_text(js)
    print(f'wrote rarity.js ({len(out)} discs)')

if __name__ == '__main__':
    main()
