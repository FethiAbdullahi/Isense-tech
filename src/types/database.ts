import type { LocalizedString } from "@/lib/i18n-fields";

export type BlogPost = {
  id: string;
  slug: string;
  title: LocalizedString | string;
  excerpt: LocalizedString | string | null;
  content: LocalizedString | string;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
  /** legacy single-locale field */
  locale?: string;
};

export type SocialPost = {
  id: string;
  platform: "instagram" | "linkedin" | "facebook";
  url: string;
  title: string | null;
  thumbnail_url: string | null;
  created_at: string;
};

export type ProductRow = {
  id: string;
  category: string;
  sort_order: number;
  title: LocalizedString;
  excerpt: LocalizedString;
  body: LocalizedString;
  specs: { k: string; v: string }[];
  image_url: string | null;
  published: boolean;
};

export type PackageRow = {
  id: string;
  sector: "home" | "office" | "factory" | "campus";
  name: LocalizedString;
  min_cameras: number;
  max_cameras: number;
  description: LocalizedString;
  sort_order: number;
};

export type FaqRow = {
  id: string;
  tags: string[];
  question: LocalizedString;
  answer: LocalizedString;
  sort_order: number;
  published: boolean;
};

export type SiteSettings = {
  id: string;
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  map_embed_url: string | null;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
};

export type CoverageRequest = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  notes: string | null;
  sector: "home" | "office" | "factory" | "campus";
  layout: unknown;
  camera_count: number;
  coverage_percent: number;
  language: string;
  status: "new" | "contacted" | "closed";
};

export const cameraLabel: Record<SocialPost["platform"], string> = {
  instagram: "CAM 01",
  linkedin: "CAM 02",
  facebook: "CAM 03",
};
