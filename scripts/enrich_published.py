#!/usr/bin/env python3
"""レビューから公開されたリリース(Supabase published_albums)向けの
iTunes Search API 補完。scripts/enrich.py と同じ照合ロジックを使い回し、
既存の enrich.js を上書きせず追記する(data.js側の4826枚はそのまま)。

使い方: python3 scripts/enrich_published.py
"""

import json
import pathlib
import sys
import time
import urllib.request

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from enrich import lookup, RATE_LIMIT_SEC  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
ENRICH_PATH = ROOT / "enrich.js"

SB_URL = "https://xqtoyvhupioztljkejnw.supabase.co/rest/v1"
SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxdG95dmh1cGlvenRsamtlam53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5Mjc2MDgsImV4cCI6MjEwMTUwMzYwOH0.gW4xkwC3GzdKcnTT-490-75Sssx49wIIBcVOEW-MKHw"
HEADERS = {"apikey": SB_KEY, "Authorization": f"Bearer {SB_KEY}"}


def fetch_all_published():
    rows, offset, page = [], 0, 1000
    while True:
        req = urllib.request.Request(
            f"{SB_URL}/published_albums?select=artist,title",
            headers={**HEADERS, "Range": f"{offset}-{offset + page - 1}"},
        )
        with urllib.request.urlopen(req, timeout=20) as r:
            batch = json.loads(r.read().decode())
        rows.extend(batch)
        if len(batch) < page:
            break
        offset += page
    return rows


def load_enrich():
    text = ENRICH_PATH.read_text()
    start = text.index("{")
    return json.loads(text[start:].rsplit(";", 1)[0])


def save_enrich(enrich):
    out = (
        "// 自動生成: scripts/enrich.py (iTunes Search API) + scripts/enrich_published.py\n"
        "// ジャケ写・試聴はAppleの提供データ。表示時はApple Musicへのリンクを添える。\n"
        f"const ENRICH = {json.dumps(enrich, ensure_ascii=False, indent=1)};\n"
    )
    ENRICH_PATH.write_text(out)


def main():
    enrich = load_enrich()
    print(f"既存enrich.js: {len(enrich)}件")

    published = fetch_all_published()
    print(f"公開済みリリース: {len(published)}件")

    targets = []
    seen = set()
    for row in published:
        key = f"{row['artist']}|{row['title']}"
        if key in enrich or key in seen:
            continue
        seen.add(key)
        targets.append((row["artist"], row["title"]))
    print(f"iTunes未照合: {len(targets)}件(レート制限{RATE_LIMIT_SEC}秒間隔)")

    matched = 0
    for i, (artist, title) in enumerate(targets, 1):
        key = f"{artist}|{title}"
        try:
            info = lookup(artist, title)
        except Exception as e:
            print(f"  [{i}/{len(targets)}] {artist} - {title}: ERROR {e}", file=sys.stderr)
            continue
        if info:
            enrich[key] = info
            matched += 1
            print(f"  [{i}/{len(targets)}] {artist} - {title}: OK ({len(info['tracks'])} tracks)", flush=True)
        else:
            print(f"  [{i}/{len(targets)}] {artist} - {title}: not on iTunes", flush=True)
        if i % 25 == 0:
            save_enrich(enrich)  # 途中経過を定期的に保存(長時間走るため)

    save_enrich(enrich)
    print(f"完了。新規マッチ {matched}/{len(targets)}件。enrich.js合計 {len(enrich)}件")


if __name__ == "__main__":
    main()
