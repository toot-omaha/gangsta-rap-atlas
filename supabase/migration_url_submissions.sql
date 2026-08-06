-- 投稿フォームをURL方式に変更するための移行SQL。
-- 既存の submissions テーブルに対して、SQL Editorで1回だけ実行してください。

alter table public.submissions add column if not exists url text;
alter table public.submissions alter column artist drop not null;
alter table public.submissions alter column title drop not null;

-- 既存のinsertポリシーを、URL必須の新しい条件に差し替える
drop policy if exists "anon can submit pending" on public.submissions;
create policy "anon can submit pending" on public.submissions
  for insert to anon
  with check (status = 'pending' and url is not null and char_length(url) < 500);
