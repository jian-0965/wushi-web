# 舞狮文化竞赛 Supabase 设置

1. 创建一个专供“狮遇”使用的 Supabase 项目；不要复用停用的 BioScope 项目。
2. 在 SQL Editor 依次执行 schema.sql、leaderboard.sql、quiz_30_questions.sql 和 quiz_key_balance.sql。这会建立资料表、题库、答题记录、安全判分触发器、30 题题库和实时榜单，并启用行级安全策略。现有项目如遇到 `permission denied for table quiz_profiles`，再执行 `fix_quiz_profiles_permissions.sql`。
3. 在 Supabase Dashboard → Authentication → URL Configuration，将 Site URL 设为 `https://biogrow-learning-lab.zhangchao072612.chatgpt.site`，并在 Redirect URLs 加入 `https://biogrow-learning-lab.zhangchao072612.chatgpt.site/?section=quiz`。注册确认邮件会回到竞赛页；竞赛注册使用邮箱和密码，开启邮箱验证时需先点邮件确认链接。
4. 将 Project URL 和 publishable key 写入 public/lion/supabase-config.js。该文件只允许 publishable key，禁止放入 secret/service-role key。
5. 部署网页后测试：注册新用户、确认邮件回跳到竞赛页、登录、完成 30 道题，再使用另一个账号确认榜单只公开“昵称 · 省份”和累计答对数。

每轮随机抽取 30 道单选题。榜单使用 Supabase Realtime 推送更新，并在页面保持打开时每 12 秒补充刷新；交卷后立即刷新。题目答案保存在不授予客户端读取权限的 quiz_answer_key 表中；答题记录由数据库触发器计算分数，不能由浏览器自行提交分数。榜单只公开“昵称 · 省份”和累计答对数，不提供地区筛选。
