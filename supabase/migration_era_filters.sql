-- 年代フィルターのチェック状態をStreet Name同期に載せるための移行SQL。
-- SQL Editorで1回だけ実行してください。
-- eras は ["pre2000","y2000s","y2010s"] のような配列(チェックONの年代)。

alter table public.fav_sync add column if not exists eras jsonb;
