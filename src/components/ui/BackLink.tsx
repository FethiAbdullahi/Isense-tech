"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function BackLink({
  href = "/",
  label,
}: {
  href?: string;
  label?: string;
}) {
  const t = useTranslations("cta");
  return (
    <Link
      href={href}
      className="mb-8 inline-flex items-center gap-2 text-sm text-text-secondary transition hover:text-accent"
    >
      <ArrowLeft className="size-4 rtl:rotate-180" />
      {label ?? t("back")}
    </Link>
  );
}
