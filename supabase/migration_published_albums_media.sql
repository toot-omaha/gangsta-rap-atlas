-- published_albums(新規公開分)向けにDiscogsのYouTube動画・ジャケ写を
-- 保存する列を追加する。SQL Editorで1回だけ実行してください。
-- youtube_ids: 曲単体らしい短尺動画のID配列(埋め込み再生用)
-- youtube_full_album_id: Full Album相当の動画ID(外部リンク専用、1本のみ)
-- discogs_art: Discogsのジャケ写URL(iTunesに無い盤の代替)

alter table public.published_albums add column if not exists youtube_ids jsonb;
alter table public.published_albums add column if not exists youtube_full_album_id text;
alter table public.published_albums add column if not exists discogs_art text;
