import { fallbackBlogPosts } from "@/content/blog";
import {
  fallbackCameraProducts,
  fallbackFaqs,
  fallbackPackages,
  fallbackSettings,
} from "@/content/cms";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { site } from "@/lib/site";
import type {
  BlogPost,
  CoverageRequest,
  FaqRow,
  PackageRow,
  ProductRow,
  SiteSettings,
  SocialPost,
} from "@/types/database";

const fallbackFeeds: SocialPost[] = [
  {
    id: "linkedin-company",
    platform: "linkedin",
    url: site.social.linkedin,
    title: "IP security systems engineered for Ethiopian sites",
    thumbnail_url: "/media/social/linkedin.jpg",
    created_at: "2025-07-10T00:00:00.000Z",
  },
  {
    id: "facebook-page",
    platform: "facebook",
    url: site.social.facebook,
    title: "Command-ready installs across Addis Ababa campuses",
    thumbnail_url: "/media/social/facebook.jpg",
    created_at: "2024-10-01T00:00:00.000Z",
  },
  {
    id: "instagram-feed",
    platform: "instagram",
    url: site.social.facebook,
    title: "Night-ready coverage for gates, yards, and corridors",
    thumbnail_url: "/media/social/instagram.jpg",
    created_at: "2025-03-01T00:00:00.000Z",
  },
];

export async function getPublishedPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) return fallbackBlogPosts;
  const supabase = await createClient();
  if (!supabase) return fallbackBlogPosts;
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  const rows = (data as BlogPost[]) ?? [];
  return rows.length ? rows : fallbackBlogPosts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured()) {
    return fallbackBlogPosts.find((post) => post.slug === slug) ?? null;
  }
  const supabase = await createClient();
  if (!supabase) {
    return fallbackBlogPosts.find((post) => post.slug === slug) ?? null;
  }
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (data) return data as BlogPost;
  return fallbackBlogPosts.find((post) => post.slug === slug) ?? null;
}

export async function getPackages(): Promise<PackageRow[]> {
  if (!isSupabaseConfigured()) return fallbackPackages;
  const supabase = await createClient();
  if (!supabase) return fallbackPackages;
  const { data, error } = await supabase.from("packages").select("*").order("sort_order");
  if (error || !data?.length) return fallbackPackages;
  return data as PackageRow[];
}

export async function getSocialPosts(): Promise<SocialPost[]> {
  if (!isSupabaseConfigured()) return fallbackFeeds;
  const supabase = await createClient();
  if (!supabase) return fallbackFeeds;
  const { data } = await supabase
    .from("social_posts")
    .select("*")
    .order("created_at", { ascending: false });
  const rows = (data as SocialPost[]) ?? [];
  return rows.length ? rows : fallbackFeeds;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return fallbackSettings;
  const supabase = await createClient();
  if (!supabase) return fallbackSettings;
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();
  if (error || !data) return fallbackSettings;
  return { ...fallbackSettings, ...(data as SiteSettings) };
}

export async function getFaqs(): Promise<FaqRow[]> {
  if (!isSupabaseConfigured()) return fallbackFaqs;
  const supabase = await createClient();
  if (!supabase) return fallbackFaqs;
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  if (error || !data?.length) return fallbackFaqs;
  return data as FaqRow[];
}

export async function getCmsProducts(): Promise<ProductRow[]> {
  if (!isSupabaseConfigured()) return fallbackCameraProducts;
  const supabase = await createClient();
  if (!supabase) return fallbackCameraProducts;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  if (error || !data?.length) return fallbackCameraProducts;
  return data as ProductRow[];
}

export async function getCoverageRequests(): Promise<CoverageRequest[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("coverage_requests")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as CoverageRequest[]) ?? [];
}
