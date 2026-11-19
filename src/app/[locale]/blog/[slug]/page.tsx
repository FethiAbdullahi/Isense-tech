import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArticleJsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site";
import { pickLocalized } from "@/lib/i18n-fields";
import { getPostBySlug } from "@/lib/queries";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const t = await getTranslations("blog");
  const title = pickLocalized(post.title, locale);
  const excerpt = pickLocalized(post.excerpt, locale);
  const content = pickLocalized(post.content, locale);
  const prefix = locale === "en" ? "" : `/${locale}`;
  const url = `${siteConfig.url}${prefix}/blog/${post.slug}`;

  return (
    <article className="pb-24 pt-28">
      <ArticleJsonLd
        title={title}
        description={excerpt || title}
        url={url}
        image={post.cover_image_url}
        datePublished={post.published_at || post.created_at}
      />
      <Container className="max-w-3xl">
        <Link href="/blog" className="text-sm text-text-secondary hover:text-accent">
          ← {t("back")}
        </Link>
        <h1 className="mt-5 text-4xl tracking-tight">{title}</h1>
        <p className="mt-3 text-xs tracking-wide text-text-secondary">
          {new Date(post.published_at || post.created_at).toLocaleDateString(locale)}
        </p>
        {post.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt=""
            className="mt-8 aspect-video w-full rounded-2xl object-cover"
          />
        ) : null}
        <div
          className="prose-security mt-8"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Container>
    </article>
  );
}
