-- 再生キューの端末間同期(PC⇄スマホ)用。fav_syncにキュー保存列を追加する。
-- queue: saveQueue()と同じ形 { cursor, items:[{albumId, idx, auto?}], playing }
-- 適用方法: SupabaseダッシュボードのSQL Editorに貼り付けて実行
alter table fav_sync
  add column if not exists queue jsonb,
  add column if not exists queue_updated_at timestamptz;
