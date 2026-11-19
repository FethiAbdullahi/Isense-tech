"use client";

import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { siteConfig } from "../../../config/site";

export function WhatsAppButton({ href }: { href?: string }) {
  const t = useTranslations("whatsapp");
  const url = href || siteConfig.whatsappUrl;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 start-5 z-40 flex size-12 items-center justify-center rounded-full border border-border bg-[#1f9e55] text-white shadow-[var(--shadow)] transition hover:scale-[1.03]"
      aria-label={t("label")}
    >
      <MessageCircle className="size-5" aria-hidden />
    </a>
  );
}
