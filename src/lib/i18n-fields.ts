export type LocaleCode = "en" | "am" | "ar";

export type LocalizedString = Partial<Record<LocaleCode, string>> & { en?: string };

export function pickLocalized(
  value: LocalizedString | string | null | undefined,
  locale: string,
  fallback = "",
): string {
  if (!value) return fallback;
  if (typeof value === "string") return value || fallback;
  const key = (locale === "am" || locale === "ar" ? locale : "en") as LocaleCode;
  return value[key] || value.en || Object.values(value).find(Boolean) || fallback;
}
