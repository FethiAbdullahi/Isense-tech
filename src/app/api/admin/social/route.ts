import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { detectPlatform, fetchLinkPreview } from "@/lib/og";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return Response.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return Response.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    url?: string;
    title?: string;
    thumbnailUrl?: string;
  } | null;

  const url = body?.url?.trim() ?? "";
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return Response.json({ error: "Invalid URL" }, { status: 400 });
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return Response.json({ error: "Invalid URL" }, { status: 400 });
  }

  const preview = await fetchLinkPreview(url, process.env.META_ACCESS_TOKEN);
  const platform = preview.platform === "other" ? detectPlatform(url) : preview.platform;
  if (platform === "other") {
    return Response.json(
      { error: "Only Instagram, LinkedIn, and Facebook URLs are accepted." },
      { status: 400 },
    );
  }

  const title = body?.title?.trim() || preview.title || url;
  const thumbnail = body?.thumbnailUrl?.trim() || preview.thumbnailUrl;

  const { error } = await supabase.from("social_posts").insert({
    platform,
    url,
    title,
    thumbnail_url: thumbnail,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 403 });
  }

  return Response.json({ ok: true });
}
