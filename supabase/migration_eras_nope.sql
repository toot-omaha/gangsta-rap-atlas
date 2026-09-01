-- 作成漏れだった同期用の列を追加する(実障害の修正)。
-- Supabaseダッシュボード → SQL Editor で実行する。
-- この2列が無かったため、pushFavSyncの本命PATCH(nope/eras/mystamps入り)が
-- 400で失敗し続け、フォールバックのhave/wantしか保存されていなかった。
-- eras: 年代フィルター(例 ["e90","e00"])、nope: イラナイ(シャッフル除外)の盤キー
alter table fav_sync
  add column if not exists eras jsonb,
  add column if not exists nope jsonb;
