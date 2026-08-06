#!/usr/bin/env python3
"""YouTube Data API v3 で、iTunesに無い盤(試聴なし)だけ動画IDを探して埋める。

検索(search.list)はユニット消費が重い(1回100ユニット)。デフォルトの無料枠は
1日10,000ユニット = 実質1日100検索が上限。使い切ると403 quotaExceededになる
だけで課金はされない(太平洋時間の深夜0時にリセット)。
なので「1日1回、まだ埋まっていない盤から順に、上限件数まで」を積み重ねる設計。

一度見つかったvideoIdはキャッシュされ、動画の埋め込み再生自体(IFrame Player)は
API/クォータ不要で無制限。重いのは最初の1回の検索だけ。

使い方:
  .env に YOUTUBE_API_KEY=xxx を書いてから
  python3 scripts/youtube_enrich.py [1日の検索上限(デフォルト90)]

出力: youtube.js  ({ "artist|title": videoId } のマップ、既存分とマージしながら再生成)
"""
import json
import os
import pathlib
import re
import sys
import time
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
CACHE_DIR = ROOT / ".cache" / "youtube"
CACHE_DIR.mkdir(parents=True, exist_ok=True)
USER_AGENT = "GangstaRapAtlas-prototype/0.1 (o.takashix@gmail.com; learning project)"


def load_env():
    env_file = ROOT / ".env"
    if not env_file.exists():
        return
    for line in env_file.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip())


def parse_albums(data_js: str):
    q = r"""('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")"""
    pat = re.compile(rf"artist:\s*{q},\s*title:\s*{q}")

    def unquote(s: str) -> str:
        body = s[1:-1]
        return body.replace("\\'", "'").replace('\\"', '"').replace("\\\\", "\\")

    return [(unquote(a), unquote(t)) for a, t in pat.findall(data_js)]


def search_video(api_key, artist, title):
    key = re.sub(r"[^a-z0-9]+", "_", f"{artist}_{title}".lower())[-150:]
    cache = CACHE_DIR / f"{key}.json"
    if cache.exists():
        return json.loads(cache.read_text()), False  # (result, spent_quota?)

    q = urllib.parse.quote(f"{artist} {title} full album")
    url = (
        "https://www.googleapis.com/youtube/v3/search"
        f"?part=snippet&type=video&maxResults=1&q={q}&key={api_key}"
    )
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=20) as res:
        data = json.loads(res.read().decode("utf-8"))
    video_id = None
    items = data.get("items") or []
    if items:
        video_id = items[0]["id"]["videoId"]
    result = {"videoId": video_id}
    cache.write_text(json.dumps(result, ensure_ascii=False))
    return result, True


def main():
    load_env()
    api_key = os.environ.get("YOUTUBE_API_KEY")
    if not api_key:
        print("YOUTUBE_API_KEY が .env に見つかりません。処理を中断します。", file=sys.stderr)
        sys.exit(1)

    daily_limit = int(sys.argv[1]) if len(sys.argv) > 1 else 90

    data_js = (ROOT / "data.js").read_text()
    albums = parse_albums(data_js)

    enrich_path = ROOT / "enrich.js"
    itunes_keys = set()
    if enrich_path.exists():
        m = re.search(r"const ENRICH = (\{.*\});", enrich_path.read_text(), re.DOTALL)
        if m:
            itunes_keys = set(json.loads(m.group(1)).keys())

    yt_path = ROOT / "youtube.js"
    out = {}
    if yt_path.exists():
        m = re.search(r"const YOUTUBE = (\{.*\});", yt_path.read_text(), re.DOTALL)
        if m:
            out = json.loads(m.group(1))

    # iTunesに無い盤だけを対象にする(試聴が既にある盤は今のところ対象外)
    targets = [(a, t) for a, t in albums if f"{a}|{t}" not in itunes_keys and f"{a}|{t}" not in out]
    print(f"{len(albums)} albums total / {len(targets)} 件がiTunes未マッチでYouTube検索対象")

    spent = 0
    consecutive_errors = 0
    for i, (artist, title) in enumerate(targets, 1):
        if spent >= daily_limit:
            print(f"本日の検索上限({daily_limit}件)に達したため中断。続きは明日の実行で。")
            break
        try:
            result, used_quota = search_video(api_key, artist, title)
        except Exception as e:
            print(f"  [{i}/{len(targets)}] {artist} - {title}: ERROR {e}", file=sys.stderr)
            spent += 1  # 失敗もクォータを消費している可能性があるため上限にカウントする
            consecutive_errors += 1
            if consecutive_errors >= 3:
                print("エラーが3連続で発生したため中断します(APIキー設定を確認してください)。", file=sys.stderr)
                break
            continue
        consecutive_errors = 0
        if used_quota:
            spent += 1
            time.sleep(0.3)
        if result.get("videoId"):
            out[f"{artist}|{title}"] = result["videoId"]
            print(f"  [{i}/{len(targets)}] {artist} - {title}: {result['videoId']}")
        else:
            print(f"  [{i}/{len(targets)}] {artist} - {title}: 見つからず")

    js = (
        "// 自動生成: scripts/youtube_enrich.py (YouTube Data API v3)\n"
        "// iTunesに無い盤の代替再生用。1日の検索クォータ制限があるため少しずつ埋まる。\n"
        f"const YOUTUBE = {json.dumps(out, ensure_ascii=False, indent=1)};\n"
    )
    yt_path.write_text(js)
    print(f"wrote youtube.js ({len(out)} discs, 本日{spent}件検索)")


if __name__ == "__main__":
    main()
