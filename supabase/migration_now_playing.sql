-- Pixel Watch(Wear OSアプリ)向け: いま鳴っている曲の表示情報とスタンプ用キー。
-- Supabaseダッシュボード → SQL Editor で実行する。
-- 本体サイトがキュー同期のPATCHに相乗りさせて書き、時計アプリが読む。
-- { albumKey, trackKey, artist, title, album, art, region, playing, at }
alter table fav_sync add column if not exists now_playing jsonb;
