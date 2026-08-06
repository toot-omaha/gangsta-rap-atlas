#!/usr/bin/env python3
"""ユーザー投稿(URL方式)を定期的に取り込み、レビュー用JSONに変換する。

投稿フォームはURL(iTunes/YouTube/Spotifyなど)だけを必須にしている。
このスクリプトが未処理分(status='pending')をSupabaseから取得し、各サービスの
oEmbedエンドポイント(認証不要・無料)でタイトル/サムネイルを裏取りしてから
scripts/submission_candidates.json に書き出す。中身は collect_grap.py の
candidates.json と似た形にしてあるので、レビューの流れも揃えられる。

読み取りにはSupabaseの SERVICE ROLE キーが要る(anonキーはinsertしかできない
設計のため)。.env に SUPABASE_SERVICE_KEY=xxx を足してから実行する。

レビュー後、承認した投稿は data.js へ手動で反映し、その投稿の status を
'approved'(却下なら'rejected')に更新すること(このスクリプトはstatusを
'reviewing'にするだけで、確定はしない)。

使い方: python3 scripts/review_submissions.py
出力:   scripts/submission_candidates.json
"""
import json
import os
import pathlib
import re
import sys
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
SB_URL = 'https://xqtoyvhupioztljkejnw.supabase.co/rest/v1'
UA = 'GangstaRapAtlas-review/0.1 (o.takashix@gmail.com; learning project)'


def load_env():
    env_file = ROOT / '.env'
    if not env_file.exists():
        return
    for line in env_file.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        k, v = line.split('=', 1)
        os.environ.setdefault(k.strip(), v.strip())


def get(url, headers=None):
    req = urllib.request.Request(url, headers={'User-Agent': UA, **(headers or {})})
    with urllib.request.urlopen(req, timeout=20) as res:
        return json.loads(res.read().decode('utf-8'))


def post(url, headers, body):
    req = urllib.request.Request(
        url, data=json.dumps(body).encode('utf-8'), method='PATCH',
        headers={'User-Agent': UA, 'Content-Type': 'application/json', **headers})
    with urllib.request.urlopen(req, timeout=20):
        pass


def oembed_lookup(url):
    """iTunes/Apple Music・YouTube・Spotifyの各oEmbed/Lookup APIで裏取りする。
    どれも認証不要。取れた情報だけ返す(取れなければNone)。"""
    host = urllib.parse.urlparse(url).netloc.lower()
    try:
        if 'music.apple.com' in host or 'itunes.apple.com' in host:
            m = re.search(r'/id(\d+)', url)
            if not m:
                return None
            data = get(f'https://itunes.apple.com/lookup?id={m.group(1)}')
            hit = (data.get('results') or [None])[0]
            if not hit:
                return None
            return {
                'title': hit.get('collectionName') or hit.get('trackName'),
                'artist': hit.get('artistName'),
                'art': hit.get('artworkUrl100'),
                'source': 'itunes',
            }
        if 'youtube.com' in host or 'youtu.be' in host:
            data = get(f'https://www.youtube.com/oembed?url={urllib.parse.quote(url)}&format=json')
            return {
                'title': data.get('title'),
                'artist': data.get('author_name'),
                'art': data.get('thumbnail_url'),
                'source': 'youtube',
            }
        if 'spotify.com' in host:
            data = get(f'https://open.spotify.com/oembed?url={urllib.parse.quote(url)}')
            return {
                'title': data.get('title'),
                'artist': None,  # SpotifyのoEmbedはtitleに"曲 - アーティスト"が混在するため後で分離が必要
                'art': data.get('thumbnail_url'),
                'source': 'spotify',
            }
    except Exception as e:
        print(f'  oEmbed失敗 ({host}): {e}', file=sys.stderr)
    return None


def main():
    load_env()
    service_key = os.environ.get('SUPABASE_SERVICE_KEY')
    if not service_key:
        print('SUPABASE_SERVICE_KEY が .env に見つかりません。処理を中断します。', file=sys.stderr)
        sys.exit(1)

    headers = {'apikey': service_key, 'Authorization': f'Bearer {service_key}'}
    rows = get(f'{SB_URL}/submissions?status=eq.pending&select=id,url,artist,title,comment,created_at', headers)
    print(f'{len(rows)} 件のpending投稿')

    out = []
    for i, row in enumerate(rows, 1):
        info = oembed_lookup(row['url']) or {}
        out.append({
            'submission_id': row['id'],
            'url': row['url'],
            'submitted_artist': row.get('artist'),
            'submitted_title': row.get('title'),
            'comment': row.get('comment'),
            'resolved_title': info.get('title'),
            'resolved_artist': info.get('artist'),
            'art': info.get('art'),
            'source': info.get('source'),
            'created_at': row.get('created_at'),
        })
        print(f"  [{i}/{len(rows)}] {row['url']} -> {info.get('artist') or '?'} - {info.get('title') or '?'}")
        # レビュー待ちに移す(確定のapproved/rejectedはレビュー後に手動で設定)
        try:
            post(f"{SB_URL}/submissions?id=eq.{row['id']}", headers, {'status': 'reviewing'})
        except Exception as e:
            print(f'  status更新失敗: {e}', file=sys.stderr)

    (ROOT / 'scripts' / 'submission_candidates.json').write_text(
        json.dumps(out, ensure_ascii=False, indent=1))
    print(f'wrote scripts/submission_candidates.json ({len(out)} 件)')


if __name__ == '__main__':
    main()
