"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const recommendationGroups = [
  [
  {
    id: "1",
    title: "Columbia West 1B",
    meta: "1 Bed  ·  到校 12 min",
    price: "$3,200",
    badge: "新生友好",
    badgeTone: "bg-emerald-400/[0.18] text-emerald-200",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    note: "“第一次来美国住这里，不容易慌”",
    desc: "离学校近，周边便利店和中餐密度高，适合刚落地、需要稳定过渡的留学生。"
  },
  {
    id: "2",
    title: "LIC Study Studio",
    meta: "Studio  ·  地铁 18 min",
    price: "$2,850",
    badge: "预算优先",
    badgeTone: "bg-amber-400/[0.18] text-amber-200",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    note: "“通勤还行，预算压力更轻”",
    desc: "适合预算要卡住、但又不想离学校和实习区太远的学生党。"
  },
  {
    id: "3",
    title: "Queens Safe Block 2B",
    meta: "2 Bed  ·  合租 25 min",
    price: "$3,850",
    badge: "安全感",
    badgeTone: "bg-sky-400/[0.18] text-sky-200",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    note: "“更像爸妈会放心的那种房子”",
    desc: "街区更稳，适合重视治安、晚归安全和室友生活秩序的人。"
  }
  ],
  [
    {
      id: "4",
      title: "Astoria Chinese Hub 1B",
      meta: "1 Bed  ·  15 min",
      price: "$3,480",
      badge: "华人生活圈",
      badgeTone: "bg-violet-400/[0.18] text-violet-200",
      image:
        "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
      note: "“吃饭买菜和找中文服务都更方便”",
      desc: "适合刚来时需要华超、中餐和中文服务支撑生活的留学生。"
    },
    {
      id: "5",
      title: "Downtown Grad Studio",
      meta: "Studio  ·  到校 20 min",
      price: "$2,960",
      badge: "读书节奏",
      badgeTone: "bg-cyan-400/[0.18] text-cyan-200",
      image:
        "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1200&q=80",
      note: "“自习、回家、再出门都不折腾”",
      desc: "更适合课程密集、希望把生活成本和学习节奏控制住的研究生。"
    },
    {
      id: "6",
      title: "Jersey City Shared 3B",
      meta: "3 Bed  ·  合租 22 min",
      price: "$3,720",
      badge: "合租友好",
      badgeTone: "bg-rose-400/[0.18] text-rose-200",
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
      note: "“更适合和熟人一起把预算打下来”",
      desc: "房间分配更清晰，适合朋友拼租，兼顾预算和通勤容忍度。"
    }
  ]
] as const;

const listingCards = recommendationGroups[0];

const values = [
  {
    title: "懂你",
    text: "看懂你是新生、研究生还是第一次独自出国。"
  },
  {
    title: "帮你避坑",
    text: "优先避开通勤过长、治安焦虑和生活配套太差的选择。"
  },
  {
    title: "有理由",
    text: "每个推荐都解释学校距离、华人配套和预算压力。"
  },
  {
    title: "不纠结",
    text: "不再一边问学长学姐，一边刷房源刷到崩。"
  }
];

const flowScreens = [
  {
    key: "choice",
    step: "Step 1 / 3",
    eyebrow: "先了解你 才能帮你选",
    title: "你现在最担心什么？"
  },
  {
    key: "persona",
    step: "Step 2 / 3",
    eyebrow: "我大概知道 你的租房处境了",
    title: "你的留学生租房标签"
  },
  {
    key: "result",
    step: "Step 3 / 3",
    eyebrow: "为你找到 3 个最佳选择",
    title: "更像为留学生准备的 shortlist"
  }
] as const;

const trustStats = [
  {
    value: "3 min",
    label: "完成一轮偏好判断"
  },
  {
    value: "12k+",
    label: "留学生用户使用过类似流程"
  },
  {
    value: "4 维",
    label: "同时考虑通勤、预算、安全、生活圈"
  }
];

const benefitHighlights = [
  {
    title: "先排除不适合",
    text: "不拿几十套房子让你继续纠结，而是先筛掉明显不适合当前阶段的选择。"
  },
  {
    title: "每个推荐都能解释",
    text: "为什么适合你、牺牲了什么、适不适合向家里解释，页面上都应该说清楚。"
  },
  {
    title: "照顾留学生真实处境",
    text: "从第一次签约、担心踩坑，到需要中文生活配套，这些都不是边角需求。"
  }
];

const comparisonMetrics = [
  {
    title: "学校距离",
    weight: "高权重",
    detail: "不是单看地图公里数，而是看你每天往返是否可持续。"
  },
  {
    title: "预算压力",
    weight: "动态平衡",
    detail: "房租只是表面，押金、通勤、生活便利一起算才真实。"
  },
  {
    title: "安全感",
    weight: "优先过滤",
    detail: "夜归焦虑、街区秩序和楼栋状态，会比照片更影响长期体验。"
  },
  {
    title: "华人配套",
    weight: "因人而异",
    detail: "对刚落地的人是安全网，对熟悉城市的人则未必需要最高权重。"
  }
];

const testimonialCards = [
  {
    quote: "以前是开着十几个标签页刷房，现在更像有人把真正值得看的 3 套先递给我。",
    name: "Yuki",
    detail: "NYU / 新生"
  },
  {
    quote: "最有用的不是推荐本身，而是它会告诉我为什么不要选另外几类房子。",
    name: "Ethan",
    detail: "Columbia / 研究生"
  },
  {
    quote: "终于能把我的顾虑讲给爸妈听了，不是只有‘我觉得还行’这种很虚的理由。",
    name: "Momo",
    detail: "BU / 第一次独居"
  }
];

const faqs = [
  {
    q: "这是房源平台，还是决策工具？",
    a: "更偏向决策工具。重点不是无限展示房源，而是帮你更快缩小到值得认真比较的 shortlist。"
  },
  {
    q: "适合刚来美国、完全没有租房经验的人吗？",
    a: "适合。现在这版文案和判断模型就是围绕第一次落地、怕踩坑、需要生活支撑的人群来设计的。"
  },
  {
    q: "如果我最在意的是预算，会不会推荐很远的地方？",
    a: "不会只看租金。系统会把通勤成本、生活成本和安全感一起衡量，而不是用低房租掩盖整体压力。"
  }
];

function NavBar() {
  return (
    <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 text-sm text-white/70 md:px-7">
      <div className="font-medium tracking-[0.02em] text-white">
        Find <span className="text-amber-300">Nest 寻窝</span>
      </div>
      <div className="hidden items-center gap-7 md:flex">
        <a href="#how" className="transition hover:text-white">
          如何工作
        </a>
        <a href="#why" className="transition hover:text-white">
          为什么是寻窝
        </a>
      </div>
      <a
        href="#flow"
        className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs text-white transition hover:bg-white/[0.1]"
      >
        开始使用
      </a>
    </div>
  );
}

function HeroCopy() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-10">
      <div className="max-w-[360px]">
        <h1 className="font-display text-4xl leading-[1.05] text-white md:text-[52px]">
          你不是在刷房
          <br />
          你是在决定留学这一年
          <br />
          <span className="text-amber-400">每天回去的地方</span>
        </h1>
        <p className="mt-4 text-sm leading-6 text-white/[0.68]">
          先回答几个问题，Find Nest 寻窝会从学校通勤、预算压力、治安感受和华人生活圈里，帮你筛出更适合留学生的答案。
        </p>
        <motion.a
          href="#flow"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 inline-flex rounded-xl bg-[linear-gradient(135deg,#ec9c58,#ca7f37)] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_35px_rgba(217,133,55,0.3)] transition hover:brightness-110"
        >
          开始决定
        </motion.a>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-white/[0.55]">
        <div className="flex -space-x-2">
          {["#f7b28a", "#f2d2ab", "#ddb29c", "#efb58a"].map((color) => (
            <span
              key={color}
              className="h-8 w-8 rounded-full border border-[#171b23]"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span>12,380 位留学生通过 Find Nest 寻窝缩短了找房决策时间</span>
      </div>
    </div>
  );
}

function ListingCard({
  item
}: {
  item: (typeof listingCards)[number];
}) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="overflow-hidden rounded-[18px] border border-white/10 bg-[#0d1118] shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
    >
      <div className="relative h-48">
        <Image src={item.image} alt={item.title} fill sizes="(max-width: 1280px) 100vw, 33vw" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(7,10,16,0.7))]" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-lg bg-[#ffb26b] px-2 py-1 text-[11px] font-semibold text-[#1d1206]">
            {item.id}
          </span>
          <span className={`rounded-lg px-2 py-1 text-[11px] ${item.badgeTone}`}>{item.badge}</span>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-medium text-white">{item.title}</h3>
            <p className="mt-1 text-xs text-white/[0.45]">{item.meta}</p>
          </div>
          <p className="text-sm text-white/[0.75]">{item.price}</p>
        </div>
        <p className="text-[13px] font-medium text-amber-300">{item.note}</p>
        <p className="text-[13px] leading-6 text-white/[0.55]">{item.desc}</p>
      </div>
    </motion.article>
  );
}

function ValueRow() {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {values.map((item) => (
        <div
          key={item.title}
          className="rounded-[18px] border border-white/[0.08] bg-white/[0.03] px-5 py-6"
        >
          <p className="text-base text-amber-200">{item.title}</p>
          <p className="mt-2 text-sm leading-6 text-white/50">{item.text}</p>
        </div>
      ))}
    </div>
  );
}

function AnalysisOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex items-center justify-center bg-[linear-gradient(180deg,rgba(5,8,14,0.6),rgba(5,8,14,0.84))] backdrop-blur-xl"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        className="w-[min(380px,calc(100%-40px))] rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,20,32,0.92),rgba(9,12,19,0.9))] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.38)]"
      >
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full border border-amber-300/20 bg-amber-300/10">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
              className="absolute inset-[7px] rounded-full border border-t-amber-300 border-r-transparent border-b-transparent border-l-transparent"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/[0.38]">AI 分析中</p>
            <p className="mt-1 text-lg text-white">正在理解你的留学租房偏好</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {[
            "提取你更在意的学校距离与预算压力",
            "评估治安感受 / 华人配套 / 合租接受度",
            "生成更适合留学生落地阶段的判断模型"
          ].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0.25, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="flex items-center gap-3 text-sm text-white/[0.62]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
              {item}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function FlowHeader({
  currentStep,
  onBack
}: {
  currentStep: number;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center justify-between text-[11px] text-white/[0.42]">
      <button
        onClick={onBack}
        className={`transition ${currentStep === 0 ? "pointer-events-none opacity-20" : "opacity-100 hover:text-white"}`}
      >
        ← Back
      </button>
      <div className="flex items-center gap-3">
        <span>{flowScreens[currentStep].step}</span>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className={`h-1.5 rounded-full ${
                dot <= currentStep ? "w-5 bg-[#dc8d4b]" : "w-5 bg-white/[0.16]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChoicePanel({
  selectedChoice,
  onSelect
}: {
  selectedChoice: string | null;
  onSelect: (choice: string) => void;
}) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {[
        {
          label: "A",
          title: "踩坑",
          lines: ["我最怕合同、押金和中介", "有坑，自己看不出来"]
        },
        {
          label: "B",
          title: "远",
          lines: ["我最怕离学校太远", "日常通勤太累"]
        }
      ].map((item, index) => {
        const isActive = selectedChoice === item.label;
        return (
          <button
            key={item.label}
            onClick={() => onSelect(item.label)}
            className={`relative overflow-hidden rounded-[18px] border p-4 text-left transition ${
              isActive
                ? "border-amber-300/45 bg-white/[0.08]"
                : "border-white/10 bg-white/[0.03] hover:border-amber-300/30 hover:bg-white/[0.06]"
            }`}
          >
            {index === 0 ? (
              <div className="absolute inset-x-10 bottom-4 h-10 opacity-70">
                <div className="flex h-full items-end justify-between">
                  {[16, 25, 12, 30, 18, 36, 14, 27, 11].map((h) => (
                    <span key={h} className="w-[2px] rounded-full bg-white/75" style={{ height: `${h}px` }} />
                  ))}
                </div>
              </div>
            ) : (
              <div
                className="absolute inset-y-0 right-0 w-1/2 bg-cover bg-center opacity-80"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg,rgba(7,10,16,0.15),rgba(7,10,16,0.7)), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80')"
                }}
              />
            )}
            <div className="relative z-10 max-w-[110px]">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-amber-300/20 bg-amber-300/10 text-xs text-amber-200">
                {item.label}
              </span>
              <h4 className="mt-4 text-lg text-white">{item.title}</h4>
              <div className="mt-3 space-y-1 text-xs leading-5 text-white/[0.55]">
                {item.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function PersonaPanel({
  selectedChoice,
  onNext
}: {
  selectedChoice: string | null;
  onNext: () => void;
}) {
  const persona = selectedChoice === "B" ? "到校通勤敏感型" : "签约避坑优先型";
  const copy =
    selectedChoice === "B"
      ? ["你对每天到校成本非常敏感", "宁可房子普通一点", "也不想把精力耗在通勤上"]
      : ["你更担心第一次租房踩坑", "会优先看合同透明度和区域稳定度", "不想把预算浪费在错误选择上"];
  const traits =
    selectedChoice === "B"
      ? ["学校距离优先", "地铁便利敏感", "愿意压缩空间换效率"]
      : ["合同风险敏感", "押金安全优先", "倾向成熟华人片区"];

  return (
    <div className="mt-6 overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(135deg,rgba(84,142,135,0.24),rgba(255,255,255,0.02))] shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
      <div className="grid gap-0 sm:grid-cols-[1.1fr_0.9fr]">
        <div className="p-6">
          <div className="glass-panel rounded-[20px] p-5">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/[0.34]">AI Persona</p>
            <p className="text-[28px] font-medium leading-tight text-[#8edfd0]">{persona}</p>
            <div className="mt-3 space-y-2 text-sm leading-6 text-white/[0.55]">
              {copy.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {traits.map((trait) => (
                <span
                  key={trait}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] text-white/[0.66]"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={onNext}
            className="mt-5 rounded-lg bg-[linear-gradient(135deg,#ec9c58,#ca7f37)] px-4 py-2 text-xs font-medium text-white shadow-[0_12px_28px_rgba(217,133,55,0.24)]"
          >
            继续生成留学生推荐
          </button>
        </div>
        <div
          className="min-h-[240px] bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(180deg,rgba(7,10,16,0.2),rgba(7,10,16,0.7)), url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80')"
          }}
        />
      </div>
    </div>
  );
}

function ResultPanel({
  results,
  rerollCount,
  onReroll
}: {
  results: (typeof recommendationGroups)[number];
  rerollCount: number;
  onReroll: () => void;
}) {
  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/[0.34]">Decision Notes</p>
            <p className="mt-2 text-sm leading-6 text-white/[0.66]">
              {rerollCount === 0
                ? "你更适合学校通勤清晰、生活配套稳定、并且更容易向家里解释清楚的选择。"
                : "基于同一偏好，给你另一组更适合留学生落地的方案，这一组更偏华人生活圈和平衡预算。"}
            </p>
          </div>
          <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[11px] text-amber-200">
            {rerollCount === 0 ? "首组选项" : "第二组建议"}
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {results.map((item) => (
          <div
            key={item.title}
            className="overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.03] transition hover:bg-white/[0.05]"
          >
            <div className="relative h-28">
              <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 20vw" className="object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(8,10,16,0.8))]" />
            </div>
            <div className="p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] text-white/[0.82]">{item.title}</p>
                <span className="text-[10px] text-amber-200">{item.id}</span>
              </div>
              <p className="mt-2 text-[10px] text-white/[0.35]">{item.meta}</p>
              <p className="mt-2 text-[10px] leading-4 text-white/[0.5]">{item.note}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-[16px] border border-white/10 bg-white/[0.03] px-4 py-3">
        <button
          onClick={onReroll}
          className="rounded-lg bg-white/[0.06] px-4 py-2 text-xs text-white/[0.65] transition hover:bg-white/[0.1]"
        >
          重新推荐
        </button>
        <a
          href="#comparison"
          className="rounded-lg bg-[linear-gradient(135deg,#ec9c58,#ca7f37)] px-4 py-2 text-xs font-medium text-white"
        >
          立即对比
        </a>
      </div>
    </div>
  );
}

function SectionIntro({
  label,
  title,
  description
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-[11px] uppercase tracking-[0.32em] text-white/[0.38]">{label}</p>
      <h2 className="mt-4 font-display text-4xl leading-tight text-white md:text-5xl">{title}</h2>
      <p className="mt-5 max-w-2xl text-sm leading-7 text-white/[0.62] md:text-base">
        {description}
      </p>
    </div>
  );
}

function TrustStrip() {
  return (
    <section className="mt-6">
      <div className="grid gap-4 rounded-[28px] border border-white/10 bg-white/[0.03] p-5 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:p-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/[0.35]">What This Solves</p>
          <p className="mt-3 text-xl leading-8 text-white md:text-2xl">
            帮留学生把“我也不知道哪里不对，但总觉得不安心”变成可解释的判断。
          </p>
        </div>
        {trustStats.map((item) => (
          <div
            key={item.label}
            className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5"
          >
            <p className="text-3xl text-[#f3b56a]">{item.value}</p>
            <p className="mt-2 text-sm leading-6 text-white/[0.55]">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BenefitSection() {
  return (
    <section className="mt-24">
      <SectionIntro
        label="Why It Feels Different"
        title="不是更会卖房，而是更懂留学生怎么做决定"
        description="很多找房网站解决的是展示问题，但留学生真正卡住的是判断问题。我们把内容、信任和决策逻辑补到同一页上，让页面不只是漂亮。"
      />

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {benefitHighlights.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: index * 0.08 }}
            className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,15,26,0.92),rgba(7,10,18,0.92))] p-6"
          >
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/[0.3]">
              0{index + 1}
            </p>
            <h3 className="mt-5 text-2xl text-white">{item.title}</h3>
            <p className="mt-4 text-sm leading-7 text-white/[0.6]">{item.text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function ComparisonSection() {
  return (
    <section id="comparison" className="mt-24">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionIntro
          label="Comparison Logic"
          title="一套更像顾问而不是搜索框的比较框架"
          description="当用户点下“立即对比”时，看到的不该只是价格表，而是一组真正影响居住体验的判断维度。"
        />

        <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,19,33,0.94),rgba(7,10,18,0.92))] p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {comparisonMetrics.map((item) => (
              <div
                key={item.title}
                className="rounded-[22px] border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg text-white">{item.title}</h3>
                  <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[11px] text-amber-200">
                    {item.weight}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-white/[0.58]">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-[24px] border border-white/10 bg-[#0a0f18] p-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/[0.32]">Recommendation Output</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[
                ["最佳通勤", "到校更稳，适合课程密集期"],
                ["最稳妥", "对第一次签约和安全感更友好"],
                ["性价比", "整体压力更平衡，适合预算敏感"]
              ].map(([title, desc]) => (
                <div key={title} className="rounded-[18px] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm text-white">{title}</p>
                  <p className="mt-2 text-xs leading-6 text-white/[0.52]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  return (
    <section className="mt-24">
      <SectionIntro
        label="User Voice"
        title="页面要让用户感觉自己被理解，而不是被推销"
        description="这类产品的信任感，很大一部分来自‘它说中了我的处境’。所以我们补上了更具体的用户反馈语气。"
      />

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {testimonialCards.map((item, index) => (
          <motion.blockquote
            key={item.name}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: index * 0.08 }}
            className="rounded-[26px] border border-white/10 bg-white/[0.03] p-6"
          >
            <p className="text-base leading-8 text-white/[0.84]">“{item.quote}”</p>
            <footer className="mt-8 border-t border-white/10 pt-4">
              <p className="text-sm text-white">{item.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/[0.36]">{item.detail}</p>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="mt-24">
      <SectionIntro
        label="FAQ"
        title="把用户会担心的问题，提前回答掉"
        description="这一块不是为了凑内容，而是降低首次理解成本，让用户更容易在首页完成自我判断。"
      />

      <div className="mt-10 grid gap-4">
        {faqs.map((item) => (
          <div
            key={item.q}
            className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-5 md:p-6"
          >
            <h3 className="text-lg text-white">{item.q}</h3>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-white/[0.58]">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ClosingCTA() {
  return (
    <section id="contact" className="mt-24 pb-10">
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(218,142,74,0.16),rgba(62,94,168,0.18),rgba(255,255,255,0.04))] p-6 md:p-10">
        <p className="text-[11px] uppercase tracking-[0.32em] text-white/[0.38]">Ready To Launch</p>
        <div className="mt-5 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="font-display text-4xl leading-tight text-white md:text-5xl">
              现在这版已经不只是“有感觉”的概念稿，
              <br />
              而是一页可以继续接产品和转化的首页。
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/[0.62] md:text-base">
              下一步如果你愿意，我们可以继续把问答流程接成真实表单、补上房源详情页，或者直接做成可上线的完整产品路径。
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="#flow"
              className="rounded-full bg-[linear-gradient(135deg,#ec9c58,#ca7f37)] px-6 py-3 text-sm font-medium text-white shadow-[0_12px_30px_rgba(217,133,55,0.28)]"
            >
              回到决策流程
            </a>
            <a
              href="#comparison"
              className="rounded-full border border-white/10 bg-white/[0.05] px-6 py-3 text-sm text-white/[0.72] transition hover:bg-white/[0.08]"
            >
              查看比较框架
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FlowPanel({
  currentStep,
  selectedChoice,
  isAnalyzing,
  maxUnlockedStep,
  rerollCount,
  results,
  onReroll,
  setSelectedChoice,
  goBack,
  goNext,
  setStep
}: {
  currentStep: number;
  selectedChoice: string | null;
  isAnalyzing: boolean;
  maxUnlockedStep: number;
  rerollCount: number;
  results: (typeof recommendationGroups)[number];
  onReroll: () => void;
  setSelectedChoice: (value: string) => void;
  goBack: () => void;
  goNext: () => void;
  setStep: (value: number) => void;
}) {
  const current = flowScreens[currentStep];

  return (
    <section
      id="flow"
      className="relative flex h-full flex-col overflow-hidden bg-[radial-gradient(circle_at_top,rgba(78,118,200,0.12),transparent_18%),linear-gradient(180deg,rgba(8,11,19,0.99),rgba(8,11,18,0.96))]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_18%,rgba(219,141,75,0.12),transparent_16%),radial-gradient(circle_at_65%_62%,rgba(112,161,255,0.09),transparent_22%)]" />
      <AnimatePresence>{isAnalyzing && <AnalysisOverlay />}</AnimatePresence>

      <div className="relative flex-1 px-6 py-5">
        <FlowHeader currentStep={currentStep} onBack={goBack} />

        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, x: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -18, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="pt-8"
          >
            <div className="max-w-[340px]">
              <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-white/[0.3]">
                留学生租房决策系统
              </p>
              <h3 className="whitespace-pre-line text-[36px] font-medium leading-[1.04] text-white">
                {current.eyebrow.replaceAll(" ", "\n")}
              </h3>
              <p className="mt-5 max-w-[280px] text-lg text-white/[0.72]">{current.title}</p>
            </div>

            {current.key === "choice" && (
              <ChoicePanel
                selectedChoice={selectedChoice}
                onSelect={setSelectedChoice}
              />
            )}

            {current.key === "persona" && (
              <PersonaPanel selectedChoice={selectedChoice} onNext={goNext} />
            )}

            {current.key === "result" && (
              <ResultPanel results={results} rerollCount={rerollCount} onReroll={onReroll} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative border-t border-white/10 px-6 py-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {flowScreens.map((screen, index) => (
            <button
              key={screen.key}
              onClick={() => {
                if (index <= maxUnlockedStep) {
                  setStep(index);
                }
              }}
              className={`overflow-hidden rounded-[16px] border text-left transition ${
                index === currentStep
                  ? "border-amber-300/40 bg-white/[0.07]"
                  : index <= maxUnlockedStep
                    ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                    : "cursor-not-allowed border-white/10 bg-white/[0.02] opacity-45"
              }`}
            >
              <div className="relative h-20">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      index === 0
                        ? "linear-gradient(180deg,rgba(7,10,16,0.18),rgba(7,10,16,0.8)), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80')"
                        : index === 1
                          ? "linear-gradient(180deg,rgba(7,10,16,0.18),rgba(7,10,16,0.8)), url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80')"
                          : "linear-gradient(180deg,rgba(7,10,16,0.18),rgba(7,10,16,0.8)), url('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80')"
                  }}
                />
                <div className="absolute left-3 top-3 rounded-md bg-[#ffb26b] px-2 py-1 text-[10px] font-semibold text-[#1d1206]">
                  {index + 1}
                </div>
              </div>
              <div className="p-3">
                <p className="text-[11px] text-white/[0.8]">{screen.step}</p>
                <p className="mt-1 text-[10px] leading-4 text-white/[0.42]">{screen.title}</p>
                {index > maxUnlockedStep && (
                  <p className="mt-1 text-[10px] text-white/[0.28]">完成上一步后解锁</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeDashboard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendationIndex, setRecommendationIndex] = useState(0);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(0);

  const goBack = () => {
    setIsAnalyzing(false);

    if (currentStep <= 1) {
      setCurrentStep(0);
      setSelectedChoice(null);
      setRecommendationIndex(0);
      setMaxUnlockedStep(0);
      return;
    }

    setCurrentStep((step) => Math.max(0, step - 1));
  };
  const goNext = () => setCurrentStep((step) => Math.min(2, step + 1));
  const handleReroll = () => {
    setRecommendationIndex((index) => (index + 1) % recommendationGroups.length);
  };

  useEffect(() => {
    if (!selectedChoice || currentStep !== 0) {
      return;
    }

    setIsAnalyzing(true);
    const timer = window.setTimeout(() => {
      setIsAnalyzing(false);
      setCurrentStep(1);
    }, 950);

    return () => window.clearTimeout(timer);
  }, [selectedChoice, currentStep]);

  useEffect(() => {
    setMaxUnlockedStep((prev) => {
      const baseline = selectedChoice ? 1 : 0;
      return Math.max(prev, baseline, currentStep);
    });
  }, [currentStep, selectedChoice]);

  useEffect(() => {
    if (currentStep < 2) {
      setRecommendationIndex(0);
    }
  }, [currentStep, selectedChoice]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(42,69,124,0.22),transparent_24%),linear-gradient(180deg,#05070d_0%,#080d16_50%,#04060b_100%)] px-4 py-4 text-white md:px-6">
      <div className="mx-auto max-w-[1500px]">
        <div className="overflow-hidden rounded-[36px] border border-white/10 bg-[#070b12] shadow-[0_25px_90px_rgba(0,0,0,0.45)]">
          <div className="grid min-h-[calc(100vh-32px)] lg:grid-cols-[1.08fr_0.92fr]">
            <section className="border-b border-white/10 lg:border-b-0 lg:border-r lg:border-r-white/10">
              <NavBar />

              <div className="px-6 pb-8 pt-6 md:px-7 md:pb-10">
                <div className="relative overflow-hidden rounded-[28px] border border-white/10">
                  <div
                    className="relative h-[460px] bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "linear-gradient(180deg,rgba(4,7,12,0.2),rgba(4,7,12,0.72)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80')"
                    }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,182,94,0.18),transparent_18%),radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.06),transparent_28%)]" />
                    <HeroCopy />
                  </div>
                </div>

                <div id="how" className="mt-8 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/[0.35]">AI Decision</p>
                    <h2 className="mt-3 max-w-[450px] text-[40px] font-medium leading-[1.08] text-white">
                      不是给留学生更多房源，
                      <br />
                      而是先帮你避开最容易踩的坑。
                    </h2>
                  </div>
                  <a
                    href="#flow"
                    className="hidden rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/[0.55] transition hover:bg-white/[0.06] md:inline-flex"
                  >
                    查看流程 →
                  </a>
                </div>

                <div className="mt-6 grid gap-4 xl:grid-cols-3">
                  {listingCards.map((item) => (
                    <ListingCard key={item.title} item={item} />
                  ))}
                </div>

                <div id="why" className="mt-5">
                  <ValueRow />
                </div>

                <div className="mt-8 flex items-end justify-between gap-5">
                  <p className="font-display text-5xl leading-none text-white md:text-6xl">寻窝</p>
                  <p className="max-w-[320px] text-right text-[40px] font-medium leading-[1.04] text-[#d7954d]">
                    Find Nest
                    <br />
                    寻窝 留学生租房决策
                  </p>
                </div>
              </div>
            </section>

            <FlowPanel
              currentStep={currentStep}
              selectedChoice={selectedChoice}
              isAnalyzing={isAnalyzing}
              maxUnlockedStep={maxUnlockedStep}
              rerollCount={recommendationIndex}
              results={recommendationGroups[recommendationIndex]}
              onReroll={handleReroll}
              setSelectedChoice={setSelectedChoice}
              goBack={goBack}
              goNext={goNext}
              setStep={setCurrentStep}
            />
          </div>
        </div>

        <TrustStrip />
        <BenefitSection />
        <ComparisonSection />
        <TestimonialSection />
        <FAQSection />
        <ClosingCTA />
      </div>
    </main>
  );
}
