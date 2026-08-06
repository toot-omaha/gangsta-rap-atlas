-- GANGSTA RAP ATLAS — Supabase セットアップ
-- SQL Editor に丸ごと貼り付けて Run してください。
--
-- 設計方針:
--   * 匿名(anon)ができるのは「投稿の書き込み」と「スタンプの書き込み」と
--     「スタンプ集計の読み取り」だけ。一覧の読み出し・変更・削除は不可。
--   * 投稿は status='pending' でしか作れない(公開はあなたの承認後に手動)。

-- ---------- 投稿(承認待ちディスク情報) ----------
-- 2026-08-06: URL方式に変更。artist/titleは手入力させず、投稿されたURLを
-- scripts/review_submissions.py が定期的にoEmbed等で裏取りして埋める運用にした。
create table public.submissions (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  url        text not null,  -- iTunes/YouTube/Spotifyなどのリンク
  artist     text,           -- 投稿者がわかれば入力(裏取り前の参考情報)
  title      text,
  comment    text,           -- 補足・出典など(個人情報は収集しない方針)
  status     text not null default 'pending'
);

alter table public.submissions enable row level security;
grant insert on public.submissions to anon;

create policy "anon can submit pending" on public.submissions
  for insert to anon
  with check (status = 'pending' and char_length(url) < 500);

-- review_submissions.py はSERVICE ROLEキーで実行し、pending分を読み取って
-- oEmbed裏取り後にstatusを更新する想定(anonにはselect/updateを与えない)。

-- ---------- 共有スタンプ ----------
-- target_key は "Artist|Title"(ディスク) または "Artist|Title#TrackName"(曲)
create table public.stamps (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  client_id  uuid not null,       -- 端末ごとの匿名ID(localStorage)
  target_key text not null,
  stamp_id   text not null,
  unique (client_id, target_key, stamp_id)   -- 同じ端末から同じ対象への重複防止
);

alter table public.stamps enable row level security;
grant insert on public.stamps to anon;

create policy "anon can stamp" on public.stamps
  for insert to anon
  with check (char_length(target_key) < 300 and char_length(stamp_id) < 40);

-- ---------- 集計だけを公開するビュー ----------
-- 生の行(client_id含む)は見せず、集計値のみ anon に公開する
create view public.stamp_counts
  with (security_invoker = off) as
  select target_key, stamp_id, count(*)::int as n
  from public.stamps
  group by target_key, stamp_id;

grant select on public.stamp_counts to anon;
