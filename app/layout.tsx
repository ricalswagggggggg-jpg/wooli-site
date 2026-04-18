import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wooli.me"),
  title: {
    default: "雾里小铺 Wooli",
    template: "%s | 雾里小铺 Wooli"
  },
  description:
    "雾里小铺 Wooli 提供电子烟、烟弹、一次性电子烟与周边商品展示，支持购物车确认、订单截图与客服微信联系。",
  keywords: [
    "雾里小铺",
    "Wooli",
    "北美电子烟",
    "wooli电子烟",
    "wooli小铺",
    "雾里电子烟",
    "电子烟",
    "纽约电子烟",
    "烟弹",
    "一次性电子烟",
    "Relx",
    "Icemax",
    "Icebomb",
    "Snowplus",
    "美国电子烟",
    "美国电子烟网站",
    "vapor",
    "vape near me",
    "电子烟 附近",
    "烟店",
    "电子烟网站",
    "电子烟购买",
    "哪里买电子烟",
    "哪里可以买到电子烟",
    "wooli.me"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: "https://www.wooli.me",
    siteName: "雾里小铺 Wooli",
    title: "雾里小铺 Wooli",
    description:
      "雾里小铺 Wooli 提供电子烟、烟弹、一次性电子烟与周边商品展示，支持购物车确认、订单截图与客服微信联系。",
    locale: "zh_CN",
    images: [
      {
        url: "/site-logo.jpg",
        width: 400,
        height: 400,
        alt: "雾里小铺 Wooli"
      }
    ]
  },
  twitter: {
    card: "summary",
    title: "雾里小铺 Wooli",
    description:
      "雾里小铺 Wooli 提供电子烟、烟弹、一次性电子烟与周边商品展示，支持购物车确认、订单截图与客服微信联系。",
    images: ["/site-logo.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  icons: {
    icon: "/site-logo.jpg",
    shortcut: "/site-logo.jpg",
    apple: "/site-logo.jpg"
  },
  category: "shopping"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
