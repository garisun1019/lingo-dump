# ✨ English Dump & Role-play (V1.0)

> **Break the "Collect & Forget" Curse — Turn Passive English Snippets into Active Fluency.**  
> **打破“收藏即学会”的魔咒：基于动态 CEFR 能力评估、AI 情景内化与原句锚定升华的英语语料闭环训练系统。**

![Version](https://img.shields.io/badge/version-v1.0.0-indigo)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?logo=tailwind-css&logoColor=white)
![LLM Ready](https://img.shields.io/badge/LLM-Gemini_%7C_OpenAI_%7C_DeepSeek_%7C_Kimi-emerald)

---

## 📋 一、 V1.0 版本发布前全面审计报告 (Pre-Release Project Audit)

在推送至 GitHub 之前，我们对当前 `src/App.tsx` 的核心业务闭环、代码健壮性与交互体验进行了全面审计：

### 1. 核心业务闭环完整性 (`Pass ✅`)
* **全渠道输入必须经过 AI 拆解（Unified Extraction Pipeline）**：无论是主界面 Inbox 随手记、右下角悬浮便签（Quick Notes）、Arena 对话气泡收录、鼠标划词收录、Review 升华句收录，还是 AI 助教解答收录，**100% 统一走 `triggerExtractionForSnippet` 智能拆解流**，彻底杜绝将未分析的整段长句直接塞入词库。
* **原文与语料双向内联高亮映射（Bi-directional Inline Highlighting）**：
  * 在 **「Inbox 原始输入流」** 中，已入选的语料直接在原句对应位置渲染为可点击的内联高亮胶囊标签，单击即可平滑滚动并闪烁定位至具体语料卡片。
  * 在 **「语料卡片库」** 中，每张卡片底部的原始语境框反向高亮当前词条所在位置，并展示用法解读（`usageNote`）、AI 提权理由（`priorityReason`）、记录日期（`createdAt`）与上次复习日期（`lastReviewedAt`）。
* **先配置剧本再开练（Scenario Setup & Script Editor）**：从语料库点击开始练习后，先进入独立的 **「剧本定制与演练配置 (`arena_setup`)」** 界面，支持选择主题、自定义情境、AI 陪练风格、回复长短，并支持一键 AI 生成新剧本草稿与手动编辑台词。
* **原句锚定升华与靶向重练（Anchor-Based Upgrade & Micro-Drills）**：严格遵循“保留用户原句 90% 骨架”的渐进式润色原则，并提供 **「原句锚定重造」** 与 **「AI 挖坑快问快答」** 两种弱点重练模式。

### 2. 工程架构与兼容性审计 (`Pass ✅`)
* **多模型无缝切换（Multi-LLM Provider Architecture）**：内置通用调用层 `callGeminiAPI`，原生支持 Gemini JSON Schema 结构化输出，并兼容 OpenAI / DeepSeek / Kimi / Claude 等接口标准，同时内置启发式兜底算法（Heuristic Fallback），即使在离线或 API 限流状态下也能完整走通所有核心流程。
* **富文本渲染安全性（Safe Markdown Parser）**：自研轻量级块级 + 行内 Markdown 解析器（`renderFormattedMarkdownText`），妥善处理加粗、斜体、行内代码、引用块与列表，无 XSS 注入风险，彻底解决原始符号外露问题。
* **数据主权与可移植性（JSON Backup & Restore）**：支持一键导出与导入包含用户能力画像、语料库、自定义主题及随手记历史的完整 JSON 备份文件。

---

## 🎯 二、 项目简介 (Introduction)

许多英语学习者都有一个共同痛点：**收藏夹里攒了几千条地道表达、美剧台词和外刊好句，但真正开口或写作时，依然只会用最基础的大白话（如 `have to`, `think`, `talk about it later`）。**

**English Dump & Role-play** 正是为了打通从 **被动输入 (Input)** 到 **主动输出 (Output)** 的最后一公里而设计：
1. **Dump（无压力随手记与智能拆解）**：把遇到的任何英文句子丢进系统，AI 根据你当前的 CEFR 等级自动拆解出其中值得学习的地道词组、习语和句型。
2. **Setup & Arena（定制剧本与实战踩点）**：系统优先挑选你的高优先级/薄弱语料，将其编排进富有戏剧张力的 Role-play 剧本中。你在对话中每成功用上一个目标表达，看板就会实时点亮并更新复习记录。
3. **Anchor-Based Review（原句锚定升华与靶向微特训）**：拒绝推翻重写！AI 在复盘时严格保留你原句的逻辑骨架和用词，给你展示 **「你的原句 → 90%保留原词的微调版 → 融入目标词的地道升华版」**，并对漏掉的表达进行一击必杀的微练习。

---

## 🚀 三、 核心功能特性 (Key Features)

### 📥 1. 智能语料库与原始输入流 (Smart Inbox & Raw Stream)
* **AI 多表达深度拆解 + 勾选确认弹窗**：输入一段话，AI 自动提取出多条习语、短语动词或句式结构，弹窗供你勾选入库（支持开启“免弹窗默认全部入库”）。
* **双视图自由切换**：
  * **语料卡片库视图**：展示详细释义、用法解读、AI 推荐理由、原句反向高亮定位、创建与复习日期。支持单条/批量修改优先级、熟练度（Lv.0 ~ Lv.3）、人工主题分类及批量删除。
  * **Inbox 原始输入流视图**：还原你录入的完整句子段落，**句中已收录为语料的片段直接内联高亮**，点击即可一键跳转到对应语料卡片。
* **多维交叉筛选与 AI 智能主题聚类**：支持按 `🤖 AI 智能主题`、`🏷️ 人工自定义主题`、`语法类别`、`提问优先级` 和 `掌握度` 组合筛选。
* **💡 随身 AI 语料助教（小灯泡提问）**：每一条语料卡片和每一条原始输入记录均配备专属小灯泡按钮，点击即可针对近义词辨析、中式英语误区或长难句语法向 AI 追问，且 AI 解答中的好词好句也能再次拆解入库。

### 🎭 2. 剧本定制与 AI 角色扮演实战 (Scenario Setup & Arena)
* **剧本自由配置与手动编辑**：开练前可自由选择预设冲突场景或输入自定义话题，调节 **AI 陪练性格**（温和引导、犀利施压 Devil's Advocate、幽默松弛、严谨高管）与 **每次回复篇幅**（极简短句、标准对话、深度长谈），并可直接手动修改剧本背景与开场白。
* **实时踩点监测 (Live Hit Detection)**：支持词形变化匹配（如 `bite / bit / biting the bullet`），对话中一旦命中目标词立即弹出高光横幅，自动提升该词掌握度并刷新“上次复习日期”。
* **卡壳脚手架 (AI Scaffolding Cue)**：不知道如何接话？点击 **「让 AI 递话柄」**，AI 会在对话中主动抛出引导句，帮你把未使用的目标词自然说出口。

### 🏆 3. 原句锚定升华与弱点靶向重练 (Review & Micro-Drills)
* **动态 CEFR 能力评估面板**：实时追踪 **词汇丰富度 (Lexical)**、**语法精准度 (Grammar)**、**语境自然度 (Pragmatic)** 与 **地道表达力 (Idiomatic)** 四大维度，并根据短板动态调整语料库中的提问优先级。
* **三栏式原句锚定升华对比**：
  1. `你的原句 (Original)`
  2. `原句骨架微调润色 (Anchored Polish - 90% 保留原词)`
  3. `融入目标词的地道升华版 (Native Upgrade)`
* **双模式弱点靶向特训**：针对本局未踩点的表达，提供 **「模式 A：改写你刚才对话里的原句」** 与 **「模式 B：AI 精准挖坑单回合快问快答」**。

### 🛠️ 4. 全局效率工具与开放生态 (Utilities & Settings)
* **全局可最小化随手记 (Floating Quick Notes)**：右下角常驻悬浮球，随时记录灵感并一键交给 AI 拆解入库。
* **全局鼠标划词收录**：在实战对话或复盘报告中选中任意英文片段，自动浮现 **`+ AI 拆解收入 Inbox`** 与 **`记入 Notes`** 快捷菜单。
* **多模型 API 兼容与 JSON 备份**：支持内置 Gemini、自定义 Gemini API Key 以及 OpenAI 兼容接口（一键填入 OpenAI / DeepSeek / Kimi 配置），支持 JSON 全量数据导出与导入恢复。

---

## 💻 四、 本地运行与部署指南 (Getting Started)

### 1. 环境要求
* **Node.js**: `>= 18.0.0`
* **包管理器**: `npm` / `pnpm` / `yarn`

### 2. 快速初始化（基于 Vite + React + Tailwind CSS）

```bash
git clone https://github.com/garisun1019/lingo-dump.git
cd lingo-dump
npm install
npm run dev
```

生产构建与预览：

```bash
npm run build
npm run preview
```

项目结构：核心单页应用位于 `src/App.tsx`，Tailwind 内容扫描范围已在 `tailwind.config.js` 中配置为 `./src/**/*.{ts,tsx}`。

### 3. 配置你自己的大模型 API Key
1. 启动应用后，点击右上角导航栏的 **「⚙️ 设置」** 按钮。
2. 选择你偏好的模型服务商：
   * **内置 Gemini 模式**：可通过构建时注入 `VITE_GEMINI_API_KEY` 使用（Key 会打包进前端产物，仅建议个人自用）。
   * **自定义 Gemini Key**：填入从 Google AI Studio 获取的 API Key（仅保存在当前页面内存中）。
   * **OpenAI 兼容接口**：点击 `OpenAI`、`DeepSeek` 或 `Kimi` 快捷按钮自动填入 Base URL 与模型名，输入你的 API Key 并点击 **「🔌 测试 API 连通性」**。

> 隐私提示：所有语料与对话均只保存在浏览器内存中（刷新即清空，可用 JSON 导出备份）；AI 请求由浏览器直连你配置的服务商，不经过任何中间服务器。

### 4. 部署到 GitHub Pages

仓库已内置 `.github/workflows/deploy.yml`，推送到 `main` 后自动构建并发布。首次使用需在仓库 **Settings → Pages → Build and deployment** 中将 Source 设为 **GitHub Actions**。

---

## 🗺️ 五、 后续迭代路线图 (Roadmap for V1.1+)

- [ ] **LocalStorage 自动持久化**：在现有 JSON 导入/导出的基础上，加入浏览器本地自动缓存与 IndexedDB 支持。
- [ ] **Web Speech API 语音实战模式**：支持语音输入（STT）与 AI 角色语音朗读（TTS），打造沉浸式听说训练。
- [ ] **基于艾宾浩斯遗忘曲线的今日待练推送**：根据 `lastReviewedAt` 与 `mastery` 自动计算每日到期需复习的语料卡片。
- [ ] **浏览器划词插件 (Chrome Extension)**：在浏览外刊或 YouTube 字幕时一键 Dump 到本地语料库。

---

## 📄 License

This project is licensed under the **MIT License**.
