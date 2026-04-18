import Link from "next/link";
import type { Metadata } from "next";
import { seoArticles } from "@/data/seo-articles";

export const metadata: Metadata = {
  title: "SEO 文章",
  description:
    "雾里小铺 Wooli 的电子烟选购相关文章，涵盖纽约电子烟、美国电子烟网站、Relx 与一次性口味选择等内容。",
  alternates: {
    canonical: "/articles"
  }
};

export default function ArticlesPage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-[28px] border border-[rgba(86,58,33,0.14)] bg-[rgba(255,249,240,0.86)] px-5 py-6 shadow-[0_22px_60px_rgba(160,111,51,0.12)] backdrop-blur sm:px-8 sm:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#9d7a4f]">
                Wooli Articles
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#241710] sm:text-4xl">
                电子烟 SEO 文章中心
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6d563f] sm:text-base">
                这里收录了围绕雾里小铺、纽约电子烟、美国电子烟网站、Relx 和一次性口味选择的内容文章，方便做 Google 收录和站内引流。
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[#d6c2a5] bg-white px-5 py-2.5 text-sm font-semibold text-[#5b3c19] transition hover:border-[#b98b55] hover:bg-[#fff4df]"
            >
              返回首页
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-5">
          {seoArticles.map((article) => (
            <article
              key={article.slug}
              className="rounded-[26px] border border-[rgba(86,58,33,0.12)] bg-[rgba(255,252,246,0.94)] p-5 shadow-[0_20px_50px_rgba(135,101,59,0.08)] sm:p-6"
            >
              <div className="flex flex-wrap items-center gap-3 text-sm text-[#8c6b44]">
                <span>{article.publishedAt}</span>
                <span>·</span>
                <span>{article.readingTime}</span>
              </div>
              <h2 className="mt-3 text-2xl font-semibold leading-tight text-[#241710]">
                {article.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#634d39] sm:text-base">
                {article.excerpt}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {article.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-[#f8ecd7] px-3 py-1 text-xs font-medium text-[#7c5b33]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <div className="mt-5">
                <Link
                  href={`/articles/${article.slug}`}
                  className="inline-flex items-center justify-center rounded-full bg-[#5a3b1d] px-5 py-2.5 text-sm font-semibold text-[#fff7ea] transition hover:bg-[#704a25]"
                >
                  查看文章
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
