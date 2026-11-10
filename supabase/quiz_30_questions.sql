-- Upgrade the live competition from 10 to 30 questions per round.
alter table public.quiz_attempts drop constraint quiz_attempts_answers_check;
alter table public.quiz_attempts drop constraint quiz_attempts_correct_count_check;
alter table public.quiz_attempts drop constraint quiz_attempts_total_count_check;
alter table public.quiz_attempts add constraint quiz_attempts_answers_check check (jsonb_typeof(answers)='array' and jsonb_array_length(answers)=30);
alter table public.quiz_attempts add constraint quiz_attempts_correct_count_check check (correct_count between 0 and 30);
alter table public.quiz_attempts add constraint quiz_attempts_total_count_check check (total_count=30);

create or replace function public.score_quiz_attempt()
returns trigger language plpgsql security definer set search_path = '' as $$
declare n int;
begin
  if new.user_id is distinct from auth.uid() then raise exception 'invalid user'; end if;
  if jsonb_array_length(new.answers) <> 30 then raise exception 'invalid answer count'; end if;
  select count(*) into n from jsonb_to_recordset(new.answers) as a(question_id bigint, choice int)
  join public.quiz_answer_key k on k.question_id=a.question_id and k.correct_choice=a.choice
  join public.quiz_questions q on q.id=a.question_id and q.active;
  if (select count(distinct question_id) from jsonb_to_recordset(new.answers) as a(question_id bigint, choice int)) <> 30 then raise exception 'duplicate or invalid questions'; end if;
  new.correct_count := n; new.total_count := 30; return new;
end; $$;

update public.quiz_questions set choices='["狮头必须有鼓形装饰", "表演只能在鼓楼进行", "每场表演都必须有歌唱", "鼓乐指挥醒狮动作与情绪"]'::jsonb where question='“无鼓不成狮”主要说明了什么？';
update public.quiz_answer_key set correct_choice=0 where question_id=(select id from public.quiz_questions where question='“无鼓不成狮”主要说明了什么？');
update public.quiz_questions set choices='["唢呐、编钟、古琴", "堂鼓、铃鼓、三弦", "大鼓、铜锣、铜钹", "笛子、二胡、木鱼"]'::jsonb where question='南狮传统锣鼓的核心组合通常包括哪些乐器？';
update public.quiz_answer_key set correct_choice=0 where question_id=(select id from public.quiz_questions where question='南狮传统锣鼓的核心组合通常包括哪些乐器？');
update public.quiz_questions set choices='["可以先于鼓声", "鼓先起之后", "表演开始之前", "只有采青时"]'::jsonb where question='传统行规中，锣与钹通常应在何时发声？';
update public.quiz_answer_key set correct_choice=0 where question_id=(select id from public.quiz_questions where question='传统行规中，锣与钹通常应在何时发声？');
update public.quiz_questions set choices='["绘制脸谱", "粘贴绒毛", "敲击鼓面", "编扎狮头骨架"]'::jsonb where question='南狮制作中的“扎”主要指什么？';
update public.quiz_answer_key set correct_choice=0 where question_id=(select id from public.quiz_questions where question='南狮制作中的“扎”主要指什么？');
update public.quiz_questions set choices='["演奏五星鼓", "为狮头上色", "在骨架上裱纸成型", "为狮头装眼睛"]'::jsonb where question='南狮制作中的“扑”主要指什么？';
update public.quiz_answer_key set correct_choice=0 where question_id=(select id from public.quiz_questions where question='南狮制作中的“扑”主要指什么？');
update public.quiz_questions set choices='["开光", "写狮", "点睛", "采青"]'::jsonb where question='南狮彩绘工序常称作什么？';
update public.quiz_answer_key set correct_choice=0 where question_id=(select id from public.quiz_questions where question='南狮彩绘工序常称作什么？');
update public.quiz_questions set choices='["北狮的唯一流派", "现代舞台新创节目", "仅用于宫廷的狮舞", "南狮的重要发源与传承中心"]'::jsonb where question='佛山醒狮与岭南南狮文化的关系常如何描述？';
update public.quiz_answer_key set correct_choice=0 where question_id=(select id from public.quiz_questions where question='佛山醒狮与岭南南狮文化的关系常如何描述？');
update public.quiz_questions set choices='["只进行静态拜礼", "以纸扎骨架展示为主", "模仿真狮翻滚嬉戏与杂技动作", "以长吻和八音为主"]'::jsonb where question='北狮表演常见的动作特点是什么？';
update public.quiz_answer_key set correct_choice=0 where question_id=(select id from public.quiz_questions where question='北狮表演常见的动作特点是什么？');
update public.quiz_questions set choices='["场地的建筑年代", "狮子的动作并随之调整节奏", "观众席灯光颜色", "狮头装饰的价格"]'::jsonb where question='醒狮表演中，鼓手最需要关注什么？';
update public.quiz_answer_key set correct_choice=0 where question_id=(select id from public.quiz_questions where question='醒狮表演中，鼓手最需要关注什么？');
update public.quiz_questions set choices='["占卜天气变化", "记录商贸税收", "训练农耕技术", "驱邪纳福、祈愿顺遂"]'::jsonb where question='传统醒狮常见的吉祥寓意是什么？';
update public.quiz_answer_key set correct_choice=0 where question_id=(select id from public.quiz_questions where question='传统醒狮常见的吉祥寓意是什么？');
insert into public.quiz_questions(question,choices) values
('南狮表演中，狮头和狮尾通常由几名舞者配合完成？','["两名", "一名", "三名", "四名"]'::jsonb),
('狮头制作的“装”主要指什么？','["搭建竹篾骨架", "在骨架上裱纸", "安装五官与装饰", "绘制彩色纹样"]'::jsonb),
('五星鼓又常被称为什么？','["三星鼓", "梅花鼓", "急急风", "震鼓"]'::jsonb),
('哪种鼓法常用于表现狮子迟疑、警惕或疑惑？','["行狮鼓", "三拜鼓", "抛狮鼓", "震鼓"]'::jsonb),
('哪种鼓点常用于狮子行礼、拜门或向观众致意？','["三拜鼓", "急急风", "擂鼓", "抛狮鼓"]'::jsonb),
('南狮与北狮在造型表现上，常见的概括是什么？','["南狮仿真、北狮写意", "两者造型完全相同", "南狮重写意脸谱，北狮偏仿真形态", "北狮只用纸糊制作"]'::jsonb),
('传统醒狮常用哪种材料制作鼓面？','["竹片", "牛皮", "棉布", "铜片"]'::jsonb),
('狮头骨架常用什么材料扎制？','["玻璃", "铝箔", "陶土", "竹篾"]'::jsonb),
('醒狮鼓手在表演时应当怎样配合狮队？','["观察狮子动作并调整节奏", "固定速度演奏不作变化", "只看观众不看狮子", "等表演结束再敲鼓"]'::jsonb),
('哪一项属于南狮常见的锣鼓乐器？','["古筝", "笙", "铜钹", "编钟"]'::jsonb),
('佛山醒狮通常归属于哪一类舞狮流派？','["北狮", "南狮", "西域狮舞", "宫廷独舞"]'::jsonb),
('狮头脸谱和色彩在民俗表达中通常承担什么作用？','["记录天气", "标记比赛分数", "区分乐器音高", "表达角色性格与吉祥寓意"]'::jsonb),
('裱纸层数和厚薄会影响狮头的哪些方面？','["软硬与整体质感", "舞者身高", "鼓点速度", "狮队人数"]'::jsonb),
('醒狮表演里的“起狮”通常意味着什么？','["演出结束", "更换乐器", "表演开始，狮子起势", "观众离场"]'::jsonb),
('“行狮鼓”通常配合狮子做什么？','["静止不动", "巡游行进、观察探路", "拆卸狮头", "独奏收尾"]'::jsonb),
('高桩醒狮表演对舞者提出的突出要求是什么？','["只需快速奔跑", "完全不需要鼓乐", "只做地面翻滚", "平衡、配合与动作控制"]'::jsonb),
('传统狮队中，狮头与狮尾之间需要什么？','["默契配合", "彼此独立演出", "用鼓架连接", "由同一人同时扮演"]'::jsonb),
('哪一项是醒狮常见的节庆演出场景？','["只在课堂考试", "只在室内音乐会", "新春与开业庆典", "只在体育比赛"]'::jsonb),
('醒狮表演的鼓乐与狮子动作之间是什么关系？','["鼓乐只在演出前播放", "鼓点引导动作、情绪与节奏", "鼓点与动作无关", "只有观众决定鼓点"]'::jsonb),
('非遗数字展示适合怎样帮助醒狮文化传播？','["替代所有传承人实践", "把地方差异全部抹去", "只展示商业广告", "让更多人便捷了解工艺与民俗"]'::jsonb);

insert into public.quiz_answer_key(question_id,correct_choice) select id,0 from public.quiz_questions where question='南狮表演中，狮头和狮尾通常由几名舞者配合完成？' and not exists(select 1 from public.quiz_answer_key k where k.question_id=public.quiz_questions.id);
insert into public.quiz_answer_key(question_id,correct_choice) select id,2 from public.quiz_questions where question='狮头制作的“装”主要指什么？' and not exists(select 1 from public.quiz_answer_key k where k.question_id=public.quiz_questions.id);
insert into public.quiz_answer_key(question_id,correct_choice) select id,1 from public.quiz_questions where question='五星鼓又常被称为什么？' and not exists(select 1 from public.quiz_answer_key k where k.question_id=public.quiz_questions.id);
insert into public.quiz_answer_key(question_id,correct_choice) select id,3 from public.quiz_questions where question='哪种鼓法常用于表现狮子迟疑、警惕或疑惑？' and not exists(select 1 from public.quiz_answer_key k where k.question_id=public.quiz_questions.id);
insert into public.quiz_answer_key(question_id,correct_choice) select id,0 from public.quiz_questions where question='哪种鼓点常用于狮子行礼、拜门或向观众致意？' and not exists(select 1 from public.quiz_answer_key k where k.question_id=public.quiz_questions.id);
insert into public.quiz_answer_key(question_id,correct_choice) select id,2 from public.quiz_questions where question='南狮与北狮在造型表现上，常见的概括是什么？' and not exists(select 1 from public.quiz_answer_key k where k.question_id=public.quiz_questions.id);
insert into public.quiz_answer_key(question_id,correct_choice) select id,1 from public.quiz_questions where question='传统醒狮常用哪种材料制作鼓面？' and not exists(select 1 from public.quiz_answer_key k where k.question_id=public.quiz_questions.id);
insert into public.quiz_answer_key(question_id,correct_choice) select id,3 from public.quiz_questions where question='狮头骨架常用什么材料扎制？' and not exists(select 1 from public.quiz_answer_key k where k.question_id=public.quiz_questions.id);
insert into public.quiz_answer_key(question_id,correct_choice) select id,0 from public.quiz_questions where question='醒狮鼓手在表演时应当怎样配合狮队？' and not exists(select 1 from public.quiz_answer_key k where k.question_id=public.quiz_questions.id);
insert into public.quiz_answer_key(question_id,correct_choice) select id,2 from public.quiz_questions where question='哪一项属于南狮常见的锣鼓乐器？' and not exists(select 1 from public.quiz_answer_key k where k.question_id=public.quiz_questions.id);
insert into public.quiz_answer_key(question_id,correct_choice) select id,1 from public.quiz_questions where question='佛山醒狮通常归属于哪一类舞狮流派？' and not exists(select 1 from public.quiz_answer_key k where k.question_id=public.quiz_questions.id);
insert into public.quiz_answer_key(question_id,correct_choice) select id,3 from public.quiz_questions where question='狮头脸谱和色彩在民俗表达中通常承担什么作用？' and not exists(select 1 from public.quiz_answer_key k where k.question_id=public.quiz_questions.id);
insert into public.quiz_answer_key(question_id,correct_choice) select id,0 from public.quiz_questions where question='裱纸层数和厚薄会影响狮头的哪些方面？' and not exists(select 1 from public.quiz_answer_key k where k.question_id=public.quiz_questions.id);
insert into public.quiz_answer_key(question_id,correct_choice) select id,2 from public.quiz_questions where question='醒狮表演里的“起狮”通常意味着什么？' and not exists(select 1 from public.quiz_answer_key k where k.question_id=public.quiz_questions.id);
insert into public.quiz_answer_key(question_id,correct_choice) select id,1 from public.quiz_questions where question='“行狮鼓”通常配合狮子做什么？' and not exists(select 1 from public.quiz_answer_key k where k.question_id=public.quiz_questions.id);
insert into public.quiz_answer_key(question_id,correct_choice) select id,3 from public.quiz_questions where question='高桩醒狮表演对舞者提出的突出要求是什么？' and not exists(select 1 from public.quiz_answer_key k where k.question_id=public.quiz_questions.id);
insert into public.quiz_answer_key(question_id,correct_choice) select id,0 from public.quiz_questions where question='传统狮队中，狮头与狮尾之间需要什么？' and not exists(select 1 from public.quiz_answer_key k where k.question_id=public.quiz_questions.id);
insert into public.quiz_answer_key(question_id,correct_choice) select id,2 from public.quiz_questions where question='哪一项是醒狮常见的节庆演出场景？' and not exists(select 1 from public.quiz_answer_key k where k.question_id=public.quiz_questions.id);
insert into public.quiz_answer_key(question_id,correct_choice) select id,1 from public.quiz_questions where question='醒狮表演的鼓乐与狮子动作之间是什么关系？' and not exists(select 1 from public.quiz_answer_key k where k.question_id=public.quiz_questions.id);
insert into public.quiz_answer_key(question_id,correct_choice) select id,3 from public.quiz_questions where question='非遗数字展示适合怎样帮助醒狮文化传播？' and not exists(select 1 from public.quiz_answer_key k where k.question_id=public.quiz_questions.id);
