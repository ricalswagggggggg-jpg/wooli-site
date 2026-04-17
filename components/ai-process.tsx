"use client";

import { motion } from "framer-motion";

const recommendationCards = [
  {
    name: "静安天际公寓",
    tag: "步行城市感",
    reason: "通勤成本低，夜归安全感强，适合需要城市节奏但想保留秩序的人。"
  },
  {
    name: "滨江留白住宅",
    tag: "恢复型空间",
    reason: "采光和安静权重更高，适合高压工作后需要快速切换情绪的人。"
  },
  {
    name: "法租界低密小宅",
    tag: "情绪价值",
    reason: "街区氛围稳定，生活便利但不过度嘈杂，适合重视日常质感的人。"
  }
];

export function AIProcess() {
  return (
    <section className="relative py-28 sm:py-36">
      <div className="section-shell grid items-start gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Decision Engine</p>
          <h2 className="mt-6 font-display text-balance text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
            这不是搜索流程
            <br />
            是一场逐步逼近真实偏好的判断
          </h2>
          <p className="mt-8 text-base leading-8 text-slate-300">
            Find Nest 把用户从“我是不是该再看看”里拉出来，用一连串清晰的选择和解释，把模糊情绪转成可以信任的建议。
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,31,0.9),rgba(5,7,13,0.92))] p-6 shadow-aura sm:p-8"
        >
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Step 1</p>
                  <h3 className="mt-3 text-2xl text-white">问问题</h3>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                  Pick A / B
                </span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ["A", "下班后 10 分钟内到家，比空间更重要"],
                  ["B", "宁可通勤多一点，也想要更安静和更大的留白"]
                ].map(([label, text]) => (
                  <button
                    key={label}
                    className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4 text-left transition duration-300 hover:border-sky-300/40 hover:bg-sky-300/10"
                  >
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{label}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-200">{text}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-[28px] p-6">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Step 2</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {["高压工作者", "夜归安全敏感", "恢复型居住", "偏爱稳定街区"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                AI 会把你的回答翻译成真实可用的居住画像，而不是停留在“喜欢安静”这种泛化标签。
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Step 3</p>
                  <h3 className="mt-3 text-2xl text-white">推荐 3 个房源</h3>
                </div>
                <span className="rounded-full bg-sky-300/10 px-3 py-1 text-xs text-sky-200">
                  Best-fit shortlist
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {recommendationCards.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(14,23,39,0.95),rgba(10,14,24,0.9))] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-lg text-white">{item.name}</h4>
                        <p className="mt-2 text-sm text-sky-200">{item.tag}</p>
                      </div>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                        89% match
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-300">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
