import { getTranslations, setRequestLocale } from "next-intl/server";
import { BackLink } from "@/components/ui/BackLink";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { projects } from "@/content/products";
import { siteConfig } from "@/lib/site";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const cta = await getTranslations("cta");

  return (
    <article className="pb-24 pt-28">
      <Container>
        <BackLink href="/" label={cta("backHome")} />
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <SectionHeader as="h1" kicker={t("kicker")} title={t("title")} />
            <p className="mt-8 text-lg leading-relaxed text-text-secondary">{t("p1")}</p>
            <p className="mt-4 text-base leading-relaxed text-text-secondary">{t("p2")}</p>
          </div>
          <div className="relative overflow-hidden rounded-[32px] border border-border bg-panel p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,color-mix(in_srgb,var(--accent)_22%,transparent),transparent_50%)]" />
            <p className="relative text-[11px] font-medium tracking-[0.2em] text-text-secondary uppercase">
              {t("foundedLabel")}
            </p>
            <p className="relative mt-3 font-display text-6xl tracking-tight text-foreground">
              {siteConfig.founded}
            </p>
            <p className="relative mt-6 text-sm leading-relaxed text-text-secondary">
              {t("partner")}
            </p>
          </div>
        </div>

        <p className="mt-12 max-w-3xl border-s-2 border-accent ps-6 text-xl leading-snug text-foreground">
          {t("profile")}
        </p>
      </Container>

      <Container className="mt-20 grid gap-5 md:grid-cols-3">
        {(
          [
            ["visionTitle", "vision"],
            ["missionTitle", "mission"],
            ["valuesTitle", "valuesBody"],
          ] as const
        ).map(([titleKey, bodyKey]) => (
          <section
            key={titleKey}
            className="rounded-[28px] border border-border bg-panel/60 p-7"
          >
            <h2 className="font-display text-xl tracking-tight text-foreground">
              {t(titleKey)}
            </h2>
            {bodyKey === "valuesBody" ? (
              <ul className="mt-5 space-y-4 text-sm leading-relaxed text-text-secondary">
                <li>
                  <span className="font-medium text-foreground">{t("serviceMinded")}.</span>{" "}
                  {t("serviceMindedBody")}
                </li>
                <li>
                  <span className="font-medium text-foreground">{t("innovative")}.</span>{" "}
                  {t("innovativeBody")}
                </li>
                <li>
                  <span className="font-medium text-foreground">{t("flexible")}.</span>{" "}
                  {t("flexibleBody")}
                </li>
              </ul>
            ) : (
              <p className="mt-5 text-sm leading-relaxed text-text-secondary">{t(bodyKey)}</p>
            )}
          </section>
        ))}
      </Container>

      <Container className="mt-20 max-w-3xl">
        <SectionHeader title={t("whyTitle")} lead={t("why")} />
      </Container>

      <Container id="projects" className="mt-20 scroll-mt-28">
        <SectionHeader title={t("projects")} />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-[28px] border border-border bg-panel/50 transition hover:border-accent/30"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-background">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <p className="absolute bottom-4 start-4 text-[11px] font-medium tracking-[0.18em] text-accent uppercase">
                  {project.system}
                </p>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl tracking-tight text-foreground">
                  {t(`project_${project.id}`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {t(`project_${project.id}_body`)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </article>
  );
}
