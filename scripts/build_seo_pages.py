#!/usr/bin/env python3
"""SEO用の静的地域ページ + sitemap.xml を生成する。

SPA本体(index.html)はハッシュルーティング(#r/地域ID)のため、検索エンジンには
地域ごとのページが存在しないように見える。このスクリプトは data.js と Supabase
(published_regions / published_albums)をマージし、クローラーが読める素のHTMLを
r/<地域ID>/index.html として書き出す。各ページからは本体の共有リンク
(../../#r/<地域ID>)へ誘導する。

使い方:  python3 scripts/build_seo_pages.py
出力:    r/index.html, r/<id>/index.html ×地域数, sitemap.xml
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
SITE = "https://toot-omaha.github.io/gangsta-rap-atlas"
SB_URL = "https://xqtoyvhupioztljkejnw.supabase.co/rest/v1"
SB_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxdG95dmh1cGlvenRsamtlam53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5Mjc2MDgsImV4cCI6MjEwMTUwMzYwOH0."
    "gW4xkwC3GzdKcnTT-490-75Sssx49wIIBcVOEW-MKHw"
)
# app.jsのPUBLISHED_ID_OFFSETと同じ値。共有リンク(#r/<id>/<discId>)のID空間を合わせる
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
        # アプリ側はREGIONS.find()で最初の定義しか使わないため、こちらも初出を正とし
        # 2つ目以降のブロックのアルバムは初出の地域へ合流させる。
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


CSS = """
body{margin:0;background:#e8e4d9;color:#14120f;font-family:'Helvetica Neue',Helvetica,'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif;line-height:1.6}
header{background:#14120f;color:#e8e4d9;padding:18px 20px;border-bottom:3px solid #c1272d}
header a{color:#e8e4d9;text-decoration:none}
header .brand{font-weight:800;letter-spacing:.14em;font-size:15px}
main{max-width:860px;margin:0 auto;padding:20px 16px 56px}
h1{font-size:22px;margin:14px 0 4px}
.area{color:#4a453c;margin:0 0 14px;font-size:14px}
.cta{display:inline-block;background:#c1272d;color:#fff;padding:9px 16px;border-radius:3px;text-decoration:none;font-weight:700;margin:8px 0 20px}
table{border-collapse:collapse;width:100%;font-size:14px}
th,td{border-bottom:1px solid #cfc9ba;padding:7px 8px;text-align:left;vertical-align:top}
th{background:#dcd6c6;font-size:12px;letter-spacing:.08em}
td a{color:#8a1f24}
.regions li{margin:3px 0}
.regions a{color:#8a1f24}
.grp{margin:18px 0 6px;font-size:15px;border-left:4px solid #c1272d;padding-left:8px}
footer{max-width:860px;margin:0 auto;padding:18px 16px;color:#4a453c;font-size:12px;border-top:1px solid #cfc9ba}
nav.bc{font-size:12px;color:#4a453c;margin-top:6px}
nav.bc a{color:#8a1f24}
""".strip()


def esc(s):
    return html.escape(str(s), quote=True)


def ld_dumps(obj):
    """JSON-LDをscriptタグへ安全に埋め込む。'</'をエスケープし、データ中に
    '</script>'が現れてもscript要素が早期終了しないようにする。"""
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


def region_page(region):
    rid = region["id"]
    name = region["name"]
    area = region["area"]
    albums = sorted(region["albums"], key=lambda a: (-(a["year"] or 0), a["artist"]))
    n = len(albums)
    artists = []
    for a in albums:
        if a["artist"] not in artists:
            artists.append(a["artist"])
    # titleはSERPでの視認性優先で短く。地域の州・郡はdescription/h1側に置く
    title = f"{name}のG-RAPディスコグラフィ {n}枚｜GANGSTA RAP ATLAS"
    desc = build_desc(name, area, n, artists)
    url = f"{SITE}/r/{rid}/"

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
                {"@type": "ListItem", "position": 2, "name": "地域一覧", "item": f"{SITE}/r/"},
                {"@type": "ListItem", "position": 3, "name": name, "item": url},
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": f"{name}のG-RAPディスコグラフィ",
            "numberOfItems": n,
            "itemListElement": items,
        },
    ]

    rows = []
    for a in albums:
        year = a["year"] or ""
        t = esc(a["title"])
        if a["discogsUrl"]:
            t = f'<a href="{esc(a["discogsUrl"])}" rel="noopener nofollow" target="_blank">{t}</a>'
        share = f"../../#r/{rid}/{a['id']}"
        rows.append(
            f"<tr><td>{esc(a['artist'])}</td><td>{t}</td><td>{year}</td>"
            f"<td>{esc(a['label'])}</td><td><a href=\"{share}\">地図で開く</a></td></tr>"
        )

    return f"""<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="GANGSTA RAP ATLAS">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/assets/icon/icon-512.png">
<meta property="og:locale" content="ja_JP">
<meta name="twitter:card" content="summary">
<link rel="icon" type="image/png" sizes="32x32" href="../../assets/icon/icon-32.png">
<script type="application/ld+json">{ld_dumps(ld)}</script>
<style>{CSS}</style>
</head>
<body>
<header>
  <a class="brand" href="../../">◉ GANGSTA RAP ATLAS</a>
  <nav class="bc"><a href="../../">ホーム</a> › <a href="../">地域一覧</a> › {esc(name)}</nav>
</header>
<main>
  <h1>{esc(name)} のG-RAPディスコグラフィ</h1>
  <p class="area">{esc(area)} — 全{n}枚収録</p>
  <p>{esc(name)}({esc(area)})出身・拠点のアーティストによるG-RAP/ギャングスタラップのディスコグラフィ。
  インタラクティブ地図では試聴・ジャケ写・スタンプ検索が使えます。</p>
  <a class="cta" href="../../#r/{rid}">🗺 地図でこの地域を開く</a>
  <table>
    <thead><tr><th>アーティスト</th><th>タイトル</th><th>年</th><th>レーベル</th><th></th></tr></thead>
    <tbody>
{chr(10).join(rows)}
    </tbody>
  </table>
</main>
<footer>© GANGSTA RAP ATLAS — <a href="../../">地図から掘る、地域別G-RAPディスコグラフィ</a> ／ <a href="../">全地域一覧</a></footer>
</body>
</html>
"""


def index_page(regions_list):
    total = sum(len(r["albums"]) for r in regions_list)
    by_area = {}
    for r in regions_list:
        by_area.setdefault(r["area"], []).append(r)
    groups = []
    for area in sorted(by_area, key=lambda a: -sum(len(r["albums"]) for r in by_area[a])):
        lis = "".join(
            f'<li><a href="{r["id"]}/">{esc(r["name"])}</a>({len(r["albums"])}枚)</li>'
            for r in sorted(by_area[area], key=lambda r: -len(r["albums"]))
        )
        groups.append(f'<h2 class="grp">{esc(area)}</h2><ul class="regions">{lis}</ul>')
    title = "地域別G-RAPディスコグラフィ一覧｜GANGSTA RAP ATLAS"
    desc = (
        f"G-RAP/ギャングスタラップの地域別ディスコグラフィ一覧。米国を中心とした{len(regions_list)}都市・"
        f"{total}枚のディスクを収録。ComptonからHouston、Memphisまで地図から発掘。"
    )
    url = f"{SITE}/r/"
    ld = [
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "GANGSTA RAP ATLAS", "item": f"{SITE}/"},
                {"@type": "ListItem", "position": 2, "name": "地域一覧", "item": url},
            ],
        },
        {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": title,
            "url": url,
            "description": desc,
            "isPartOf": {"@type": "WebSite", "name": "GANGSTA RAP ATLAS", "url": f"{SITE}/"},
        },
    ]
    return f"""<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="GANGSTA RAP ATLAS">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:locale" content="ja_JP">
<script type="application/ld+json">{ld_dumps(ld)}</script>
<meta property="og:image" content="{SITE}/assets/icon/icon-512.png">
<meta name="twitter:card" content="summary">
<link rel="icon" type="image/png" sizes="32x32" href="../assets/icon/icon-32.png">
<style>{CSS}</style>
</head>
<body>
<header>
  <a class="brand" href="../">◉ GANGSTA RAP ATLAS</a>
  <nav class="bc"><a href="../">ホーム</a> › 地域一覧</nav>
</header>
<main>
  <h1>地域別G-RAPディスコグラフィ一覧</h1>
  <p class="area">全{len(regions_list)}地域・{total}枚収録</p>
  <p>各地域ページにディスコグラフィの全リストがあります。
  <a href="../">インタラクティブ地図版</a>では試聴・ジャケ写・スタンプ検索が使えます。</p>
{chr(10).join(groups)}
</main>
<footer>© GANGSTA RAP ATLAS — <a href="../">地図から掘る、地域別G-RAPディスコグラフィ</a></footer>
</body>
</html>
"""


def main():
    regions, order = parse_data_js()
    merge_supabase(regions, order)

    # 対象: アルバムが1枚以上ある通常地域(unclassifiedは地図専用の置き場なので除外)
    targets = [
        regions[rid]
        for rid in order
        if rid != "unclassified" and regions[rid]["albums"]
    ]

    out = ROOT / "r"
    if out.exists():
        shutil.rmtree(out)
    out.mkdir()
    (out / "index.html").write_text(index_page(targets), encoding="utf-8")
    for r in targets:
        d = out / r["id"]
        d.mkdir()
        (d / "index.html").write_text(region_page(r), encoding="utf-8")

    today = date.today().isoformat()
    urls = [f"{SITE}/", f"{SITE}/r/"] + [f"{SITE}/r/{r['id']}/" for r in targets]
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
    print(f"generated {len(targets)} region pages, {total} albums, sitemap {len(urls)} urls")


if __name__ == "__main__":
    main()
