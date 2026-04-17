"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const cards = [
  {
    title: "通勤之外，看见真实的生活半径",
    body: "不是只看地图距离，而是评估你每天如何回家、在哪恢复、周末会不会愿意待下去。",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "AI 从偏好里提炼判断，不堆砌参数",
    body: "你给出的每个回答都会转化成真正影响居住体验的权重，而不是留在问卷结果里。",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "答案必须可解释，喜欢和不喜欢都有依据",
    body: "每一套推荐都伴随清晰理由，让你不再在‘差不多’的房子里反复犹豫。",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
  }
];

export function CorePhilosophy() {
  return (
    <section id="core" className="relative py-28 sm:py-36">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Core Idea</p>
          <h2 className="mt-6 font-display text-balance text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
            不是给你更多选择，而是给你最好的答案
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {cards.map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: index * 0.08 }}
              className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(13,19,34,0.96),rgba(9,12,21,0.84))] shadow-panel"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover opacity-70 transition duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(4,7,14,0.75))]" />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Perspective 0{index + 1}</p>
                <h3 className="mt-4 text-xl leading-8 text-white">{card.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{card.body}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
