import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { buttonClass } from "@/components/ui/Button";
import { partners } from "@/content/partners";
import { featuredProjects } from "@/content/products";
import { siteConfig } from "../../../config/site";
import { getPublishedPosts } from "@/lib/queries";
import { pickLocalized } from "@/lib/i18n-fields";

/** Homepage product strip — distinct categories, not four camera twins. */
const featured = ["dome", "access", "metal", "hrm"] as const;

const pillarLinks = [
  { key: "solutions", href: "/solutions" },
  { key: "products", href: "/products" },
  { key: "support", href: "/contact" },
] as const;

export async function HomeSections({ locale }: { locale: string }) {
  const tStats = await getTranslations("stats");
  const tPillars = await getTranslations("pillars");
  const tProtect = await getTranslations("protect");
  const tProducts = await getTranslations("products");
  const tCta = await getTranslations("cta");
  const tHome = await getTranslations("home");
  const tBlog = await getTranslations("blog");
  const tAbout = await getTranslations("about");
  const posts = (await getPublishedPosts()).slice(0, 3);

  return (
    <>
      {/* 1. Proof — named projects + stats */}
      <section
        id="projects"
        className="scroll-mt-28 border-y border-border bg-panel/40 py-16 md:py-20"
      >
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              kicker={tHome("projectsKicker")}
              title={tHome("projectsTitle")}
              lead={tHome("projectsLead")}
            />
            <Link href="/about#projects" className={buttonClass("secondary")}>
              {tHome("projectsAll")}
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProjects.map((project) => (
              <Link
                key={project.id}
                href="/about#projects"
                className="group overflow-hidden rounded-[22px] border border-border bg-panel transition hover:border-accent/40 hover:shadow-[var(--shadow)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-background">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent" />
                  <p className="absolute bottom-3 start-3 end-3 text-[10px] font-medium tracking-[0.16em] text-accent uppercase">
                    {project.system}
                  </p>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base tracking-tight text-foreground md:text-lg">
                    {tAbout(`project_${project.id}`)}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 border-t border-border pt-10 md:grid-cols-4 md:gap-6">
            {siteConfig.stats.map((stat) => (
              <div key={stat.key}>
                <p className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-sm text-text-secondary">
                  {tStats(stat.key)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 2. Partners — logos link to brand sites */}
      <section id="partners" className="scroll-mt-28 py-16 md:py-20">
        <Container>
          <SectionHeader
            kicker={tHome("partnersKicker")}
            title={tHome("partnersTitle")}
            lead={tHome("partnersLead")}
          />
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {partners.map((partner) => (
              <li key={partner.id}>
                <a
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-[8.5rem] flex-col justify-between rounded-2xl border border-border bg-panel/70 p-4 transition hover:border-accent/45 hover:bg-panel hover:shadow-[var(--shadow)]"
                >
                  <span className="flex items-start justify-between gap-2">
                    <span className="flex h-14 w-full max-w-[9.5rem] items-center justify-center rounded-xl bg-white px-3 py-2 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={partner.logo}
                        alt=""
                        className="max-h-9 max-w-full object-contain"
                      />
                    </span>
                    <ArrowUpRight className="size-3.5 shrink-0 text-text-secondary opacity-0 transition group-hover:opacity-100 group-hover:text-accent" />
                  </span>
                  <span>
                    <span className="mt-3 block text-sm font-semibold tracking-tight text-foreground">
                      {partner.name}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-text-secondary">
                      {partner.focus}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 3. Pillars — clickable paths */}
      <section className="border-y border-border bg-panel/25 py-14 md:py-16">
        <Container>
          <SectionHeader
            kicker={tHome("pillarsKicker")}
            title={tHome("pillarsTitle")}
            lead={tHome("pillarsLead")}
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {pillarLinks.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className="group rounded-2xl border border-border bg-panel/60 p-6 transition hover:border-accent/40 hover:shadow-[var(--shadow)]"
              >
                <span className="flex items-start justify-between gap-3">
                  <h3 className="text-xl text-foreground">{tPillars(key)}</h3>
                  <ArrowUpRight className="mt-1 size-4 shrink-0 text-text-secondary transition group-hover:text-accent" />
                </span>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {tPillars(`${key}Body`)}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Products */}
      <section className="py-20 md:py-24">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              kicker={tProducts("kicker")}
              title={tHome("productsTitle")}
              lead={tHome("productsLead")}
            />
            <Link href="/products" className={buttonClass("secondary")}>
              {tCta("viewProducts")}
            </Link>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((id) => (
              <Link
                key={id}
                href={`/products/${id}`}
                className="group overflow-hidden rounded-[28px] border border-border bg-panel transition hover:border-accent/40 hover:shadow-[var(--shadow)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/products/${id}.jpg`}
                  alt=""
                  className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="p-5">
                  <h3 className="font-display text-lg tracking-tight text-foreground">
                    {tProducts(id)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {tProducts(`${id}Body`)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Slim protect / coverage CTA */}
      <section className="border-y border-border bg-[radial-gradient(ellipse_at_10%_0%,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_55%)] py-10 md:py-12">
        <Container>
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-xl tracking-tight text-foreground md:text-2xl">
                {tProtect("title")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary md:text-[15px]">
                {tProtect("body")}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link href="/coverage" className={buttonClass("primary")}>
                {tHome("designCoverage")}
              </Link>
              <Link href="/contact" className={buttonClass("secondary")}>
                {tCta("getInTouch")}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Compact blog teaser */}
      <section className="py-14 md:py-16">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-accent">{tBlog("kicker")}</p>
              <h2 className="mt-2 font-display text-2xl tracking-tight text-foreground md:text-3xl">
                {tHome("blogTitle")}
              </h2>
            </div>
            <Link href="/blog" className={buttonClass("secondary")}>
              {tHome("blogAll")}
            </Link>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {posts.map((post) => {
              const title = pickLocalized(post.title, locale);
              const excerpt = pickLocalized(post.excerpt, locale);
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex gap-3 rounded-2xl border border-border bg-panel/50 p-3 transition hover:border-accent/35 hover:bg-panel"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.cover_image_url || "/products/nvr.jpg"}
                    alt=""
                    className="size-16 shrink-0 rounded-xl object-cover md:size-[4.5rem]"
                  />
                  <div className="min-w-0 py-0.5">
                    <h3 className="line-clamp-2 font-display text-[15px] leading-snug tracking-tight text-foreground">
                      {title}
                    </h3>
                    {excerpt ? (
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-secondary">
                        {excerpt}
                      </p>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
