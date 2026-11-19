"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

async function requireUser() {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return { supabase, user };
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function savePost(formData: FormData) {
  const { supabase, user } = await requireUser();
  const id = String(formData.get("id") ?? "");
  const titleText = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? titleText));
  const excerptText = String(formData.get("excerpt") ?? "").trim();
  const contentText = String(formData.get("content") ?? "");
  const cover = String(formData.get("cover_image_url") ?? "").trim() || null;
  const locale = String(formData.get("locale") ?? "en");
  const published = formData.get("published") === "on";
  const loc = locale === "am" || locale === "ar" ? locale : "en";

  if (!titleText || !slug) throw new Error("Title is required.");

  let existing: {
    title?: unknown;
    excerpt?: unknown;
    content?: unknown;
  } | null = null;
  if (id) {
    const { data } = await supabase
      .from("blog_posts")
      .select("title, excerpt, content")
      .eq("id", id)
      .maybeSingle();
    existing = data;
  }

  const mergeField = (prev: unknown, value: string) => {
    const base =
      prev && typeof prev === "object" && !Array.isArray(prev)
        ? { ...(prev as Record<string, string>) }
        : typeof prev === "string" && prev
          ? { en: prev }
          : {};
    return { ...base, [loc]: value };
  };

  const row = {
    title: mergeField(existing?.title, titleText),
    slug,
    excerpt: excerptText ? mergeField(existing?.excerpt, excerptText) : {},
    content: mergeField(existing?.content, contentText),
    cover_image_url: cover,
    published,
    published_at: published ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
    author_id: user.id,
  };

  const query = id
    ? supabase.from("blog_posts").update(row).eq("id", id)
    : supabase.from("blog_posts").insert(row);

  const { error } = await query;
  if (error) throw new Error(error.message);

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/admin");
}

export async function deletePost(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id") ?? "");
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/blog");
  redirect("/admin");
}

export async function deleteSocial(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id") ?? "");
  const { error } = await supabase.from("social_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/admin");
}

const coverageStatuses = ["new", "contacted", "closed"] as const;

export async function updateCoverageStatus(formData: FormData) {
  const { supabase } = await requireUser();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !coverageStatuses.includes(status as (typeof coverageStatuses)[number])) {
    throw new Error("Invalid coverage status.");
  }
  const { error } = await supabase.from("coverage_requests").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/coverage");
}
