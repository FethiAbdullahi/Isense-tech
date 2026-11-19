"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/ui/SectionHeader";

function AnatomyLoading() {
  const t = useTranslations("anatomy");
  return (
    <div className="mt-10" role="status" aria-live="polite">
      <div className="card-surface aspect-[5/4] w-full" />
      <span className="sr-only">{t("loading")}</span>
    </div>
  );
}

const CameraAnatomy = dynamic(
  () => import("./CameraAnatomy").then((mod) => mod.CameraAnatomy),
  { ssr: false, loading: () => <AnatomyLoading /> },
);

export function AnatomySection() {
  const t = useTranslations("anatomy");

  return (
    <section className="mt-16" aria-label={t("title")}>
      <SectionHeader kicker={t("kicker")} title={t("title")} lead={t("lead")} />
      <CameraAnatomy />
    </section>
  );
}
