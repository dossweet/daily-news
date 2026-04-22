#!/usr/bin/env node
/**
 * 每日资讯生成脚本
 * 用法: node scripts/generate-news.js
 *
 * 数据来源:
 * - 36kr RSS (AI/科技新闻)
 * - 实在智能的AI资讯
 *
 * 生成的新闻会写入 public/data/news.json
 * 同时更新 src/lib/news-data.ts 作为内置数据
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const DATA_DIR = path.join(__dirname, "..", "public", "data");
const NEWS_FILE = path.join(DATA_DIR, "news.json");
const NEWS_DATA_FILE = path.join(__dirname, "..", "src", "lib", "news-data.ts");

// 确保目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 获取 RSS 内容
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, { timeout: 10000 }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.on("timeout", () => reject(new Error("Request timeout")));
  });
}

// 解析 RSS XML
function parseRSS(xml) {
  const items = [];
  const itemMatches = xml.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || [];
  for (const item of itemMatches.slice(0, 10)) {
    const getContent = (tag) => {
      const m = item.match(new RegExp(`<${tag}[^>]*><!\[CDATA\[([\s\S]*?)\]\]></${tag}>|<${tag}[^>]*>([\s\S]*?)</${tag}>`, "i"));
      return m ? (m[1] || m[2] || "").trim() : "";
    };
    const title = getContent("title");
    const link = getContent("link");
    const description = getContent("description")
      .replace(/<[^>]+>/g, "")
      .replace(/&[^;]+;/g, " ")
      .slice(0, 120);
    if (title && link) {
      items.push({ title, url: link, summary: description });
    }
  }
  return items;
}

async function fetch36kr() {
  try {
    const xml = await fetchUrl("https://36kr.com/feed");
    return parseRSS(xml);
  } catch (e) {
    console.warn("36kr fetch failed:", e.message);
    return [];
  }
}

async function fetchZhismart() {
  try {
    const xml = await fetchUrl("https://www.zhismart.com/feed/");
    return parseRSS(xml);
  } catch (e) {
    console.warn("zhismart fetch failed:", e.message);
    return [];
  }
}

function getToday() {
  const now = new Date();
  const offset = now.getTimezoneOffset() / 60;
  const chinaDate = new Date(now.getTime() - offset * 60 * 60 * 1000);
  return chinaDate.toISOString().slice(0, 10);
}

function loadExistingNews() {
  if (fs.existsSync(NEWS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(NEWS_FILE, "utf-8"));
    } catch {
      return [];
    }
  }
  return [];
}

function saveNews(newsItems) {
  const existing = loadExistingNews();
  const today = getToday();

  // 检查今天是否已有数据，有则覆盖
  const filtered = existing.filter((n) => n.date !== today);
  const updated = [newsItems, ...filtered].sort((a, b) => b.date.localeCompare(a.date));

  fs.writeFileSync(NEWS_FILE, JSON.stringify(updated, null, 2), "utf-8");

  // 生成 news-data.ts
  const tsContent = `// Auto-generated news data\n// Generated at: ${new Date().toISOString()}\n\nexport const NEWS_DATA = ${JSON.stringify(updated, null, 2)} as const;\n`;
  fs.writeFileSync(NEWS_DATA_FILE, tsContent, "utf-8");

  console.log(`✅ 生成 ${today} 的资讯，共 ${newsItems.aiNews.length} 条AI + ${newsItems.internetNews.length} 条互联网动态`);
}

async function main() {
  console.log("📡 开始抓取资讯...");

  const [aiNews, internetNews] = await Promise.all([
    fetch36kr(),
    fetchZhismart(),
  ]);

  if (aiNews.length === 0 && internetNews.length === 0) {
    console.error("❌ 未能获取任何新闻数据，请检查网络连接");
    process.exit(1);
  }

  const today = getToday();
  const englishReminder = getEnglishReminder();

  saveNews({
    date: today,
    aiNews: aiNews.slice(0, 8),
    internetNews: internetNews.slice(0, 8),
    englishReminder,
  });
}

function getEnglishReminder() {
  const englishFile = path.join(
    process.env.HOME || "/Users/dossweet",
    ".openclaw",
    "memory",
    "english-daily.json"
  );
  try {
    if (fs.existsSync(englishFile)) {
      const data = JSON.parse(fs.readFileSync(englishFile, "utf-8"));
      const totalLearned = data.totalLearned || data.learnedCount || 0;
      const remaining = Math.max(0, 30 - totalLearned);
      if (remaining > 0) {
        return {
          count: remaining,
          url: "https://english-app-ten.vercel.app/archive",
        };
      }
    }
  } catch {}
  return null;
}

main().catch(console.error);
