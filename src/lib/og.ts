export type LinkPreview = {
  title: string;
  thumbnailUrl: string | null;
  platform: "instagram" | "linkedin" | "facebook" | "other";
};

export function detectPlatform(url: string): LinkPreview["platform"] {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.includes("instagram.com")) return "instagram";
    if (host.includes("linkedin.com")) return "linkedin";
    if (host.includes("facebook.com") || host.includes("fb.com")) {
      return "facebook";
    }
    return "other";
  } catch {
    return "other";
  }
}

function metaContent(html: string, keys: string[]) {
  for (const key of keys) {
    const property = html.match(
      new RegExp(
        `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["']`,
        "i",
      ),
    );
    if (property?.[1]) return decodeHtml(property[1]);
    const reverse = html.match(
      new RegExp(
        `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["']`,
        "i",
      ),
    );
    if (reverse?.[1]) return decodeHtml(reverse[1]);
  }
  return null;
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export async function fetchLinkPreview(
  url: string,
  metaToken?: string,
): Promise<LinkPreview> {
  const platform = detectPlatform(url);

  if (platform === "linkedin") {
    const oembed = await fetch(
      `https://www.linkedin.com/oauth/v2/oembed?url=${encodeURIComponent(url)}`,
      { next: { revalidate: 0 } },
    ).catch(() => null);
    if (oembed?.ok) {
      const data = (await oembed.json()) as {
        title?: string;
        thumbnail_url?: string;
      };
      return {
        platform,
        title: data.title ?? url,
        thumbnailUrl: data.thumbnail_url ?? null,
      };
    }
  }

  if ((platform === "instagram" || platform === "facebook") && metaToken) {
    const oembedEndpoint =
      platform === "instagram"
        ? "https://graph.facebook.com/v21.0/instagram_oembed"
        : "https://graph.facebook.com/v21.0/oembed_post";
    const oembed = await fetch(
      `${oembedEndpoint}?url=${encodeURIComponent(url)}&access_token=${metaToken}`,
      { next: { revalidate: 0 } },
    ).catch(() => null);
    if (oembed?.ok) {
      const data = (await oembed.json()) as {
        title?: string;
        thumbnail_url?: string;
        author_name?: string;
      };
      return {
        platform,
        title: data.title || data.author_name || url,
        thumbnailUrl: data.thumbnail_url ?? null,
      };
    }
  }

  const page = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; iSensePreview/1.0; +https://isense-tech.com)",
      Accept: "text/html",
    },
    next: { revalidate: 0 },
  }).catch(() => null);

  if (page?.ok) {
    const html = await page.text();
    const title =
      metaContent(html, ["og:title", "twitter:title"]) ||
      html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ||
      url;
    const thumbnailUrl = metaContent(html, [
      "og:image",
      "og:image:url",
      "twitter:image",
    ]);
    return { platform, title: title.trim(), thumbnailUrl };
  }

  return { platform, title: url, thumbnailUrl: null };
}
