import { getTranslations, setRequestLocale } from "next-intl/server";
import { CoveragePlanner } from "@/components/coverage/CoveragePlanner";
import { BackLink } from "@/components/ui/BackLink";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { pageMetadata } from "@/lib/metadata";
import { getPackages } from "@/lib/queries";
import type { Sector } from "@/lib/coverage-math";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("coverage");
  return pageMetadata({
    title: t("title"),
    description: t("lead"),
    path: "/coverage",
  });
}

export default async function CoveragePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sector?: string }>;
}) {
  const { locale } = await params;
  const { sector } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("coverage");
  const cta = await getTranslations("cta");
  const packages = await getPackages();
  const initialSector = (
    ["home", "office", "factory", "campus"].includes(sector ?? "")
      ? sector
      : "home"
  ) as Sector;

  return (
    <section className="pt-28 pb-24">
      <Container>
        <BackLink href="/solutions" label={cta("backSolutions")} />
        <SectionHeader as="h1" kicker={t("kicker")} title={t("title")} lead={t("lead")} />
        <div className="mt-10 overflow-hidden rounded-[32px] border border-border bg-panel p-4 shadow-[var(--shadow)] md:p-7">
          <CoveragePlanner packages={packages} initialSector={initialSector} />
        </div>
      </Container>
    </section>
  );
}
