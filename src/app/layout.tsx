import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "每日资讯 - AI前沿 · 互联网动态",
  description: "每日早上8点自动抓取AI前沿和互联网行业资讯",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
