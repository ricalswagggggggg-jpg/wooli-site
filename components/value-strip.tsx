"use client";

import { motion } from "framer-motion";

const values = [
  {
    title: "懂你",
    text: "不是识别表面偏好，而是识别你真正会长期在意的生活条件。"
  },
  {
    title: "帮你选",
    text: "替你把海量候选压缩成少数值得认真看的结果。"
  },
  {
    title: "有理由",
    text: "每个结论都能回溯到你的回答、场景和优先级。"
  },
  {
    title: "不纠结",
    text: "让决定不再靠临时冲动，而是靠清晰、稳定、可解释的判断。"
  }
];

export function ValueStrip() {
  return (
    <section className="relative pb-24 pt-8 sm:pb-32">
      <div className="section-shell rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-8 shadow-panel sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Why It Matters</p>
          <h2 className="mt-5 font-display text-balance text-4xl leading-tight text-white sm:text-5xl">
            做租房决定，不该像在噪音里下注。
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {values.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: index * 0.06 }}
              className="rounded-[24px] border border-white/10 bg-[#0b1220]/70 p-6"
            >
              <p className="text-2xl text-white">{item.title}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
