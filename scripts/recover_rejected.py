#!/usr/bin/env python3
"""REJECT済み候補(processed_ids.json の rejected)を再チェックし、Discogsの
スタイルタグがGangsta/G-Funkのものだけを「出身地不明」合流用の候補として
拾い直すスクリプト。

背景: 出身地(MusicBrainz/Wikipediaのバイオ文が空)が解決できないという
理由だけでREJECTされていたケースが相当数あることが判明した
(例: Under The Influence "Life In The Quarters" — G-Funkタグ付きだが
アーティストのプロフィール文が空でREJECTされていた)。
ジャンルタグ自体は合っているものを拾い直し、地図には「出身地不明」
ピンとして出す(手動で地名が分かれば後で正しい地域に動かせる)。

出力: scripts/recovered_candidates.json (レビュー用の中間ファイル。
data.js への反映は別スクリプトで行う)
"""

import json
import pathlib
import re
import sys
import time
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
from collect_grap import discogs, ROOT as PROJECT_ROOT  # noqa: E402

RESULT_FILE = PROJECT_ROOT / 'scripts' / 'recovered_candidates.json'
TARGET_STYLES = {'gangsta', 'g-funk'}


def load_rejected_ids():
    p = json.loads((PROJECT_ROOT / 'scripts' / 'processed_ids.json').read_text())
    return sorted(set(p['rejected']['ids']), key=int)


def load_results():
    if RESULT_FILE.exists():
        return json.loads(RESULT_FILE.read_text())
    return {}


def save_results(results):
    RESULT_FILE.write_text(json.dumps(results, ensure_ascii=False, indent=1))


def main():
    ids = load_rejected_ids()
    results = load_results()
    todo = [i for i in ids if i not in results]
    print(f'REJECT済み: {len(ids)}件 / 未チェック: {len(todo)}件', flush=True)

    checked = 0
    matched = 0
    for did in todo:
        try:
            rel = discogs.get(f'https://api.discogs.com/releases/{did}')
        except Exception as e:
            print(f'  [skip] id={did}: {e}', flush=True)
            continue
        styles = [s.lower() for s in (rel.get('styles') or [])]
        artists = rel.get('artists') or []
        artist_name = artists[0].get('name', '') if artists else ''
        is_various = 'various' in artist_name.lower() or len(artists) > 3
        hit = bool(TARGET_STYLES & set(styles)) and not is_various
        results[did] = {
            'match': hit,
            'artist': re.sub(r'\s*\(\d+\)$', '', artist_name),
            'title': rel.get('title'),
            'year': rel.get('year'),
            'label': (rel.get('labels') or [{}])[0].get('name'),
            'styles': rel.get('styles'),
            'discogs_url': rel.get('uri'),
        } if hit else {'match': False}
        checked += 1
        if hit:
            matched += 1
            print(f'  MATCH id={did} {results[did]["artist"]} - {results[did]["title"]} ({results[did]["styles"]})', flush=True)
        if checked % 100 == 0:
            save_results(results)
            print(f'...{checked}/{len(todo)} チェック済み(該当{matched}件、保存済み)', flush=True)

    save_results(results)
    print(f'完了。{checked}件チェックし、{matched}件がGangsta/G-Funkタグ一致(要レビュー候補)。', flush=True)


if __name__ == '__main__':
    main()
