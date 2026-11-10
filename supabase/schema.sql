-- 狮遇舞狮文化竞赛 · 在 Supabase SQL Editor 执行
create table if not exists public.quiz_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null check (char_length(username) between 2 and 24),
  province text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_questions (
  id bigint generated always as identity primary key,
  question text not null,
  choices jsonb not null check (jsonb_typeof(choices) = 'array' and jsonb_array_length(choices) = 4),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_answer_key (
  question_id bigint primary key references public.quiz_questions(id) on delete cascade,
  correct_choice smallint not null check (correct_choice between 0 and 3)
);

create table if not exists public.quiz_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  answers jsonb not null check (jsonb_typeof(answers) = 'array' and jsonb_array_length(answers) = 10),
  correct_count smallint not null default 0 check (correct_count between 0 and 10),
  total_count smallint not null default 10 check (total_count = 10),
  created_at timestamptz not null default now()
);
create index if not exists quiz_attempts_user_score_idx on public.quiz_attempts(user_id, correct_count desc, created_at);

create or replace function public.create_quiz_profile()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.email_confirmed_at is null then return new; end if;
  insert into public.quiz_profiles(id, username, province)
  values (new.id,
    left(coalesce(nullif(trim(new.raw_user_meta_data->>'username'), ''), '醒狮新友'),24),
    coalesce(nullif(trim(new.raw_user_meta_data->>'province'), ''), '未填写'))
  on conflict(id) do nothing;
  return new;
end; $$;
revoke all on function public.create_quiz_profile() from public, anon, authenticated;
create trigger on_auth_user_created_quiz_profile after insert or update of email_confirmed_at on auth.users
for each row execute function public.create_quiz_profile();

create or replace function public.score_quiz_attempt()
returns trigger language plpgsql security definer set search_path = '' as $$
declare n int;
begin
  if new.user_id is distinct from auth.uid() then raise exception 'invalid user'; end if;
  if jsonb_array_length(new.answers) <> 10 then raise exception 'invalid answer count'; end if;
  select count(*) into n
  from jsonb_to_recordset(new.answers) as a(question_id bigint, choice int)
  join public.quiz_answer_key k on k.question_id=a.question_id and k.correct_choice=a.choice
  join public.quiz_questions q on q.id=a.question_id and q.active;
  if (select count(distinct question_id) from jsonb_to_recordset(new.answers) as a(question_id bigint, choice int)) <> 10 then
    raise exception 'duplicate or invalid questions';
  end if;
  new.correct_count := n;
  new.total_count := 10;
  return new;
end; $$;
revoke all on function public.score_quiz_attempt() from public, anon, authenticated;
create trigger score_quiz_attempt_before_insert before insert on public.quiz_attempts
for each row execute function public.score_quiz_attempt();

create or replace function public.quiz_leaderboard(province_filter text default null, board_limit int default 50)
returns table(username text, province text, correct_count bigint, achieved_at timestamptz)
-- SECURITY DEFINER is limited to this public aggregate: it returns only nickname,
-- province and summed points; callers cannot read another user's attempt rows.
language sql stable security definer set search_path = '' as $$
  select p.username,p.province,coalesce(sum(a.correct_count),0)::bigint,min(a.created_at)
  from public.quiz_profiles p left join public.quiz_attempts a on a.user_id=p.id
  where province_filter is null or p.province=province_filter
  group by p.id,p.username,p.province
  order by coalesce(sum(a.correct_count),0) desc,min(a.created_at) asc nulls last,p.username asc
  limit least(greatest(board_limit,1),100);
$$;

alter table public.quiz_profiles enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_answer_key enable row level security;
alter table public.quiz_attempts enable row level security;
create policy "users read own profile" on public.quiz_profiles for select to authenticated using ((select auth.uid()) = id);
create policy "authenticated read active questions" on public.quiz_questions for select to authenticated using (active);
create policy "users read own quiz attempts" on public.quiz_attempts for select to authenticated using ((select auth.uid()) = user_id);
create policy "users submit own quiz attempts" on public.quiz_attempts for insert to authenticated with check ((select auth.uid()) = user_id);
revoke all on public.quiz_answer_key from anon, authenticated;
revoke all privileges on table public.quiz_profiles from anon, authenticated;
revoke select (id, username, province, created_at),
       insert (id, username, province, created_at),
       update (id, username, province, created_at),
       references (id, username, province, created_at)
on table public.quiz_profiles from anon, authenticated;
grant select on table public.quiz_profiles to authenticated;
grant select on public.quiz_questions to authenticated;
grant select, insert on public.quiz_attempts to authenticated;
grant usage, select on sequence public.quiz_attempts_id_seq to authenticated;
revoke all on function public.quiz_leaderboard(text,int) from public;
grant execute on function public.quiz_leaderboard(text,int) to anon, authenticated;

-- Seed content: checked cultural facts; replace/add questions as the project grows.
insert into public.quiz_questions(question,choices) values
('“无鼓不成狮”主要说明了什么？','["鼓乐指挥醒狮动作与情绪","狮头必须有鼓形装饰","表演只能在鼓楼进行","每场表演都必须有歌唱"]'),
('南狮传统锣鼓的核心组合通常包括哪些乐器？','["大鼓、铜锣、铜钹","笛子、二胡、木鱼","唢呐、编钟、古琴","堂鼓、铃鼓、三弦"]'),
('传统行规中，锣与钹通常应在何时发声？','["鼓先起之后","表演开始之前","只有采青时","可以先于鼓声"]'),
('南狮制作中的“扎”主要指什么？','["编扎狮头骨架","绘制脸谱","粘贴绒毛","敲击鼓面"]'),
('南狮制作中的“扑”主要指什么？','["在骨架上裱纸成型","为狮头装眼睛","演奏五星鼓","为狮头上色"]'),
('南狮彩绘工序常称作什么？','["写狮","点睛","采青","开光"]'),
('佛山醒狮与岭南南狮文化的关系常如何描述？','["南狮的重要发源与传承中心","北狮的唯一流派","现代舞台新创节目","仅用于宫廷的狮舞"]'),
('北狮表演常见的动作特点是什么？','["模仿真狮翻滚嬉戏与杂技动作","以长吻和八音为主","只进行静态拜礼","以纸扎骨架展示为主"]'),
('醒狮表演中，鼓手最需要关注什么？','["狮子的动作并随之调整节奏","观众席灯光颜色","狮头装饰的价格","场地的建筑年代"]'),
('传统醒狮常见的吉祥寓意是什么？','["驱邪纳福、祈愿顺遂","占卜天气变化","记录商贸税收","训练农耕技术"]');
insert into public.quiz_answer_key(question_id,correct_choice)
select id,case question when '“无鼓不成狮”主要说明了什么？' then 0 when '南狮传统锣鼓的核心组合通常包括哪些乐器？' then 0 when '传统行规中，锣与钹通常应在何时发声？' then 0 when '南狮制作中的“扎”主要指什么？' then 0 when '南狮制作中的“扑”主要指什么？' then 0 when '南狮彩绘工序常称作什么？' then 0 when '佛山醒狮与岭南南狮文化的关系常如何描述？' then 0 when '北狮表演常见的动作特点是什么？' then 0 when '醒狮表演中，鼓手最需要关注什么？' then 0 else 0 end
from public.quiz_questions q where not exists(select 1 from public.quiz_answer_key k where k.question_id=q.id);
