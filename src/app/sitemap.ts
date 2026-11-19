import type { MetadataRoute } from "next";
import { siteConfig } from "../../config/site";
import { products } from "@/content/products";
import { routing } from "@/i18n/routing";
import { getPublishedPosts } from "@/lib/queries";

const staticPaths = [
  "",
  "/about",
  "/services",
  "/products",
  "/solutions",
  "/coverage",
  "/specifications",
  "/contact",
  "/blog",
];

function localeUrl(locale: string, path: string) {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${siteConfig.url}${prefix}${path || "/"}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of staticPaths) {
      entries.push({
        url: localeUrl(locale, path),
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, localeUrl(l, path)]),
          ),
        },
      });
    }
    for (const product of products) {
      const path = `/products/${product.id}`;
      entries.push({
        url: localeUrl(locale, path),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    for (const post of posts) {
      entries.push({
        url: localeUrl(locale, `/blog/${post.slug}`),
        lastModified: new Date(post.updated_at || post.created_at),
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
