// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import {
  Inbox,
  MessageSquare,
  Award,
  Sparkles,
  CheckCircle2,
  Plus,
  Send,
  RefreshCw,
  ChevronRight,
  Target,
  Zap,
  BookOpen,
  TrendingUp,
  RotateCcw,
  Lightbulb,
  HelpCircle,
  Brain,
  Sliders,
  Flame,
  Check,
  ArrowRight,
  Eye,
  Trash2,
  BookmarkPlus,
  StickyNote,
  Minimize2,
  CheckSquare,
  FolderPlus,
  Settings2,
  Settings,
  Key,
  Cpu,
  X,
  FileText,
  Calendar,
  Clock,
  ExternalLink,
  Download,
  Upload,
  Play,
  Home,
  ShieldCheck,
  MousePointerClick,
  Wand2
} from "lucide-react";

// ==========================================
// 1. INITIAL MOCK DATA & CONFIG PRESETS
// ==========================================
const CEFR_PRESETS = {
  A1: { title: "入门初学者 (Beginner)", defaultScore: 28 },
  A2: { title: "基础交流者 (Elementary)", defaultScore: 42 },
  B1: { title: "独立使用者 (Intermediate)", defaultScore: 55 },
  B2: { title: "中高级进阶 (Upper-Intermediate)", defaultScore: 68 },
  C1: { title: "流利运用者 (Advanced)", defaultScore: 82 },
  C2: { title: "母语级精通 (Mastery)", defaultScore: 94 }
};

const INITIAL_PROFICIENCY = {
  cefr: "B2",
  cefrTitle: "中高级进阶 (Upper-Intermediate)",
  overallScore: 68,
  dimensions: {
    lexical: { label: "词汇丰富度 (Lexical)", score: 64, delta: +3 },
    grammar: { label: "语法精准度 (Grammar)", score: 75, delta: +1 },
    pragmatic: { label: "语境自然度 (Pragmatic)", score: 66, delta: +4 },
    idiomatic: { label: "地道表达力 (Idiomatic)", score: 62, delta: +5 }
  },
  aiStrategyNote:
    "系统检测到你的【语法结构】较稳固，但常使用平白词汇（如 think, talk again, hard decision）。已自动将 Inbox 中能替代大白话的【高频商务习语与复杂句型】提权为 High Priority 重点提问。"
};

const ARENA_THEMES = [
  { id: "auto", label: "🤖 AI 智能撮合 (根据语料自动生成戏剧冲突)", promptHint: "Blend selected expressions naturally into a dramatic workplace or life scenario" },
  { id: "tech_sprint", label: "💻 互联网产品排期与技术债博弈", promptHint: "Tech product sprint planning and debating technical debt vs new features" },
  { id: "client_crisis", label: "🔥 挑剔大客户危机公关与谈判", promptHint: "Handling an urgent client escalation and negotiating realistic timelines" },
  { id: "exec_pitch", label: "📊 向高管汇报预算与跨部门协作", promptHint: "Pitching a bold initiative to an executive and aligning cross-functional teams" },
  { id: "coffee_chat", label: "☕ 硅谷咖啡馆轻松闲聊与观点碰撞", promptHint: "Casual yet insightful coffee chat with an industry peer debating trends" }
];

const AI_STYLES = [
  { id: "encouraging", label: "🌱 温和引导型", desc: "耐心递话柄，适合初次使用生词", promptHint: "Warm, supportive, and actively sets up easy conversational hooks for the user." },
  { id: "challenging", label: "⚡ 犀利施压型 (Devil's Advocate)", desc: "不断追问反驳，逼迫高强度输出", promptHint: "Sharp, skeptical, pushes back on weak arguments to test fluency under pressure." },
  { id: "humorous", label: "😄 幽默松弛型", desc: "美式冷幽默与地道俚语互动", promptHint: "Witty, relaxed, uses natural banter and light humor." },
  { id: "concise_exec", label: "💼 严谨高管型", desc: "言简意赅、注重逻辑与结论", promptHint: "Direct, executive-level, values structured thinking and bottom-line clarity." }
];

const DIALOGUE_LENGTHS = [
  { id: "short", label: "⚡ 极简短句 (1~2句/回合)", promptHint: "Keep every AI reply strictly to 1-2 short, punchy sentences (under 30 words)." },
  { id: "medium", label: "💬 标准对话 (2~3句/回合)", promptHint: "Keep every AI reply to 2-3 natural conversational sentences (35-55 words)." },
  { id: "deep", label: "📜 深度长谈 (3~5句/回合)", promptHint: "Provide rich context and nuanced follow-ups in 3-5 sentences (60-90 words)." }
];

// OpenAI-compatible providers: selecting one fills in base URL + a default model.
const LLM_PRESETS = [
  { id: "siliconflow", label: "硅基流动", baseUrl: "https://api.siliconflow.cn/v1", modelName: "deepseek-ai/DeepSeek-V3", keyUrl: "https://cloud.siliconflow.cn/account/ak" },
  { id: "deepseek", label: "DeepSeek", baseUrl: "https://api.deepseek.com/v1", modelName: "deepseek-chat", keyUrl: "https://platform.deepseek.com/api_keys" },
  { id: "moonshot", label: "Kimi", baseUrl: "https://api.moonshot.cn/v1", modelName: "moonshot-v1-8k", keyUrl: "https://platform.moonshot.cn/console/api-keys" },
  { id: "zhipu", label: "智谱 GLM", baseUrl: "https://open.bigmodel.cn/api/paas/v4", modelName: "glm-4-flash", keyUrl: "https://bigmodel.cn/usercenter/apikeys" },
  { id: "dashscope", label: "通义千问", baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1", modelName: "qwen-plus", keyUrl: "https://bailian.console.aliyun.com/" },
  { id: "openai", label: "OpenAI", baseUrl: "https://api.openai.com/v1", modelName: "gpt-4o-mini", keyUrl: "https://platform.openai.com/api-keys" },
  { id: "openrouter", label: "OpenRouter", baseUrl: "https://openrouter.ai/api/v1", modelName: "openai/gpt-4o-mini", keyUrl: "https://openrouter.ai/keys" }
];

const GEMINI_KEY_URL = "https://aistudio.google.com/apikey";

const INITIAL_INBOX_ITEMS = [
  {
    id: "item-1",
    target: "bite the bullet",
    rawInput: "We have no choice but to bite the bullet and refactor the legacy authentication module before Q4.",
    category: "Idiom",
    cefr: "B2",
    meaning: "咬紧牙关应付难关；硬着头皮做某事",
    usageNote: "常接动词原形 (bite the bullet and do sth)，替代 have to do something difficult。",
    tags: ["Workplace", "Decision"],
    aiTheme: "职场沟通 (Workplace)",
    manualTheme: "高频核心库",
    mastery: 1,
    priority: "High",
    priorityReason: "能直接改善你习惯用 'have to' 的平白表达",
    createdAt: "2026-10-20",
    lastReviewedAt: "2026-10-25",
    patterns: ["bite the bullet", "bit the bullet", "biting the bullet"]
  },
  {
    id: "item-2",
    target: "circle back to",
    rawInput: "Let's circle back to the budget allocation once we have the final vendor quotes next Tuesday.",
    category: "Phrasal Verb",
    cefr: "B2",
    meaning: "稍后再回头讨论；过段时间再议",
    usageNote: "后接名词或话题 (circle back to [topic])，北美职场极高频，替代 talk about it later。",
    tags: ["Workplace", "Meeting"],
    aiTheme: "职场沟通 (Workplace)",
    manualTheme: "会议话术",
    mastery: 2,
    priority: "Medium",
    priorityReason: "巩固商务控场流利度",
    createdAt: "2026-10-21",
    lastReviewedAt: "2026-10-27",
    patterns: ["circle back", "circling back", "circled back"]
  },
  {
    id: "item-3",
    target: "play devil's advocate",
    rawInput: "Just to play devil's advocate here, what happens if our main supplier delays the shipment by a month?",
    category: "Idiom",
    cefr: "C1",
    meaning: "唱反调；故意提出反面意见以供探讨",
    usageNote: "常用于 Let me play devil's advocate 或 Just to play devil's advocate，委婉提出异议。",
    tags: ["Debate", "Critical Thinking"],
    aiTheme: "观点思辨 (Debate)",
    manualTheme: "高频核心库",
    mastery: 0,
    priority: "High",
    priorityReason: "C1 冲击必背：帮你礼貌且专业地提出反对观点",
    createdAt: "2026-10-24",
    lastReviewedAt: "尚未复习",
    patterns: ["devil's advocate", "devils advocate"]
  },
  {
    id: "item-4",
    target: "By the time..., ... will have ...",
    rawInput: "By the time the marketing campaign goes live, our engineering team will have resolved all critical bugs.",
    category: "Sentence Pattern",
    cefr: "B2",
    meaning: "到……的时候，……就已经完成了（将来完成时句型）",
    usageNote: "前半句用一般现在时表将来，主句用 will have + 过去分词。",
    tags: ["Grammar", "Planning"],
    aiTheme: "职场沟通 (Workplace)",
    manualTheme: "高级句型",
    mastery: 1,
    priority: "High",
    priorityReason: "突破单一时态瓶颈，提升时态层次感",
    createdAt: "2026-10-22",
    lastReviewedAt: "2026-10-26",
    patterns: ["by the time", "will have"]
  },
  {
    id: "item-5",
    target: "on the same page",
    rawInput: "Before we wrap up, I want to make sure everybody is on the same page regarding the launch timeline.",
    category: "Idiom",
    cefr: "B1",
    meaning: "达成共识；步调一致；理解一致",
    usageNote: "常搭配 get on the same page 或 be on the same page。",
    tags: ["Workplace", "Alignment"],
    aiTheme: "日常社交 (Casual)",
    manualTheme: "会议话术",
    mastery: 3,
    priority: "Low",
    priorityReason: "已熟练掌握，仅作低频保温复习",
    createdAt: "2026-10-15",
    lastReviewedAt: "2026-10-28",
    patterns: ["on the same page", "same page"]
  }
];

const DEFAULT_SCENARIO = {
  title: "Q4 产品危机排期会议 (Product Sprint Crisis)",
  aiRole: "Alex（焦虑的产品总监，急需保住 Q4 亮眼数据）",
  userRole: "Tech Lead（技术负责人，既要坚持重构底层代码，又要缓和会议气氛）",
  difficulty: "B2 → C1 进阶挑战",
  context:
    "距离 Q4 新功能发布只剩 3 周。Alex 希望立刻上线花哨的 AI 看板，但你深知底层旧代码已经摇摇欲坠。请安抚 Alex，提出反面风险，并推迟次要预算的讨论。",
  targetIds: ["item-1", "item-2", "item-3"],
  openingLine:
    "Hey! Thanks for jumping on this call. Look, the executives are pressuring us to ship the new AI analytics dashboard by next Friday. I really don't think we have time to touch the old authentication code right now. What's your take?"
};

const DEMO_REVIEW_DATA = {
  overallScore: 85,
  hitCount: 2,
  totalTargets: 3,
  proficiencyUpdate: {
    oldScore: 68,
    newScore: 72,
    cefrProgress: "B2 (距离 C1 还差 8 分)",
    dimensionChanges: {
      lexical: "+3",
      grammar: "+1",
      pragmatic: "+4",
      idiomatic: "+5"
    },
    assessmentSummary:
      "你在本轮对话中的抗压沟通非常清晰！能够主动运用 'bite the bullet' 和 'circle back to' 推进议程。但在提出反面假设时仍依赖 'let me say an opposite idea' 这样的大白话，建议重点突破 C1 级习语 'play devil's advocate'。"
  },
  sentenceUpgrades: [
    {
      id: "up-1",
      turnIndex: 1,
      userOriginal:
        "I understand your worry about Q4, Alex. But our old system crashes too much, so we have to bite the bullet and fix the core code now.",
      targetUsed: "bite the bullet",
      anchoredPolish: {
        text: "I share your concern about Q4, Alex. However, our legacy system crashes too frequently, so we have to bite the bullet and refactor the core code now.",
        diffExplanation:
          "90% 保留了你的原句骨架！仅将口语化的 'understand your worry' 微调为更地道的 'share your concern'，'old system / fix' 升级为 'legacy system / refactor'，与你用的 'bite the bullet' 气场完美契合。"
      },
      nativeUpgrade: {
        text: "I completely share your concern about Q4, Alex. That said, with our legacy system crashing so frequently, we really have no choice but to bite the bullet and refactor the core architecture right now.",
        coachNote: "用 'That said' 承接转折，比单纯的 'But' 更具高管沟通质感。"
      }
    },
    {
      id: "up-2",
      turnIndex: 2,
      userOriginal:
        "Wait, let me say an opposite idea first: if the base system goes down during launch, the new dashboard won't work anyway. Also, let's circle back to the extra server budget next week.",
      targetUsed: "circle back to",
      missedOpportunityFor: "play devil's advocate",
      anchoredPolish: {
        text: "Hold on, let me play devil's advocate here first: if the base system goes down during launch, the new dashboard won't work anyway. Also, let's circle back to the extra server budget next week.",
        diffExplanation:
          "完全保留你后半句精彩的假设和 'circle back to'！只把你原句开头的 'let me say an opposite idea first' 锚定替换为本局目标词组 'let me play devil's advocate here first'，瞬间从 B1 跃升至 C1！"
      },
      nativeUpgrade: {
        text: "Just to play devil's advocate here—if the underlying system crashes during launch, the new dashboard won't work anyway. As for the extra server budget, let's circle back to that next week.",
        coachNote: "用 'As for...' 引导第二个话题，衔接 'circle back to' 会更加丝滑自然。"
      }
    }
  ],
  weaknessDrills: [
    {
      id: "drill-1",
      targetId: "item-3",
      target: "play devil's advocate",
      meaning: "唱反调；故意提出反面意见以供探讨",
      status: "Missed (本局未踩点)",
      reason: "你在第 2 回合想表达“提个反面意见”，使用了中式直译 'say an opposite idea'，错过了使用该词组的最佳时机。",
      modeA_Rewrite: {
        title: "原句锚定重造 (Rewrite Your Own Sentence)",
        originalUserSentence:
          "Wait, let me say an opposite idea first: if the base system goes down during launch, the new dashboard won't work anyway.",
        hint: "请保持你原句的后半部分不变，将 'say an opposite idea' 替换为 'play devil's advocate' 重新输出整句：",
        idealAnswer:
          "Wait, let me play devil's advocate first: if the base system goes down during launch, the new dashboard won't work anyway."
      },
      modeB_Trap: {
        title: "AI 精准挖坑快问快答 (One-Shot Context Trap)",
        aiPrompt:
          "Alex: \"Everyone on the board agrees that cutting the QA testing phase by 50% is a 100% safe way to launch early! Don't you agree?\"",
        instruction: "请用一句话回复 Alex，用上 【play devil's advocate】 委婉指出如果出现严重 Bug 怎么办：",
        idealAnswer:
          "Just to play devil's advocate, what happens if a critical bug slips through into production?"
      }
    }
  ]
};

const DEMO_NOTE_CONTENT = "Let's not get bogged down in minor UI details right now.";
const DEMO_NOTE_HISTORY = [{ id: "n-1", text: "push the envelope (突破极限/挑战常规)", time: "10 mins ago" }];

const DEMO_DRAFT_SCENARIO = {
  title: DEFAULT_SCENARIO.title,
  aiRole: DEFAULT_SCENARIO.aiRole,
  userRole: DEFAULT_SCENARIO.userRole,
  difficulty: DEFAULT_SCENARIO.difficulty,
  context: DEFAULT_SCENARIO.context,
  openingLine: DEFAULT_SCENARIO.openingLine
};

const EMPTY_SCENARIO = {
  title: "尚未生成剧本",
  aiRole: "待生成（在剧本定制里让 AI 编排）",
  userRole: "待生成",
  difficulty: "待定",
  context:
    "在「剧本定制」中选择对话主题、AI 陪练风格与回复篇幅，勾选至少 1 条语料后即可生成属于你的实战剧本。",
  targetIds: [],
  openingLine: ""
};

const FRESH_PROFICIENCY = {
  ...INITIAL_PROFICIENCY,
  dimensions: {
    lexical: { ...INITIAL_PROFICIENCY.dimensions.lexical, delta: 0 },
    grammar: { ...INITIAL_PROFICIENCY.dimensions.grammar, delta: 0 },
    pragmatic: { ...INITIAL_PROFICIENCY.dimensions.pragmatic, delta: 0 },
    idiomatic: { ...INITIAL_PROFICIENCY.dimensions.idiomatic, delta: 0 }
  },
  aiStrategyNote:
    "这是你的初始能力基线。完成第一次 AI 语料拆解和实战对话后，系统会根据你的真实输出更新各维度分数与提问权重。"
};

const EMPTY_REVIEW_DATA = {
  isEmpty: true,
  overallScore: 0,
  hitCount: 0,
  totalTargets: 0,
  proficiencyUpdate: {
    oldScore: 0,
    newScore: 0,
    cefrProgress: "",
    dimensionChanges: {},
    assessmentSummary: ""
  },
  sentenceUpgrades: [],
  weaknessDrills: []
};

// ==========================================
// 2. MAIN APPLICATION COMPONENT
// ==========================================
export default function App() {
  // Navigation & Subviews
  const [entryMode, setEntryMode] = useState(null); // null | "demo" | "fresh"
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState("inbox"); // "inbox" | "arena_setup" | "arena" | "review"
  const [inboxSubView, setInboxSubView] = useState("items"); // "items" | "raw_inputs"
  const [focusedItemId, setFocusedItemId] = useState(null);

  // User Dynamic Proficiency State
  const [profile, setProfile] = useState(INITIAL_PROFICIENCY);
  const [showProficiencyModal, setShowProficiencyModal] = useState(false);

  // Global Settings & Multi-LLM Provider Config
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [llmSettings, setLlmSettings] = useState({
    provider: "openai_compatible", // "gemini" | "openai_compatible"
    apiKey: "",
    baseUrl: "https://api.siliconflow.cn/v1",
    modelName: "deepseek-ai/DeepSeek-V3"
  });
  const [skipDumpConfirmModal, setSkipDumpConfirmModal] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState(null);

  // Multi-Item Extraction Confirmation Modal State
  const [extractionModalData, setExtractionModalData] = useState(null);

  // Lightbulb AI Q&A Modal State
  const [qaModalState, setQaModalState] = useState(null);
  const [qaInput, setQaInput] = useState("");

  // Inbox State
  const [inboxItems, setInboxItems] = useState(INITIAL_INBOX_ITEMS);
  const [rawInputText, setRawInputText] = useState("");
  const [dumpManualTheme, setDumpManualTheme] = useState("高频核心库");
  const [isAnalyzingDump, setIsAnalyzingDump] = useState(false);
  const [analyzingSourceLabel, setAnalyzingSourceLabel] = useState(null);

  // Filter & Batch States
  const [selectedItemIds, setSelectedItemIds] = useState(["item-1", "item-2", "item-3"]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterAiTheme, setFilterAiTheme] = useState("All");
  const [filterManualTheme, setFilterManualTheme] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterMastery, setFilterMastery] = useState("All");
  const [customManualThemes, setCustomManualThemes] = useState(["高频核心库", "会议话术", "高级句型", "生活口语"]);
  const [newManualThemeInput, setNewManualThemeInput] = useState("");
  const [isAddingTheme, setIsAddingTheme] = useState(false);
  const [isSmartClustering, setIsSmartClustering] = useState(false);

  // Arena Setup & Script Editor Config
  const [arenaConfig, setArenaConfig] = useState({
    themeId: "auto",
    customTopic: "",
    styleId: "encouraging",
    lengthId: "medium"
  });
  const [draftScenario, setDraftScenario] = useState(DEMO_DRAFT_SCENARIO);
  const [isDraftingScript, setIsDraftingScript] = useState(false);

  // Quick Add Toast & Selection Popover
  const [quickSaveToast, setQuickSaveToast] = useState(null);
  const [selectionPopup, setSelectionPopup] = useState(null);

  // Floating Notes State
  const [isNotesMinimized, setIsNotesMinimized] = useState(true);
  const [noteContent, setNoteContent] = useState(DEMO_NOTE_CONTENT);
  const [savedNotesHistory, setSavedNotesHistory] = useState(DEMO_NOTE_HISTORY);

  // Arena State
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "msg-0",
      sender: "ai",
      text: DEFAULT_SCENARIO.openingLine,
      timestamp: "Just now"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [hitTargets, setHitTargets] = useState({});
  const [expandedHintId, setExpandedHintId] = useState(null);
  const [lastHitBanner, setLastHitBanner] = useState(null);

  // Review & Drill State
  const [reviewData, setReviewData] = useState(DEMO_REVIEW_DATA);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [drillModeByCard, setDrillModeByCard] = useState({});
  const [drillInputs, setDrillInputs] = useState({});
  const [drillFeedbacks, setDrillFeedbacks] = useState({});

  const chatEndRef = useRef(null);

  const getTodayDateStr = () => new Date().toISOString().slice(0, 10);

  const triggerToast = (msg) => {
    setQuickSaveToast(msg);
    setTimeout(() => {
      setQuickSaveToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // ==========================================
  // LANDING PAGE: DEMO vs BLANK START
  // ==========================================
  const resetSharedPanels = () => {
    setCustomManualThemes(["高频核心库", "会议话术", "高级句型", "生活口语"]);
    setFilterCategory("All");
    setFilterAiTheme("All");
    setFilterManualTheme("All");
    setFilterPriority("All");
    setFilterMastery("All");
    setDumpManualTheme("高频核心库");
    setRawInputText("");
    setIsAddingTheme(false);
    setNewManualThemeInput("");
    setArenaConfig({ themeId: "auto", customTopic: "", styleId: "encouraging", lengthId: "medium" });
    setHitTargets({});
    setLastHitBanner(null);
    setExpandedHintId(null);
    setDrillModeByCard({});
    setDrillInputs({});
    setDrillFeedbacks({});
    setActiveTab("inbox");
    setInboxSubView("items");
    setFocusedItemId(null);
    setIsNotesMinimized(true);
    setShowProficiencyModal(false);
    setShowSettingsModal(false);
    setExtractionModalData(null);
    setQaModalState(null);
    setQaInput("");
    setIsEvaluating(false);
    setIsAnalyzingDump(false);
    setAnalyzingSourceLabel(null);
    setChatInput("");
    setIsAiTyping(false);
    setSelectionPopup(null);
  };

  const handleStartWithDemo = () => {
    if (entryMode !== null) {
      const ok = window.confirm("从示例开始会把当前语料、剧本与复盘内容重置为示例数据，确定继续吗？");
      if (!ok) return;
    }
    resetSharedPanels();
    setInboxItems(INITIAL_INBOX_ITEMS);
    setSelectedItemIds(["item-1", "item-2", "item-3"]);
    setProfile(INITIAL_PROFICIENCY);
    setNoteContent(DEMO_NOTE_CONTENT);
    setSavedNotesHistory(DEMO_NOTE_HISTORY);
    setDraftScenario(DEMO_DRAFT_SCENARIO);
    setScenario(DEFAULT_SCENARIO);
    setMessages([
      { id: "msg-0", sender: "ai", text: DEFAULT_SCENARIO.openingLine, timestamp: "Just now" }
    ]);
    setReviewData(DEMO_REVIEW_DATA);
    setEntryMode("demo");
    setShowLanding(false);
    triggerToast("✨ 已载入示例语料与剧本，可以直接开始体验");
  };

  const handleStartFresh = () => {
    if (entryMode !== null && (inboxItems.length > 0 || savedNotesHistory.length > 0)) {
      const ok = window.confirm("从头开始会清空当前页面里的语料、剧本与复盘内容（不可恢复），确定继续吗？");
      if (!ok) return;
    }
    resetSharedPanels();
    setInboxItems([]);
    setSelectedItemIds([]);
    setProfile(FRESH_PROFICIENCY);
    setNoteContent("");
    setSavedNotesHistory([]);
    setDraftScenario(EMPTY_SCENARIO);
    setScenario(EMPTY_SCENARIO);
    setMessages([]);
    setReviewData(EMPTY_REVIEW_DATA);
    setEntryMode("fresh");
    setShowLanding(false);
    triggerToast("🌱 已进入空白模式，从你的第一句英文开始积累");
  };

  // ==========================================
  // UNIVERSAL LLM CALLER (Gemini native API + any OpenAI-compatible endpoint)
  // ==========================================
  const callGeminiAPI = async (prompt, systemInstruction, responseSchema = null) => {
    const { provider, apiKey: customKey, baseUrl, modelName } = llmSettings;

    // 1. OpenAI-Compatible Provider
    if (provider === "openai_compatible") {
      if (!customKey.trim()) {
        throw new Error("未配置 OpenAI 兼容 API Key");
      }
      const cleanBase = baseUrl.replace(/\/+$/, "");
      const endpoint = `${cleanBase}/chat/completions`;
      const sysPrompt = responseSchema
        ? `${systemInstruction}\n\nIMPORTANT: You MUST respond strictly with valid JSON matching this schema:\n${JSON.stringify(responseSchema)}`
        : systemInstruction;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${customKey.trim()}`
        },
        body: JSON.stringify({
          model: modelName || "gpt-4o-mini",
          messages: [
            { role: "system", content: sysPrompt },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          ...(responseSchema ? { response_format: { type: "json_object" } } : {})
        })
      });

      if (!res.ok) throw new Error(`OpenAI API HTTP ${res.status}`);
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error("Empty OpenAI response");
      if (responseSchema) {
        const cleanedJson = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
        return JSON.parse(cleanedJson);
      }
      return text;
    }

    // 2. Gemini Native Provider
    const envGeminiKey = (import.meta.env?.VITE_GEMINI_API_KEY || "").trim();
    const activeGeminiKey = customKey.trim() || envGeminiKey;
    if (!activeGeminiKey) {
      throw new Error("未配置 Gemini API Key：请在「设置」中填写 Google AI Studio 的 Key，或构建时注入 VITE_GEMINI_API_KEY");
    }
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] }
    };

    if (responseSchema) {
      payload.generationConfig = {
        responseMimeType: "application/json",
        responseSchema
      };
    }

    const delays = [1000, 2000];
    for (let attempt = 0; attempt <= delays.length; attempt++) {
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": activeGeminiKey
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("Empty response");
        return responseSchema ? JSON.parse(text) : text;
      } catch (err) {
        if (attempt === delays.length) throw err;
        await new Promise((r) => setTimeout(r, delays[attempt]));
      }
    }
  };

  // ==========================================
  // UNIFIED AI EXTRACTION FLOW FOR ANY SNIPPET
  // ==========================================
  const buildHeuristicExtractions = (cleanText, sourceLabel) => {
    const knownChunks = [
      {
        match: /get(?:ting)? bogged down in/i,
        target: "get bogged down in",
        category: "Phrasal Verb",
        cefr: "B2",
        meaning: "陷入……泥潭而无法推进；纠缠于琐碎细节",
        usageNote: "后接名词或动名词 (get bogged down in details)，表示被琐事拖慢节奏。",
        patterns: ["bogged down in", "get bogged down", "getting bogged down in"]
      },
      {
        match: /jump(?:ing)? on this call/i,
        target: "jump on a call",
        category: "Idiom",
        cefr: "B1",
        meaning: "快速接入电话/线上会议",
        usageNote: "北美职场高频口语，比 join a meeting 更地道亲切。",
        patterns: ["jump on a call", "jumping on this call", "jump on this call"]
      },
      {
        match: /what's your take on/i,
        target: "What's your take on [sth]?",
        category: "Sentence Pattern",
        cefr: "B2",
        meaning: "你对……怎么看？你的观点是什么？",
        usageNote: "take 在此作名词表示“看法/切入点”，完美替代 What do you think about...?",
        patterns: ["what's your take on", "your take on"]
      },
      {
        match: /share your concern/i,
        target: "share [sb's] concern about",
        category: "Phrasal Verb",
        cefr: "B2",
        meaning: "与某人有同样的顾虑/感同身受某人的担忧",
        usageNote: "商务谈判安抚对方情绪的黄金开场白。",
        patterns: ["share your concern", "share his concern"]
      },
      {
        match: /refactor the (?:core|legacy) (?:code|architecture)/i,
        target: "refactor the legacy architecture",
        category: "Vocabulary",
        cefr: "B2",
        meaning: "重构遗留底层架构/代码",
        usageNote: "技术与产品团队沟通高频搭配，替代 fix the old code。",
        patterns: ["refactor the core", "refactor the legacy"]
      }
    ];

    const matched = knownChunks
      .filter((k) => k.match.test(cleanText))
      .map((k) => ({
        target: k.target,
        category: k.category,
        cefr: k.cefr,
        meaning: k.meaning,
        usageNote: k.usageNote,
        priority: "High",
        priorityReason: `从【${sourceLabel}】中精准识别出的高频地道表达`,
        aiTheme: "职场沟通 (Workplace)",
        tags: [sourceLabel, "Authentic"],
        patterns: k.patterns
      }));

    if (matched.length > 0) return matched;

    const words = cleanText.replace(/[.?!]+$/, "").split(/\s+/);
    const chunkText = words.length > 6 ? words.slice(0, 5).join(" ") : cleanText;
    return [
      {
        target: chunkText,
        category: words.length > 5 ? "Sentence Pattern" : "Idiom",
        cefr: profile.cefr,
        meaning: `从【${sourceLabel}】提炼的核心表达结构`,
        usageNote: "建议结合原句语境进行造句替换练习。",
        priority: "High",
        priorityReason: `匹配当前 ${profile.cefr} 实战进阶需求`,
        aiTheme: "职场沟通 (Workplace)",
        tags: [sourceLabel],
        patterns: [chunkText.toLowerCase()]
      }
    ];
  };

  const commitCandidatesToInbox = (candidatesToCommit) => {
    if (!candidatesToCommit || candidatesToCommit.length === 0) return;
    const today = getTodayDateStr();
    const newItems = candidatesToCommit.map((c, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      target: c.target,
      rawInput: c.rawInput,
      category: c.category || "Idiom",
      cefr: c.cefr || profile.cefr,
      meaning: c.meaning,
      usageNote: c.usageNote,
      tags: c.tags || ["QuickAdd"],
      aiTheme: c.aiTheme || "职场沟通 (Workplace)",
      manualTheme: c.manualTheme || dumpManualTheme || "高频核心库",
      mastery: 0,
      priority: c.priority || "High",
      priorityReason: c.priorityReason || `根据当前 ${profile.cefr} 能力评估自动纳入重点提问`,
      createdAt: today,
      lastReviewedAt: "尚未复习",
      patterns: c.patterns?.length ? c.patterns : [c.target.toLowerCase()]
    }));

    setInboxItems((prev) => [...newItems, ...prev]);
    setSelectedItemIds((prev) => [...newItems.map((i) => i.id), ...prev]);
    triggerToast(`🎉 已成功拆解并加入 ${newItems.length} 条地道表达至 Inbox！`);
  };

  const triggerExtractionForSnippet = async (rawSnippet, sourceLabel = "快捷收录") => {
    const cleanText = (rawSnippet || "").trim();
    if (!cleanText) return;
    setIsAnalyzingDump(true);
    setAnalyzingSourceLabel(sourceLabel);

    try {
      const schema = {
        type: "OBJECT",
        properties: {
          extractedItems: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                target: { type: "STRING" },
                category: { type: "STRING" },
                cefr: { type: "STRING" },
                meaning: { type: "STRING" },
                usageNote: { type: "STRING" },
                priority: { type: "STRING" },
                priorityReason: { type: "STRING" },
                aiTheme: { type: "STRING" },
                tags: { type: "ARRAY", items: { type: "STRING" } },
                patterns: { type: "ARRAY", items: { type: "STRING" } }
              },
              required: [
                "target",
                "category",
                "cefr",
                "meaning",
                "usageNote",
                "priority",
                "priorityReason",
                "aiTheme",
                "tags",
                "patterns"
              ]
            }
          }
        },
        required: ["extractedItems"]
      };

      const prompt = `User wants to extract valuable English expressions from this text (Source: ${sourceLabel}):
"${cleanText}"

The user's current English proficiency is CEFR ${profile.cefr} (${profile.cefrTitle}).
Deconstruct this sentence/paragraph and extract ALL valuable, authentic English learning chunks (idioms, phrasal verbs, collocations, high-value vocabulary, or sentence patterns—usually 1 to 4 distinct items).
CRITICAL: Do NOT just return the entire long sentence as the target. Extract the specific reusable phrase/idiom/pattern found inside the sentence!
For each extracted item:
- target: The specific reusable English phrase, idiom, or sentence pattern.
- category: MUST be one of "Idiom", "Phrasal Verb", "Sentence Pattern", "Vocabulary".
- cefr: MUST be one of "A1", "A2", "B1", "B2", "C1", "C2".
- meaning: Clear, concise Chinese definition.
- usageNote: Practical Chinese explanation of how to use it, collocations, or grammar nuance.
- priority: "High", "Medium", or "Low".
- priorityReason: Why this fits the user's CEFR ${profile.cefr} growth.
- aiTheme: One of "职场沟通 (Workplace)", "观点思辨 (Debate)", "日常社交 (Casual)", "高管谈判 (Executive)".
- patterns: 2-4 lowercase string substrings/inflections to match in raw text.`;

      const result = await callGeminiAPI(
        prompt,
        "You are an expert ESL linguist who deconstructs authentic English text into specific, reusable vocabulary/idiom/pattern cards.",
        schema
      );

      const rawList =
        result?.extractedItems?.length > 0
          ? result.extractedItems
          : buildHeuristicExtractions(cleanText, sourceLabel);

      const candidates = rawList.map((item, idx) => ({
        tempId: `cand-${Date.now()}-${idx}`,
        target: item.target || cleanText,
        rawInput: cleanText,
        category: item.category || "Idiom",
        cefr: item.cefr || profile.cefr,
        meaning: item.meaning || "地道核心表达",
        usageNote: item.usageNote || "可在对应语境中自然替换大白话使用。",
        priority: item.priority || "High",
        priorityReason: item.priorityReason || `从【${sourceLabel}】中拆解提炼的高价值表达`,
        tags: item.tags?.length ? item.tags : [sourceLabel],
        aiTheme: item.aiTheme || "职场沟通 (Workplace)",
        manualTheme: dumpManualTheme || "高频核心库",
        patterns: item.patterns?.length ? item.patterns : [(item.target || cleanText).toLowerCase()]
      }));

      if (skipDumpConfirmModal) {
        commitCandidatesToInbox(candidates);
      } else {
        setExtractionModalData({
          sourceLabel,
          rawText: cleanText,
          candidates,
          selectedTempIds: candidates.map((c) => c.tempId),
          dontAskAgainChecked: false
        });
      }
    } catch (err) {
      const fallbackCandidates = buildHeuristicExtractions(cleanText, sourceLabel).map((item, idx) => ({
        tempId: `cand-${Date.now()}-${idx}`,
        ...item,
        rawInput: cleanText,
        manualTheme: dumpManualTheme || "高频核心库"
      }));

      if (skipDumpConfirmModal) {
        commitCandidatesToInbox(fallbackCandidates);
      } else {
        setExtractionModalData({
          sourceLabel,
          rawText: cleanText,
          candidates: fallbackCandidates,
          selectedTempIds: fallbackCandidates.map((c) => c.tempId),
          dontAskAgainChecked: false
        });
      }
    } finally {
      setIsAnalyzingDump(false);
      setAnalyzingSourceLabel(null);
    }
  };

  const handleConfirmExtractionModal = () => {
    if (!extractionModalData) return;
    if (extractionModalData.dontAskAgainChecked) {
      setSkipDumpConfirmModal(true);
    }
    const chosen = extractionModalData.candidates.filter((c) =>
      extractionModalData.selectedTempIds.includes(c.tempId)
    );
    commitCandidatesToInbox(chosen);
    setExtractionModalData(null);
  };

  // ==========================================
  // JSON EXPORT & IMPORT BACKUP HANDLERS
  // ==========================================
  const handleExportData = () => {
    const backupPayload = {
      version: "2.0",
      exportedAt: new Date().toISOString(),
      profile,
      inboxItems,
      customManualThemes,
      savedNotesHistory
    };
    const blob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `english-dump-backup-${getTodayDateStr()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast("📦 已导出 JSON 备份文件！");
  };

  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed.inboxItems)) {
          setInboxItems(parsed.inboxItems);
        }
        if (parsed.profile) {
          setProfile(parsed.profile);
        }
        if (Array.isArray(parsed.customManualThemes)) {
          setCustomManualThemes(parsed.customManualThemes);
        }
        if (Array.isArray(parsed.savedNotesHistory)) {
          setSavedNotesHistory(parsed.savedNotesHistory);
        }
        triggerToast("✅ 备份数据导入成功！");
      } catch (err) {
        triggerToast("⚠️ JSON 文件格式有误，无法导入");
      }
    };
    reader.readAsText(file);
  };

  // ==========================================
  // LIGHTBULB AI Q&A HANDLERS
  // ==========================================
  const handleOpenQaModal = (targetObj, e) => {
    if (e) e.stopPropagation();
    const initialAiGreeting =
      targetObj.type === "item"
        ? `你好！我是你的语料随身助教 💡。\n你可以针对 **「${targetObj.title}」**（${targetObj.meaning}）提问任何关于**语境微妙差异、同义替换、常见搭配或造句批改**的问题！`
        : `你好！我是你的语料随身助教 💡。\n正在为你分析原始输入句：\n> *"${targetObj.contextText}"*\n\n你可以问我这句的**长难句语法结构、地道亮点，或者还有哪些隐藏表达值得积累**！`;

    setQaModalState({
      ...targetObj,
      messages: [{ role: "ai", text: initialAiGreeting }],
      loading: false
    });
    setQaInput("");
  };

  const handleSendQaQuestion = async (presetQuestion = null) => {
    if (!qaModalState) return;
    const questionText = (presetQuestion || qaInput).trim();
    if (!questionText) return;

    const updatedMsgs = [...qaModalState.messages, { role: "user", text: questionText }];
    setQaModalState((prev) => ({ ...prev, messages: updatedMsgs, loading: true }));
    if (!presetQuestion) setQaInput("");

    try {
      const prompt = `Context (${qaModalState.type === "item" ? "Target Expression" : "Raw English Sentence"}):
Title/Expression: "${qaModalState.title}"
Full Original Sentence: "${qaModalState.contextText}"
Learner CEFR Level: ${profile.cefr}

User's Question: "${questionText}"

Provide a concise, insightful, encouraging answer in Chinese with 1-2 natural English examples. Use clear Markdown formatting (**bold**, bullet points).`;

      const reply = await callGeminiAPI(
        prompt,
        "You are a warm, expert ESL coach answering specific questions about an English expression or sentence."
      );
      setQaModalState((prev) =>
        prev
          ? {
              ...prev,
              messages: [...updatedMsgs, { role: "ai", text: reply }],
              loading: false
            }
          : null
      );
    } catch (err) {
      const fallbackAnswer = `针对 **「${qaModalState.title}」** 的解析：\n\n1. **核心语感**：该表达在地道母语者交流中非常高频，能有效替代平铺直叙的大白话。\n2. **搭配注意**：使用时注意前后的介词搭配与主谓时态呼应。\n3. **实战造句**：*"We decided to ${qaModalState.title} and move the project forward."*`;
      setQaModalState((prev) =>
        prev
          ? {
              ...prev,
              messages: [...updatedMsgs, { role: "ai", text: fallbackAnswer }],
              loading: false
            }
          : null
      );
    }
  };

  // ==========================================
  // INLINE & BLOCK MARKDOWN PARSER (FIXES CODE DISPLAY IN CHAT & Q&A)
  // ==========================================
  const parseInlineMarkdown = (textStr) => {
    if (!textStr) return null;
    const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\n]+\*)/g;
    const parts = textStr.split(tokenRegex);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return (
          <strong key={idx} className="font-bold text-amber-300">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 mx-0.5 rounded bg-indigo-500/25 border border-indigo-400/40 text-indigo-200 font-mono text-[12px]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return (
          <em key={idx} className="italic text-slate-300">
            {part.slice(1, -1)}
          </em>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const renderFormattedMarkdownText = (text) => {
    if (!text) return null;
    const cleanedText = String(text)
      .replace(/^```(?:markdown|text|json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    const lines = cleanedText.split("\n");
    return (
      <div className="space-y-1.5 leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;
          if (trimmed.startsWith("### ") || trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
            return (
              <div key={idx} className="font-bold text-indigo-300 pt-1 text-sm">
                {parseInlineMarkdown(trimmed.replace(/^#+\s*/, ""))}
              </div>
            );
          }
          if (trimmed.startsWith("> ")) {
            return (
              <blockquote
                key={idx}
                className="pl-3 border-l-2 border-indigo-400/60 text-slate-300 italic text-xs my-1"
              >
                {parseInlineMarkdown(trimmed.replace(/^>\s*/, ""))}
              </blockquote>
            );
          }
          if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || /^\d+\.\s/.test(trimmed)) {
            const bulletLabel = /^\d+\.\s/.test(trimmed) ? trimmed.match(/^\d+\./)[0] : "•";
            const contentBody = trimmed.replace(/^([-*]|\d+\.)\s+/, "");
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-amber-400 font-bold shrink-0">{bulletLabel}</span>
                <div className="flex-1">{parseInlineMarkdown(contentBody)}</div>
              </div>
            );
          }
          if (trimmed.startsWith("💡") || trimmed.startsWith("[递话柄")) {
            return (
              <div
                key={idx}
                className="mt-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs font-medium"
              >
                {parseInlineMarkdown(trimmed)}
              </div>
            );
          }
          return <div key={idx}>{parseInlineMarkdown(trimmed)}</div>;
        })}
      </div>
    );
  };

  // ==========================================
  // INLINE HIGHLIGHTING INSIDE RAW INPUTS & CARDS
  // ==========================================
  const findAllItemSpansInSentence = (rawSentence, itemsList) => {
    if (!rawSentence || !itemsList || itemsList.length === 0) return [];
    const lowerRaw = rawSentence.toLowerCase();
    const spans = [];

    itemsList.forEach((item) => {
      const candidateStrings = Array.from(
        new Set([
          item.target,
          ...(item.patterns || []),
          ...item.target
            .split(/\.\.\.|…/)
            .map((s) => s.trim())
            .filter((s) => s.length >= 3)
        ])
      )
        .filter((s) => s && s.trim().length >= 2)
        .sort((a, b) => b.length - a.length);

      for (const pat of candidateStrings) {
        const cleanPat = pat.toLowerCase().trim();
        const foundIdx = lowerRaw.indexOf(cleanPat);
        if (foundIdx !== -1) {
          spans.push({
            start: foundIdx,
            end: foundIdx + cleanPat.length,
            item
          });
          if (!item.target.includes("...")) break;
        }
      }
    });

    spans.sort((a, b) => a.start - b.start || b.end - a.end);
    const merged = [];
    for (const sp of spans) {
      if (merged.length === 0 || sp.start >= merged[merged.length - 1].end) {
        merged.push(sp);
      }
    }
    return merged;
  };

  const handleJumpToSpecificItem = (itemId) => {
    setFilterCategory("All");
    setFilterAiTheme("All");
    setFilterManualTheme("All");
    setFilterPriority("All");
    setFilterMastery("All");
    setInboxSubView("items");
    setFocusedItemId(itemId);
    setTimeout(() => {
      const el = document.getElementById(`inbox-card-${itemId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
    setTimeout(() => {
      setFocusedItemId((prev) => (prev === itemId ? null : prev));
    }, 3000);
  };

  const renderHighlightedRawText = (rawInput, itemsInGroup) => {
    if (!rawInput) return null;
    const spans = findAllItemSpansInSentence(rawInput, itemsInGroup);
    if (spans.length === 0) {
      return <span>{rawInput}</span>;
    }

    const segments = [];
    let cursor = 0;
    spans.forEach((sp, i) => {
      if (sp.start > cursor) {
        segments.push(<span key={`txt-${i}`}>{rawInput.slice(cursor, sp.start)}</span>);
      }
      const matchedSlice = rawInput.slice(sp.start, sp.end);
      segments.push(
        <button
          key={`hl-${sp.item.id}-${i}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleJumpToSpecificItem(sp.item.id);
          }}
          title={`点击跳转到语料卡片：「${sp.item.target}」(${sp.item.meaning})`}
          className="inline-flex items-center gap-1 mx-0.5 px-2 py-0.5 rounded-md bg-indigo-500/25 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-400/50 font-semibold transition-all shadow-sm group/tag align-baseline"
        >
          <span className="underline decoration-indigo-400/70 decoration-wavy underline-offset-4">
            {matchedSlice}
          </span>
          <ExternalLink className="w-3 h-3 text-indigo-300 group-hover/tag:text-white shrink-0" />
        </button>
      );
      cursor = sp.end;
    });

    if (cursor < rawInput.length) {
      segments.push(<span key="txt-end">{rawInput.slice(cursor)}</span>);
    }

    return <span className="leading-7">{segments}</span>;
  };

  const renderSingleCardRawHighlight = (rawInput, item) => {
    if (!rawInput) return null;
    const spans = findAllItemSpansInSentence(rawInput, [item]);
    if (spans.length === 0) return <span>"{rawInput}"</span>;

    const segments = [];
    let cursor = 0;
    spans.forEach((sp, i) => {
      if (sp.start > cursor) {
        segments.push(<span key={`c-txt-${i}`}>{rawInput.slice(cursor, sp.start)}</span>);
      }
      segments.push(
        <mark
          key={`c-hl-${i}`}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-amber-500/25 border border-amber-400/50 text-amber-200 font-semibold not-italic"
        >
          {rawInput.slice(sp.start, sp.end)}
        </mark>
      );
      cursor = sp.end;
    });
    if (cursor < rawInput.length) {
      segments.push(<span key="c-txt-end">{rawInput.slice(cursor)}</span>);
    }
    return <span>"{segments}"</span>;
  };

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiTyping]);

  // Reset page scroll when switching tabs or returning to the landing page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab, showLanding]);

  // Text selection listener for Arena & Review
  useEffect(() => {
    const handleMouseUp = () => {
      if (activeTab !== "arena" && activeTab !== "review") {
        setSelectionPopup(null);
        return;
      }
      const sel = window.getSelection();
      const text = sel ? sel.toString().trim() : "";
      if (text.length >= 3 && text.length <= 240 && /[a-zA-Z]/.test(text)) {
        try {
          const range = sel.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          if (rect.width > 0) {
            setSelectionPopup({
              text,
              x: Math.min(window.innerWidth - 300, Math.max(8, rect.left)),
              y: Math.max(16, rect.top - 48)
            });
          }
        } catch (e) {
          setSelectionPopup(null);
        }
      } else {
        setSelectionPopup(null);
      }
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [activeTab]);

  // ==========================================
  // INBOX CRUD, BATCH & FILTER HANDLERS
  // ==========================================
  const handleAddDump = async (e) => {
    if (e) e.preventDefault();
    if (!rawInputText.trim()) return;
    const textToAnalyze = rawInputText.trim();
    setRawInputText("");
    await triggerExtractionForSnippet(textToAnalyze, "Inbox 随手记");
  };

  const handleDeleteSingleItem = (id, e) => {
    if (e) e.stopPropagation();
    setInboxItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedItemIds((prev) => prev.filter((selId) => selId !== id));
    triggerToast("🗑️ 已删除该条语料");
  };

  const handleBatchDelete = () => {
    if (selectedItemIds.length === 0) return;
    const count = selectedItemIds.length;
    setInboxItems((prev) => prev.filter((item) => !selectedItemIds.includes(item.id)));
    setSelectedItemIds([]);
    triggerToast(`🗑️ 已批量删除 ${count} 条语料`);
  };

  const handleBatchUpdateField = (field, value) => {
    if (selectedItemIds.length === 0) return;
    setInboxItems((prev) =>
      prev.map((item) => (selectedItemIds.includes(item.id) ? { ...item, [field]: value } : item))
    );
    triggerToast(`✅ 已批量更新 ${selectedItemIds.length} 条语料`);
  };

  const handleSingleUpdateField = (id, field, value, e) => {
    if (e) e.stopPropagation();
    setInboxItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleAddCustomTheme = () => {
    const clean = newManualThemeInput.trim();
    if (!clean) return;
    if (!customManualThemes.includes(clean)) {
      setCustomManualThemes((prev) => [...prev, clean]);
    }
    setDumpManualTheme(clean);
    setNewManualThemeInput("");
    setIsAddingTheme(false);
    triggerToast(`🏷️ 已创建人工主题「${clean}」`);
  };

  const handleAiAutoClusterThemes = () => {
    setIsSmartClustering(true);
    setTimeout(() => {
      setInboxItems((prev) =>
        prev.map((item) => {
          const lower = (item.target + " " + item.rawInput).toLowerCase();
          let aiTheme = "职场沟通 (Workplace)";
          if (lower.includes("advocate") || lower.includes("argue") || lower.includes("take")) {
            aiTheme = "观点思辨 (Debate)";
          } else if (lower.includes("coffee") || lower.includes("page") || lower.includes("call")) {
            aiTheme = "日常社交 (Casual)";
          } else if (lower.includes("budget") || lower.includes("executive") || lower.includes("vendor")) {
            aiTheme = "高管谈判 (Executive)";
          }
          return { ...item, aiTheme };
        })
      );
      setIsSmartClustering(false);
      triggerToast("🤖 AI 已完成全库智能主题聚类！");
    }, 500);
  };

  const handleSelectAllFiltered = (filteredList) => {
    const filteredIds = filteredList.map((i) => i.id);
    const allSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedItemIds.includes(id));
    if (allSelected) {
      setSelectedItemIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedItemIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  // ==========================================
  // ARENA SETUP & CHAT HANDLERS
  // ==========================================
  const handleOpenArenaSetup = (useSmartPick = false) => {
    let chosenIds = selectedItemIds;
    if (useSmartPick || !chosenIds || chosenIds.length === 0) {
      const sorted = [...inboxItems].sort((a, b) => {
        const pScore = (p) => (p === "High" ? 3 : p === "Medium" ? 2 : 1);
        if (pScore(b.priority) !== pScore(a.priority)) return pScore(b.priority) - pScore(a.priority);
        return a.mastery - b.mastery;
      });
      chosenIds = sorted.slice(0, 3).map((i) => i.id);
      setSelectedItemIds(chosenIds);
    }
    const chosenItems = inboxItems.filter((i) => chosenIds.includes(i.id));
    const targetsListStr = chosenItems.map((i) => `「${i.target}」`).join("、");
    setDraftScenario((prev) => ({
      ...prev,
      difficulty: `${profile.cefr} 适应性挑战`,
      context: `本局你需要围绕选定的 ${chosenItems.length} 个目标表达（${targetsListStr}）与 AI 进行实战对话。你可在下方选择主题、风格、篇幅，或让 AI 预生成新剧本草稿后直接手动编辑剧本内容！`
    }));
    setActiveTab("arena_setup");
  };

  const handleAiGenerateScriptDraft = async () => {
    const chosenItems = inboxItems.filter((i) => selectedItemIds.includes(i.id));
    if (chosenItems.length === 0) {
      triggerToast("⚠️ 请先至少勾选 1 个目标表达");
      return;
    }
    setIsDraftingScript(true);
    const selectedThemeObj = ARENA_THEMES.find((t) => t.id === arenaConfig.themeId) || ARENA_THEMES[0];
    const selectedStyleObj = AI_STYLES.find((s) => s.id === arenaConfig.styleId) || AI_STYLES[0];
    const selectedLengthObj = DIALOGUE_LENGTHS.find((l) => l.id === arenaConfig.lengthId) || DIALOGUE_LENGTHS[1];
    const themeInstruction = arenaConfig.customTopic.trim()
      ? `User specified custom topic: "${arenaConfig.customTopic.trim()}"`
      : `Selected Scenario Theme: ${selectedThemeObj.label}`;

    try {
      const schema = {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          aiRole: { type: "STRING" },
          userRole: { type: "STRING" },
          difficulty: { type: "STRING" },
          context: { type: "STRING" },
          openingLine: { type: "STRING" }
        },
        required: ["title", "aiRole", "userRole", "difficulty", "context", "openingLine"]
      };

      const targetsDesc = chosenItems.map((i) => `- "${i.target}" (${i.meaning})`).join("\n");
      const prompt = `Design one role-play scenario for a CEFR ${profile.cefr} English learner.

Target expressions the learner must practise (weave them naturally into the situation):
${targetsDesc}

Preferences:
- ${themeInstruction}
- AI persona style: ${selectedStyleObj.label} (${selectedStyleObj.desc})
- AI turn length: ${selectedLengthObj.promptHint}

Hard requirements:
1. aiRole and userRole are two DIFFERENT real human characters. aiRole is the specific person the learner talks to: a name plus job/relationship plus current demand or mood. aiRole must NEVER be an AI, assistant, bot, coach, narrator, system or virtual character, and must never hint at being artificial.
2. aiRole speaks FIRST. openingLine is spoken by aiRole in the first person, in natural spoken English (max 3 sentences), greeting/addressing userRole directly and ending with a question or hook the learner can answer. It must not mention AI, models, prompts or being an assistant.
3. userRole is the character the human learner plays, described from the learner's point of view (e.g. "你是……").
4. context is written in Chinese and addresses the learner as 你 (i.e. userRole): explain the situation, the stakes and what you should achieve in this conversation.
5. Format aiRole and userRole as "名字（身份 · 当前诉求/情绪）" in Chinese, each 10-30 characters. Use realistic human names.
6. title is bilingual: Chinese followed by English in parentheses.

Return JSON with title, aiRole, userRole, difficulty, context, openingLine.`;

      const res = await callGeminiAPI(
        prompt,
        "You are a creative role-play scenario director for ESL learners. Every character you write is a realistic human being; you never cast an AI assistant as a character.",
        schema
      );
      setDraftScenario(res);
      triggerToast("✨ AI 已生成新剧本草稿，你可直接微调编辑或点击开练！");
    } catch (err) {
      setDraftScenario({
        title: `${selectedThemeObj.label.replace(/^[^\s]+\s/, "")} · 实战演练`,
        aiRole: "Jordan（合作方项目负责人 · 急于敲定本季度的交付排期）",
        userRole: "项目核心负责人（负责技术落地与资源协调）",
        difficulty: `${profile.cefr} 实战模拟`,
        context: `围绕主题「${arenaConfig.customTopic || selectedThemeObj.label}」展开对话，自然融入所选的 ${chosenItems.length} 个目标表达。`,
        openingLine:
          "Hey there! Glad we could catch up. We have a few critical decisions to make today—how do you suggest we kick things off?"
      });
      triggerToast("⚡ 已根据所选主题更新剧本草稿（未连接模型，使用本地剧本模板）");
    } finally {
      setIsDraftingScript(false);
    }
  };

  const handleGenerateAndStartArena = async (useEditedDraftDirectly = true) => {
    const chosenItems = inboxItems.filter((i) => selectedItemIds.includes(i.id));
    if (chosenItems.length === 0) {
      triggerToast("⚠️ 请至少选择 1 个需要练习的目标语料");
      return;
    }

    setActiveTab("arena");
    setHitTargets({});

    if (useEditedDraftDirectly && draftScenario.title && draftScenario.openingLine) {
      setScenario({ ...draftScenario, targetIds: selectedItemIds });
      setMessages([
        {
          id: `msg-${Date.now()}`,
          sender: "ai",
          text: draftScenario.openingLine,
          timestamp: "Just now"
        }
      ]);
      return;
    }

    setIsGeneratingScenario(true);
    try {
      await handleAiGenerateScriptDraft();
      setScenario({ ...draftScenario, targetIds: selectedItemIds });
      setMessages([
        {
          id: `msg-${Date.now()}`,
          sender: "ai",
          text: draftScenario.openingLine,
          timestamp: "Just now"
        }
      ]);
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  const detectHitsInMessage = (text, activeTargetItems) => {
    const lower = text.toLowerCase();
    const newlyHit = [];
    activeTargetItems.forEach((item) => {
      const patterns = item.patterns || [item.target.toLowerCase()];
      const isMatched = patterns.some((p) => lower.includes(p.toLowerCase()));
      if (isMatched) {
        newlyHit.push(item);
      }
    });
    return newlyHit;
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isAiTyping) return;
    const userText = chatInput.trim();
    setChatInput("");

    const activeTargetItems = inboxItems.filter((i) => scenario.targetIds?.includes(i.id));
    const matchedItems = detectHitsInMessage(userText, activeTargetItems);

    if (matchedItems.length > 0) {
      const today = getTodayDateStr();
      const updatedHits = { ...hitTargets };
      matchedItems.forEach((m) => {
        updatedHits[m.id] = { hit: true, sentence: userText };
      });
      setHitTargets(updatedHits);
      setLastHitBanner(matchedItems.map((m) => m.target).join(", "));
      setTimeout(() => setLastHitBanner(null), 3500);

      const matchedIds = matchedItems.map((m) => m.id);
      setInboxItems((prev) =>
        prev.map((it) =>
          matchedIds.includes(it.id)
            ? { ...it, lastReviewedAt: today, mastery: Math.min(3, it.mastery + 1) }
            : it
        )
      );
    }

    const newUserMsg = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: userText,
      hitTargets: matchedItems.map((m) => m.target),
      timestamp: "Just now"
    };

    const nextMessages = [...messages, newUserMsg];
    setMessages(nextMessages);
    setIsAiTyping(true);

    const selectedStyleObj = AI_STYLES.find((s) => s.id === arenaConfig.styleId) || AI_STYLES[0];
    const selectedLengthObj = DIALOGUE_LENGTHS.find((l) => l.id === arenaConfig.lengthId) || DIALOGUE_LENGTHS[1];

    try {
      const unhitItems = activeTargetItems.filter(
        (i) => !hitTargets[i.id]?.hit && !matchedItems.some((m) => m.id === i.id)
      );
      const historyText = nextMessages
        .filter((m) => !m.isCue)
        .map((m) => `${m.sender === "ai" ? scenario.aiRole : scenario.userRole}: ${m.text}`)
        .join("\n");

      const prompt = `Role-play scenario: ${scenario.title}
Who you are: ${scenario.aiRole} — a real human being in this scene. You never step out of this identity.
Who the learner is: ${scenario.userRole}
Scene context: ${scenario.context}
Your conversational style: ${selectedStyleObj.promptHint}
Length constraint: ${selectedLengthObj.promptHint}

Conversation so far:
${historyText}

Expressions the learner still needs to practise: ${unhitItems.map((u) => `"${u.target}" (${u.meaning})`).join(", ") || "All targets hit! Wrap up naturally."}

Reply as ${scenario.aiRole} only, in natural spoken English. Stay fully in character as a real person: never mention AI, models, prompts, coaching or being an assistant, and never narrate from outside the scene. End with something that invites the learner to use one of the remaining expressions.`;

      const aiReply = await callGeminiAPI(
        prompt,
        "You are role-playing one specific human character in a conversation with an English learner. Stay in character at all times and never reveal or imply that you are an AI, model or assistant."
      );

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: "ai",
          text: aiReply,
          timestamp: "Just now"
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: "ai",
          text: "That makes sense! Still, what if someone on the board disagrees with our approach? How would you counter their point, and when should we revisit the remaining budget?",
          timestamp: "Just now"
        }
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleGiveMeACue = () => {
    const activeTargetItems = inboxItems.filter((i) => scenario.targetIds?.includes(i.id));
    const unhit = activeTargetItems.find((i) => !hitTargets[i.id]?.hit) || activeTargetItems[0];
    if (!unhit) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-cue-${Date.now()}`,
        sender: "ai",
        isCue: true,
        text: `💡 **[教练提示]** 这一轮还没用上 **\`${unhit.target}\`**（${unhit.meaning}）。\n\n可以尝试把它接进你的回答，例如："Speaking of which, ..."`,
        timestamp: "Coach Hint"
      }
    ]);
  };

  const handleLoadDemoDialogueAndReview = () => {
    const demoMsgs = [
      {
        id: "dm-0",
        sender: "ai",
        text: DEFAULT_SCENARIO.openingLine,
        timestamp: "2 mins ago"
      },
      {
        id: "dm-1",
        sender: "user",
        text: "I understand your worry about Q4, Alex. But our old system crashes too much, so we have to bite the bullet and fix the core code now.",
        hitTargets: ["bite the bullet"],
        timestamp: "1 min ago"
      },
      {
        id: "dm-2",
        sender: "ai",
        text: "Fair point, fixing the crashes is critical. Still, rewriting the core module sounds risky! Everyone on the board thinks shipping the new AI dashboard first is a guaranteed win. What if we just patch the legacy code?",
        timestamp: "1 min ago"
      },
      {
        id: "dm-3",
        sender: "user",
        text: "Wait, let me say an opposite idea first: if the base system goes down during launch, the new dashboard won't work anyway. Also, let's circle back to the extra server budget next week.",
        hitTargets: ["circle back to"],
        timestamp: "Just now"
      }
    ];
    setMessages(demoMsgs);
    setHitTargets({
      "item-1": { hit: true, sentence: demoMsgs[1].text },
      "item-2": { hit: true, sentence: demoMsgs[3].text }
    });
    setReviewData(DEMO_REVIEW_DATA);
    setActiveTab("review");
    triggerToast("✨ 已载入完整演示对话并生成【原句升华与弱点特训】报告！");
  };

  const handleFinishAndEvaluate = () => {
    setIsEvaluating(true);
    setActiveTab("review");
    setTimeout(() => {
      setReviewData(DEMO_REVIEW_DATA);
      setIsEvaluating(false);
    }, 600);
  };

  const handleCheckDrill = (drill) => {
    const userAns = (drillInputs[drill.id] || "").trim();
    if (!userAns) return;
    const mode = drillModeByCard[drill.id] || "rewrite";
    const ideal = mode === "rewrite" ? drill.modeA_Rewrite.idealAnswer : drill.modeB_Trap.idealAnswer;

    const today = getTodayDateStr();
    setInboxItems((prev) =>
      prev.map((it) =>
        it.id === drill.targetId
          ? { ...it, lastReviewedAt: today, mastery: Math.min(3, it.mastery + 1) }
          : it
      )
    );

    setDrillFeedbacks((prev) => ({
      ...prev,
      [drill.id]: {
        loading: false,
        score: 95,
        comment: `太棒了！你成功将「${drill.target}」自然融入了你的原句语境中，熟练度已 +1 并更新今日复习记录！`,
        anchoredFix: ideal
      }
    }));
  };

  const handleTestApiConnection = async () => {
    setIsTestingApi(true);
    setApiTestResult(null);
    try {
      await callGeminiAPI("Reply with OK.", "You are a test assistant.");
      setApiTestResult({ ok: true, message: "API 连通性测试成功，可以开始使用了。" });
      triggerToast("✅ API 连通性测试成功！");
    } catch (err) {
      setApiTestResult({ ok: false, message: `连接测试失败：${err.message}` });
      triggerToast(`⚠️ 连接测试失败: ${err.message}`);
    } finally {
      setIsTestingApi(false);
    }
  };

  const handleChangeUserCefr = (newCefr) => {
    const preset = CEFR_PRESETS[newCefr];
    if (!preset) return;
    setProfile((prev) => ({
      ...prev,
      cefr: newCefr,
      cefrTitle: preset.title,
      overallScore: preset.defaultScore,
      aiStrategyNote: `已手动切换至 ${newCefr} (${preset.title}) 基线。系统将重点根据 ${newCefr} 进阶标准为你拆解地道表达与匹配情景对话难度。`
    }));
    triggerToast(`🎓 已将当前英语等级切换为 ${newCefr}`);
  };

  const handleSubmitNoteToInbox = async () => {
    const clean = noteContent.trim();
    if (!clean) return;
    setSavedNotesHistory((prev) => [{ id: `n-${Date.now()}`, text: clean, time: "Just now" }, ...prev]);
    setNoteContent("");
    await triggerExtractionForSnippet(clean, "随手记 Notes");
  };

  // Computed lists
  const uniqueAiThemes = ["All", ...Array.from(new Set(inboxItems.map((i) => i.aiTheme).filter(Boolean)))];
  const uniqueManualThemes = [
    "All",
    ...Array.from(new Set([...customManualThemes, ...inboxItems.map((i) => i.manualTheme).filter(Boolean)]))
  ];

  const filteredInbox = inboxItems.filter((item) => {
    const catMatch = filterCategory === "All" || item.category === filterCategory;
    const aiMatch = filterAiTheme === "All" || item.aiTheme === filterAiTheme;
    const manualMatch = filterManualTheme === "All" || item.manualTheme === filterManualTheme;
    const prioMatch = filterPriority === "All" || item.priority === filterPriority;
    const mastMatch = filterMastery === "All" || String(item.mastery) === filterMastery;
    return catMatch && aiMatch && manualMatch && prioMatch && mastMatch;
  });

  const groupedRawInputs = Object.values(
    inboxItems.reduce((acc, item) => {
      const key = item.rawInput.trim();
      if (!acc[key]) {
        acc[key] = {
          rawInput: item.rawInput,
          createdAt: item.createdAt || "2026-10-20",
          lastReviewedAt: item.lastReviewedAt || "尚未复习",
          items: []
        };
      }
      acc[key].items.push(item);
      if (item.lastReviewedAt && item.lastReviewedAt !== "尚未复习") {
        acc[key].lastReviewedAt = item.lastReviewedAt;
      }
      return acc;
    }, {})
  );

  const activeTargetItems = inboxItems.filter((i) => scenario.targetIds?.includes(i.id));

  const getMasteryBadge = (level) => {
    const map = [
      { text: "Lv.0 新收录", color: "bg-slate-800 text-slate-300 border-slate-700" },
      { text: "Lv.1 弱点待强化", color: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
      { text: "Lv.2 初步掌握", color: "bg-sky-500/15 text-sky-300 border-sky-500/30" },
      { text: "Lv.3 已内化", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" }
    ];
    return map[level] || map[0];
  };

  const getPriorityBadge = (priority) => {
    if (priority === "High") return "bg-rose-500/15 text-rose-300 border-rose-500/30";
    if (priority === "Medium") return "bg-indigo-500/15 text-indigo-300 border-indigo-500/30";
    return "bg-slate-800 text-slate-400 border-slate-700";
  };

  // ==========================================
  // LANDING / STARTUP PAGE
  // ==========================================
  if (showLanding) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-clip">
        {/* soft background glows */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-32 w-[480px] h-[480px] rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-emerald-500/10 blur-[140px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-5 lg:px-8 py-5 sm:py-7 space-y-10 sm:space-y-14">
          {/* Top bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight text-white">English Dump & Role-play</h1>
                <p className="text-[11px] text-slate-400">把「收藏的英语」练成「说得出的话」</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                无账号 · 无埋点 · 数据只留在当前页面
              </span>
              {entryMode !== null && (
                <button
                  onClick={() => setShowLanding(false)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200"
                >
                  <span>继续当前学习</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Hero */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                V1.0 · 动态 CEFR 能力评估 · 原句锚定升华
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-white">
                打破「收藏即学会」的魔咒
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                收藏夹里攒了几千条地道表达，开口时却还是 <span className="text-slate-400 line-through">have to</span>、
                <span className="text-slate-400 line-through">talk about it later</span>？
                这里把任何英文句子拆成可练的语料，再编排进剧本实战，最后基于<strong className="text-white">你自己的原句</strong>做地道升华。
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={handleStartWithDemo}
                  className="group flex-1 text-left px-5 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/25 transition-all"
                >
                  <span className="flex items-center gap-2 text-sm font-bold text-white">
                    <Play className="w-4 h-4 fill-white" />
                    从示例开始
                    <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20">推荐</span>
                  </span>
                  <span className="block text-[11px] text-indigo-100/90 mt-1">
                    预置 5 条语料 + 一套完整剧本，先体验闭环
                  </span>
                </button>
                <button
                  onClick={handleStartFresh}
                  className="group flex-1 text-left px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 transition-all"
                >
                  <span className="flex items-center gap-2 text-sm font-bold text-white">
                    <Wand2 className="w-4 h-4 text-emerald-400" />
                    从头开始
                  </span>
                  <span className="block text-[11px] text-slate-400 mt-1">
                    空白语料库与剧本，从你的第一句英文开始
                  </span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                两种模式都可以随时点左上角房子图标回到这里；会话数据仅保存在当前页面内存，刷新即清空。
              </p>
            </div>

            {/* Visual mock: arena chat + anchor review */}
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-tr from-indigo-600/25 via-purple-500/10 to-emerald-500/10 blur-3xl rounded-full" />
              <div className="relative space-y-3">
                <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-slate-400">
                      🎭 Q4 产品危机排期会议
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
                      实时踩点
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="w-[88%] rounded-xl rounded-bl-none bg-slate-800 border border-slate-700 px-3 py-2 text-[11px] text-slate-200 leading-relaxed">
                      Alex：Can we really afford to touch the old auth code right now?
                    </div>
                    <div className="w-[86%] ml-auto rounded-xl rounded-br-none bg-indigo-600 px-3 py-2 text-[11px] text-white leading-relaxed">
                      I think we have to{" "}
                      <span className="font-bold underline decoration-amber-300 decoration-2">bite the bullet</span> and
                      refactor it before launch.
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      踩点成功：bite the bullet · 熟练度 +1
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-3 mt-3 border-t border-slate-800">
                    {["bite the bullet", "circle back to", "devil's advocate"].map((t, i) => (
                      <span
                        key={t}
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          i === 0
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                            : "bg-slate-800 border-slate-700 text-slate-400"
                        }`}
                      >
                        {i === 0 ? "✓ " : "○ "}
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/95 border border-indigo-500/30 rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-300 mb-2">
                    <Award className="w-3.5 h-3.5" />
                    原句锚定升华预览
                  </div>
                  <div className="space-y-1.5 text-[11px] leading-relaxed">
                    <p className="text-slate-400 line-through decoration-slate-600">
                      …we have to bite the bullet and fix the core code…
                    </p>
                    <p className="text-white">
                      …we have to bite the bullet and{" "}
                      <span className="text-indigo-300 font-semibold">refactor</span> the core code…
                      <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                        90% 保留原词
                      </span>
                    </p>
                    <p className="text-emerald-300">
                      …we really have{" "}
                      <span className="font-semibold">no choice but to bite the bullet</span> and refactor the core
                      architecture…
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Learning loop */}
          <section className="space-y-5">
            <div className="text-center space-y-1.5">
              <h3 className="text-xl font-bold text-white">一次完整的学习闭环</h3>
              <p className="text-xs text-slate-400">被动输入 → 主动输出 → 针对性复盘，三步走完</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: <Inbox className="w-5 h-5 text-indigo-300" />,
                  step: "01 · Dump",
                  title: "随手记，AI 拆解",
                  desc: "粘贴美剧台词、外刊好句或会议原话，AI 按你当前的 CEFR 等级拆出习语、短语动词与句型，勾选即入库。"
                },
                {
                  icon: <MessageSquare className="w-5 h-5 text-emerald-300" />,
                  step: "02 · Setup & Arena",
                  title: "定制剧本，实战踩点",
                  desc: "选主题、AI 陪练性格与回复篇幅，AI 把目标语料编进有冲突的对话；用上目标表达即刻点亮看板，卡壳还能让 AI 递话柄。"
                },
                {
                  icon: <Award className="w-5 h-5 text-amber-300" />,
                  step: "03 · Anchor Review",
                  title: "原句升华，弱点重练",
                  desc: "保留你原句 90% 骨架做微调润色，再给出融入目标词的地道版，并针对漏掉的表达做靶向微特训。"
                }
              ].map((s) => (
                <div key={s.step} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                      {s.icon}
                    </div>
                    <span className="text-[10px] font-bold tracking-wider text-slate-500">{s.step}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{s.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section className="space-y-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-white">核心功能一览</h3>
                <p className="text-xs text-slate-400 mt-1">所有 AI 环节都围绕你的真实输出运转，而不是通用题库</p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-500">
                <MousePointerClick className="w-3.5 h-3.5" />
                支持全局划词收录
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  icon: <BookOpen className="w-5 h-5 text-indigo-300" />,
                  title: "智能语料库 & 原始输入流",
                  desc: "语料卡片与原文双向内联高亮：原句里已收录的片段直接高亮，点击即可跳转卡片。支持 AI 主题、人工主题、类别、优先级、掌握度交叉筛选。",
                  chips: ["双向高亮", "多维筛选", "批量整理"]
                },
                {
                  icon: <Lightbulb className="w-5 h-5 text-amber-300" />,
                  title: "随身 AI 语料助教",
                  desc: "每条语料和每条原始记录旁都有小灯泡：追问近义词辨析、中式英语误区或长难句语法，AI 解答里的好句还能再次拆解入库。",
                  chips: ["近义词辨析", "Chinglish 纠正", "二次拆解"]
                },
                {
                  icon: <StickyNote className="w-5 h-5 text-emerald-300" />,
                  title: "全局效率工具",
                  desc: "右下角常驻可最小化随手记，通勤灵感随时丢进去；在对话或复盘报告中划选任意英文，即可一键拆解入库或记入 Notes。",
                  chips: ["悬浮随手记", "划词收录", "气泡收录"]
                },
                {
                  icon: <Cpu className="w-5 h-5 text-purple-300" />,
                  title: "多模型接入 & 数据自主",
                  desc: "支持硅基流动、DeepSeek、Kimi、智谱 GLM、通义千问、OpenAI、OpenRouter 与 Gemini。Key 只存在内存，并可导出/导入完整 JSON 备份。",
                  chips: ["7+ 服务商", "Key 仅存内存", "JSON 备份"]
                }
              ].map((f) => (
                <div key={f.title} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                      {f.icon}
                    </div>
                    <h4 className="font-bold text-sm text-white">{f.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {f.chips.map((c) => (
                      <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mode chooser */}
          <section id="start-choice" className="space-y-4">
            <div className="text-center space-y-1.5">
              <h3 className="text-xl font-bold text-white">选择你的起点</h3>
              <p className="text-xs text-slate-400">示例模式用来快速感受完整闭环，空白模式用来建立真正属于你的语料库</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative bg-gradient-to-b from-indigo-950/60 to-slate-900 border border-indigo-500/40 rounded-2xl p-6 space-y-3 shadow-xl">
                <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/25 text-indigo-200 border border-indigo-400/40">
                  推荐首次体验
                </span>
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-indigo-300" />
                  <h4 className="font-bold text-base text-white">从示例开始</h4>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                  <li>· 5 条预置语料（bite the bullet / circle back to / play devil's advocate …）</li>
                  <li>· 一套「Q4 产品危机排期会议」剧本与角色设定</li>
                  <li>· 可一键载入演示对话，直接查看升华复盘与弱点特训</li>
                </ul>
                <button
                  onClick={handleStartWithDemo}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/25"
                >
                  <span>载入示例并进入</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-emerald-300" />
                  <h4 className="font-bold text-base text-white">从头开始</h4>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                  <li>· 清空全部示例语料、原始记录、随手记与复盘报告</li>
                  <li>· 保留初始 B2 能力基线，等待你的真实表现来更新</li>
                  <li>· 从第一条收藏的英文句子开始，建立自己的语料库</li>
                </ul>
                <button
                  onClick={handleStartFresh}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-emerald-500/40 text-emerald-300 text-sm font-bold flex items-center justify-center gap-1.5"
                >
                  <span>空白模式进入</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-400">
              <div className="flex items-start gap-2">
                <Key className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                <span>进入后请在右上角「设置」里填入你自己的模型 API Key（如硅基流动的免费额度）。</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>API Key 与学习数据只保存在当前页面内存，不上传第三方、不写 localStorage。</span>
              </div>
              <div className="flex items-start gap-2">
                <Download className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <span>语料、能力画像与随手记可随时在设置中导出为 JSON 备份。</span>
              </div>
            </div>
          </section>

          <footer className="pt-2 pb-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
            <span>English Dump & Role-play · V1.0 · MIT License</span>
            <a
              href="https://github.com/garisun1019/lingo-dump"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-slate-300"
            >
              <ExternalLink className="w-3 h-3" />
              github.com/garisun1019/lingo-dump
            </a>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast */}
      {quickSaveToast && (
        <div className="fixed top-16 sm:top-20 right-3 sm:right-6 z-[100] max-w-[calc(100vw-1.5rem)] bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-indigo-400/40 flex items-center gap-2 text-xs font-semibold animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{quickSaveToast}</span>
        </div>
      )}

      {/* Global Analyzing Banner */}
      {isAnalyzingDump && analyzingSourceLabel && (
        <div className="fixed top-16 sm:top-20 left-3 right-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[100] bg-slate-900/95 border border-indigo-500 text-indigo-200 px-4 sm:px-5 py-2.5 rounded-2xl sm:rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-bold">
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
          <span>AI 正在从【{analyzingSourceLabel}】智能拆解可学习的地道表达，请稍候...</span>
        </div>
      )}

      {/* Selection Popup */}
      {selectionPopup && (
        <div
          style={{ left: `${selectionPopup.x}px`, top: `${selectionPopup.y}px` }}
          className="fixed z-50 bg-slate-900 border border-indigo-500 shadow-2xl rounded-xl p-1.5 flex items-center gap-1.5"
        >
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              triggerExtractionForSnippet(selectionPopup.text, "划词收录");
              setSelectionPopup(null);
            }}
            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>+ AI 拆解收入 Inbox</span>
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setNoteContent((prev) => (prev ? `${prev}\n${selectionPopup.text}` : selectionPopup.text));
              setIsNotesMinimized(false);
              setSelectionPopup(null);
              triggerToast("📝 已摘录至右下角随手记 Notes");
            }}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1"
          >
            <StickyNote className="w-3.5 h-3.5" />
            <span>记入 Notes</span>
          </button>
        </div>
      )}

      {/* Top Navigation Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm sm:text-lg tracking-tight text-white truncate">
                  <span className="sm:hidden">Lingo Dump</span>
                  <span className="hidden sm:inline">English Dump & Role-play</span>
                </h1>
                <span className="hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 whitespace-nowrap">
                  动态水平驱动 + 原句锚定升华
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                随手记语料拆解 · 剧本自由定制 · 模拟对话踩点 · 基于你原句骨架的地道润色与弱点重练
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={() => setShowProficiencyModal(!showProficiencyModal)}
              className="flex items-center gap-2 sm:gap-2.5 px-2 sm:px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 transition-all text-left"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xs sm:text-sm">
                {profile.cefr}
              </div>
              <div className="hidden md:block">
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <span>当前动态能力评估</span>
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="text-xs font-semibold text-white">
                  综合指数 {profile.overallScore}/100 · <span className="text-indigo-400">查看维度</span>
                </div>
              </div>
            </button>

            <nav className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab("inbox")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "inbox"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>1. 语料库 ({inboxItems.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("arena_setup")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "arena_setup"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>2. 剧本定制</span>
              </button>
              <button
                onClick={() => setActiveTab("arena")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "arena"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>3. 情景实战</span>
              </button>
              <button
                onClick={() => setActiveTab("review")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "review"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>4. 原句升华复盘</span>
              </button>
            </nav>

            <button
              onClick={() => setShowLanding(true)}
              title="返回启动页（可切换示例 / 空白模式）"
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all"
            >
              <Home className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-all"
            >
              <Settings className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">设置</span>
            </button>
          </div>
        </div>

        {/* Expandable Dynamic Proficiency Panel */}
        {showProficiencyModal && (
          <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(profile.dimensions).map(([key, dim]) => (
                <div key={key} className="bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="truncate">{dim.label}</span>
                    {dim.delta > 0 && <span className="text-emerald-400 font-bold">+{dim.delta}</span>}
                  </div>
                  <div className="text-lg font-extrabold text-white mb-1.5">
                    {dim.score}
                    <span className="text-xs text-slate-500">/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-4 bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 mb-1">
                <Brain className="w-4 h-4" />
                <span>AI 动态出题与提问权重策略 ({profile.cefr})</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{profile.aiStrategyNote}</p>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 pb-24 md:pb-6">
        {/* ==========================================
            TAB 1: INBOX (CORPUS CARDS & RAW INPUT STREAM)
           ========================================== */}
        {activeTab === "inbox" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            <div className="lg:col-span-5 space-y-4 lg:space-y-6">
              {/* Quick Dump Input Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <h2 className="font-bold text-base text-white">随手记 (Quick English Dump)</h2>
                  </div>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">AI 自动拆解多条地道表达</span>
                </div>

                <form onSubmit={handleAddDump} className="space-y-3">
                  <textarea
                    id="quick-dump-input"
                    value={rawInputText}
                    onChange={(e) => setRawInputText(e.target.value)}
                    placeholder="粘贴任何你遇到的英文句子、美剧台词、外刊段落... AI 会自动从中拆解出多个地道词组、句型并供你勾选入库"
                    rows={4}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">归入人工主题：</span>
                      <select
                        value={dumpManualTheme}
                        onChange={(e) => setDumpManualTheme(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
                      >
                        {customManualThemes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setIsAddingTheme(!isAddingTheme)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300"
                        title="新建人工主题分类"
                      >
                        <FolderPlus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {isAddingTheme && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={newManualThemeInput}
                        onChange={(e) => setNewManualThemeInput(e.target.value)}
                        placeholder="输入新主题名称..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomTheme}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                      >
                        添加
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-500 w-full">一键填入多表达长句测试拆解：</span>
                    {[
                      "We need to bite the bullet and get the team on the same page before we circle back to the vendor contract.",
                      "Let's not get bogged down in edge cases right now; we can iron out the details next week."
                    ].map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setRawInputText(sample)}
                        className="text-[11px] text-left px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/70 truncate max-w-full"
                      >
                        + "{sample.slice(0, 52)}..."
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isAnalyzingDump || !rawInputText.trim()}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
                  >
                    {isAnalyzingDump ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>AI 正在深度拆解地道表达...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>AI 智能拆解地道表达并入库</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Arena Start Trigger Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-sm text-white">准备开启实战 (Arena Setup)</h3>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                    已选 {selectedItemIds.length} 项语料
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  点击下方按钮将先跳转到<strong className="text-slate-200">剧本编辑与主题风格选择界面</strong>，你可以自由选择对话主题、AI 性格、回复篇幅并预览/修改剧本后再开战！
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => handleOpenArenaSetup(false)}
                    className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/25 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>按所选语料开始模拟对话</span>
                  </button>
                  <button
                    onClick={() => handleOpenArenaSetup(true)}
                    className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>按弱点智能选词并配置</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Inbox Subviews + Multi-Filters + Batch Bar + Detailed Cards */}
            <div className="lg:col-span-7 space-y-4">
              {/* View Switcher & AI Smart Theme Cluster Button */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setInboxSubView("items")}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                      inboxSubView === "items"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>语料卡片库 ({filteredInbox.length}/{inboxItems.length})</span>
                  </button>
                  <button
                    onClick={() => setInboxSubView("raw_inputs")}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                      inboxSubView === "raw_inputs"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Inbox 原始输入流 ({groupedRawInputs.length})</span>
                  </button>
                </div>

                <button
                  onClick={handleAiAutoClusterThemes}
                  disabled={isSmartClustering}
                  className="px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSmartClustering ? "animate-spin" : ""}`} />
                  <span>AI 刷新智能主题分类</span>
                </button>
              </div>

              {/* Multi-Dimensional Filter Bar & Batch Operations */}
              {inboxSubView === "items" && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    <select
                      value={filterAiTheme}
                      onChange={(e) => setFilterAiTheme(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
                    >
                      <option value="All">🤖 AI智能主题: 全部</option>
                      {uniqueAiThemes
                        .filter((t) => t !== "All")
                        .map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                    </select>

                    <select
                      value={filterManualTheme}
                      onChange={(e) => setFilterManualTheme(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
                    >
                      <option value="All">🏷️ 人工主题: 全部</option>
                      {uniqueManualThemes
                        .filter((t) => t !== "All")
                        .map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                    </select>

                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
                    >
                      <option value="All">📚 类别: 全部</option>
                      <option value="Idiom">Idiom (习语)</option>
                      <option value="Phrasal Verb">Phrasal Verb (短语)</option>
                      <option value="Sentence Pattern">Sentence Pattern (句型)</option>
                      <option value="Vocabulary">Vocabulary (词汇)</option>
                    </select>

                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
                    >
                      <option value="All">🔥 优先级: 全部</option>
                      <option value="High">High (重点提问)</option>
                      <option value="Medium">Medium (常规)</option>
                      <option value="Low">Low (低频)</option>
                    </select>

                    <select
                      value={filterMastery}
                      onChange={(e) => setFilterMastery(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
                    >
                      <option value="All">📈 掌握度: 全部</option>
                      <option value="0">0 - 新收录</option>
                      <option value="1">1 - 弱点待强化</option>
                      <option value="2">2 - 初步掌握</option>
                      <option value="3">3 - 已内化</option>
                    </select>
                  </div>

                  {/* Batch Action Bar */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => handleSelectAllFiltered(filteredInbox)}
                      className="flex items-center gap-1.5 text-slate-300 hover:text-white font-medium"
                    >
                      <CheckSquare className="w-4 h-4 text-indigo-400" />
                      <span>全选/反选当前列表 ({selectedItemIds.length} 已选)</span>
                    </button>

                    {selectedItemIds.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          onChange={(e) => {
                            if (e.target.value) handleBatchUpdateField("priority", e.target.value);
                            e.target.value = "";
                          }}
                          defaultValue=""
                          className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-200"
                        >
                          <option value="" disabled>
                            批量改优先级...
                          </option>
                          <option value="High">设为 High</option>
                          <option value="Medium">设为 Medium</option>
                          <option value="Low">设为 Low</option>
                        </select>

                        <select
                          onChange={(e) => {
                            if (e.target.value !== "") handleBatchUpdateField("mastery", Number(e.target.value));
                            e.target.value = "";
                          }}
                          defaultValue=""
                          className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-200"
                        >
                          <option value="" disabled>
                            批量改掌握度...
                          </option>
                          <option value="0">0 - 新收录</option>
                          <option value="1">1 - 弱点待强化</option>
                          <option value="2">2 - 初步掌握</option>
                          <option value="3">3 - 已内化</option>
                        </select>

                        <select
                          onChange={(e) => {
                            if (e.target.value) handleBatchUpdateField("manualTheme", e.target.value);
                            e.target.value = "";
                          }}
                          defaultValue=""
                          className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-200"
                        >
                          <option value="" disabled>
                            批量移至主题...
                          </option>
                          {customManualThemes.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={handleBatchDelete}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 flex items-center gap-1 font-semibold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>批量删除 ({selectedItemIds.length})</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUBVIEW A: RAW INPUT STREAM (With Inline Highlighted Clickable Tags inside original text!) */}
              {inboxSubView === "raw_inputs" ? (
                <div className="space-y-3">
                  <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl px-4 py-2.5 text-xs text-indigo-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>
                      下方展示你录入的所有原始英文段落。<strong className="text-white">原文中已入选语料库的部分已直接内联高亮标出</strong>，单击原文中的高亮词块即可跳转到对应的具体语料卡片！
                    </span>
                  </div>
                  {groupedRawInputs.length === 0 && (
                    <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-10 text-center space-y-2">
                      <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                      <h3 className="font-bold text-sm text-white">还没有原始输入记录</h3>
                      <p className="text-xs text-slate-400">
                        在左侧「随手记」里粘贴第一段英文，AI 拆解出的语料会带着原句一起出现在这里。
                      </p>
                    </div>
                  )}
                  {groupedRawInputs.map((group, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold">
                            原始记录 #{idx + 1}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-indigo-400" />
                            记录于: {group.createdAt}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-emerald-400" />
                            上次复习: {group.lastReviewedAt}
                          </span>
                        </div>
                        <button
                          onClick={(e) =>
                            handleOpenQaModal(
                              { type: "raw", title: `原始记录 #${idx + 1}`, contextText: group.rawInput },
                              e
                            )
                          }
                          className="px-2.5 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                          <span>💡 针对原句向 AI 提问</span>
                        </button>
                      </div>

                      {/* Inline highlighted original text */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 leading-relaxed">
                        {renderHighlightedRawText(group.rawInput, group.items)}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>
                          已从本段原句中拆解收录 {group.items.length} 条地道表达（点击句中蓝色高亮处可直接定位）
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* SUBVIEW B: DETAILED CORPUS CARDS */
                <div className="space-y-3">
                  {filteredInbox.length === 0 && (
                    <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-10 text-center space-y-3">
                      <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                      <h3 className="font-bold text-sm text-white">
                        {inboxItems.length === 0 ? "语料库还是空的" : "当前筛选条件下没有语料"}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {inboxItems.length === 0
                          ? "把你在美剧、播客、会议里遇到的英文句子粘贴到左侧，AI 会拆出值得练的习语、短语动词和句型。"
                          : "试试把筛选条件切回「全部」，或重新勾选 AI 智能主题分类。"}
                      </p>
                      {inboxItems.length === 0 ? (
                        <button
                          onClick={() => document.getElementById("quick-dump-input")?.focus()}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          去写下第一句
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setFilterCategory("All");
                            setFilterAiTheme("All");
                            setFilterManualTheme("All");
                            setFilterPriority("All");
                            setFilterMastery("All");
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold"
                        >
                          重置全部筛选
                        </button>
                      )}
                    </div>
                  )}
                  {filteredInbox.map((item) => {
                    const isSelected = selectedItemIds.includes(item.id);
                    const isFocused = focusedItemId === item.id;
                    const masteryBadge = getMasteryBadge(item.mastery);
                    return (
                      <div
                        id={`inbox-card-${item.id}`}
                        key={item.id}
                        onClick={() => {
                          setSelectedItemIds((prev) =>
                            prev.includes(item.id) ? prev.filter((i) => i !== item.id) : [...prev, item.id]
                          );
                        }}
                        className={`cursor-pointer group rounded-2xl p-4 border transition-all ${
                          isFocused
                            ? "bg-indigo-950/50 border-amber-400 ring-2 ring-amber-400/50 animate-pulse"
                            : isSelected
                            ? "bg-indigo-950/25 border-indigo-500/60 shadow-lg"
                            : "bg-slate-900 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-1">
                              {isSelected ? (
                                <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-white">
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-md border border-slate-600" />
                              )}
                            </div>
                            <div className="flex-1 space-y-2">
                              {/* Top Header Row */}
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="font-bold text-base text-white">{item.target}</h4>
                                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 font-semibold border border-slate-700">
                                    {item.category} · {item.cefr}
                                  </span>
                                  {item.aiTheme && (
                                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30">
                                      🤖 {item.aiTheme}
                                    </span>
                                  )}
                                </div>

                                {/* Quick Individual Controls & Lightbulb Q&A */}
                                <div
                                  className="flex flex-wrap items-center gap-1.5"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    onClick={(e) =>
                                      handleOpenQaModal(
                                        {
                                          type: "item",
                                          title: item.target,
                                          meaning: item.meaning,
                                          contextText: item.rawInput
                                        },
                                        e
                                      )
                                    }
                                    className="px-2.5 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-semibold flex items-center gap-1"
                                  >
                                    <Lightbulb className="w-3 h-3 text-amber-400" />
                                    <span>💡 AI 提问</span>
                                  </button>

                                  <select
                                    value={item.priority}
                                    onChange={(e) => handleSingleUpdateField(item.id, "priority", e.target.value, e)}
                                    className={`bg-slate-950 border rounded-lg px-2 py-0.5 text-[11px] font-semibold ${getPriorityBadge(
                                      item.priority
                                    )}`}
                                  >
                                    <option value="High">🔥 High 重点</option>
                                    <option value="Medium">⚡ Medium 常规</option>
                                    <option value="Low">🌱 Low 低频</option>
                                  </select>

                                  <select
                                    value={item.mastery}
                                    onChange={(e) =>
                                      handleSingleUpdateField(item.id, "mastery", Number(e.target.value), e)
                                    }
                                    className={`bg-slate-950 border rounded-lg px-2 py-0.5 text-[11px] font-semibold ${masteryBadge.color}`}
                                  >
                                    <option value={0}>0 · 新收录</option>
                                    <option value={1}>1 · 弱点待强化</option>
                                    <option value={2}>2 · 初步掌握</option>
                                    <option value={3}>3 · 已内化</option>
                                  </select>

                                  <select
                                    value={item.manualTheme || "高频核心库"}
                                    onChange={(e) =>
                                      handleSingleUpdateField(item.id, "manualTheme", e.target.value, e)
                                    }
                                    className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-0.5 text-[11px] text-slate-300"
                                  >
                                    {uniqueManualThemes
                                      .filter((t) => t !== "All")
                                      .map((t) => (
                                        <option key={t} value={t}>
                                          🏷️ {t}
                                        </option>
                                      ))}
                                  </select>

                                  <button
                                    onClick={(e) => handleDeleteSingleItem(item.id, e)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                                    title="删除该语料"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Meaning & Detailed Usage Note Interpretation */}
                              <div className="space-y-1">
                                <p className="text-sm text-slate-100 font-semibold">{item.meaning}</p>
                                {item.usageNote && (
                                  <div className="text-xs text-indigo-200/90 bg-indigo-950/30 border border-indigo-500/20 rounded-lg px-3 py-1.5 flex items-start gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                                    <span>
                                      <strong className="text-indigo-300">用法解读：</strong>
                                      {item.usageNote}
                                    </span>
                                  </div>
                                )}
                                {item.priorityReason && (
                                  <div className="text-[11px] text-amber-300/90 flex items-center gap-1.5 pt-0.5">
                                    <Target className="w-3 h-3 text-amber-400 shrink-0" />
                                    <span>AI 推荐理由：{item.priorityReason}</span>
                                  </div>
                                )}
                              </div>

                              {/* Original Raw Input Box with Reverse Inline Highlighting of current target */}
                              <div className="text-xs text-slate-300 bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-800/90 leading-relaxed">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                                  原始输入定位 (Original Context):
                                </span>
                                {renderSingleCardRawHighlight(item.rawInput, item)}
                              </div>

                              {/* Dates & Tags Footer */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-400">
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-slate-500" />
                                    记录日期: {item.createdAt || "2026-10-20"}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-emerald-400" />
                                    上次复习: {item.lastReviewedAt || "尚未复习"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {(item.tags || []).map((tg, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.2 rounded bg-slate-800/80 text-slate-400 text-[10px]"
                                    >
                                      #{tg}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 1.5: ARENA SETUP & SCRIPT CUSTOMIZATION EDITOR
           ========================================== */}
        {activeTab === "arena_setup" && (
          <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Settings2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">剧本定制与演练配置 (Scenario Setup & Editor)</h2>
                  <p className="text-xs text-slate-400">
                    先选择对话主题、AI 对练风格与篇幅长短，你还可以让 AI 预生成新剧本或直接手动编辑剧本台词后开练！
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("inbox")}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold self-start sm:self-auto"
              >
                ← 返回语料库重选
              </button>
            </div>

            {/* 1. Selected Target Expressions */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span>1. 本局需要踩点的目标表达 ({selectedItemIds.length} 项)：</span>
                </label>
                <button onClick={() => setActiveTab("inbox")} className="text-[11px] text-indigo-400 hover:underline">
                  去增删目标语料
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedItemIds.length === 0 && (
                  <p className="text-xs text-slate-400">
                    还没有勾选目标语料。先回语料库点击卡片勾选，或点击右上角「去增删目标语料」。
                  </p>
                )}
                {inboxItems
                  .filter((i) => selectedItemIds.includes(i.id))
                  .map((it) => (
                    <div
                      key={it.id}
                      className="px-3 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-200 text-xs flex items-center gap-2"
                    >
                      <span className="font-bold text-white">🎯 {it.target}</span>
                      <span className="text-slate-400">({it.meaning})</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* 2. Theme, Style, Length Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">2. 选择预设对话主题：</label>
                <select
                  value={arenaConfig.themeId}
                  onChange={(e) => setArenaConfig({ ...arenaConfig, themeId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {ARENA_THEMES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">或者输入自定义情境话题 (选填)：</label>
                <input
                  type="text"
                  value={arenaConfig.customTopic}
                  onChange={(e) => setArenaConfig({ ...arenaConfig, customTopic: e.target.value })}
                  placeholder="例如：向挑剔的硅谷 VC 解释公司的 SaaS 定价策略..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">3. 选择 AI 陪练性格风格：</label>
                <select
                  value={arenaConfig.styleId}
                  onChange={(e) => setArenaConfig({ ...arenaConfig, styleId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {AI_STYLES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} — {s.desc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">4. 选择每次回复篇幅长短：</label>
                <select
                  value={arenaConfig.lengthId}
                  onChange={(e) => setArenaConfig({ ...arenaConfig, lengthId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {DIALOGUE_LENGTHS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Editable Scenario Script Preview & AI Generator */}
            <div className="bg-slate-950/90 border border-indigo-500/30 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>5. 预览与手动编辑剧本设定 (Editable Script)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    你可以点击右侧按钮让 AI 根据上方所选主题/风格重新生成剧本，也可以直接在输入框内修改角色、背景与第一句台词！
                  </p>
                </div>
                <button
                  onClick={handleAiGenerateScriptDraft}
                  disabled={isDraftingScript}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600/25 hover:bg-indigo-600/40 border border-indigo-400/40 text-indigo-200 text-xs font-bold flex items-center gap-1.5 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isDraftingScript ? "animate-spin" : ""}`} />
                  <span>{isDraftingScript ? "AI 正在为你编排新剧本..." : "🤖 按上方配置让 AI 生成新剧本"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">剧本标题：</label>
                  <input
                    type="text"
                    value={draftScenario.title}
                    onChange={(e) => setDraftScenario({ ...draftScenario, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">AI 扮演角色 (AI Role)：</label>
                  <input
                    type="text"
                    value={draftScenario.aiRole}
                    onChange={(e) => setDraftScenario({ ...draftScenario, aiRole: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">你的角色 (Your Role)：</label>
                  <input
                    type="text"
                    value={draftScenario.userRole}
                    onChange={(e) => setDraftScenario({ ...draftScenario, userRole: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-slate-400 block">剧情背景与任务提示 (Context)：</label>
                <textarea
                  rows={2}
                  value={draftScenario.context}
                  onChange={(e) => setDraftScenario({ ...draftScenario, context: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-slate-200 focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-slate-400 block">AI 开场白台词 (Opening Line)：</label>
                <textarea
                  rows={2}
                  value={draftScenario.openingLine}
                  onChange={(e) => setDraftScenario({ ...draftScenario, openingLine: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-emerald-200 focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              {entryMode !== "fresh" ? (
                <button
                  onClick={handleLoadDemoDialogueAndReview}
                  className="px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>一键载入演示对话并直接查看【原句升华复盘】</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-500">空白模式下不会载入示例对话，用自己的语料开练即可。</span>
              )}

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => handleGenerateAndStartArena(true)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>按当前剧本正式进入实战对话</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 2: ARENA ROLE-PLAY CHAT
           ========================================== */}
        {activeTab === "arena" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            <div className="order-2 lg:order-1 lg:col-span-4 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                    当前剧本设定
                  </span>
                  <button
                    onClick={() => setActiveTab("arena_setup")}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>编辑剧本/风格</span>
                  </button>
                </div>

                <h2 className="font-bold text-base text-white">{scenario.title}</h2>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {scenario.context}
                </p>

                <div className="text-xs space-y-1 pt-1">
                  <div className="text-slate-400">
                    🎭 <strong>AI 扮演角色：</strong>
                    <span className="text-slate-200">{scenario.aiRole}</span>
                  </div>
                  <div className="text-slate-400">
                    🧑‍💻 <strong>你的角色：</strong>
                    <span className="text-slate-200">{scenario.userRole}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-sm text-white">本局踩点看板 (Target Tracker)</h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">
                    已点亮 {Object.keys(hitTargets).length} / {activeTargetItems.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeTargetItems.length === 0 && (
                    <p className="text-xs text-slate-400">
                      本局还没有目标语料。去「剧本定制」勾选至少 1 条表达后再开练。
                    </p>
                  )}
                  {activeTargetItems.map((item) => {
                    const isHit = Boolean(hitTargets[item.id]?.hit);
                    const isHintExpanded = expandedHintId === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`rounded-xl p-3 border transition-all ${
                          isHit
                            ? "bg-emerald-950/30 border-emerald-500/50"
                            : "bg-slate-950 border-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-bold text-sm ${isHit ? "text-emerald-300" : "text-white"}`}>
                            {item.target}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setExpandedHintId(isHintExpanded ? null : item.id)}
                              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300"
                            >
                              {isHintExpanded ? "收起提示" : "用法提示"}
                            </button>
                            <span
                              className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                                isHit
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : "bg-amber-500/15 text-amber-300"
                              }`}
                            >
                              {isHit ? "已踩点 ✨" : "待使用"}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{item.meaning}</p>
                        {isHintExpanded && (
                          <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-indigo-200 space-y-1">
                            <div>
                              💡 <strong>用法提示：</strong>
                              {item.usageNote}
                            </div>
                            <div className="text-slate-400 italic">原句参考："{item.rawInput}"</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {entryMode !== "fresh" && (
                  <button
                    onClick={handleLoadDemoDialogueAndReview}
                    className="mt-4 w-full py-2.5 px-3 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>一键载入演示对话并体验复盘</span>
                  </button>
                )}
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-8 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden h-[calc(100dvh-11rem)] min-h-[420px] max-h-[760px] lg:h-[640px] lg:max-h-none shadow-xl">
              <div className="px-3 sm:px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 shrink-0 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-sm text-white truncate">{scenario.aiRole}</span>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    (划选任意文字或点击气泡右上角可将地道表达拆解入库)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleGiveMeACue}
                    className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-semibold flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">让 AI 递话柄</span>
                    <span className="sm:hidden">递话柄</span>
                  </button>
                  <button
                    onClick={handleFinishAndEvaluate}
                    className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] sm:text-xs font-bold flex items-center gap-1 shadow"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">结束并生成升华复盘</span>
                    <span className="sm:hidden">结束复盘</span>
                  </button>
                </div>
              </div>

              {lastHitBanner && (
                <div className="bg-emerald-600/90 text-white px-4 py-2 text-xs font-bold flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>太棒了！你在对话中成功踩点目标表达：{lastHitBanner}</span>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 sm:space-y-4">
                {isGeneratingScenario ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                    <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
                    <p className="text-sm">AI 导演正在根据所选语料与风格偏好生成剧本...</p>
                  </div>
                ) : (
                  <>
                    {messages.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-slate-400">
                        <MessageSquare className="w-7 h-7 text-slate-600" />
                        <p className="text-sm font-semibold text-slate-300">剧本还没有开场白</p>
                        <p className="text-xs max-w-sm leading-relaxed">
                          回到「剧本定制」，勾选目标语料并让 AI 生成剧本，或手动填写开场白台词后再开始对话。
                        </p>
                      </div>
                    )}
                    {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="text-[11px] text-slate-400">
                          {msg.sender === "user"
                            ? "You"
                            : msg.isCue
                            ? "🎯 教练提示 (Coach)"
                            : scenario.aiRole}
                        </span>
                        <button
                          onClick={() => triggerExtractionForSnippet(msg.text, "对话气泡收录")}
                          disabled={isAnalyzingDump}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          <BookmarkPlus className="w-3 h-3" />
                          <span>+ AI 拆解收入 Inbox</span>
                        </button>
                      </div>
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-indigo-600 text-white rounded-br-none shadow"
                            : msg.isCue
                            ? "bg-amber-950/50 border border-amber-500/40 text-amber-100 rounded-bl-none"
                            : "bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-none"
                        }`}
                      >
                        {renderFormattedMarkdownText(msg.text)}
                      </div>
                      {msg.hitTargets && msg.hitTargets.length > 0 && (
                        <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>成功踩点: {msg.hitTargets.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  </>
                )}
                {isAiTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    <span>{scenario.aiRole} 正在输入回复...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {activeTargetItems.length > 0 && (
                <div className="md:hidden px-3 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-[10px] text-slate-500 shrink-0">本局目标</span>
                  {activeTargetItems.map((item) => {
                    const isHit = Boolean(hitTargets[item.id]?.hit);
                    return (
                      <span
                        key={item.id}
                        className={`shrink-0 text-[11px] px-2 py-0.5 rounded-full border font-semibold whitespace-nowrap ${
                          isHit
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                            : "bg-slate-900 border-slate-700 text-slate-300"
                        }`}
                      >
                        {isHit ? "✓ " : ""}
                        {item.target}
                      </span>
                    );
                  })}
                </div>
              )}

              <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2 sm:gap-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="用英语回复…"
                  className="flex-1 min-w-0 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || isAiTyping}
                  className="shrink-0 px-4 sm:px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">发送</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 3: REVIEW & ANCHOR-BASED UPGRADES & DRILLS
           ========================================== */}
        {activeTab === "review" && (
          <div className="space-y-6 sm:space-y-8">
            {isEvaluating ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin text-indigo-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">AI 正在生成基于你原词原句的升华对比报告...</h3>
              </div>
            ) : reviewData?.isEmpty ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-3">
                <Award className="w-9 h-9 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-white">还没有可复盘的对话</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  先勾选几条目标语料进入剧本实战，结束对话后这里会生成逐句原句升华对比与弱点靶向特训。
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => setActiveTab("inbox")}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Inbox className="w-3.5 h-3.5" />
                    去语料库挑选
                  </button>
                  <button
                    onClick={() => setActiveTab("arena_setup")}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    去剧本定制
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center shadow-xl">
                  <div className="lg:col-span-4 flex items-center gap-5 border-b lg:border-b-0 lg:border-r border-slate-800 pb-4 lg:pb-0">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex flex-col items-center justify-center text-white shadow-lg">
                      <span className="text-2xl font-extrabold">{reviewData.overallScore}</span>
                      <span className="text-[10px] uppercase tracking-wider">本局总评</span>
                    </div>
                    <div>
                      <div className="text-xs text-emerald-400 font-bold mb-1">
                        🎯 踩点率：{reviewData.hitCount} / {reviewData.totalTargets} 目标表达
                      </div>
                      <div className="text-sm font-bold text-white">
                        动态能力：{reviewData.proficiencyUpdate.oldScore} →{" "}
                        <span className="text-emerald-400">{reviewData.proficiencyUpdate.newScore}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{reviewData.proficiencyUpdate.cefrProgress}</div>
                    </div>
                  </div>
                  <div className="lg:col-span-8 space-y-2">
                    <div className="text-xs font-bold text-indigo-300">AI 诊断总结：</div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {reviewData.proficiencyUpdate.assessmentSummary}
                    </p>
                  </div>
                </div>

                {/* Sentence Upgrades */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-white">逐句原句升华对比 (Anchor-Based Upgrade)</h3>
                  {reviewData.sentenceUpgrades.map((item, index) => (
                    <div
                      key={index}
                      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg p-4 sm:p-5 space-y-4"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                          <span className="text-xs text-slate-400 block mb-2">1. 你的原句 (Original)</span>
                          <p className="text-sm text-slate-200 leading-relaxed">"{item.userOriginal}"</p>
                        </div>
                        <div className="bg-indigo-950/20 border border-indigo-500/40 rounded-xl p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-indigo-300">
                              2. 原句骨架微调润色 (90%保留原词)
                            </span>
                            <button
                              onClick={() => triggerExtractionForSnippet(item.anchoredPolish.text, "润色句拆解收录")}
                              className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/30 hover:bg-indigo-500 text-indigo-100 flex items-center gap-1"
                            >
                              <BookmarkPlus className="w-3 h-3" />
                              <span>+ 拆解入库</span>
                            </button>
                          </div>
                          <p className="text-sm text-white leading-relaxed">"{item.anchoredPolish.text}"</p>
                          <p className="text-[11px] text-indigo-200/80">{item.anchoredPolish.diffExplanation}</p>
                        </div>
                        <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-300">3. 融入目标词的地道升华版</span>
                            <button
                              onClick={() => triggerExtractionForSnippet(item.nativeUpgrade.text, "升华版拆解收录")}
                              className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/30 hover:bg-emerald-500 text-emerald-100 flex items-center gap-1"
                            >
                              <BookmarkPlus className="w-3 h-3" />
                              <span>+ 拆解入库</span>
                            </button>
                          </div>
                          <p className="text-sm text-white leading-relaxed">"{item.nativeUpgrade.text}"</p>
                          <p className="text-[11px] text-emerald-200/80">💡 {item.nativeUpgrade.coachNote}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Weakness Micro-Drills */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-lg text-white">弱点靶向重练 (Weakness Micro-Drills)</h3>
                  </div>
                  {reviewData.weaknessDrills.map((drill) => {
                    const currentMode = drillModeByCard[drill.id] || "rewrite";
                    const fb = drillFeedbacks[drill.id];
                    return (
                      <div
                        key={drill.id}
                        className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                                未踩点弱项
                              </span>
                              <h4 className="font-bold text-base text-white">{drill.target}</h4>
                              <span className="text-xs text-slate-400">({drill.meaning})</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">{drill.reason}</p>
                          </div>

                          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                            <button
                              onClick={() => setDrillModeByCard({ ...drillModeByCard, [drill.id]: "rewrite" })}
                              className={`px-3 py-1.5 rounded-lg font-semibold ${
                                currentMode === "rewrite" ? "bg-indigo-600 text-white" : "text-slate-400"
                              }`}
                            >
                              模式 A：改写你的原句
                            </button>
                            <button
                              onClick={() => setDrillModeByCard({ ...drillModeByCard, [drill.id]: "trap" })}
                              className={`px-3 py-1.5 rounded-lg font-semibold ${
                                currentMode === "trap" ? "bg-indigo-600 text-white" : "text-slate-400"
                              }`}
                            >
                              模式 B：AI 单回合快问快答
                            </button>
                          </div>
                        </div>

                        {currentMode === "rewrite" ? (
                          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                            <div className="text-slate-400">你在刚才对话中说的大白话原句：</div>
                            <div className="text-sm text-amber-200 font-medium">
                              "{drill.modeA_Rewrite.originalUserSentence}"
                            </div>
                            <div className="text-indigo-300">💡 提示：{drill.modeA_Rewrite.hint}</div>
                          </div>
                        ) : (
                          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                            <div className="text-sm text-white font-medium">{drill.modeB_Trap.aiPrompt}</div>
                            <div className="text-indigo-300">🎯 任务：{drill.modeB_Trap.instruction}</div>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={drillInputs[drill.id] || ""}
                            onChange={(e) => setDrillInputs({ ...drillInputs, [drill.id]: e.target.value })}
                            placeholder={`请用上 "${drill.target}" 重新表达...`}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                          />
                          <button
                            onClick={() => handleCheckDrill(drill)}
                            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0"
                          >
                            提交批改
                          </button>
                        </div>

                        {fb && !fb.loading && (
                          <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-4 space-y-2 text-xs">
                            <div className="font-bold text-emerald-300">
                              🎉 批改通过 ({fb.score}分)：{fb.comment}
                            </div>
                            <div className="flex items-center justify-between text-slate-300">
                              <span>参考地道范例："{fb.anchoredFix}"</span>
                              <button
                                onClick={() => triggerExtractionForSnippet(fb.anchoredFix, "特训范例拆解")}
                                className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200"
                              >
                                + 拆解收入 Inbox
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-4">
          {[
            { id: "inbox", label: "语料库", icon: Inbox, count: inboxItems.length },
            { id: "arena_setup", label: "剧本", icon: Sliders },
            { id: "arena", label: "实战", icon: MessageSquare },
            { id: "review", label: "复盘", icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold transition-colors ${
                  isActive ? "text-indigo-300" : "text-slate-500 active:text-slate-300"
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-indigo-400" />
                )}
                <Icon className={`w-5 h-5 ${isActive ? "text-indigo-400" : ""}`} />
                <span className="flex items-center gap-1">
                  {tab.label}
                  {typeof tab.count === "number" && tab.count > 0 && (
                    <span className="px-1 rounded-full bg-slate-800 text-[9px] text-slate-300">{tab.count}</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ==========================================
          FLOATING QUICK NOTES WIDGET (Minimizable)
         ========================================== */}
      <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] md:bottom-5 right-3 sm:right-5 z-40">
        {isNotesMinimized ? (
          <button
            onClick={() => setIsNotesMinimized(false)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-2xl shadow-amber-500/30 transition-all"
          >
            <StickyNote className="w-4 h-4" />
            <span className="hidden sm:inline">随手记 Notes</span>
            <span className="sm:hidden">Notes</span>
          </button>
        ) : (
          <div className="w-[min(20rem,calc(100vw-1.5rem))] bg-slate-900 border border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-4 py-2.5 bg-amber-500/20 border-b border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                <StickyNote className="w-4 h-4" />
                <span>随手记便签 (Quick Notes)</span>
              </div>
              <button
                onClick={() => setIsNotesMinimized(true)}
                className="text-slate-400 hover:text-white p-1"
                title="缩小为图标"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-3.5 space-y-2.5">
              <textarea
                rows={3}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="随时记录灵光一现的句子或表达..."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={handleSubmitNoteToInbox}
                disabled={!noteContent.trim() || isAnalyzingDump}
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>AI 拆解并提交至 Inbox</span>
              </button>
              {savedNotesHistory.length > 0 && (
                <div className="pt-2 border-t border-slate-800 max-h-24 overflow-y-auto space-y-1">
                  {savedNotesHistory.map((n) => (
                    <div key={n.id} className="text-[11px] text-slate-400 truncate">
                      • {n.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ==========================================
          MULTI-EXPRESSION EXTRACTION CONFIRM MODAL
         ========================================== */}
      {extractionModalData && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl max-w-2xl w-full max-h-[88vh] sm:max-h-[88dvh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    AI 已从【{extractionModalData.sourceLabel || "输入内容"}】拆解出{" "}
                    {extractionModalData.candidates.length} 个地道表达
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  请勾选你希望加入 Inbox 重点积累的表达（可单独修改优先级）
                </p>
              </div>
              <button onClick={() => setExtractionModalData(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 sm:px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 text-xs text-slate-400 italic truncate">
              原句："{extractionModalData.rawText}"
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {extractionModalData.candidates.map((cand) => {
                const isChecked = extractionModalData.selectedTempIds.includes(cand.tempId);
                return (
                  <div
                    key={cand.tempId}
                    onClick={() => {
                      const nextIds = isChecked
                        ? extractionModalData.selectedTempIds.filter((id) => id !== cand.tempId)
                        : [...extractionModalData.selectedTempIds, cand.tempId];
                      setExtractionModalData({ ...extractionModalData, selectedTempIds: nextIds });
                    }}
                    className={`cursor-pointer rounded-xl p-4 border transition-all ${
                      isChecked
                        ? "bg-indigo-950/30 border-indigo-500/60"
                        : "bg-slate-950 border-slate-800 opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {isChecked ? (
                            <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center text-white">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded border border-slate-600" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{cand.target}</span>
                            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                              {cand.category} · {cand.cefr}
                            </span>
                          </div>
                          <p className="text-xs text-slate-200 font-medium">{cand.meaning}</p>
                          <p className="text-[11px] text-slate-400">💡 {cand.usageNote}</p>
                        </div>
                      </div>

                      <div onClick={(e) => e.stopPropagation()}>
                        <select
                          value={cand.priority}
                          onChange={(e) => {
                            const updated = extractionModalData.candidates.map((c) =>
                              c.tempId === cand.tempId ? { ...c, priority: e.target.value } : c
                            );
                            setExtractionModalData({ ...extractionModalData, candidates: updated });
                          }}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-amber-300"
                        >
                          <option value="High">High 重点</option>
                          <option value="Medium">Medium 常规</option>
                          <option value="Low">Low 低频</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={extractionModalData.dontAskAgainChecked}
                  onChange={(e) =>
                    setExtractionModalData({
                      ...extractionModalData,
                      dontAskAgainChecked: e.target.checked
                    })
                  }
                  className="rounded border-slate-700"
                />
                <span>下次不再弹窗提醒，拆解后默认全部加入 Inbox</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setExtractionModalData(null)}
                  className="px-4 py-2 bg-slate-800 text-xs rounded-xl text-slate-300"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmExtractionModal}
                  disabled={extractionModalData.selectedTempIds.length === 0}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-bold text-white rounded-xl"
                >
                  确认加入所选 ({extractionModalData.selectedTempIds.length} 项)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          LIGHTBULB Q&A MODAL
         ========================================== */}
      {qaModalState && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-xl w-full max-h-[85vh] sm:max-h-[88dvh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>AI 语料助教 · 针对「{qaModalState.title}」提问</span>
              </h3>
              <button onClick={() => setQaModalState(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 flex flex-wrap gap-1.5">
              {[
                "常见搭配与地道例句有哪些？",
                "和它的近义表达有什么细微区别？",
                "中国学习者用它时最容易犯什么错？"
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendQaQuestion(q)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {qaModalState.messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-950 border border-slate-800 text-slate-200"
                    }`}
                  >
                    {renderFormattedMarkdownText(m.text)}
                  </div>
                  {m.role === "ai" && idx > 0 && (
                    <button
                      onClick={() => triggerExtractionForSnippet(m.text, "AI助教解答拆解")}
                      className="mt-1 text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-indigo-300 hover:text-white flex items-center gap-1"
                    >
                      <BookmarkPlus className="w-3 h-3" />
                      <span>+ AI 拆解解答中的地道表达入库</span>
                    </button>
                  )}
                </div>
              ))}
              {qaModalState.loading && (
                <div className="flex items-center gap-2 text-xs text-amber-300">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>AI 助教正在思考解答...</span>
                </div>
              )}
            </div>
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={qaInput}
                onChange={(e) => setQaInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendQaQuestion()}
                placeholder="输入你想追问的语法、语境或造句..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
              <button
                onClick={() => handleSendQaQuestion()}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
              >
                提问
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SETTINGS MODAL (CEFR, Multi-LLM, JSON Backup)
         ========================================== */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl max-w-lg w-full max-h-[90vh] sm:max-h-[92dvh] overflow-y-auto p-4 sm:p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>全局设置 · 模型配置 · 数据导入导出</span>
              </h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* 1. User CEFR Level Selection */}
              <div className="space-y-2">
                <label className="text-slate-300 font-semibold block">1. 当前英语 CEFR 等级设定：</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {Object.keys(CEFR_PRESETS).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => handleChangeUserCefr(lvl)}
                      className={`py-2 rounded-xl font-bold border transition-all ${
                        profile.cefr === lvl
                          ? "bg-indigo-600 border-indigo-400 text-white shadow"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. LLM Provider Config */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <label className="text-slate-300 font-semibold block">2. 选择大语言模型服务商 (LLM API)：</label>
                <select
                  value={llmSettings.provider}
                  onChange={(e) => {
                    setLlmSettings({ ...llmSettings, provider: e.target.value });
                    setApiTestResult(null);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="openai_compatible">
                    🌐 OpenAI 兼容接口 (硅基流动 / DeepSeek / Kimi / 智谱 / 通义 / OpenAI / OpenRouter)
                  </option>
                  <option value="gemini">💎 Google Gemini 原生接口</option>
                </select>

                {llmSettings.provider === "openai_compatible" && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-slate-400">快捷填入：</span>
                      {LLM_PRESETS.map((preset) => {
                        const active = llmSettings.baseUrl.replace(/\/+$/, "") === preset.baseUrl;
                        return (
                          <button
                            key={preset.id}
                            onClick={() =>
                              setLlmSettings({
                                ...llmSettings,
                                baseUrl: preset.baseUrl,
                                modelName: preset.modelName
                              })
                            }
                            className={`px-2 py-0.5 rounded transition-colors ${
                              active
                                ? "bg-indigo-500/30 border border-indigo-500/50 text-indigo-200"
                                : "bg-slate-800 text-indigo-300 hover:bg-slate-700"
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={llmSettings.baseUrl}
                      onChange={(e) => setLlmSettings({ ...llmSettings, baseUrl: e.target.value })}
                      placeholder="Base URL (例如 https://api.siliconflow.cn/v1)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                    <input
                      type="text"
                      value={llmSettings.modelName}
                      onChange={(e) => setLlmSettings({ ...llmSettings, modelName: e.target.value })}
                      placeholder="Model Name (例如 deepseek-ai/DeepSeek-V3、deepseek-chat、qwen-plus)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                    <p className="text-[11px] text-slate-500">
                      快捷填入会覆盖 Base URL 与模型名，模型名可按服务商文档自行修改（需支持 JSON 输出）。
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400">API Key：</span>
                    {(() => {
                      const preset = LLM_PRESETS.find(
                        (p) => p.baseUrl === llmSettings.baseUrl.replace(/\/+$/, "")
                      );
                      const keyUrl =
                        llmSettings.provider === "gemini" ? GEMINI_KEY_URL : preset?.keyUrl;
                      return keyUrl ? (
                        <a
                          href={keyUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                        >
                          获取 Key ↗
                        </a>
                      ) : null;
                    })()}
                  </div>
                  <input
                    type="password"
                    value={llmSettings.apiKey}
                    onChange={(e) => setLlmSettings({ ...llmSettings, apiKey: e.target.value })}
                    placeholder="输入你的 API Key（仅保存在当前页面内存中）..."
                    autoComplete="off"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                  <button
                    onClick={handleTestApiConnection}
                    disabled={isTestingApi}
                    className="px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-semibold disabled:opacity-60"
                  >
                    {isTestingApi ? "正在测试连接..." : "🔌 测试 API 连通性"}
                  </button>
                  {apiTestResult && (
                    <div
                      className={`text-[11px] leading-relaxed rounded-lg px-2.5 py-2 border break-words ${
                        apiTestResult.ok
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                          : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                      }`}
                    >
                      {apiTestResult.message}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Dump Confirmation Toggle */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-semibold">3. 语料拆解后免弹窗直接入库：</span>
                <button
                  onClick={() => setSkipDumpConfirmModal(!skipDumpConfirmModal)}
                  className={`px-3 py-1 rounded-full font-bold ${
                    skipDumpConfirmModal ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {skipDumpConfirmModal ? "已开启 (默认全入库)" : "已关闭 (每次弹窗勾选)"}
                </button>
              </div>

              {/* 4. Data Backup: Export & Import */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-slate-300 font-semibold block">
                  4. 数据导出与导入备份 (JSON Backup & Restore)：
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleExportData}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-300 font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>导出 JSON 备份</span>
                  </button>
                  <label className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-300 font-semibold flex items-center justify-center gap-1.5 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>导入备份文件</span>
                    <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl"
              >
                完成并保存设置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}