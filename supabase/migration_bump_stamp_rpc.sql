-- みんなのスタンプ集計(stampsテーブル)への書き込みをRPC経由にする。
-- Supabaseダッシュボード → SQL Editor で実行する。
--
-- 背景: 本体サイト/時計アプリは POST /stamps + Prefer: resolution=merge-duplicates で
-- upsertしていたが、anonロールにUPDATE(とSELECT)権限が無いため401で失敗していた
-- (エラーを握りつぶしていたため沈黙failing)。SELECT権限を付けると生データ
-- (client_id×target_key)が公開されるので、代わりにSECURITY DEFINERの関数だけを
-- anonに許可する。
create or replace function public.bump_stamp(p_client_id uuid, p_target_key text, p_stamp_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.stamps
     set stamp_id = p_stamp_id
   where client_id = p_client_id and target_key = p_target_key;
  if not found then
    insert into public.stamps (client_id, target_key, stamp_id)
    values (p_client_id, p_target_key, p_stamp_id);
  end if;
end;
$$;
revoke all on function public.bump_stamp(uuid, text, text) from public;
grant execute on function public.bump_stamp(uuid, text, text) to anon;
