import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BackLink } from "@/components/ui/BackLink";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { pickLocalized } from "@/lib/i18n-fields";
import { getPublishedPosts } from "@/lib/queries";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const cta = await getTranslations("cta");
  const posts = await getPublishedPosts();

  return (
    <article className="pb-24 pt-28">
      <Container className="max-w-5xl">
        <BackLink href="/" label={cta("backHome")} />
        <SectionHeader as="h1" kicker={t("kicker")} title={t("title")} />
        {posts.length === 0 ? (
          <div className="mt-14 overflow-hidden rounded-[32px] border border-border bg-panel">
            <div className="grid md:grid-cols-[1.1fr_0.9fr]">
              <div className="p-8 md:p-10">
                <p className="font-display text-2xl tracking-tight text-foreground">
                  {t("empty")}
                </p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
                  {t("emptyHint")}
                </p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/products/nvr.jpg"
                alt=""
                className="hidden h-full min-h-[220px] w-full object-cover md:block"
              />
            </div>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {posts.map((post) => {
              const title = pickLocalized(post.title, locale);
              const excerpt = pickLocalized(post.excerpt, locale);
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-[28px] border border-border bg-panel transition hover:border-accent/35 hover:shadow-[var(--shadow)]"
                >
                  {post.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.cover_image_url}
                      alt=""
                      className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="aspect-[16/10] bg-[radial-gradient(circle_at_30%_20%,color-mix(in_srgb,var(--accent)_28%,transparent),transparent_55%),linear-gradient(160deg,var(--panel),var(--background))]" />
                  )}
                  <div className="p-6">
                    <p className="text-xs tracking-wide text-text-secondary">
                      {new Date(post.published_at || post.created_at).toLocaleDateString(locale)}
                    </p>
                    <h2 className="mt-2 font-display text-2xl tracking-tight text-foreground">
                      {title}
                    </h2>
                    {excerpt ? (
                      <p className="mt-3 text-sm leading-relaxed text-text-secondary">{excerpt}</p>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </article>
  );
}
