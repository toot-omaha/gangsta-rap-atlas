#!/usr/bin/env python3
"""レビューから公開されたリリース(Supabase published_albums)のうち、
iTunesに試聴が無い盤(enrich.jsに載っていない)を対象に、scripts/enrich.py
と同じ着眼点をSupabase向けに移植する。scripts/discogs_video_enrich.py
(data.js向け)のロジックをそのまま使い回し、Discogsのリリース情報に
既に載っているYouTubeリンク(videos配列)からアルバム全体の動画を選び、
ジャケ写(images[0].uri)とあわせて published_albums の
youtube_ids / youtube_full_album_id / discogs_art 列へ書き込む。

事前準備: supabase/migration_published_albums_media.sql をSQL Editorで
1回実行してから使うこと(列が無いとPATCHが失敗する)。

使い方:
  python3 scripts/discogs_video_enrich_published.py [処理件数上限(デフォルト200)]
"""

import json
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from discogs_video_enrich import discogs_get, pick_album_video, youtube_video_alive  # noqa: E402

import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
ENRICH_PATH = ROOT / "enrich.js"

SB_URL = "https://xqtoyvhupioztljkejnw.supabase.co/rest/v1"
SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxdG95dmh1cGlvenRsamtlam53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5Mjc2MDgsImV4cCI6MjEwMTUwMzYwOH0.gW4xkwC3GzdKcnTT-490-75Sssx49wIIBcVOEW-MKHw"
HEADERS = {"apikey": SB_KEY, "Authorization": f"Bearer {SB_KEY}"}
WRITE_HEADERS = {**HEADERS, "Content-Type": "application/json", "Prefer": "return=minimal"}


def fetch_all_published():
    rows, offset, page = [], 0, 1000
    while True:
        req = urllib.request.Request(
            f"{SB_URL}/published_albums?select=id,artist,title,discogs_url,youtube_ids,youtube_full_album_id,discogs_art",
            headers={**HEADERS, "Range": f"{offset}-{offset + page - 1}"},
        )
        with urllib.request.urlopen(req, timeout=20) as r:
            batch = json.loads(r.read().decode())
        rows.extend(batch)
        if len(batch) < page:
            break
        offset += page
    return rows


def load_itunes_keys():
    text = ENRICH_PATH.read_text()
    start = text.index("{")
    enrich = json.loads(text[start:].rsplit(";", 1)[0])
    return set(enrich.keys())


def patch_album(row_id, fields):
    body = json.dumps(fields).encode()
    req = urllib.request.Request(
        f"{SB_URL}/published_albums?id=eq.{row_id}", data=body, headers=WRITE_HEADERS, method="PATCH"
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.status


def main():
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else 200

    itunes_keys = load_itunes_keys()
    print(f"既存enrich.js(iTunes試聴): {len(itunes_keys)}件")

    published = fetch_all_published()
    print(f"公開済みリリース: {len(published)}件")

    targets = []
    for row in published:
        key = f"{row['artist']}|{row['title']}"
        if key in itunes_keys:
            continue  # iTunesに試聴があるので対象外
        m = re.search(r"discogs\.com/release/(\d+)", row.get("discogs_url") or "")
        if not m:
            continue
        need_video = not (row.get("youtube_ids") or row.get("youtube_full_album_id"))
        need_art = not row.get("discogs_art")
        if not need_video and not need_art:
            continue
        targets.append({**row, "release_id": m.group(1), "need_video": need_video, "need_art": need_art})

    print(f"iTunes未マッチで動画/ジャケ写いずれか未設定: {len(targets)}件(先頭{min(limit, len(targets))}件を処理)")

    updated = 0
    for i, t in enumerate(targets[:limit], 1):
        try:
            data = discogs_get(f"https://api.discogs.com/releases/{t['release_id']}")
        except Exception as e:
            print(f"  [{i}] {t['artist']} - {t['title']}: ERROR {e}", file=sys.stderr)
            continue

        fields = {}

        if t["need_video"]:
            short_vids, full_vid = pick_album_video(data.get("videos"))
            short_vids = [v for v in short_vids if youtube_video_alive(v)]
            if full_vid and not youtube_video_alive(full_vid):
                full_vid = None
            if short_vids:
                fields["youtube_ids"] = short_vids
            if full_vid:
                fields["youtube_full_album_id"] = full_vid
            if fields:
                label = f"短尺{len(short_vids)}本" + ("+Full Album(リンク)" if full_vid else "")
                print(f"  [{i}] {t['artist']} - {t['title']}: video={label}")
            else:
                print(f"  [{i}] {t['artist']} - {t['title']}: 動画なし")

        if t["need_art"]:
            images = data.get("images") or []
            art_url = images[0].get("uri") if images else None
            if art_url:
                fields["discogs_art"] = art_url
                print(f"  [{i}] {t['artist']} - {t['title']}: art={art_url}")
            else:
                print(f"  [{i}] {t['artist']} - {t['title']}: 画像なし")

        if fields:
            try:
                patch_album(t["id"], fields)
                updated += 1
            except Exception as e:
                print(f"  [{i}] {t['artist']} - {t['title']}: PATCH ERROR {e}", file=sys.stderr)

    print(f"完了: {updated} 件を更新")


if __name__ == "__main__":
    main()
