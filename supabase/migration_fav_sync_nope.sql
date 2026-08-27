-- 「イラナイ」(アルバム単位のシャッフル除外マーク)をStreet Name同期に載せる
-- ための移行SQL。SQL Editorで1回だけ実行してください。
-- nope は have/want と同じくディスクキー(artist|title)の配列。

alter table public.fav_sync add column if not exists nope jsonb;
