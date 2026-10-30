# English Dump & Role-play

随手记语料拆解 · 剧本自由定制 · 模拟对话踩点 · 基于原句骨架的地道润色与弱点重练。

一个纯前端的英语学习工作台：

1. **语料库**：粘贴任意英文句子 / 台词 / 外刊段落，AI 拆解成可复用的词组、习语、句型卡片，支持优先级、掌握度、主题分类与批量管理。
2. **剧本定制**：按所选语料自动生成角色扮演剧本（主题、AI 性格、回复篇幅均可调），也可手动编辑。
3. **情景实战**：与 AI 角色对话，实时点亮本局目标表达（踩点看板），可让 AI 递话柄。
4. **原句升华复盘**：对比你的原句、骨架微调润色与地道升升级版，并生成弱点重练。

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## API Key 配置

所有 AI 能力都在浏览器内直接调用 LLM，Key 只保存在浏览器内存/本地，不会上传到任何自建服务。

- **方式一（推荐）**：打开页面右上角「设置」，选择服务商：
  - 自定义 Gemini：填 Google AI Studio 的 API Key
  - OpenAI 兼容：填 Base URL（如 `https://api.openai.com/v1`、DeepSeek、通义等）+ Key + 模型名
- **方式二**：构建时注入内置 Gemini Key

```bash
cp .env.example .env
# 在 .env 中填入 VITE_GEMINI_API_KEY=...
npm run build
```

> 注意：注入到前端构建产物中的 Key 对访问者可见，仅适合个人自用部署；多人使用请走方式一，或自行加一层后端代理。

## 部署到 GitHub Pages

`vite.config.ts` 已设置 `base: "./"`，构建产物可直接托管在任意静态站点：

1. 推送仓库后，在 GitHub 仓库 **Settings → Pages** 中选择分支 `main` + 目录 `/docs`，或将 `dist/` 部署到任意静态平台（Vercel / Netlify / Cloudflare Pages）。
2. 使用 Vercel / Netlify 时，构建命令 `npm run build`，输出目录 `dist`。

## 技术栈

React 18 + TypeScript + Vite + Tailwind CSS + lucide-react。
