#!/usr/bin/env python3
"""seed_research/*.json を読み、data.js の該当アルバムに
stampSeed(album+tracksの合算) と seedSrc(出典URL) を書き込む。

- リサーチ済みアルバムのみ更新する(未リサーチのstampSeedは触らない。
  ただしフロント側は seedSrc の無いシードをカウントしない)
- 実行: python3 scripts/apply_seeds.py
"""
import json
import glob
import re
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'data.js')

def aggregate(research):
    total = {}
    for src in [research.get('album', {})] + list(research.get('tracks', {}).values()):
        for k, v in src.items():
            total[k] = total.get(k, 0) + v
    return total

def js_obj(d):
    return '{ ' + ', '.join(f'{k}: {v}' for k, v in d.items()) + ' }'

def js_arr(xs):
    return '[' + ', '.join("'" + x.replace("'", "\\'") + "'" for x in xs) + ']'

def main():
    src = open(DATA, encoding='utf-8').read()
    n_applied = 0
    for path in sorted(glob.glob(os.path.join(ROOT, 'scripts', 'seed_research', '*.json'))):
        r = json.load(open(path, encoding='utf-8'))
        artist, title = r['artist'], r['title']
        seed = aggregate(r)
        # data.js内の該当エントリを探す(artist+titleで一意)
        # エントリは2行構成: { artist: ..., title: ..., ... stampSeed: {...} },
        pat = re.compile(
            r"(\{ (?:id: \d+, )?artist: (['\"])" + re.escape(artist) + r"\2, title: (['\"])" + re.escape(title) + r"\3,.*?stampSeed: )\{[^}]*\}",
            re.DOTALL)
        m = pat.search(src)
        if not m:
            print(f'  [skip] not found in data.js: {artist} - {title}')
            continue
        replacement = m.group(1) + js_obj(seed) + ', seedSrc: ' + js_arr(r.get('sources', []))
        # 既にseedSrcがある場合は古いものを除去
        after = src[m.end():]
        after = re.sub(r"^, seedSrc: \[[^\]]*\]", '', after)
        src = src[:m.start()] + replacement + after
        n_applied += 1
        print(f'  [ok] {artist} - {title}: {js_obj(seed)}')
    open(DATA, 'w', encoding='utf-8').write(src)
    print(f'applied {n_applied} researched seed(s)')

if __name__ == '__main__':
    main()
