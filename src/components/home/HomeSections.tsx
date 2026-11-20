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

  const railPartners = [...partners, ...partners];

  return (
    <>
      {/* 1. Proof — film strip commissions + inline stats */}
      <section
        id="projects"
        className="scroll-mt-28 border-y border-border bg-panel/50 py-16 md:py-20"
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

          <div className="mt-10 -mx-4 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
            <ul className="flex min-w-max gap-0 border-y border-border md:min-w-0 md:w-full">
              {featuredProjects.map((project, index) => (
                <li
                  key={project.id}
                  className="relative flex w-[min(72vw,18rem)] shrink-0 flex-col border-e border-border last:border-e-0 md:w-auto md:flex-1"
                >
                  <Link
                    href="/about#projects"
                    className="group flex h-full flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-background">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.image}
                        alt=""
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col gap-2 px-4 py-5">
                      <p className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
                        {String(index + 1).padStart(2, "0")} · {project.system}
                      </p>
                      <h3 className="font-display text-xl leading-tight tracking-tight text-foreground md:text-2xl">
                        {tAbout(`project_${project.id}`)}
                      </h3>
                      <span className="mt-auto inline-flex items-center gap-1 pt-3 font-mono text-[10px] tracking-[0.14em] text-text-secondary uppercase transition group-hover:text-accent">
                        {tHome("projectsAll")}
                        <ArrowUpRight className="size-3" />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-4 border-t border-border pt-8 md:gap-x-12">
            {siteConfig.stats.map((stat) => (
              <p
                key={stat.key}
                className="font-display text-2xl tracking-tight text-foreground md:text-3xl"
              >
                {stat.value}
                <span className="ms-2 font-sans text-sm font-normal text-text-secondary md:text-[15px]">
                  {tStats(stat.key)}
                </span>
              </p>
            ))}
          </div>
        </Container>
      </section>

      {/* 2. Partners — drifting wordmark rail */}
      <section id="partners" className="scroll-mt-28 overflow-hidden py-16 md:py-20">
        <Container>
          <SectionHeader
            kicker={tHome("partnersKicker")}
            title={tHome("partnersTitle")}
            lead={tHome("partnersLead")}
          />
        </Container>

        <div className="relative mt-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 start-0 z-10 w-16 bg-gradient-to-r from-background to-transparent md:w-24"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 end-0 z-10 w-16 bg-gradient-to-l from-background to-transparent md:w-24"
          />
          <div className="partner-rail-track flex w-max items-center gap-0">
            {railPartners.map((partner, i) => (
              <a
                key={`${partner.id}-${i}`}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative mx-8 flex h-20 shrink-0 items-center md:mx-12 md:h-24"
                title={partner.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-10 max-w-[9rem] object-contain opacity-45 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0 md:max-h-12 md:max-w-[11rem]"
                />
                <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-accent transition duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Pillars — full-bleed columns with diagonal separators */}
      <section className="border-y border-border bg-panel/40 py-0">
        <div className="grid md:grid-cols-3">
          {pillarLinks.map(({ key, href }, index) => (
            <Link
              key={key}
              href={href}
              className="group relative border-b border-border px-6 py-14 transition hover:bg-panel-elevated/40 md:border-b-0 md:px-8 md:py-16 lg:px-12"
            >
              {index > 0 ? (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-8 start-0 hidden w-px bg-border md:block"
                  style={{
                    transform: "skewX(-12deg)",
                    transformOrigin: "top",
                  }}
                />
              ) : null}
              <p className="font-mono text-[10px] tracking-[0.22em] text-accent uppercase">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 flex items-start justify-between gap-3 font-display text-2xl tracking-tight text-foreground md:text-3xl">
                {tPillars(key)}
                <ArrowUpRight className="mt-1 size-5 shrink-0 text-text-secondary transition group-hover:text-accent" />
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-secondary md:text-[15px]">
                {tPillars(`${key}Body`)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Products — asymmetric list with image peek */}
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
          <ul className="mt-12 divide-y divide-border border-y border-border">
            {featured.map((id, index) => (
              <li key={id}>
                <Link
                  href={`/products/${id}`}
                  className="group grid items-center gap-4 py-6 transition hover:bg-panel/40 sm:grid-cols-[minmax(0,1fr)_minmax(8rem,12rem)] md:gap-8 md:py-7"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] tracking-[0.2em] text-text-secondary uppercase">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 font-display text-xl tracking-tight text-foreground transition group-hover:text-accent md:text-2xl">
                      {tProducts(id)}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">
                      {tProducts(`${id}Body`)}
                    </p>
                  </div>
                  <div className="relative aspect-[4/3] w-full max-w-[12rem] overflow-hidden justify-self-end border border-border bg-panel sm:ms-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/products/${id}.jpg`}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 5. Protect CTA — graphite band + amber rule */}
      <section className="border-y border-border bg-panel py-12 md:py-14">
        <Container>
          <div className="h-px w-16 bg-accent" />
          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl tracking-tight text-foreground md:text-3xl">
                {tProtect("title")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary md:text-[15px]">
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

      {/* 6. Blog — flat graphite panels */}
      <section className="py-14 md:py-16">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] font-medium tracking-[0.18em] text-accent uppercase">
                {tBlog("kicker")}
              </p>
              <h2 className="mt-2 font-display text-2xl tracking-tight text-foreground md:text-3xl">
                {tHome("blogTitle")}
              </h2>
            </div>
            <Link href="/blog" className={buttonClass("secondary")}>
              {tHome("blogAll")}
            </Link>
          </div>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {posts.map((post) => {
              const title = pickLocalized(post.title, locale);
              const excerpt = pickLocalized(post.excerpt, locale);
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex gap-4 py-4 transition hover:bg-panel/40 md:gap-5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.cover_image_url || "/products/nvr.jpg"}
                    alt=""
                    className="size-16 shrink-0 object-cover md:size-[4.5rem]"
                  />
                  <div className="min-w-0 py-0.5">
                    <h3 className="line-clamp-2 font-display text-[15px] leading-snug tracking-tight text-foreground transition group-hover:text-accent md:text-base">
                      {title}
                    </h3>
                    {excerpt ? (
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-secondary md:text-sm">
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
