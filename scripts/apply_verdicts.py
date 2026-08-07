#!/usr/bin/env python3
"""レビュー結果(ACCEPT/REJECT/NEEDS_REVIEW)をprocessed_ids.json台帳へ反映する。

collect_grap.py実行時点では何も台帳へ書き込まない(候補化しただけの段階では
まだ「保留」)。実際にdata.jsへ合流させた(ACCEPT)か、明確にG-RAP対象外と
判断した(REJECT)ものだけをここで記録する。NEEDS_REVIEW(出身地不明・
判断材料不足)は記録しない = 次回収集で自然に再候補化される。

使い方:
  candidates.json の中から、採用した discogs_id のリストと、却下した
  discogs_id のリストをこのスクリプトへ渡す。

  python3 scripts/apply_verdicts.py merged 32718528 1539564 ...
  python3 scripts/apply_verdicts.py rejected 8964763 ...

'rejected'は再クロール可能な保留(scripts/collect_grap.py --reset-rejected
でいつでもクリアして再候補化できる)。'merged'はdata.jsに実在する前提の
永久除外(次回収集のskipped_existingチェックと二重に効くだけなので安全)。
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'scripts'))
from collect_grap import add_processed  # noqa: E402


def main():
    if len(sys.argv) < 3:
        print('使い方: python3 scripts/apply_verdicts.py <merged|rejected> <discogs_id> [discogs_id...]')
        sys.exit(1)
    status = sys.argv[1]
    if status not in ('merged', 'rejected'):
        print("statusは 'merged' か 'rejected' のどちらか")
        sys.exit(1)
    ids = sys.argv[2:]

    candidates_path = ROOT / 'scripts' / 'candidates.json'
    candidates = json.loads(candidates_path.read_text()) if candidates_path.exists() else []
    by_id = {str(c['discogs_id']): c for c in candidates}

    items = []
    missing = []
    for did in ids:
        c = by_id.get(did)
        if not c:
            missing.append(did)
            continue
        items.append((c['discogs_id'], c['artist'], c['title']))

    add_processed(items, status)
    print(f'{len(items)} 件を {status} として記録')
    if missing:
        print(f'candidates.jsonに見つからなかったdiscogs_id: {missing}', file=sys.stderr)


if __name__ == '__main__':
    main()
