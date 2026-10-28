# 狮遇 · 中国舞狮互动馆

围绕中国舞狮的文化展示与互动体验。当前页面包括作品说明、历史与各地流派、狮头制作、鼓点互动，以及支持文字、图片和语音转文字的 AI 导览。制作工艺下方还有实时绘制的 3D 工坊与可滚动观看的工艺影像。

本仓库只包含舞狮项目。网页入口是 `public/index.html`，本地服务由 `server.js` 提供；无需安装第三方 npm 包。

## 本地运行

需要 Node.js 22.13 或更新版本。

```bash
npm run dev
```

打开 <http://localhost:3000>。也可用 `npm start` 启动不带文件监听的服务。检查代码与测试：

```bash
npm run check
npm test
```

仓库没有 `build` 脚本，也没有需要执行的 `npm ci` 步骤。

## 目录

```text
public/index.html                    网页入口
public/lion/main.js                 页面与交互
public/lion/style.css               页面样式
public/lion/data.js                 文案、流派、资料与节奏数据
public/lion/art.js                  交互用 SVG 示意
public/lion/audio.js                鼓、锣、钹的浏览器合成音
public/lion/culture.js              鼓乐文化介绍
public/lion/ai-explainer.js         随行 AI 讲解与当前场景识别
public/lion/ai-explainer.css        随行讲解样式
public/lion/home-readable.css       首页文字排版调整
public/lion/gallery.js              3D 工坊界面与滚动交互
public/lion/gallery-3d.js           原生 WebGL / Canvas 立体工坊
public/lion/craft-film.*            工艺影像页与入口组件
public/lion/scroll-world-engine.js  影像页滚动引擎
public/lion/assets/                 页面实际使用的图片和影像
  home/                             首页
  history/                          历史
  legends/                          六色狮
  regions/                          各地流派
  craft/                            工艺影像（含 MP4）
  drums/                            鼓乐互动
server.js                           本地静态文件与 API 服务
server/lion-agent.js                AI、检索、工具调用及输入输出校验
tests/lion.test.mjs                 AI 接口与鼓点测试
```

网页的静态资源都从 `/lion/assets/` 引用。新增图片时放进对应主题目录，并更新页面引用。`public/lion/assets/craft/lingnan-craft-film.mp4` 是工艺影像页使用的影片；本地服务支持视频分段读取。

## AI 配置

复制 `.env.example` 中的变量名，在运行服务的环境中设置。`server.js` 不会自动加载 `.env` 文件；例如可用 Node 的 `--env-file=.env` 参数启动。不要把实际密钥提交到 GitHub。

| 变量 | 用途 |
| --- | --- |
| `MODEL_API_KEY` | 兼容接口的服务端密钥 |
| `MODEL_BASE_URL` | 模型服务地址，例如兼容 Chat Completions 的 `/v1` 根地址 |
| `MODEL_NAME` | 文本模型名称 |
| `VISION_MODEL_NAME` | 可选，图片理解模型；缺省沿用 `MODEL_NAME` |

生成舞狮图片需要服务端模型供应方开放图像生成接口。未配置时，AI 页面仍可展示资料检索结果；页面会明确区分 AI 结果与资料回退结果。用户上传的图片不会写入此仓库。

## 素材与内容

狮头与地区配图为网页展示素材，不能依据单张图片确认产地、师承或真伪。工艺影像是氛围演绎，实际工序以传承人技艺及资料为准。鼓点是浏览器合成的互动体验，不是传统狮队鼓谱的录音。

历史、工艺与流派内容的参考链接见 `public/lion/data.js`。影像滚动引擎的许可文本见 `public/lion/scroll-world-LICENSE.txt`。
