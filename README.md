# 📰 每日资讯站点

AI前沿 + 互联网动态可视化站点，基于 Next.js + TailwindCSS，部署在 Vercel。

---

## 🚀 快速部署

### 1. 创建 GitHub 仓库

```bash
cd ~/clawd/daily-news
git init
git add .
git commit -m "Initial commit"
gh repo create daily-news --public --source=. --push
```

### 2. 连接到 Vercel

1. 访问 [vercel.com](https://vercel.com) 登录
2. 点击 "New Project" → 导入刚才的仓库
3. Framework Preset 选择 **Next.js**
4. 点击 Deploy

部署完成会自动分配 `https://daily-news.vercel.app` 域名。

---

## 🔄 自动更新（Vercel Cron）

### 方案一：Vercel Cron Job（推荐）

在 `vercel.json` 中配置：

```json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 0 * * *"
    }
  ]
}
```

创建 `src/app/api/cron/route.ts`：

```typescript
import { NextResponse } from "next/server";
import { execSync } from "child_process";
import path from "path";

export async function GET() {
  try {
    const scriptPath = path.join(process.cwd(), "scripts", "generate-news.js");
    execSync(`node ${scriptPath}`, { stdio: "inherit" });
    return NextResponse.json({ ok: true, time: new Date().toISOString() });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
```

> ⚠️ Vercel Cron 需要在项目设置中开启 Cron Jobs 权限。

### 方案二：本地 Cron（继续用 OpenClaw）

当前 `openclaw cron` 已经在每天早上8点运行，生成飞书推送。
可以扩展它，同时触发网站数据更新。

---

## 📁 项目结构

```
daily-news/
├── src/
│   ├── app/
│   │   ├── page.tsx              # 首页：资讯列表
│   │   ├── news/[date]/page.tsx  # 详情页
│   │   └── not-found.tsx
│   └── lib/
│       ├── news.ts                # 数据读取逻辑
│       └── news-data.ts           # 内置静态数据（自动生成）
├── scripts/
│   └── generate-news.js          # 抓取脚本
├── public/
│   └── data/
│       └── news.json             # JSON 数据文件
└── vercel.json                   # Vercel 配置
```

---

## 🛠 本地开发

```bash
cd ~/clawd/daily-news
npm run dev
# 访问 http://localhost:3000
```

手动生成当日资讯：
```bash
node scripts/generate-news.js
```

---

## 📝 数据格式

```typescript
interface DailyNews {
  date: string; // "2026-04-22"
  aiNews: NewsItem[];        // AI 前沿
  internetNews: NewsItem[];  // 互联网动态
  englishReminder?: {       // 可选，英语学习提醒
    count: number;
    url: string;
  };
}

interface NewsItem {
  title: string;
  summary: string;
  url: string;
}
```

---

## 🔧 自定义数据源

编辑 `scripts/generate-news.js`，修改 RSS 源：

```javascript
const RSS_SOURCES = {
  aiNews: [
    "https://36kr.com/feed",           // 36氪
    "https://feeds.feedburner.com/toutiao", // 今日头条
  ],
  internetNews: [
    "https://www.ifairer.com/feed/",    // 互联网动态
  ],
};
```
