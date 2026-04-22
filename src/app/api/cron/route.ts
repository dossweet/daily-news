import { NextResponse } from "next/server";
import { execSync } from "child_process";
import path from "path";

export async function GET() {
  // Vercel Cron 安全验证（可选）
  const authHeader = process.env.VERCEL_CRONTROL_SECRET;
  const reqAuth = process.env.VERCEL_CRONTROL_AUTH || "";
  if (authHeader && reqAuth !== authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const scriptPath = path.join(process.cwd(), "scripts", "generate-news.js");
    execSync(`node "${scriptPath}"`, {
      stdio: "inherit",
      timeout: 60_000,
    });
    return NextResponse.json({
      ok: true,
      time: new Date().toISOString(),
      tz: "Asia/Shanghai",
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
