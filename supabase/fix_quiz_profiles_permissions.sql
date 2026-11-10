-- Repair existing deployments where column grants existed but table SELECT did not.
-- Profile rows are private: each signed-in user can read only their own row.
drop policy if exists "public leaderboard profile fields" on public.quiz_profiles;
drop policy if exists "users read own profile" on public.quiz_profiles;

revoke all privileges on table public.quiz_profiles from anon, authenticated;
revoke select (id, username, province, created_at),
       insert (id, username, province, created_at),
       update (id, username, province, created_at),
       references (id, username, province, created_at)
on table public.quiz_profiles from anon, authenticated;

create policy "users read own profile"
on public.quiz_profiles
for select
to authenticated
using ((select auth.uid()) = id);

grant select on table public.quiz_profiles to authenticated;
