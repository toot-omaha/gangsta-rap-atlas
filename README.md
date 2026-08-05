# GANGSTA RAP ATLAS

地図カラ掘ル、地域別ディスコグラフィ — G-RAPの発掘型情報サイト。

アメリカ地図(と世界)の都市を撃つと、その土地のディスク(CD単体)一覧が誌面風ポップアップで開く。
スタンプは曲単位で押し、その集計がディスクのムードプロファイルになる。
スタンプが少ない盤ほど「発掘度」が高い = まだ誰も掘っていない。

## 構成

- 静的サイト(ビルド不要): `index.html` / `style.css` / `app.js`
- `data.js` — 手動キュレーションの地域・ディスクデータ(ここに足して育てる)
- `enrich.js` — 自動生成。iTunes Search API から取得したジャケ写・30秒試聴・Apple Musicリンク
- `scripts/enrich.py` — `data.js` を読んで `enrich.js` を再生成するパイプライン(python3のみで動く)

## ディスクの追加方法

1. `data.js` の該当地域(なければ地域ごと)にエントリを追加
2. `python3 scripts/enrich.py` を実行(レートリミット遵守・キャッシュあり)
3. ジャケ写と試聴が自動で付く。iTunesに無い盤は「NOT ON STREAMING ─ 激レア ─」表示になる

## データ方針

- 収集は公式API(iTunes Search API)とオープンデータのみ。スクレイピングによる転載はしない
- レビュー文の転載はせず、ムード分析の数値(スタンプ初期値)としてのみ利用する
- ジャケ写はAppleの提供データを使い、Apple Musicへのリンクを添える
- 弾痕画像: freesvg.org のパブリックドメイン素材を加工(`assets/bullet-hole-clean.svg`)
- 地図: © OpenStreetMap contributors © CARTO

## デプロイ

Cloudflare Pages(Git連携)。ビルドコマンドなし・出力ディレクトリ `/`。
