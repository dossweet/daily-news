每天早上8点抓取并推送今日AI前沿和互联网行业资讯。同时把数据更新到网站。格式如下：

📰 每日资讯 · [日期]

【AI 前沿】
• [标题] - 一句话描述
  🔗 链接

【互联网动态】
• [标题] - 一句话描述
  🔗 链接

---
📚 **英语学习提醒**
你有 {n} 个表达还没学习，点击展开就算学习了哦！
👉 https://english-app-ten.vercel.app/archive

其中 {n} = 30 - 已在 ~/.openclaw/memory/english-daily.json 中记录的历史学习总数。如果 {n}=0（全部学完），则省略整条英语提醒。

## 网站更新任务
抓取完成后，请执行以下命令更新网站数据：

```bash
# 1. 获取现有数据
cp ~/clawd/daily-news/public/data/news.json /tmp/news-backup.json 2>/dev/null || echo '{"news":[]}' > /tmp/news-backup.json

# 2. 生成新的新闻数据（用 Node.js 脚本）
cat > /tmp/update-news.mjs << 'EOF'
import { readFileSync, writeFileSync } from 'fs';

const today = new Date().toISOString().slice(0, 10);
const backup = JSON.parse(readFileSync('/tmp/news-backup.json', 'utf-8'));

// 从 agent 的回答中提取 AI 前沿和互联网动态
// 生成新的数据条目
const newEntry = {
  date: today,
  // AI前沿和互联网动态从上下文中提取
};

const existing = backup.news || [];
const filtered = existing.filter(n => n.date !== today);
const updated = [newEntry, ...filtered];
writeFileSync('~/clawd/daily-news/public/data/news.json', JSON.stringify({news: updated}, null, 2));
EOF

# 3. 直接用 jq 更新 JSON（更可靠）
# 今天的数据从 cron 的 summary 中获取

# 4. 同时更新 news-data.ts
```

由于你无法直接构造数据，最简单的方式是：
1. 在生成完资讯后，将完整的资讯内容（日期、AI前沿列表、互联网动态列表）保存到文件
2. 使用简单的方式写入 ~/clawd/daily-news/public/data/news.json
3. 更新 ~/clawd/daily-news/src/lib/news-data.ts

网站数据路径：
- JSON数据: ~/clawd/daily-news/public/data/news.json
- TS数据: ~/clawd/daily-news/src/lib/news-data.ts

数据格式：
```json
{
  "news": [
    {
      "date": "2026-04-22",
      "aiNews": [
        {"title": "标题", "summary": "描述", "url": "链接"}
      ],
      "internetNews": [
        {"title": "标题", "summary": "描述", "url": "链接"}
      ],
      "englishReminder": {
        "count": 30,
        "url": "https://english-app-ten.vercel.app/archive"
      }
    }
  ]
}
```

请把今天的资讯追加到 news.json 中（如果当天已存在则覆盖），同时更新 news-data.ts。