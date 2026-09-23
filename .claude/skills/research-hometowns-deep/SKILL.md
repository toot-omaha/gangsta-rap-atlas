---
name: research-hometowns
description: レビュー待ちG-RAPアーティストの出身地をWeb調査し、確度付きでSupabaseへ登録する(A確度は地図へ自動公開)。引数でバッチ件数を指定(省略時25)。Sonnet 5以上での実行を推奨。
---

# 出身地の深掘り再調査バッチ(第2回)

初回調査(/research-hometowns)で**確度C(不明)**になったアーティストを対象に、初回より深く
Web調査して`research_suggestions`を更新する。初回はDiscogsプロフィールだけ見て「地名情報なし」で
終わっている例が多いので、**通販サイト・レーベル・別盤・動画説明文まで必ず当たる**。確度Aは`published_albums`へも書き込み、
即座に本番の地図へ反映する(メインサイトがこのテーブルを読み足して表示する仕組みが稼働済み)。

**このスキルは1バッチ=既定25組を処理して終了する。** 引数があればその件数(最大50)。
対象は約2,830組あるため、繰り返し実行して少しずつ進める前提。

## 接続情報

```
SB_URL: https://xqtoyvhupioztljkejnw.supabase.co/rest/v1
SB_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxdG95dmh1cGlvenRsamtlam53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5Mjc2MDgsImV4cCI6MjEwMTUwMzYwOH0.gW4xkwC3GzdKcnTT-490-75Sssx49wIIBcVOEW-MKHw
ヘッダー: apikey + Authorization: Bearer(どちらも同じキー)、書き込み時は Content-Type: application/json と Prefer: resolution=merge-duplicates,return=minimal
```

最初に `research_suggestions` へのGETが200を返すことを確認する。404ならテーブル未作成なので
作業を始めずにユーザーへ伝えること。

## 1. バッチの選定

選定はスクリプトに任せる(7,000件のJSONを自分で突き合わせない):

```
python3 scripts/rehunt_batch.py <件数>
```

出力の `batch` 配列(artist / first_pass_note / releases)がそのまま今回の対象。
最古リリースの古い順に並んでいる。`first_pass_note` は初回の結論で、そこで見た情報源は
今回は飛ばしてよい(例:「Discogsプロフィールに地名情報なし」→プロフィールは見なくてよい)。
`python3 scripts/rehunt_batch.py --stats` で全体の残数が分かる。

## 2. アーティストごとの調査手順

**目的は同じ(アーティストの出身地=米国等の都市)。ただし初回の「検索4回まで」は撤廃し、
下の情報源を順番に全部当てる(1組あたり検索8回程度まで)。** それでも無ければC据え置き。

### 最重要の注意: 同名の別人を拾わない

G-RAPは一般語のアーティスト名だらけ(Prime、3D、DNA等)。**証拠は必ず今回の盤と
結びついていること**を確認する: 証拠ページにアルバム名・レーベル名・Discogsリリースの
いずれかが一致して現れているか、Discogs上の同一アーティストIDか。結びつきが確認
できない情報は、どれだけ明確に都市を書いていても採用しない。

### 当たる順序(必ずこの順で、見つかるまで)

1. **日本のG-RAP専門通販サイト**(最有力・即A確度)。専門店は商品化の時点で産地を調べて
   「〜産」「CALI」「BAY AREA」「TEXAS」等と書く=事実上レビュー済み。検索例:
   `"<アルバム名>" G-RAP`、`"<アーティスト名>" "<アルバム名>" 産`、`"<アルバム名>" 中古 CD`、
   `"<アーティスト名>" gangsta rap 通販`。ヒットしたら商品説明の産地表記を読む。
2. **英語圏の中古盤ショップ・コレクターブログ・フォーラム**: `"<artist>" "<album>" rap <year>`、
   `"<album>" g-funk`、`"<artist>" "<label>"`。「rare … from <city>」型の記述を探す。
3. **Discogs(初回で見ていない箇所)**: (a) レーベルの `contact_info`(自主レーベルなら所在地≒出身地。
   `https://api.discogs.com/labels/<id>`)、(b) 同アーティストの**別リリース**のNotes/クレジット
   (`https://api.discogs.com/artists/<id>/releases`)、(c) リリースの `notes` にある録音スタジオ・
   私書箱・電話の市外局番、(d) マスターの別バージョン(再発盤は産地を書いていることがある)。
4. **Rate Your Music / YouTube / Bandcamp**: `site:rateyourmusic.com "<artist>"` の location、
   YouTubeのアップロード動画の説明文(「Rare G-Funk from Compton 1995」型)、Bandcampのlocation。
5. **採用しないもの**: 曲名・歌詞だけからの推測、メジャー流通レーベルの所在地、結びつき未確認の記述。

### 確度の定義

- **A**: 出身地(都市)の明記がオンライン上にあり、今回の盤との結びつきも確認できた → 自動公開
- **B**: 状況証拠のみ(1つの強い状況証拠、または2つ以上の弱い証拠の一致) → 提案としてレビュー待ち
- **C**: 特定できなかった → `[第2回]` 印付きで据え置き(regionは空)

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
  "note": "[第2回] <当たった情報源と結論を1行>" }
```

**noteは必ず `[第2回] ` で始める**(rehunt_batch.pyが第2回済みの判定に使う。忘れると同じ組が
次のバッチに再び出てくる)。C据え置きの場合も必ず上書きUPSERTして印を付ける。

```
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

バッチ終了時に集計を報告する: 処理数 / A(自動公開)数 / B(レビュー待ち)数 / C(据え置き)数、
Aの内訳(アーティスト名→地域、根拠1行)、残り(rehunt_batch.pyの出力の remaining_after_this_batch)。
判断に迷って保留したケースがあれば具体的に書く。

## してはいけないこと

- 証拠なしでの地域割り当て(evidenceが空のA/Bは禁止)
- candidates.jsonに無いリリースの追加(調査中に別の盤を見つけても対象外)
- `review_decisions` の既存行(人間の判断)の上書き — 選定時に除外しているので通常は起きない
- data.js や本体コードの変更
