#!/usr/bin/env python3
"""iTunesに無い盤(enrich.jsに試聴が無い)だけを対象に、Discogsのリリース情報に
既に載っているYouTubeリンク(videos配列)からアルバム全体の動画を1本だけ選び、
data.jsの該当アルバムの youtubeId フィールドへ直接書き込む。あわせて、
Discogsのジャケ写(images[0].uri)を discogsArt フィールドへ書き込む
(iTunesに無い盤はジャケ写も♪アイコンのままだったため、ユーザー承知の上で
Discogs画像を代替ジャケ写として使う方針に変更、2026-08-07)。

方針(ユーザー指示、2026-08-07):
  - YouTube Data API の検索(1日100クォータ)は使わない。Discogsのrelease
    エンドポイントは既存の収集パイプラインと同じレートリミットで取得でき、
    videos配列に投稿者が貼ったYouTubeリンクが載っていることが多いため、
    そちらを優先する方が「省エネ」(クォータを消費しない)。
  - 曲単位でYouTubeを紐付けるところまでは無理にやらない。あくまで
    アルバム1本の代替再生用として youtubeId (既存スキーマ) を埋めるだけ。

選定ロジック: videos配列から、タイトルに "full album" を含むものを最優先、
無ければアルバムらしい尺(6分以上)のものを、それも無ければ先頭を使う。
ジャケ写は images 配列の先頭(primary画像)をそのまま使う。

使い方:
  python3 scripts/discogs_video_enrich.py [処理件数上限(デフォルト200)]

出力: data.js を直接書き換える(該当アルバムの youtubeId: null → youtubeId: '<videoId>'、
discogsArt フィールドが無ければ新規追加)。
collect_grap.py / rarity.py と同時に実行しない(Discogs APIのレート競合のため)。
"""
import json
import pathlib
import re
import sys
import time
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
CACHE = ROOT / '.cache' / 'discogs'
CACHE.mkdir(parents=True, exist_ok=True)
UA = 'GangstaRapAtlas-collector/0.1 (o.takashix@gmail.com; learning project)'

_last = 0.0
MIN_INTERVAL = 2.6  # Discogs 25/分に合わせる(collect_grap.pyと同じ目安)


def discogs_get(url):
    global _last
    key = re.sub(r'[^a-z0-9]+', '_', url.lower())[-150:]
    cache_file = CACHE / f'{key}.json'
    if cache_file.exists():
        return json.loads(cache_file.read_text())
    wait = MIN_INTERVAL - (time.time() - _last)
    if wait > 0:
        time.sleep(wait)
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    _last = time.time()
    with urllib.request.urlopen(req, timeout=20) as res:
        data = json.loads(res.read().decode('utf-8'))
    cache_file.write_text(json.dumps(data, ensure_ascii=False))
    return data


def pick_album_video(videos):
    if not videos:
        return None
    seen = []
    for v in videos:
        vid = extract_video_id(v.get('uri', ''))
        if not vid or vid in [s[0] for s in seen]:
            continue
        seen.append((vid, v))
    for vid, v in seen:
        if 'full album' in (v.get('title') or '').lower():
            return vid
    for vid, v in seen:
        if (v.get('duration') or 0) >= 360:  # 6分以上ならアルバム通しの可能性が高い
            return vid
    return seen[0][0] if seen else None


def extract_video_id(uri):
    m = re.search(r'[?&]v=([A-Za-z0-9_-]{6,})', uri)
    if m:
        return m.group(1)
    m = re.search(r'youtu\.be/([A-Za-z0-9_-]{6,})', uri)
    return m.group(1) if m else None


def main():
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else 200
    data_path = ROOT / 'data.js'
    src = data_path.read_text()

    enrich_path = ROOT / 'enrich.js'
    itunes_keys = set()
    if enrich_path.exists():
        m = re.search(r'const ENRICH = (\{.*\});', enrich_path.read_text(), re.DOTALL)
        if m:
            itunes_keys = set(json.loads(m.group(1)).keys())

    # { id, artist, title, discogsUrl, youtubeId(現在値) } を持つエントリを
    # 出現順に列挙する。1エントリ = data.js中の1つの album object。
    # discogsArtフィールドは無いエントリが大半なので正規表現には含めず、
    # 個別に「id:Nの直後からstampSeed:までにdiscogsArtが無いか」を後で見る。
    entry_pat = re.compile(
        r"\{ id: (\d+), artist: ((?:'(?:[^'\\]|\\.)*')|(?:\"(?:[^\"\\]|\\.)*\")), "
        r"title: ((?:'(?:[^'\\]|\\.)*')|(?:\"(?:[^\"\\]|\\.)*\")), .*?"
        r"youtubeId: (null|'[A-Za-z0-9_-]+'), .*?"
        r"discogsUrl: '(https://www\.discogs\.com/release/(\d+))'"
    )

    def unquote(s):
        return s[1:-1].replace("\\'", "'").replace('\\"', '"').replace('\\\\', '\\')

    targets = []
    for m in entry_pat.finditer(src):
        aid, artist_q, title_q, yt_cur, discogs_url, release_id = m.groups()
        artist, title = unquote(artist_q), unquote(title_q)
        key = f'{artist}|{title}'
        if key in itunes_keys:
            continue  # iTunesに試聴があるので対象外
        stamp_idx = src.find('stampSeed', m.start())
        has_art = stamp_idx != -1 and 'discogsArt:' in src[m.start():stamp_idx]
        if yt_cur != 'null' and has_art:
            continue  # 動画・ジャケ写とも既に埋まっている
        targets.append({
            'id': aid, 'artist': artist, 'title': title, 'release_id': release_id,
            'need_video': yt_cur == 'null', 'need_art': not has_art,
        })

    print(f'{len(targets)} 件がiTunes未マッチで動画/ジャケ写いずれか未設定(うち先頭{min(limit, len(targets))}件を処理)')

    updated = 0
    for i, t in enumerate(targets[:limit], 1):
        try:
            data = discogs_get(f'https://api.discogs.com/releases/{t["release_id"]}')
        except Exception as e:
            print(f'  [{i}] {t["artist"]} - {t["title"]}: ERROR {e}', file=sys.stderr)
            continue

        changed_this = False

        if t['need_video']:
            vid = pick_album_video(data.get('videos'))
            if vid:
                pat = re.compile(r"(\{ id: " + re.escape(t['id']) + r", .*?youtubeId: )null(,)")
                new_src, n = pat.subn(rf"\g<1>'{vid}'\g<2>", src, count=1)
                if n == 1:
                    src = new_src
                    changed_this = True
                    print(f'  [{i}] {t["artist"]} - {t["title"]}: video={vid}')
                else:
                    print(f'  [{i}] {t["artist"]} - {t["title"]}: id={t["id"]}のyoutubeId置換に失敗(手動確認要)', file=sys.stderr)
            else:
                print(f'  [{i}] {t["artist"]} - {t["title"]}: 動画なし')

        if t['need_art']:
            images = data.get('images') or []
            art_url = images[0].get('uri') if images else None
            if art_url:
                # stampSeed: の直前に discogsArt: '<url>', を差し込む
                # (id〜stampSeedは改行をまたぐため re.DOTALL が必須)
                pat = re.compile(r"(\{ id: " + re.escape(t['id']) + r", .*?)(stampSeed:)", re.DOTALL)
                new_src, n = pat.subn(rf"\g<1>discogsArt: {json.dumps(art_url)}, \g<2>", src, count=1)
                if n == 1:
                    src = new_src
                    changed_this = True
                    print(f'  [{i}] {t["artist"]} - {t["title"]}: art={art_url}')
                else:
                    print(f'  [{i}] {t["artist"]} - {t["title"]}: id={t["id"]}のdiscogsArt挿入に失敗(手動確認要)', file=sys.stderr)
            else:
                print(f'  [{i}] {t["artist"]} - {t["title"]}: 画像なし')

        if changed_this:
            updated += 1

    if updated:
        data_path.write_text(src)
    print(f'完了: {updated} 件を更新')


if __name__ == '__main__':
    main()
