---
name: research-hometowns
description: レビュー待ちG-RAPアーティストの出身地をWeb調査し、確度付きでSupabaseへ登録する(A確度は地図へ自動公開)。引数でバッチ件数を指定(省略時25)。Sonnet 5以上での実行を推奨。
---

# 出身地調査バッチ

`admin/candidates.json`(REJECT救済レビューの候補、アーティスト単位)から未調査のアーティストを選び、
出身地をWeb調査して`research_suggestions`へ保存する。確度Aは`published_albums`へも書き込み、
即座に本番の地図へ反映する(メインサイトがこのテーブルを読み足して表示する仕組みが稼働済み)。

**このスキルは1バッチ=既定25組を処理して終了する。** 引数があればその件数(最大50)。
全体で7,000組超あるため、繰り返し実行して少しずつ進める前提。

## 接続情報

```
SB_URL: https://xqtoyvhupioztljkejnw.supabase.co/rest/v1
SB_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxdG95dmh1cGlvenRsamtlam53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5Mjc2MDgsImV4cCI6MjEwMTUwMzYwOH0.gW4xkwC3GzdKcnTT-490-75Sssx49wIIBcVOEW-MKHw
ヘッダー: apikey + Authorization: Bearer(どちらも同じキー)、書き込み時は Content-Type: application/json と Prefer: resolution=merge-duplicates,return=minimal
```

最初に `research_suggestions` へのGETが200を返すことを確認する。404ならテーブル未作成なので
作業を始めずにユーザーへ伝えること。

## 1. バッチの選定

1. `admin/candidates.json` を読む(アーティスト単位、各releasesにyear/label/styles/discogs URL)。
2. 除外対象を取得:
   - `research_suggestions?select=artist`(調査済み)
   - `review_decisions?select=artist`(人間が判断済み)
   - `published_albums?select=source_artist`(公開済み)
3. 残りから **最古のリリース年が1999以前のアーティストを、年の古い順** に、バッチ件数だけ選ぶ
   (同年内はリリース数の多い順)。1999以前が尽きたら2000年以降を年順で。

## 2. アーティストごとの調査手順

**目的はアーティストの出身地(米国の都市)を特定すること。** 1組あたり検索は4回程度まで。
見つからなければ潔く確度Cにする(不明のままも正しい結果)。

### 最重要の注意: 同名の別人を拾わない

G-RAPは一般語のアーティスト名だらけ(Prime、3D、DNA等)。**証拠は必ず今回の盤と
結びついていること**を確認する: 証拠ページにアルバム名・レーベル名・Discogsリリースの
いずれかが一致して現れているか、Discogs上の同一アーティストIDか。結びつきが確認
できない情報は、どれだけ明確に都市を書いていても採用しない。

### 情報源(効く順)

1. **G-RAP専門の通販サイト(最有力・即A確度)**: 中古レコード/CD専門店(日本のG-RAP専門店を含む)の
   商品ページ。専門店は商品化の時点で産地を調査して記載しており(「〜産」「CALI」「BAY AREA」等)、
   事実上レビュー済みの情報。検索例: `"<アルバム名>" G-RAP`、`"<アーティスト名>" "<アルバム名>" 産`、
   `"<アルバム名>" CD 通販`。日本語・英語の両方で試す。
2. **Discogsアーティストページのプロフィール**(即A確度): 「Rapper from Sacramento, CA」のような明記。
   candidates.jsonのリリースURLからAPIで辿れる:
   `https://api.discogs.com/releases/<id>` → `artists[0].id` → `https://api.discogs.com/artists/<id>` の `profile`。
3. **その他のオンライン記述**(明記があれば即A確度): コレクターブログ、Rate Your Musicのlocation、
   YouTube動画の説明文(「Rare G-Funk from Compton 1995」等)、ラップ系wiki。
4. **状況証拠(B確度)**: 自主制作盤のレーベル所在地(`https://api.discogs.com/labels/<id>` の
   `contact_info`。自主レーベルなら所在地≒出身地)、リリースNotes欄の連絡先住所(私書箱の都市)、
   電話番号の市外局番、複数の弱い示唆の一致。
5. **採用しないもの**: 曲名・歌詞だけからの推測、メジャー流通レーベルの所在地、結びつき未確認の記述。

### 確度の定義

- **A**: 出身地(都市)の明記がオンライン上にあり、今回の盤との結びつきも確認できた → 自動公開
- **B**: 状況証拠のみ(1つの強い状況証拠、または2つ以上の弱い証拠の一致) → 提案としてレビュー待ち
- **C**: 特定できなかった → 調査済みの印とメモのみ(regionは空)

Discogs APIは認証なしで25回/分。**リクエスト間に2.5秒**空ける。Nominatimは1回/秒。

## 3. 結果の保存

### 全アーティスト共通: research_suggestionsへUPSERT

```
POST {SB_URL}/research_suggestions
Prefer: resolution=merge-duplicates,return=minimal
{ "artist": "<candidates.jsonのartist表記そのまま>",
  "region_id": "<既存地域ID または null>", "custom_region": "<新規地名 または null>",
  "confidence": "A|B|C",
  "evidence": [{"url": "https://...", "note": "通販サイト商品説明: サクラメント産"}],
  "note": "<補足があれば>" }
```

region_idの決め方: `admin/regions.json` を読み、特定した都市名と一致する既存地域(unclassified以外)が
あればそのid。無ければregion_id=null、custom_regionに都市名(例: "Stockton")。
同名都市が複数州にある場合は州まで確認し、確信が持てなければcustom_regionに "Columbia, SC" 形式で書く。

### A確度のみ追加: 地図へ自動公開

1. region_idが決まった場合はそれを使う。custom_regionの場合:
   - `published_regions?select=id,name` を確認し、同名(大文字小文字無視)があればそのidを使う。
   - 無ければNominatimでジオコーディング:
     `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&q=<都市名>`
     → `POST {SB_URL}/published_regions` に `{id: "custom-<slug>", name, area: "<州, 国>", lat, lng}`。
     idのslugは小文字英数とハイフンのみ。重複したら`-2`等を付ける。
2. そのアーティストの**candidates.jsonにある全リリース**を一括UPSERT:
   ```
   POST {SB_URL}/published_albums
   Prefer: resolution=merge-duplicates,return=minimal
   [{ "source_artist": "<artist>", "discogs_release_id": "<release.id>",
      "title": ..., "artist": "<artist>", "year": ..., "label": ...,
      "discogs_url": "<release.url>", "region_id": "<解決済みID>",
      "updated_at": "<現在時刻ISO>" }, ...]
   ```
3. レビューページ側の整合のため `review_decisions` にも同内容をUPSERT:
   `{ artist, include: true, region_id, custom_region, updated_at }`

## 4. 報告

バッチ終了時に集計を報告する: 処理数 / A(自動公開)数 / B(レビュー待ち)数 / C(不明)数、
Aの内訳(アーティスト名→地域、根拠1行)、残りの未調査数。
判断に迷って保留したケースがあれば具体的に書く。

## してはいけないこと

- 証拠なしでの地域割り当て(evidenceが空のA/Bは禁止)
- candidates.jsonに無いリリースの追加(調査中に別の盤を見つけても対象外)
- `review_decisions` の既存行(人間の判断)の上書き — 選定時に除外しているので通常は起きない
- data.js や本体コードの変更
