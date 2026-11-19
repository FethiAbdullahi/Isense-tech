import { siteConfig } from "../../../../config/site";
import { analyzeCoverage, isLayout, type Sector } from "@/lib/coverage-math";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const buckets = new Map<string, number[]>();

const SECTORS = new Set<Sector>(["home", "office", "factory", "campus"]);
const LOCALES = new Set(["en", "am", "ar"]);

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0]?.trim();
    if (ip) return ip;
  }
  return request.headers.get("x-real-ip")?.trim() || "local";
}

function allowRequest(ip: string) {
  const now = Date.now();
  const recent = (buckets.get(ip) ?? []).filter((stamp) => now - stamp < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    buckets.set(ip, recent);
    return false;
  }
  recent.push(now);
  buckets.set(ip, recent);
  if (buckets.size > 2000) {
    for (const [key, stamps] of buckets) {
      if (stamps.every((stamp) => now - stamp >= WINDOW_MS)) buckets.delete(key);
    }
  }
  return true;
}

function ok(stored: boolean) {
  return Response.json({ ok: true, stored, whatsappUrl: siteConfig.whatsappUrl });
}

export async function POST(request: Request) {
  if (!allowRequest(clientIp(request))) {
    return Response.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": "600" } });
  }

  const body = (await request.json().catch(() => null)) as {
    name?: string;
    phone?: string;
    email?: string;
    notes?: string;
    company_website?: string;
    language?: string;
    layout?: unknown;
    camera_count?: number;
    coverage_percent?: number;
  } | null;

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  if (typeof body.company_website === "string" && body.company_website.trim()) {
    return ok(false);
  }

  const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
  const name = text(body.name);
  const phone = text(body.phone);
  const email = text(body.email);
  const notes = text(body.notes) || null;
  const language = LOCALES.has(text(body.language)) ? text(body.language) : "";
  const phoneDigits = phone.replace(/\D/g, "");

  if (
    name.length < 2 ||
    name.length > 120 ||
    phoneDigits.length < 6 ||
    phoneDigits.length > 15 ||
    email.length > 200 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !language ||
    (notes !== null && notes.length > 2000) ||
    typeof body.camera_count !== "number" ||
    !Number.isFinite(body.camera_count) ||
    typeof body.coverage_percent !== "number" ||
    !Number.isFinite(body.coverage_percent) ||
    body.coverage_percent < 0 ||
    body.coverage_percent > 100 ||
    !isLayout(body.layout) ||
    !SECTORS.has(body.layout.sector)
  ) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const layout = body.layout;
  const analysis = analyzeCoverage(layout);

  if (!isSupabaseConfigured()) return ok(false);

  const supabase = await createClient();
  if (!supabase) return ok(false);

  const { error } = await supabase.from("coverage_requests").insert({
    name,
    phone,
    email,
    notes,
    sector: layout.sector,
    layout,
    camera_count: layout.cameras.length,
    coverage_percent: analysis.percent,
    language,
  });

  if (error) {
    return Response.json({ error: "Could not store layout" }, { status: 500 });
  }

  return ok(true);
}
