import type { Metadata } from "next";
import { siteConfig } from "../../config/site";
import { routing } from "@/i18n/routing";

export function localeAlternates(path = ""): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    languages[locale] = `${siteConfig.url}${prefix}${path || ""}`;
  }
  return {
    canonical: languages.en,
    languages: {
      ...languages,
      "x-default": languages.en,
    },
  };
}

export function pageMetadata({
  title,
  description,
  path = "",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const imageUrl = new URL("/og.png", siteConfig.url).toString();
  const image = {
    url: imageUrl,
    width: 1200,
    height: 630,
    alt: `${siteConfig.name} — ${siteConfig.tagline}`,
    type: "image/png" as const,
  };

  return {
    title,
    description,
    alternates: localeAlternates(path),
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}${path}`,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
