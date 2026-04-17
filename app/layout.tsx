import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "雾里小铺 Wooli",
  description: "复刻商品展示与购物车页面"
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
