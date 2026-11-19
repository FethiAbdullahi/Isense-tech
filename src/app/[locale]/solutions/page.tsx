import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BackLink } from "@/components/ui/BackLink";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { buttonClass } from "@/components/ui/Button";

const sectors = [
  {
    id: "home",
    image: "/media/hero-day.jpg",
    objectPosition: "center 60%",
    points: ["entry", "living", "alerts"],
  },
  {
    id: "office",
    image: "/products/access.jpg",
    objectPosition: "center center",
    points: ["reception", "corridors", "server"],
  },
  {
    id: "factory",
    image: "/products/ptz.jpg",
    objectPosition: "center 40%",
    points: ["line", "dock", "yard"],
  },
  {
    id: "campus",
    image: "/media/hero-night.jpg",
    objectPosition: "center 45%",
    points: ["gate", "parking", "command"],
  },
] as const;

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("solutions");
  const coverage = await getTranslations("coverage");
  const cta = await getTranslations("cta");

  return (
    <article className="pb-24 pt-28">
      <Container>
        <BackLink href="/" label={cta("backHome")} />
        <SectionHeader as="h1" kicker={t("kicker")} title={t("title")} lead={t("lead")} />

        <div className="mt-14 space-y-8">
          {sectors.map((sector, index) => (
            <article
              key={sector.id}
              className="overflow-hidden rounded-[32px] border border-border bg-panel"
            >
              <div
                className={`grid lg:grid-cols-2 ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
              >
                <div className="relative min-h-[240px] overflow-hidden lg:min-h-[380px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sector.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: sector.objectPosition }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/15 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-panel/50" />
                  <p className="absolute bottom-5 start-5 font-display text-3xl tracking-tight text-white drop-shadow lg:hidden">
                    {t(sector.id)}
                  </p>
                </div>
                <div className="flex flex-col justify-center p-7 md:p-10">
                  <p className="text-[11px] font-medium tracking-[0.2em] text-accent uppercase">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-3 hidden font-display text-3xl tracking-tight text-foreground lg:block">
                    {t(sector.id)}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-text-secondary">
                    {t(`${sector.id}Body`)}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {sector.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-sm text-foreground"
                      >
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                        {t(`points.${point}`)}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/coverage?sector=${sector.id}`}
                    className="mt-8 inline-flex text-sm font-medium text-accent transition hover:opacity-80"
                  >
                    {coverage("openPlanner")} →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 overflow-hidden rounded-[32px] border border-border bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_45%),var(--panel)] p-8 md:flex md:items-center md:justify-between md:gap-8 md:p-10">
          <div>
            <h2 className="font-display text-2xl tracking-tight text-foreground md:text-3xl">
              {t("ctaTitle")}
            </h2>
            <p className="mt-3 max-w-xl text-text-secondary">{t("ctaBody")}</p>
          </div>
          <Link href="/coverage" className={`${buttonClass("primary")} mt-6 shrink-0 md:mt-0`}>
            {t("cta")}
          </Link>
        </div>
      </Container>
    </article>
  );
}
