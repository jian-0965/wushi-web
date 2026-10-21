# 狮遇 · 非遗舞狮多模态互动馆

一个围绕中国狮舞非遗文化设计的 Web 互动作品。网站使用顶部横向导航，下方切换完整体验画面，把文化展示、工艺体验、声音交互、流程动画和多模态 AI 导览连接起来。

## 主要功能

- 作品说明：介绍创作目标、内容边界和资料来源。
- 历史简介：用时间线呈现狮舞的历史与当代传承。
- 地区狮舞：展示佛山醒狮、鹤山狮、徐水舞狮、揭阳青狮和藤县狮舞的造型示意与特征。
- 制作工艺：体验“扎、扑、写、装”四道狮头工序，支持裱糊进度、配色和 SVG 保存。
- 舞狮互动：点击或使用键盘控制抬头、摇头、开口、行礼、跃起和迈步。
- 鼓点播放器：提供三套原创合成教学节奏，支持播放、调速、音量、循环、敲击练习、评分和 WAV 导出。
- 采青流程：用连续动画展示寻青、见青、探青、采青、食青和吐青六个教学环节。
- 多模态 Agent：支持文字提问和狮头图片上传，检索非遗资料并调用地区、工艺、鼓点和采青工具。

## 技术实现

- 前端：原生 HTML、CSS、JavaScript 与原创 SVG。
- 音频：Web Audio API 实时合成鼓、锣、钹，并使用 OfflineAudioContext 导出 WAV。
- 服务端：Vinext、Cloudflare Workers 兼容入口。
- AI：OpenAI 兼容 Chat Completions 接口、图文输入、Function Calling、检索增强和结构化输出校验。
- 数据：浏览器 localStorage 保存体验进度与节奏练习结果，不保存上传图片。

多模态 Agent 使用以下服务端环境变量，密钥不能写入前端或提交到仓库：

```text
MODEL_API_KEY=
MODEL_BASE_URL=
MODEL_NAME=
VISION_MODEL_NAME=   # 可选，未设置时使用 MODEL_NAME
```

## 本地运行

要求 Node.js 22.13 或更高版本。

```bash
npm ci
npm run dev
```

生产构建和测试：

```bash
npm test
npm run build
```

## 关键目录

```text
public/index.html          页面入口
public/lion/main.js        八个栏目与前端交互
public/lion/style.css      视觉与响应式布局
public/lion/art.js         狮头、狮身与鼓的原创 SVG
public/lion/audio.js       节奏播放、打击乐与评分
public/lion/data.js        地区、工艺、采青、鼓点和检索资料
server/lion-agent.js       多模态 Agent、工具调用与安全校验
build/sites-worker.ts      Worker 请求入口
tests/lion.test.mjs        Agent、图片、工具和节奏测试
```

## 内容边界

- 页面中的狮头为原创矢量教学示意，不是实物照片或产地鉴定依据。
- “探寻、行进、欢腾”是原创合成教学节奏，不代表传统狮队的固定鼓谱。
- 六段采青流程是教学编排，实际套路会随地区、阵式和表演传统变化。
- 单张图片只能支持外观特征观察和可能样式判断，不能确认师承、产地、制作者、真伪或内部材料。
- AI 请求失败时会返回有明确标识的资料检索结果，不会模拟图片识别成功。

## 资料来源

核心资料来自中国非物质文化遗产网、香港非物质文化遗产资料库、新华社和中国社会科学网。具体链接可在网站“作品说明与资料出处”以及 `public/lion/data.js` 中查看。

