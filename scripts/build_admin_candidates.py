#!/usr/bin/env python3
"""recover_rejected.py の結果(scripts/recovered_candidates.json)を、
非公開の確認ページ(admin/review.html)向けにアーティスト単位でまとめ直す。

recover_rejected.pyはバックグラウンドで随時進むため、このスクリプトは
何度でも再実行してadmin/candidates.jsonを更新し直せる。
"""

import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'scripts' / 'recovered_candidates.json'
DEST = ROOT / 'admin' / 'candidates.json'


def main():
    data = json.loads(SRC.read_text())
    by_artist = {}
    for did, v in data.items():
        if not v.get('match'):
            continue
        artist = v['artist']
        by_artist.setdefault(artist, []).append({
            'id': did,
            'title': v.get('title'),
            'year': v.get('year'),
            'label': v.get('label'),
            'styles': v.get('styles'),
            'url': v.get('discogs_url'),
        })
    artists = [
        {'artist': name, 'releases': sorted(rels, key=lambda r: r.get('year') or 0)}
        for name, rels in sorted(by_artist.items(), key=lambda kv: kv[0].lower())
    ]
    DEST.write_text(json.dumps(artists, ensure_ascii=False, indent=1))
    print(f'{len(artists)}組のアーティスト、計{sum(len(a["releases"]) for a in artists)}件を書き出しました。')


if __name__ == '__main__':
    main()
