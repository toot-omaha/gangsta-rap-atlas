-- Street Name利用者の粗い地域情報(国レベル)。
-- Supabaseダッシュボード → SQL Editor で実行する。
-- tz: ブラウザのタイムゾーン(例 Asia/Tokyo)、locale: 言語設定(例 ja-JP)。
-- IPアドレスは収集しない。匿名のStreet Nameに紐づく推定国のみ。
alter table fav_sync
  add column if not exists tz text,
  add column if not exists locale text;
