import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    company_website?: string;
  } | null;

  if (body?.company_website) {
    return Response.json({ ok: true });
  }

  const ip = clientIp(request);
  const limit = rateLimit(`contact:${ip}`);
  if (!limit.ok) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const name = body?.name?.trim() ?? "";
  const email = body?.email?.trim() ?? "";
  const message = body?.message?.trim() ?? "";
  const phone = body?.phone?.trim() || null;

  if (!name || !email || !message || !email.includes("@")) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return Response.json({ ok: true, stored: false });
  }

  const supabase = await createClient();
  if (!supabase) {
    return Response.json({ ok: true, stored: false });
  }

  const { error } = await supabase.from("contact_inquiries").insert({
    name,
    email,
    phone,
    message,
  });

  if (error) {
    return Response.json({ error: "Could not store inquiry" }, { status: 500 });
  }

  return Response.json({ ok: true, stored: true });
}
