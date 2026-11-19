"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const labels: Record<string, string> = {
  en: "EN",
  am: "አማርኛ",
  ar: "العربية",
};

const compactLabels: Record<string, string> = {
  en: "EN",
  am: "አማ",
  ar: "عر",
};

export function LocaleSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-border bg-panel p-1"
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => router.replace(pathname, { locale: code })}
          className={cn(
            "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
            code === "am" && "[font-family:var(--font-noto-ethiopic),sans-serif]",
            code === "ar" && "[font-family:var(--font-noto-arabic),sans-serif]",
            locale === code
              ? "bg-accent text-on-accent shadow-sm"
              : "text-text-secondary hover:text-foreground",
          )}
          aria-pressed={locale === code}
        >
          {(compact ? compactLabels : labels)[code]}
        </button>
      ))}
    </div>
  );
}
