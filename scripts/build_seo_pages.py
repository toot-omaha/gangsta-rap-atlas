#!/usr/bin/env python3
"""SEO用の静的地域ページ + sitemap.xml を生成する。

SPA本体(index.html)はハッシュルーティング(#r/地域ID)のため、検索エンジンには
地域ごとのページが存在しないように見える。このスクリプトは data.js と Supabase
(published_regions / published_albums)をマージし、地域ごとの実URL
r/<地域ID>/index.html を書き出す。

生成されるページは**本体アプリそのもののシェル**(root index.htmlをテンプレートに、
title/description/canonical/OGP/JSON-LDだけ地域固有に差し替え+noscriptに
クローラー可読なディスク一覧を埋め込んだもの)。人間が検索から開くと通常の
地図アプリがその地域を開いた状態で起動する(app.jsのopenFromPath()がパスを
ハッシュ共有リンクに変換して既存フローに乗せる)。
「テキストの一覧ページに着地させたくない」というユーザー要望による設計。
r/ 直下の一覧ページは廃止済み(存在しないパスはPagesのSPAフォールバックで
本体が出るのでリンク切れにはならない)。

使い方:  python3 scripts/build_seo_pages.py
出力:    r/<id>/index.html ×地域数, sitemap.xml
再実行すると全ファイルを上書きする(差分掃除もする)。
"""
import html
import json
import re
import shutil
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://g.rap-atlas.com"
SB_URL = "https://xqtoyvhupioztljkejnw.supabase.co/rest/v1"
SB_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxdG95dmh1cGlvenRsamtlam53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5Mjc2MDgsImV4cCI6MjEwMTUwMzYwOH0."
    "gW4xkwC3GzdKcnTT-490-75Sssx49wIIBcVOEW-MKHw"
)
# app.jsのPUBLISHED_ID_OFFSETと同じ値(共有リンクのID空間)
PUBLISHED_ID_OFFSET = 1000000


def unescape_js(s: str) -> str:
    return s.replace("\\'", "'").replace('\\"', '"').replace("\\\\", "\\")


def parse_data_js():
    """data.jsから地域とアルバムを抜き出す(地域ヘッダ位置で区切って帰属させる)。"""
    src = (ROOT / "data.js").read_text(encoding="utf-8")
    region_re = re.compile(
        r"id:\s*'([^']+)',\s*name:\s*'((?:[^'\\]|\\.)*)',\s*area:\s*'((?:[^'\\]|\\.)*)',\s*\n?\s*lng:\s*(-?[0-9.]+),\s*lat:\s*(-?[0-9.]+)"
    )
    album_re = re.compile(
        r"\{ id: (\d+), artist: '((?:[^'\\]|\\.)*)', title: '((?:[^'\\]|\\.)*)', year: (\d+), label: '((?:[^'\\]|\\.)*)',.*?"
        r"discogsUrl: '((?:[^'\\]|\\.)*)'",
        re.S,
    )
    headers = [(m.start(), m) for m in region_re.finditer(src)]
    regions = {}
    order = []
    for i, (pos, m) in enumerate(headers):
        end = headers[i + 1][0] if i + 1 < len(headers) else len(src)
        rid = m.group(1)
        # data.jsに同一idの地域が重複定義されていることがある(yokohama等)。
        # アプリ側はREGIONS.find()で最初の定義しか使わないため、初出を正とする。
        if rid in regions:
            region = regions[rid]
        else:
            region = {
                "id": rid,
                "name": unescape_js(m.group(2)),
                "area": unescape_js(m.group(3)),
                "albums": [],
            }
            regions[rid] = region
            order.append(rid)
        for am in album_re.finditer(src[pos:end]):
            region["albums"].append(
                {
                    "id": int(am.group(1)),
                    "artist": unescape_js(am.group(2)),
                    "title": unescape_js(am.group(3)),
                    "year": int(am.group(4)),
                    "label": unescape_js(am.group(5)),
                    "discogsUrl": unescape_js(am.group(6)),
                }
            )
    return regions, order


def fetch_all(path: str):
    rows, page, offset = [], 1000, 0
    while True:
        req = urllib.request.Request(
            f"{SB_URL}/{path}",
            headers={
                "apikey": SB_KEY,
                "Authorization": f"Bearer {SB_KEY}",
                "Range": f"{offset}-{offset + page - 1}",
            },
        )
        with urllib.request.urlopen(req) as resp:
            chunk = json.load(resp)
        rows.extend(chunk)
        if len(chunk) < page:
            return rows
        offset += page


def merge_supabase(regions, order):
    for r in fetch_all("published_regions?select=id,name,area,lat,lng&order=id"):
        if r["id"] in regions:
            continue
        regions[r["id"]] = {"id": r["id"], "name": r["name"], "area": r["area"] or "", "albums": []}
        order.append(r["id"])
    for a in fetch_all(
        "published_albums?select=id,title,artist,year,label,discogs_url,region_id&order=id"
    ):
        region = regions.get(a["region_id"])
        if region is None:
            continue
        aid = PUBLISHED_ID_OFFSET + a["id"]
        if any(al["id"] == aid for al in region["albums"]):
            continue
        region["albums"].append(
            {
                "id": aid,
                "artist": a["artist"] or "",
                "title": a["title"] or "",
                "year": a["year"] or 0,
                "label": a["label"] or "",
                "discogsUrl": a["discogs_url"] or "",
            }
        )


def esc(s):
    return html.escape(str(s), quote=True)


def ld_dumps(obj):
    """JSON-LDをscriptタグへ安全に埋め込む('</'エスケープで早期終了を防ぐ)。"""
    return json.dumps(obj, ensure_ascii=False).replace("</", "<\\/")


def build_desc(name, area, n, artists, limit=160):
    """metaディスクリプションを組み立てる。文字数上限に収まる分だけアーティストを
    列挙する(機械的に文字数で切ると名前の途中でぶつ切りになるため)。"""
    head = f"{name}({area})出身アーティストのG-RAP/ギャングスタラップ ディスコグラフィ全{n}枚。"
    tail = "ほか。試聴・ジャケ写は地図から。"
    listed = []
    for a in artists:
        cand = listed + [a]
        if len(head) + len("、".join(cand)) + len(tail) > limit:
            break
        listed.append(a)
    if listed:
        return head + "、".join(listed) + tail
    return (head + "試聴・ジャケ写は地図から。")[:limit]


def build_desc_en(name, area, n, artists, limit=160):
    """英語版metaディスクリプション。build_descと同じ方針で長さに収まる分だけ列挙。"""
    head = f"Complete G-Rap / gangsta rap discography from {name}, {area} — {n} discs by "
    tail = " and more. Listen & dig on the interactive map."
    listed = []
    for a in artists:
        cand = listed + [a]
        if len(head) + len(", ".join(cand)) + len(tail) > limit:
            break
        listed.append(a)
    if listed:
        return head + ", ".join(listed) + tail
    return (f"Complete G-Rap discography from {name}, {area} — {n} discs. "
            "Listen & dig on the interactive map.")[:limit]


# 相対URLの属性をルート絶対に変える(生成ページは/r/<id>/配下で配信されるため)。
# https:等の絶対URL・ルート絶対・フラグメント・data:はそのまま。
ABS_RE = re.compile(r'((?:href|src)=")(?!https?:|/|#|data:)')


def region_page(region, template, lang="ja"):
    rid = region["id"]
    name = region["name"]
    area = region["area"]
    albums = sorted(region["albums"], key=lambda a: (-(a["year"] or 0), a["artist"]))
    n = len(albums)
    artists = []
    for a in albums:
        if a["artist"] not in artists:
            artists.append(a["artist"])
    url_ja = f"{SITE}/r/{rid}/"
    url_en = f"{SITE}/en/r/{rid}/"
    if lang == "en":
        title = f"{name} G-Rap Discography ({n} Discs) | GANGSTA RAP ATLAS"
        desc = build_desc_en(name, area, n, artists)
        url = url_en
    else:
        title = f"{name}のG-RAPディスコグラフィ {n}枚｜GANGSTA RAP ATLAS"
        desc = build_desc(name, area, n, artists)
        url = url_ja

    items = []
    for i, a in enumerate(albums[:100], 1):
        item = {
            "@type": "ListItem",
            "position": i,
            "item": {
                "@type": "MusicAlbum",
                "name": a["title"],
                "byArtist": {"@type": "MusicGroup", "name": a["artist"]},
            },
        }
        if a["year"]:
            item["item"]["datePublished"] = str(a["year"])
        if a["discogsUrl"]:
            item["item"]["sameAs"] = a["discogsUrl"]
        items.append(item)
    ld = [
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "GANGSTA RAP ATLAS", "item": f"{SITE}/"},
                {"@type": "ListItem", "position": 2, "name": name, "item": url},
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": (f"{name} G-Rap Discography" if lang == "en" else f"{name}のG-RAPディスコグラフィ"),
            "numberOfItems": n,
            "itemListElement": items,
        },
    ]

    rows = []
    for a in albums:
        t = esc(a["title"])
        if a["discogsUrl"]:
            t = f'<a href="{esc(a["discogsUrl"])}" rel="noopener nofollow">{t}</a>'
        rows.append(
            f"<tr><td>{esc(a['artist'])}</td><td>{t}</td><td>{a['year'] or ''}</td><td>{esc(a['label'])}</td></tr>"
        )
    if lang == "en":
        noscript = f"""<noscript>
  <div style="padding:24px;max-width:860px;margin:0 auto;font-family:sans-serif">
    <h1>{esc(name)} G-Rap Discography</h1>
    <p>{esc(area)} — {n} discs. G-Rap / gangsta rap releases by artists from {esc(name)}.
    JavaScript is required for the interactive map.</p>
    <p><a href="/en/">GANGSTA RAP ATLAS Home</a></p>
    <table border="1" cellpadding="4" cellspacing="0">
      <thead><tr><th>Artist</th><th>Title</th><th>Year</th><th>Label</th></tr></thead>
      <tbody>
{chr(10).join(rows)}
      </tbody>
    </table>
  </div>
</noscript>"""
    else:
        noscript = f"""<noscript>
  <div style="padding:24px;max-width:860px;margin:0 auto;font-family:sans-serif">
    <h1>{esc(name)} のG-RAPディスコグラフィ</h1>
    <p>{esc(area)} — 全{n}枚収録。{esc(name)}出身・拠点のアーティストによる
    G-RAP/ギャングスタラップのディスコグラフィです。地図アプリの表示にはJavaScriptが必要です。</p>
    <p><a href="/">GANGSTA RAP ATLAS ホーム</a></p>
    <table border="1" cellpadding="4" cellspacing="0">
      <thead><tr><th>アーティスト</th><th>タイトル</th><th>年</th><th>レーベル</th></tr></thead>
      <tbody>
{chr(10).join(rows)}
      </tbody>
    </table>
  </div>
</noscript>"""

    s = template
    s = re.sub(r"<title>.*?</title>", f"<title>{esc(title)}</title>", s, count=1, flags=re.S)
    s = re.sub(
        r'<meta name="description" content="[^"]*">',
        f'<meta name="description" content="{esc(desc)}">', s, count=1)
    s = re.sub(
        r'<link rel="canonical" href="[^"]*">',
        f'<link rel="canonical" href="{url}">', s, count=1)
    s = re.sub(
        r'<meta property="og:title" content="[^"]*">',
        f'<meta property="og:title" content="{esc(title)}">', s, count=1)
    s = re.sub(
        r'<meta property="og:description" content="[^"]*">',
        f'<meta property="og:description" content="{esc(desc)}">', s, count=1)
    s = re.sub(
        r'<meta property="og:url" content="[^"]*">',
        f'<meta property="og:url" content="{url}">', s, count=1)
    s = re.sub(
        r'<meta name="twitter:title" content="[^"]*">',
        f'<meta name="twitter:title" content="{esc(title)}">', s, count=1)
    s = re.sub(
        r'<meta name="twitter:description" content="[^"]*">',
        f'<meta name="twitter:description" content="{esc(desc)}">', s, count=1)
    # hreflang(テンプレートのルート用3行をこの地域のペアに差し替え)
    s = re.sub(r'<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n?', "", s)
    s = s.replace(
        f'<link rel="canonical" href="{url}">',
        f'<link rel="canonical" href="{url}">\n'
        f'<link rel="alternate" hreflang="ja" href="{url_ja}">\n'
        f'<link rel="alternate" hreflang="en" href="{url_en}">\n'
        f'<link rel="alternate" hreflang="x-default" href="{url_ja}">', 1)
    if lang == "en":
        s = s.replace('<html lang="ja">', '<html lang="en">', 1)
        s = s.replace('<meta property="og:locale" content="ja_JP">\n<meta property="og:locale:alternate" content="en_US">',
                      '<meta property="og:locale" content="en_US">\n<meta property="og:locale:alternate" content="ja_JP">', 1)
        # /en/配下では未設定ユーザーの初期UI言語を英語にする(既存の選択は尊重)
        s = s.replace('<meta charset="utf-8">',
            "<meta charset=\"utf-8\">\n<script>try{if(!localStorage.getItem('gra.lang'))localStorage.setItem('gra.lang','en')}catch(e){}</script>", 1)
    # 地域固有のJSON-LDを</head>直前に追加(WebSiteのJSON-LDはそのまま残す)
    s = s.replace("</head>", f'<script type="application/ld+json">{ld_dumps(ld)}</script>\n</head>', 1)
    # 既存の汎用noscriptを地域版に差し替え
    s = re.sub(r"<noscript>.*?</noscript>", noscript, s, count=1, flags=re.S)
    # 相対アセットをルート絶対へ(このページは/r/<id>/や/en/配下で配信されるため)
    s = ABS_RE.sub(r"\1/", s)
    return s


def en_root_page(template):
    """英語版トップ(/en/)。ルートのメタを英語に差し替えたアプリシェル。"""
    title = "GANGSTA RAP ATLAS — Dig G-Rap From The Map"
    desc = ("Regional G-Rap / gangsta rap discography you can dig from a US map. "
            "10,000+ discs from 600+ cities — Compton, Houston, Memphis and beyond. "
            "Previews, cover art and collector stamps.")
    url = f"{SITE}/en/"
    s = template
    s = re.sub(r"<title>.*?</title>", f"<title>{esc(title)}</title>", s, count=1, flags=re.S)
    s = re.sub(r'<meta name="description" content="[^"]*">',
               f'<meta name="description" content="{esc(desc)}">', s, count=1)
    s = re.sub(r'<link rel="canonical" href="[^"]*">',
               f'<link rel="canonical" href="{url}">', s, count=1)
    s = re.sub(r'<meta property="og:title" content="[^"]*">',
               f'<meta property="og:title" content="{esc(title)}">', s, count=1)
    s = re.sub(r'<meta property="og:description" content="[^"]*">',
               f'<meta property="og:description" content="{esc(desc)}">', s, count=1)
    s = re.sub(r'<meta property="og:url" content="[^"]*">',
               f'<meta property="og:url" content="{url}">', s, count=1)
    s = re.sub(r'<meta name="twitter:title" content="[^"]*">',
               f'<meta name="twitter:title" content="{esc(title)}">', s, count=1)
    s = re.sub(r'<meta name="twitter:description" content="[^"]*">',
               f'<meta name="twitter:description" content="{esc(desc)}">', s, count=1)
    s = re.sub(r'<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n?', "", s)
    s = s.replace(
        f'<link rel="canonical" href="{url}">',
        f'<link rel="canonical" href="{url}">\n'
        f'<link rel="alternate" hreflang="ja" href="{SITE}/">\n'
        f'<link rel="alternate" hreflang="en" href="{url}">\n'
        f'<link rel="alternate" hreflang="x-default" href="{SITE}/">', 1)
    s = s.replace('<html lang="ja">', '<html lang="en">', 1)
    s = s.replace('<meta property="og:locale" content="ja_JP">\n<meta property="og:locale:alternate" content="en_US">',
                  '<meta property="og:locale" content="en_US">\n<meta property="og:locale:alternate" content="ja_JP">', 1)
    s = s.replace('<meta charset="utf-8">',
        "<meta charset=\"utf-8\">\n<script>try{if(!localStorage.getItem('gra.lang'))localStorage.setItem('gra.lang','en')}catch(e){}</script>", 1)
    noscript = """<noscript>
  <div style="padding:24px;max-width:640px;margin:0 auto;font-family:sans-serif">
    <h1>GANGSTA RAP ATLAS</h1>
    <p>A regional G-Rap / gangsta rap discography you can dig from a US map.
    JavaScript is required for the interactive map.</p>
    <p>Major regions: <a href="/en/r/houston/">Houston</a> / <a href="/en/r/memphis/">Memphis</a> /
    <a href="/en/r/oakland/">Oakland</a> / <a href="/en/r/neworleans/">New Orleans</a> /
    <a href="/en/r/sacramento/">Sacramento</a> / <a href="/en/r/sf/">San Francisco</a> /
    <a href="/en/r/detroit/">Detroit</a> / <a href="/en/r/compton/">Compton</a></p>
  </div>
</noscript>"""
    s = re.sub(r"<noscript>.*?</noscript>", noscript, s, count=1, flags=re.S)
    s = ABS_RE.sub(r"\1/", s)
    return s


def main():
    regions, order = parse_data_js()
    merge_supabase(regions, order)
    template = (ROOT / "index.html").read_text(encoding="utf-8")

    targets = [
        regions[rid]
        for rid in order
        if rid != "unclassified" and regions[rid]["albums"]
    ]

    out = ROOT / "r"
    if out.exists():
        shutil.rmtree(out)
    out.mkdir()
    out_en = ROOT / "en"
    if out_en.exists():
        shutil.rmtree(out_en)
    (out_en / "r").mkdir(parents=True)
    (out_en / "index.html").write_text(en_root_page(template), encoding="utf-8")
    for r in targets:
        d = out / r["id"]
        d.mkdir()
        (d / "index.html").write_text(region_page(r, template), encoding="utf-8")
        de = out_en / "r" / r["id"]
        de.mkdir()
        (de / "index.html").write_text(region_page(r, template, lang="en"), encoding="utf-8")

    today = date.today().isoformat()
    urls = ([f"{SITE}/", f"{SITE}/en/"]
            + [f"{SITE}/r/{r['id']}/" for r in targets]
            + [f"{SITE}/en/r/{r['id']}/" for r in targets])
    entries = "\n".join(
        f"  <url><loc>{u}</loc><lastmod>{today}</lastmod></url>" for u in urls
    )
    (ROOT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{entries}\n</urlset>\n",
        encoding="utf-8",
    )
    total = sum(len(r["albums"]) for r in targets)
    print(f"generated {len(targets)} region app-shell pages, {total} albums, sitemap {len(urls)} urls")


if __name__ == "__main__":
    main()
