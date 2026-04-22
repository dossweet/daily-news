import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-7xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-slate-700 mb-2">未找到该期资讯</h1>
        <p className="text-slate-500 mb-6">这期资讯可能不存在或已被移除</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          ← 返回首页
        </Link>
      </div>
    </main>
  );
}
