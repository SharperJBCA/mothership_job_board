-- Replace claim/unclaim UPDATE policy with post-update-only checks.

drop policy if exists "players claim/unclaim jobs" on public.jobs;

create policy "players claim jobs"
on public.jobs
for update
to authenticated
using (true)
with check (
  status = 'claimed'
  and claimed_by = auth.uid()
);

create policy "players unclaim jobs"
on public.jobs
for update
to authenticated
using (true)
with check (
  status = 'available'
  and claimed_by is null
);
