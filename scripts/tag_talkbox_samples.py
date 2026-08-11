#!/usr/bin/env python3
"""トークボックス/ネタモノのサウンドタグをDiscogs APIから自動バックフィルする。

方針(検討過程はユーザーとの会話で確定済み):
  - トークボックス: リリースのextraartists(参加者クレジット)のroleに
    "Talk Box"/"Vocoder"が含まれるものを機械的に検出する(API起点で
    精度が高い)。
  - ネタモノ: Discogsのnotes欄(補足説明文)に"contains a sample of"等の
    文言があるものだけを拾う(出典なしのLLM推定はstampSeedと同じ轍を
    踏むので避ける。書かれている盤だけが対象になる=拾えるのは一部)。

data.js には直接書き込まず、まず scripts/tag_backfill.json に結果を
貯める(レビュー・再実行が安全にできるように)。data.js への反映は
apply_tag_backfill.py で別途行う。

レートリミット: collect_grap.py と同じ RateLimited('discogs', 2.6) を再利用。
4800枚超をすべて舐めると数時間かかる想定のバックグラウンド処理。
"""

import json
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from collect_grap import discogs, ROOT  # noqa: E402

DATA_FILE = ROOT / 'data.js'
RESULT_FILE = ROOT / 'scripts' / 'tag_backfill.json'

TALKBOX_RE = re.compile(r'talk\s*box|talkbox|vocoder', re.I)
SAMPLE_RE = re.compile(r'sampl(e|ed|es|ing)\b.{0,60}\bof\b|\bcontains?\b.{0,25}\bsampl', re.I)

ID_RE = re.compile(r'^\{ id: (\d+),')
DISCOGS_RE = re.compile(r"discogsUrl: 'https://www\.discogs\.com/release/(\d+)'")


def load_targets():
    """data.jsを走査し、{album_id: discogs_release_id} を返す。"""
    src = DATA_FILE.read_text(encoding='utf-8')
    chunks = re.split(r'(?=\{ id: \d+,)', src)
    targets = {}
    for chunk in chunks[1:]:
        m = ID_RE.match(chunk)
        if not m:
            continue
        # このチャンクは次のアルバムの手前まで(=このアルバムのフィールド全部)を含む
        dm = DISCOGS_RE.search(chunk)
        if not dm:
            continue
        targets[int(m.group(1))] = int(dm.group(1))
    return targets


def load_results():
    if RESULT_FILE.exists():
        return json.loads(RESULT_FILE.read_text())
    return {}


def save_results(results):
    RESULT_FILE.write_text(json.dumps(results, ensure_ascii=False, indent=1, sort_keys=True))


def detect_tags(release):
    tags = []
    for a in (release.get('extraartists') or []):
        role = a.get('role') or ''
        if TALKBOX_RE.search(role):
            tags.append('talkbox')
            break
    notes = release.get('notes') or ''
    if SAMPLE_RE.search(notes):
        tags.append('sample')
    return tags


def main():
    targets = load_targets()
    results = load_results()
    todo = [(aid, rid) for aid, rid in targets.items() if str(aid) not in results]
    print(f'対象: {len(targets)}枚 / 未処理: {len(todo)}枚', flush=True)

    done = 0
    for aid, rid in todo:
        try:
            release = discogs.get(f'https://api.discogs.com/releases/{rid}')
            tags = detect_tags(release)
        except Exception as e:
            print(f'  [skip] id={aid} release={rid}: {e}', flush=True)
            continue
        results[str(aid)] = tags
        done += 1
        if tags:
            print(f'  id={aid} release={rid} -> {tags}', flush=True)
        if done % 50 == 0:
            save_results(results)
            print(f'...{done}/{len(todo)} 処理済み(保存済み)', flush=True)

    save_results(results)
    tagged = sum(1 for v in results.values() if v)
    print(f'完了。{len(results)}枚チェック済み、うち{tagged}枚に何らかのタグ検出。', flush=True)


if __name__ == '__main__':
    main()
