import { NEWS_DATA } from "./news-data";

export interface NewsItem {
  title: string;
  summary: string;
  url: string;
}

export interface DailyNews {
  date: string; // YYYY-MM-DD
  aiNews: NewsItem[];
  internetNews: NewsItem[];
  englishReminder?: {
    count: number;
    url: string;
  };
}

export function getAllNews(): DailyNews[] {
  return NEWS_DATA as unknown as DailyNews[];
}

export function getNewsByDate(date: string): DailyNews | null {
  return getAllNews().find((n) => n.date === date) ?? null;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00+08:00");
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}
