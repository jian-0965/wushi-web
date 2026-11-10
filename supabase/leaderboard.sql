create table public.quiz_leaderboard (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  province text not null,
  correct_count bigint not null default 0,
  achieved_at timestamptz
);
alter table public.quiz_leaderboard enable row level security;
create policy "public view leaderboard" on public.quiz_leaderboard for select to anon, authenticated using (true);
revoke all on public.quiz_leaderboard from anon, authenticated;
grant select (username, province, correct_count, achieved_at) on public.quiz_leaderboard to anon, authenticated;

create or replace function public.create_quiz_profile()
returns trigger language plpgsql security definer set search_path = '' as $$
declare handle text; region text;
begin
  if new.email_confirmed_at is null then return new; end if;
  handle := left(coalesce(nullif(trim(new.raw_user_meta_data->>'username'), ''), '醒狮新友'),24);
  region := coalesce(nullif(trim(new.raw_user_meta_data->>'province'), ''), '未填写');
  insert into public.quiz_profiles(id, username, province) values(new.id,handle,region) on conflict(id) do nothing;
  insert into public.quiz_leaderboard(user_id,username,province) values(new.id,handle,region);
  return new;
end; $$;

create or replace function public.refresh_quiz_leaderboard()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.quiz_leaderboard l
  set correct_count=(select coalesce(sum(a.correct_count),0) from public.quiz_attempts a where a.user_id=new.user_id),
      achieved_at=(select min(a.created_at) from public.quiz_attempts a where a.user_id=new.user_id)
  where l.user_id=new.user_id;
  return null;
end; $$;
revoke all on function public.refresh_quiz_leaderboard() from public,anon,authenticated;
create trigger refresh_quiz_leaderboard_after_attempt after insert on public.quiz_attempts
for each row execute function public.refresh_quiz_leaderboard();

drop function public.quiz_leaderboard(text,int);
do $$ begin
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='quiz_leaderboard') then
    alter publication supabase_realtime add table public.quiz_leaderboard;
  end if;
end $$;
