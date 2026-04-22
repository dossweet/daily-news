import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllNews, getNewsByDate, formatDate } from "@/lib/news";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ date: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const news = getNewsByDate(date);
  if (!news) return { title: "未找到" };
  return {
    title: `每日资讯 · ${date}`,
    description: `${formatDate(date)} AI前沿${news.aiNews.length}条 + 互联网动态${news.internetNews.length}条`,
  };
}

export async function generateStaticParams() {
  const allNews = getAllNews();
  return allNews.map((n) => ({ date: n.date }));
}

export default async function NewsDetailPage({ params }: Props) {
  const { date } = await params;
  const news = getNewsByDate(date);

  if (!news) notFound();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-slate-400 hover:text-slate-700 transition-colors text-sm flex items-center gap-1"
            >
              ← 返回
            </Link>
            <span className="text-slate-300">|</span>
            <h1 className="text-lg font-bold text-slate-800">
              📰 每日资讯 · {formatDate(date)}
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* AI 前沿 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🤖</span>
            <h2 className="text-xl font-bold text-slate-800">AI 前沿</h2>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
              {news.aiNews.length}条
            </span>
          </div>
          <div className="space-y-3">
            {news.aiNews.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 font-bold text-sm mt-0.5 w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-700 font-medium leading-snug">
                      {item.title}
                    </p>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                      {item.summary}
                    </p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-500 text-xs mt-2 hover:underline"
                    >
                      🔗 阅读全文
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 互联网动态 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🌐</span>
            <h2 className="text-xl font-bold text-slate-800">互联网动态</h2>
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">
              {news.internetNews.length}条
            </span>
          </div>
          <div className="space-y-3">
            {news.internetNews.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <span className="text-purple-500 font-bold text-sm mt-0.5 w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-700 font-medium leading-snug">
                      {item.title}
                    </p>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                      {item.summary}
                    </p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-purple-500 text-xs mt-2 hover:underline"
                    >
                      🔗 阅读全文
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 英语学习提醒 */}
        {news.englishReminder && (
          <section className="bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📚</span>
              <h2 className="text-lg font-bold text-green-700">英语学习提醒</h2>
            </div>
            <p className="text-green-700 text-sm leading-relaxed">
              你有{" "}
              <span className="font-bold text-green-800 text-base">
                {news.englishReminder.count}
              </span>{" "}
              个表达还没学习，点击展开就算学习了哦！
            </p>
            <a
              href={news.englishReminder.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-green-600 text-sm mt-3 font-medium hover:underline"
            >
              👉 前往学习 →
            </a>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-8">
        <div className="max-w-3xl mx-auto px-4 py-5 text-center text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-600 transition-colors">
            ← 返回资讯列表
          </Link>
        </div>
      </footer>
    </main>
  );
}
