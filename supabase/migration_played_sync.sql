-- 再生済みアルバムセットの端末間同期用。
-- Supabaseダッシュボード → SQL Editor で実行する。
-- played: { "ids": [albumId, ...], "cleared_at": <ミリ秒エポック> }
--   ids は増えるだけの集合として和集合マージ、cleared_at は
--   「履歴と再生済みをクリア」した時刻(新しいクリアが勝つ)。
alter table fav_sync add column if not exists played jsonb;
