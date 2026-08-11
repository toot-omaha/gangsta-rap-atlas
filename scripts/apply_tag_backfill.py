#!/usr/bin/env python3
"""tag_talkbox_samples.py の結果(scripts/tag_backfill.json)をdata.jsへ反映する。

タグが1つも検出されなかったアルバムには何も書き込まない(tags: [] を
全件に付けて回るとファイルが無駄に肥大化するため)。id: N, の直後に
tags: [...] を挿し込む形なので、既存のフォーマット(1行/複数行どちらの
アルバムオブジェクトでも)を壊さない。
"""

import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA_FILE = ROOT / 'data.js'
RESULT_FILE = ROOT / 'scripts' / 'tag_backfill.json'


def main():
    results = json.loads(RESULT_FILE.read_text())
    to_apply = {int(k): v for k, v in results.items() if v}
    print(f'{len(results)}枚チェック済み中、{len(to_apply)}枚にタグを反映します。')

    src = DATA_FILE.read_text(encoding='utf-8')

    def repl(m):
        aid = int(m.group(1))
        if aid not in to_apply:
            return m.group(0)
        tags_js = ', '.join(f"'{t}'" for t in to_apply[aid])
        return f'{{ id: {aid}, tags: [{tags_js}],'

    new_src, n = re.subn(r'\{ id: (\d+),', repl, src)
    DATA_FILE.write_text(new_src, encoding='utf-8')
    print(f'data.js を更新しました({n}件走査)。')


if __name__ == '__main__':
    main()
