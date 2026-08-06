#!/usr/bin/env python3
"""ユーザー投稿(URL方式)を定期的に取り込み、レビュー用JSONに変換する。

投稿フォームはURL(iTunes/YouTube/Spotifyなど)だけを必須にしている。
このスクリプトが未処理分(status='pending')をSupabaseから取得し、
  1. 各サービスのoEmbedエンドポイント(認証不要・無料)でタイトル/
     アーティスト名/サムネイルを裏取りし、
  2. 取れたアーティスト名を使って collect_grap.py と同じ
     MusicBrainz(出生地)+Nominatim(ジオコーディング)+Wikipedia(経歴抜粋、
     参考文として同梱するだけで自動判定はしない)で出身地を仮推定する
(どちらも無料・認証不要のAPI。地域推定は精度が低いので、あくまで
レビュー時の参考。最終判断は人力/WebSearchでの確認が必要)。
結果は scripts/submission_candidates.json に書き出す。中身は
collect_grap.py の candidates.json と似た形にしてあるので、レビューの
流れも揃えられる。

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
import time
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
CACHE = ROOT / '.cache'
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


def norm(s):
    return re.sub(r'[^a-z0-9]+', '', s.lower())


class RateLimited:
    """collect_grap.pyと同じ、API種別ごとに独立したレートリミット+ディスクキャッシュ付きGET。"""

    def __init__(self, name, min_interval):
        self.dir = CACHE / name
        self.dir.mkdir(parents=True, exist_ok=True)
        self.min_interval = min_interval
        self._last = 0.0

    def get_(self, url, headers=None):
        key = re.sub(r'[^a-z0-9]+', '_', url.lower())[-150:]
        cache_file = self.dir / f'{key}.json'
        if cache_file.exists():
            return json.loads(cache_file.read_text())
        wait = self.min_interval - (time.time() - self._last)
        if wait > 0:
            time.sleep(wait)
        req = urllib.request.Request(url, headers={'User-Agent': UA, **(headers or {})})
        self._last = time.time()
        with urllib.request.urlopen(req, timeout=20) as res:
            data = json.loads(res.read().decode('utf-8'))
        cache_file.write_text(json.dumps(data, ensure_ascii=False))
        return data


musicbrainz = RateLimited('musicbrainz', 1.1)
nominatim = RateLimited('nominatim', 1.1)
wikipedia = RateLimited('wikipedia', 1.1)

_WIKI_TAG = re.compile(r'\{\{[^{}]*\}\}|\[\[(?:[^|\]]*\|)?([^\]]*)\]\]|<ref[^>]*>.*?</ref>|<[^>]+>', re.S)


def artist_hometown(artist):
    """(地名, 国名) を返す。collect_grap.pyのartist_hometown()と同じロジック。"""
    q = urllib.parse.quote(f'artist:"{artist}"')
    data = musicbrainz.get_(f'https://musicbrainz.org/ws/2/artist/?query={q}&fmt=json')
    for a in data.get('artists', []):
        if norm(a.get('name', '')) == norm(artist):
            area = a.get('begin-area') or a.get('area')
            country = (a.get('area') or {}).get('name')
            if area:
                return area.get('name'), country
    return None, None


def geocode(place, country=None):
    if not place:
        return None
    q_text = f'{place}, {country}' if country and country != place else place
    q = urllib.parse.quote(q_text)
    res = nominatim.get_(f'https://nominatim.openstreetmap.org/search?q={q}&format=json&limit=1')
    if not res:
        return None
    return {'lng': float(res[0]['lon']), 'lat': float(res[0]['lat']), 'name': place}


def wiki_bio(artist):
    q = urllib.parse.quote(f'{artist} rapper')
    data = wikipedia.get_(
        f'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={q}&format=json&srlimit=1'
    )
    hits = data.get('query', {}).get('search', [])
    if not hits:
        return None
    title = hits[0]['title']
    sec = wikipedia.get_(
        f'https://en.wikipedia.org/w/api.php?action=parse&page={urllib.parse.quote(title)}&prop=sections&format=json'
    )
    if 'error' in sec:
        return None
    idx = next(
        (s['index'] for s in sec.get('parse', {}).get('sections', [])
         if 'early life' in s['line'].lower() or 'biography' in s['line'].lower()),
        None,
    )
    if idx is not None:
        body = wikipedia.get_(
            f'https://en.wikipedia.org/w/api.php?action=parse&page={urllib.parse.quote(title)}'
            f'&prop=wikitext&section={idx}&format=json'
        )
        wt = body.get('parse', {}).get('wikitext', {}).get('*', '')
    else:
        body = wikipedia.get_(
            f'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true'
            f'&explaintext=true&titles={urllib.parse.quote(title)}&format=json'
        )
        wt = next(iter(body.get('query', {}).get('pages', {}).values()), {}).get('extract', '')

    def unlink(m):
        return m.group(1) if m.group(1) is not None else ''
    plain = _WIKI_TAG.sub(unlink, wt)
    plain = re.sub(r'\n{2,}', '\n', plain).strip()
    return {'title': title, 'excerpt': plain[:600]}


def resolve_region(artist):
    """アーティスト名から仮の出身地(地名・国・緯度経度・Wikipedia抜粋)を推定する。
    精度は低いので、あくまでレビュー時の参考情報として返す。"""
    if not artist:
        return None
    try:
        place, country = artist_hometown(artist)
        geo = geocode(place, country) if place else None
        bio = wiki_bio(artist)
        if not geo and not bio:
            return None
        return {
            'hometown': geo,
            'country': country,
            'wiki_excerpt': (bio or {}).get('excerpt'),
        }
    except Exception as e:
        print(f'  出身地推定失敗 ({artist}): {e}', file=sys.stderr)
        return None


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
        artist_for_lookup = info.get('artist') or row.get('artist')
        region = resolve_region(artist_for_lookup)
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
            'suggested_hometown': (region or {}).get('hometown'),
            'suggested_country': (region or {}).get('country'),
            'wiki_excerpt': (region or {}).get('wiki_excerpt'),
            'created_at': row.get('created_at'),
        })
        print(f"  [{i}/{len(rows)}] {row['url']} -> {info.get('artist') or '?'} - {info.get('title') or '?'}"
              f" (出身地候補: {(region or {}).get('hometown', {}).get('name') if region else '不明'})")
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
