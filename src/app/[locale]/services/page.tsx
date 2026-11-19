import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

/** Services content lives under Solutions — keep the old URL as a redirect. */
export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect({ href: "/solutions", locale });
}
