-- Fix for gm_users RLS recursion and safer jobs claim/unclaim policies.
-- Apply in Supabase SQL editor.

-- 1) gm_users policy: avoid self-referential EXISTS recursion.
alter table public.gm_users enable row level security;

drop policy if exists "gms can read gm list" on public.gm_users;
create policy "gms can read gm list"
on public.gm_users for select
using (auth.uid() = user_id);

-- Optional: allow GMs to add/remove GM entries via service role only.
-- (Do not grant authenticated direct write access unless intended.)

-- 2) jobs claim/unclaim policies: split into explicit claim/unclaim checks.
alter table public.jobs enable row level security;

drop policy if exists "players claim/unclaim jobs" on public.jobs;
drop policy if exists "players claim jobs" on public.jobs;
drop policy if exists "players unclaim jobs" on public.jobs;

create policy "players claim jobs"
on public.jobs for update
to authenticated
using (auth.uid() is not null)
with check (
  status = 'claimed'
  and claimed_by = auth.uid()
);

create policy "players unclaim jobs"
on public.jobs for update
to authenticated
using (auth.uid() is not null)
with check (
  status = 'available'
  and claimed_by is null
);

-- 3) Column-level update permission remains limited.
revoke update on public.jobs from authenticated;
grant update (status, claimed_by, claimed_at) on public.jobs to authenticated;
