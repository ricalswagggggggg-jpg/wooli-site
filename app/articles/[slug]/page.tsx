import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSeoArticle, seoArticles } from "@/data/seo-articles";

type ArticlePageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return seoArticles.map((article) => ({
    slug: article.slug
  }));
}

export function generateMetadata({ params }: ArticlePageProps): Metadata {
  const article = getSeoArticle(params.slug);

  if (!article) {
    return {};
  }

  return {
    title: article.metaTitle,
    description: article.description,
    keywords: article.keywords,
    alternates: {
      canonical: `/articles/${article.slug}`
    },
    openGraph: {
      title: article.metaTitle,
      description: article.description,
      type: "article",
      url: `https://www.wooli.me/articles/${article.slug}`
    }
  };
}

export default function ArticleDetailPage({ params }: ArticlePageProps) {
  const article = getSeoArticle(params.slug);

  if (!article) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.metaTitle,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Organization",
      name: "雾里小铺 Wooli"
    },
    publisher: {
      "@type": "Organization",
      name: "雾里小铺 Wooli",
      logo: {
        "@type": "ImageObject",
        url: "https://www.wooli.me/site-logo.jpg"
      }
    },
    mainEntityOfPage: `https://www.wooli.me/articles/${article.slug}`
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row">
        <article className="min-w-0 flex-1 rounded-[30px] border border-[rgba(86,58,33,0.14)] bg-[rgba(255,251,244,0.95)] px-5 py-6 shadow-[0_22px_60px_rgba(135,101,59,0.1)] sm:px-8 sm:py-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[#91714b]">
            <Link href="/articles" className="font-medium hover:text-[#5b3c19]">
              SEO 文章
            </Link>
            <span>·</span>
            <span>{article.publishedAt}</span>
            <span>·</span>
            <span>{article.readingTime}</span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold leading-tight text-[#231712] sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-4 text-base leading-8 text-[#654f3c]">
            {article.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {article.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-[#f7e9d1] px-3 py-1 text-xs font-medium text-[#7b5b33]"
              >
                {keyword}
              </span>
            ))}
          </div>

          <div className="mt-8 space-y-8">
            {article.sections.map((section, index) => (
              <section key={`${article.slug}-${index}`} className="space-y-4">
                {section.heading ? (
                  <h2 className="text-2xl font-semibold text-[#2a1a12]">
                    {section.heading}
                  </h2>
                ) : null}

                {section.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[15px] leading-8 text-[#4f3d2e] sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}

                {section.internalLinks?.map((link) => (
                  <p
                    key={`${link.href}-${link.label}`}
                    className="rounded-[18px] border border-[rgba(86,58,33,0.08)] bg-[#fff8ee] px-4 py-3 text-[14px] leading-7 text-[#5a4736] sm:text-[15px]"
                  >
                    <Link
                      href={link.href}
                      className="font-semibold text-[#7c5628] underline decoration-[#d0ae80] underline-offset-4 hover:text-[#5a3b1d]"
                    >
                      {link.label}
                    </Link>
                    {"："}
                    {link.text}
                  </p>
                ))}

                {section.bullets ? (
                  <ul className="space-y-3 rounded-[22px] border border-[rgba(86,58,33,0.08)] bg-[#fff8ee] p-5 text-[15px] leading-7 text-[#4f3d2e] sm:text-base">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#a5783f]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {section.steps ? (
                  <ol className="space-y-3 rounded-[22px] border border-[rgba(86,58,33,0.08)] bg-[#fff8ee] p-5 text-[15px] leading-7 text-[#4f3d2e] sm:text-base">
                    {section.steps.map((step, stepIndex) => (
                      <li key={step} className="flex gap-3">
                        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5a3b1d] text-sm font-semibold text-[#fff5e3]">
                          {stepIndex + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                ) : null}
              </section>
            ))}
          </div>

          <div className="mt-10 space-y-6 border-t border-[rgba(86,58,33,0.1)] pt-8">
            <section className="rounded-[24px] border border-[rgba(86,58,33,0.1)] bg-[#fff8ee] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.26em] text-[#9d7a4f]">
                Related Products
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-[#2a1a12]">
                相关商品推荐
              </h2>
              <p className="mt-2 text-sm leading-7 text-[#664f39]">
                看完文章后，可以直接跳回对应类目开始选购，让文章页和商品页形成更自然的站内链接。
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {article.relatedProducts.map((product) => (
                  <Link
                    key={product.href}
                    href={product.href}
                    className="inline-flex items-center justify-center rounded-full border border-[#d5c0a1] bg-white px-4 py-2 text-sm font-semibold text-[#5a3b1d] transition hover:border-[#b88b54] hover:bg-[#fff4df]"
                  >
                    {product.label}
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-[24px] border border-[rgba(86,58,33,0.1)] bg-[#fff8ee] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.26em] text-[#9d7a4f]">
                Related Articles
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-[#2a1a12]">
                延伸阅读
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {article.relatedArticles.map((relatedArticle) => (
                  <Link
                    key={relatedArticle.href}
                    href={relatedArticle.href}
                    className="rounded-[18px] border border-[#e5d7c3] bg-white px-4 py-4 text-sm font-medium leading-6 text-[#4f3d2e] transition hover:border-[#c79a64] hover:bg-[#fffdf8]"
                  >
                    {relatedArticle.label}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </article>

        <aside className="w-full shrink-0 lg:w-[320px]">
          <div className="sticky top-6 rounded-[28px] border border-[rgba(86,58,33,0.14)] bg-[rgba(255,248,238,0.95)] p-5 shadow-[0_20px_50px_rgba(135,101,59,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9d7a4f]">
              Quick Actions
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[#2a1a12]">
              看完文章，直接去选购
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#664f39]">
              浏览商品、加入购物车、确认订单并保存截图，再发送给客服确认，会比直接聊天询价更省时间。
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-[#5a3b1d] px-5 py-3 text-sm font-semibold text-[#fff6ea] transition hover:bg-[#704825]"
              >
                返回首页开始选购
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center justify-center rounded-full border border-[#d5c0a1] bg-white px-5 py-3 text-sm font-semibold text-[#5a3b1d] transition hover:bg-[#fff4df]"
              >
                查看更多文章
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
