# スタンプシード実測リサーチ

stampSeed を「推定値」から「レビュー実測値」に置き換えるためのデータ置き場。

## ルール

- 1アルバム = 1 JSONファイル(`<artist-slug>--<title-slug>.json`)
- スタンプ1カウント = 「そのムードに言及している独立したウェブ上のレビュー/記事 1本」
  - 同じ媒体の同じ記事は1カウントまで
  - 出典URLを必ず `sources` に記録する(検証可能性のため)
  - レビュー本文の転載はしない(ムード判定の結果だけを記録する)
- 曲単位の言及は `tracks` に、アルバム全体の言及は `album` に記録
- 表示上のアルバム集計 = album分 + 全tracks分の合算
- リサーチ済みアルバムは `scripts/apply_seeds.py` が data.js に
  `stampSeed`(集計値) + `seedSrc`(出典URL配列) を書き込む
- `seedSrc` が無いアルバムのシードはフロント側でカウントされない(app.js参照)

## ムードID

doro(ドロドロ) / horror(ホラー) / mellow(メロウ) / smooth(スムース) /
aishu(哀愁) / bangin(バンギン) / funky(ファンキー) / laidbk(レイドバック) /
dark(ダーク) / party(パーティー)

## JSONフォーマット

```json
{
  "artist": "N.W.A",
  "title": "Straight Outta Compton",
  "album": { "bangin": 3, "dark": 2 },
  "tracks": {
    "Straight Outta Compton": { "bangin": 2 },
    "Express Yourself": { "funky": 2, "party": 1 }
  },
  "sources": [
    "https://example.com/review1",
    "https://example.com/review2"
  ]
}
```
