import { getTranslations, setRequestLocale } from "next-intl/server";
import { AnatomySection } from "@/components/anatomy/AnatomySection";
import { products } from "@/content/products";
import { partners } from "@/content/partners";
import { Link } from "@/i18n/navigation";
import { BackLink } from "@/components/ui/BackLink";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { buttonClass } from "@/components/ui/Button";

const featured = ["dome", "bullet", "ptz", "nvr"] as const;

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("products");
  const specs = await getTranslations("specs");
  const cta = await getTranslations("cta");
  const tHome = await getTranslations("home");
  const featuredSet = new Set<string>(featured);
  const rest = products.filter((p) => !featuredSet.has(p.id));

  return (
    <article className="pb-24 pt-28">
      <Container>
        <BackLink href="/" label={cta("backHome")} />
        <SectionHeader as="h1" kicker={t("kicker")} title={t("title")} lead={t("lead")} />

        <div
          id="partners"
          className="mt-10 scroll-mt-28 rounded-sm border border-border bg-panel/50 p-5 md:p-6"
        >
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] text-accent uppercase">
            {tHome("partnersKicker")}
          </p>
          <p className="mt-1 text-sm text-text-secondary">{tHome("partnersLead")}</p>
          <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {partners.map((partner) => (
              <li key={partner.id}>
                <a
                  id={`partner-${partner.id}`}
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-16 items-center justify-center rounded-sm border border-border bg-panel px-3 transition hover:border-accent/50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-9 max-w-full object-contain opacity-70 grayscale transition group-hover:opacity-100 group-hover:grayscale-0"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((id) => {
            const product = products.find((p) => p.id === id);
            if (!product) return null;
            return (
              <Link
                key={id}
                href={`/products/${id}`}
                className="group overflow-hidden rounded-sm border border-border bg-panel transition hover:border-accent/40 hover:shadow-[var(--shadow)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={t(id)}
                  className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="p-5">
                  <h2 className="font-display text-xl text-foreground">{t(id)}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {t(`${id}Body`)}
                  </p>
                  <span className="mt-4 inline-block text-sm text-accent">
                    {specs("kicker")} →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <AnatomySection />

        <div className="mt-20">
          <h2 className="font-display text-2xl tracking-tight text-foreground md:text-3xl">
            {t("moreTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-text-secondary">{t("moreLead")}</p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {rest.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group rounded-sm border border-border bg-panel/40 p-6 transition hover:border-accent/40 hover:bg-panel"
              >
                <h3 className="font-display text-2xl text-foreground">{t(product.id)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {t(`${product.id}Body`)}
                </p>
                <span className="mt-5 inline-block text-sm text-accent">
                  {specs("kicker")} →
                </span>
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-12">
          <Link href="/contact" className={buttonClass("primary")}>
            {cta("getInTouch")}
          </Link>
        </p>
      </Container>
    </article>
  );
}
