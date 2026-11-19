import { setRequestLocale } from "next-intl/server";
import { VisionHero } from "@/components/hero/VisionHero";
import { HomeSections } from "@/components/home/HomeSections";
import { SocialFeed } from "@/components/social/SocialFeed";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <OrganizationJsonLd />
      <VisionHero />
      <HomeSections locale={locale} />
      <SocialFeed />
    </>
  );
}
