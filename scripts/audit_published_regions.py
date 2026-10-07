#!/usr/bin/env python3
"""published_regions の重複点検(深掘り再調査バッチの後に毎回実行)。

custom-* 地域のうち、admin/regions.json の既存地域と(アクセント・大文字小文字・記号を無視した)
同名のものを列挙する。--fix を付けると、州が一致して確実なものだけ既存地域へ統合する
(published_albums / review_decisions / research_suggestions の region_id を付け替え、
custom地域を削除)。同名別州の可能性があるもの(Columbia, Springfield 等)は列挙のみで触らない。
"""
import json, re, sys, unicodedata, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SB = "https://xqtoyvhupioztljkejnw.supabase.co/rest/v1"
KEY = ("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
       "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxdG95dmh1cGlvenRsamtlam53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5Mjc2MDgsImV4cCI6MjEwMTUwMzYwOH0."
       "gW4xkwC3GzdKcnTT-490-75Sssx49wIIBcVOEW-MKHw")
H = {"apikey": KEY, "Authorization": f"Bearer {KEY}"}


def call(method, path, body=None):
    req = urllib.request.Request(f"{SB}/{path}", method=method, headers={**H, "Content-Type": "application/json", "Prefer": "return=minimal"},
                                 data=json.dumps(body).encode() if body is not None else None)
    try:
        return urllib.request.urlopen(req).status
    except urllib.error.HTTPError as e:
        return e.code


def get_all(path):
    rows, off = [], 0
    while True:
        req = urllib.request.Request(f"{SB}/{path}", headers={**H, "Range": f"{off}-{off+999}"})
        page = json.load(urllib.request.urlopen(req)); rows += page
        if len(page) < 1000: return rows
        off += 1000


def norm(s):
    return re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().lower())


US_STATES = {"al","ak","az","ar","ca","co","ct","de","fl","ga","hi","id","il","in","ia","ks","ky","la","me","md","ma","mi","mn","ms","mo","mt","ne","nv","nh","nj","nm","ny","nc","nd","oh","ok","or","pa","ri","sc","sd","tn","tx","ut","vt","va","wa","wv","wi","wy","dc"}


def main():
    fix = "--fix" in sys.argv
    base = [r for r in json.load(open(ROOT / "admin" / "regions.json")) if not r.get("unclassified")]
    by_name = {}
    for r in base:
        by_name.setdefault(norm(r["name"]), []).append(r)
    pub = [p for p in get_all("published_regions?select=id,name,area") if p["id"].startswith("custom-")]
    merged = 0
    for p in pub:
        city = norm(p["name"].split(",")[0])
        cands = by_name.get(city, [])
        if not cands:
            continue
        # 州付き(custom-xxx-ST)なら、既存側のareaに同じ州が含まれる時だけ確実とみなす
        m = re.search(r"-([a-z]{2})$", p["id"])
        st = m.group(1) if m and m.group(1) in US_STATES else None
        sure = [c for c in cands if (st is None and len(cands) == 1 and not any(x in c.get("area", "").lower() for x in ("georgia", "carolina")))
                or (st and st in norm(c.get("area", "")) and False)]
        # 米国の同名都市は州の食い違いを見落としやすいので、州なしcustomで既存が1件のものだけ自動統合
        tag = "AUTO" if sure else "REVIEW"
        print(f"{tag}: {p['id']} ({p['name']}) ≈ {[c['id'] for c in cands]}")
        if fix and sure:
            to = sure[0]["id"]
            for t, extra in (("published_albums", {}), ("review_decisions", {"custom_region": None}), ("research_suggestions", {"custom_region": None})):
                print("  ", t, call("PATCH", f"{t}?region_id=eq.{p['id']}", {"region_id": to, **extra}))
            print("   delete region", call("DELETE", f"published_regions?id=eq.{p['id']}"))
            merged += 1
    print(f"custom regions: {len(pub)}, merged: {merged}")


if __name__ == "__main__":
    main()
