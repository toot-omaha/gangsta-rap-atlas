#!/usr/bin/env python3
"""出身地の深掘り再調査(第2回)のバッチ選定。

初回調査で確度C(不明)になったアーティストのうち、まだ第2回を通していないものを
最古リリース年の古い順に N 組選び、JSONで出力する(/research-hometowns-deep スキルが使う)。

  python3 scripts/rehunt_batch.py [件数=25] [--stats]

「第2回済み」の判定は research_suggestions.note が "[第2回]" で始まるかどうか。
"""
import json
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SB_URL = "https://xqtoyvhupioztljkejnw.supabase.co/rest/v1"
SB_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxdG95dmh1cGlvenRsamtlam53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5Mjc2MDgsImV4cCI6MjEwMTUwMzYwOH0."
    "gW4xkwC3GzdKcnTT-490-75Sssx49wIIBcVOEW-MKHw"
)
H = {"apikey": SB_KEY, "Authorization": f"Bearer {SB_KEY}"}


def fetch_all(path):
    rows, off = [], 0
    while True:
        req = urllib.request.Request(f"{SB_URL}/{path}", headers={**H, "Range": f"{off}-{off + 999}"})
        page = json.load(urllib.request.urlopen(req))
        rows += page
        if len(page) < 1000:
            return rows
        off += 1000


def main():
    n = 25
    stats = "--stats" in sys.argv
    for a in sys.argv[1:]:
        if a.isdigit():
            n = min(int(a), 50)
    cands = {a["artist"]: a for a in json.load(open(ROOT / "admin" / "candidates.json"))}
    sugg = fetch_all("research_suggestions?select=artist,confidence,note")
    decided = {d["artist"] for d in fetch_all("review_decisions?select=artist")}
    published = {p["source_artist"] for p in fetch_all("published_albums?select=source_artist")}

    c_rows = [s for s in sugg if s["confidence"] == "C" and s["artist"] in cands]
    done2 = [s for s in c_rows if (s.get("note") or "").startswith("[第2回]")]
    todo = [s for s in c_rows if not (s.get("note") or "").startswith("[第2回]")
            and s["artist"] not in decided and s["artist"] not in published]

    def earliest(artist):
        ys = [r.get("year") for r in cands[artist]["releases"] if r.get("year")]
        return min(ys) if ys else 9999

    todo.sort(key=lambda s: (earliest(s["artist"]), -len(cands[s["artist"]]["releases"])))
    if stats:
        print(json.dumps({"C_total": len(c_rows), "second_pass_done": len(done2), "remaining": len(todo)}, ensure_ascii=False))
        return
    batch = [{"artist": s["artist"], "first_pass_note": s.get("note"), "releases": cands[s["artist"]]["releases"]}
             for s in todo[:n]]
    print(json.dumps({"remaining_after_this_batch": max(0, len(todo) - len(batch)), "batch": batch}, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
