"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-end overflow-hidden pt-24">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-35 blur-[2px]"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(3,5,10,0.18), rgba(3,5,10,0.82)), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80')"
        }}
      />
      <div className="absolute inset-0 bg-grain" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(116,165,255,0.18),transparent_18%),radial-gradient(circle_at_50%_120%,rgba(105,136,255,0.22),transparent_30%)]" />

      <div className="section-shell relative z-10 flex w-full flex-col justify-between gap-14 pb-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <div className="mb-8 flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-white/[0.55]">
            <span className="h-px w-10 bg-white/20" />
            Find Nest
          </div>

          <div className="space-y-4">
            <h1 className="font-display text-balance text-5xl leading-[0.95] text-white sm:text-6xl md:text-7xl lg:text-[92px]">
              你不是在找房
            </h1>
            <h2 className="max-w-5xl font-display text-balance text-4xl leading-[1.02] text-white/[0.92] sm:text-5xl md:text-6xl lg:text-[78px]">
              你是在选一个接下来每天醒来的地方
            </h2>
          </div>

          <p className="mt-8 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Find Nest 不展示海量噪音，而是像一个冷静、锋利的决策顾问，
            帮你在不确定里找到最适合长期居住的答案。
          </p>

          <motion.a
            href="#core"
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="group mt-10 inline-flex items-center gap-4 rounded-full border border-white/[0.15] bg-white/[0.08] px-7 py-4 text-sm font-medium text-white shadow-aura backdrop-blur-xl transition-colors duration-300 hover:border-sky-300/40"
          >
            <span className="bg-[linear-gradient(90deg,#ffffff,#d2ddff,#7eb6ff)] bg-clip-text text-transparent transition duration-300 group-hover:translate-x-0.5">
              开始决定
            </span>
            <span className="h-2.5 w-2.5 rounded-full bg-sky-300 shadow-[0_0_24px_rgba(125,180,255,0.9)] transition duration-300 group-hover:scale-110" />
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15 }}
          className="grid gap-4 self-end sm:max-w-lg sm:grid-cols-3"
        >
          {[
            ["噪音过滤", "只留下真正值得比较的选项"],
            ["偏好识别", "把你的生活方式变成判断标准"],
            ["理由可见", "每次推荐都告诉你为什么"]
          ].map(([title, text]) => (
            <div key={title} className="glass-panel rounded-3xl p-4 shadow-panel">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Signal</p>
              <h3 className="mt-4 text-lg text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
