import Link from "next/link";
import { getAllNews, formatDate } from "@/lib/news";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const allNews = getAllNews();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <h1 className="text-2xl font-bold text-slate-800">
            📰 每日资讯
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            AI前沿 · 互联网动态 · 每日8点更新
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {allNews.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-slate-500 text-lg">暂无资讯数据</p>
            <p className="text-slate-400 text-sm mt-2">每日早上8点自动抓取更新</p>
          </div>
        ) : (
          <div className="space-y-4">
            {allNews.map((news) => (
              <Link
                key={news.date}
                href={`/news/${news.date}`}
                className="block bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                      {formatDate(news.date)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                        🤖 AI前沿 {news.aiNews.length}条
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                        🌐 互联网动态 {news.internetNews.length}条
                      </span>
                      {news.englishReminder && (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">
                          📚 英语学习
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-blue-400 transition-colors text-lg mt-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-8">
        <div className="max-w-3xl mx-auto px-4 py-5 text-center text-xs text-slate-400">
          由 <span className="text-slate-500">小谷</span> 的 AI 助手自动生成 · 每日8点更新
        </div>
      </footer>
    </main>
  );
}
