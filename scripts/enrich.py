#!/usr/bin/env python3
"""iTunes Search API でアルバム情報を取得して enrich.js を生成する。

これは「行儀の良いデータ収集」の実例になっている:
  1. 公式API(キー不要・利用が許可された窓口)だけを叩く
  2. レートリミット: iTunes Search API の目安は約20リクエスト/分 → 3.2秒間隔
  3. User-Agent で身元(連絡先)を名乗る
  4. 取得結果はローカルにキャッシュし、同じ問い合わせを二度投げない

使い方:  python3 scripts/enrich.py
出力:    enrich.js  (アルバムキー → ジャケ写URL / 30秒試聴URL / Apple Musicリンク)
"""

import json
import pathlib
import re
import sys
import time
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
CACHE_DIR = ROOT / ".cache" / "itunes"
CACHE_DIR.mkdir(parents=True, exist_ok=True)

RATE_LIMIT_SEC = 3.2  # 20リクエスト/分を超えないように
USER_AGENT = "GangstaRapAtlas-prototype/0.1 (o.takashix@gmail.com; learning project)"

_last_request = [0.0]


def polite_get(url: str) -> dict:
    """キャッシュ優先・レートリミット付きのGET。"""
    key = re.sub(r"[^a-z0-9]+", "_", url.lower())[-120:]
    cache = CACHE_DIR / f"{key}.json"
    if cache.exists():
        return json.loads(cache.read_text())

    wait = RATE_LIMIT_SEC - (time.time() - _last_request[0])
    if wait > 0:
        time.sleep(wait)
    _last_request[0] = time.time()

    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=20) as res:
        data = json.loads(res.read().decode("utf-8"))
    cache.write_text(json.dumps(data, ensure_ascii=False))
    return data


def parse_albums(data_js: str):
    """data.js から (artist, title) を順に抜き出す。単引用符・二重引用符の両対応。"""
    q = r"""('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")"""
    pat = re.compile(rf"artist:\s*{q},\s*title:\s*{q}")

    def unquote(s: str) -> str:
        body = s[1:-1]
        return body.replace("\\'", "'").replace('\\"', '"').replace("\\\\", "\\")

    return [(unquote(a), unquote(t)) for a, t in pat.findall(data_js)]


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", s.lower())


def find_album(artist: str, title: str):
    """アーティスト検索 → ディスコグラフィ照合の二段構え。

    「artist title」のフリーワード検索はノイズが多く旧作を取りこぼすため、
    まず musicArtist を特定し、そのアルバム一覧からタイトルを照合する。
    """
    na, nt = norm(artist), norm(title)

    term = urllib.parse.quote(artist)
    url = f"https://itunes.apple.com/search?term={term}&entity=musicArtist&limit=5"
    artists = polite_get(url).get("results", [])
    # 名前がどちらか一方に含まれる候補だけ試す(Snoop Doggy Dogg ⊃ Snoop Dogg)。
    # 一致候補が無ければ「とりあえず1件目」にフォールバックしない
    # (無関係なアーティストへ誤ってマッチし、ジャケ写・ジャンル・試聴が
    # 全く違う盤になってしまう事故が実際に発生したため。例: "Big Blac" が
    # 無関係なオルタナロックのアーティストにマッチしていた)。
    candidates = [
        r for r in artists
        if norm(r.get("artistName", "")) and
        (norm(r["artistName"]) in na or na in norm(r["artistName"]))
    ][:3]

    hits = []
    for a in candidates:
        lu = f"https://itunes.apple.com/lookup?id={a['artistId']}&entity=album&limit=200"
        for r in polite_get(lu).get("results", []):
            rt = norm(r.get("collectionName", ""))
            # G-RAPはCDシングル(CDS)・EP・コンピもディスク1枚として扱うため、
            # collectionType では絞らない(wrapperType=collection なら候補)。
            # ただし短いタイトル同士だと部分一致(nt in rt / rt in nt)が
            # 偶然の文字列一致で誤爆しやすいため(例: 相手が"4"のような
            # 短いタイトルだと、こちらの長いタイトルにほぼ必ず含まれてしまう)、
            # 短い方の文字列がある程度の長さを持つ場合に限って部分一致を認める。
            if r.get("wrapperType") != "collection" or not rt:
                continue
            shorter_len = min(len(nt), len(rt))
            # 完全一致は長さに関わらず常に許可("Yo!"のような短いタイトルが
            # 完全一致してるのに部分一致ガードで弾かれていた事故があったため)。
            if nt == rt or ((nt in rt or rt in nt) and shorter_len >= 4):
                hits.append(r)
        if hits:
            break
    # 完全版より「素の盤」を優先(Anniversary / Deluxe などを避ける)
    hits.sort(key=lambda r: len(r.get("collectionName", "")))
    return hits[0] if hits else None


def lookup(artist: str, title: str):
    hit = find_album(artist, title)
    if not hit:
        return None

    # アルバムの収録曲(試聴URL付き)も引いておく
    tracks = []
    cid = hit.get("collectionId")
    if cid:
        lu = f"https://itunes.apple.com/lookup?id={cid}&entity=song&limit=30"
        for r in polite_get(lu).get("results", []):
            if r.get("kind") == "song" and r.get("previewUrl"):
                tracks.append({
                    "name": r["trackName"],
                    "preview": r["previewUrl"],
                })

    return {
        "art": hit.get("artworkUrl100"),
        "link": hit.get("collectionViewUrl"),
        "genre": hit.get("primaryGenreName"),
        "tracks": tracks,
    }


def main():
    data_js = (ROOT / "data.js").read_text()
    albums = parse_albums(data_js)
    print(f"{len(albums)} albums in data.js")

    enrich = {}
    for i, (artist, title) in enumerate(albums, 1):
        try:
            info = lookup(artist, title)
        except Exception as e:  # ネットワーク失敗は飛ばして続行
            print(f"  [{i}] {artist} - {title}: ERROR {e}", file=sys.stderr)
            continue
        if info:
            enrich[f"{artist}|{title}"] = info
            print(f"  [{i}] {artist} - {title}: OK ({len(info['tracks'])} tracks)")
        else:
            print(f"  [{i}] {artist} - {title}: not on iTunes (rare!)")

    out = (
        "// 自動生成: scripts/enrich.py (iTunes Search API)\n"
        "// ジャケ写・試聴はAppleの提供データ。表示時はApple Musicへのリンクを添える。\n"
        f"const ENRICH = {json.dumps(enrich, ensure_ascii=False, indent=1)};\n"
    )
    (ROOT / "enrich.js").write_text(out)
    print(f"wrote enrich.js ({len(enrich)}/{len(albums)} matched)")


if __name__ == "__main__":
    main()
