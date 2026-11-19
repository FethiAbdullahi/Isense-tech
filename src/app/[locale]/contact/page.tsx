import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";
import { BackLink } from "@/components/ui/BackLink";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getSiteSettings } from "@/lib/queries";
import { siteConfig } from "@/lib/site";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const cta = await getTranslations("cta");
  const settings = await getSiteSettings();
  const phoneTel = settings.phone.replace(/\D/g, "");
  const mapUrl = settings.map_embed_url || siteConfig.map.embedUrl;

  return (
    <article className="pb-24 pt-28">
      <Container>
        <BackLink href="/" label={cta("backHome")} />
        <SectionHeader as="h1" kicker={t("kicker")} title={t("title")} />
        <div className="mt-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="rounded-[32px] border border-border bg-panel p-7 md:p-8">
              <p className="text-[11px] font-medium tracking-[0.2em] text-accent uppercase">
                {t("live")}
              </p>
              <p className="mt-4 text-lg leading-relaxed text-foreground">
                {settings.address}
              </p>
              <a
                className="mt-3 inline-block text-sm font-medium text-accent hover:opacity-80"
                href={`https://www.google.com/maps/search/?api=1&query=${siteConfig.map.lat},${siteConfig.map.lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {cta("openMap")}
              </a>
              <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-medium tracking-[0.16em] text-text-secondary uppercase">
                    {t("phone")}
                  </p>
                  <a
                    className="mt-2 inline-block text-foreground transition hover:text-accent"
                    href={`tel:+${phoneTel}`}
                  >
                    {settings.phone}
                  </a>
                </div>
                <div>
                  <p className="text-[11px] font-medium tracking-[0.16em] text-text-secondary uppercase">
                    {t("email")}
                  </p>
                  <a
                    className="mt-2 inline-block text-foreground transition hover:text-accent"
                    href={`mailto:${settings.email}`}
                  >
                    {settings.email}
                  </a>
                </div>
              </div>
              <div className="mt-8 border-t border-border pt-6">
                <p className="text-[11px] font-medium tracking-[0.2em] text-accent uppercase">
                  {t("hours")}
                </p>
                <div className="mt-3 space-y-1 text-sm text-text-secondary">
                  <p>{settings.hours.weekdays}</p>
                  <p>{settings.hours.saturday}</p>
                  <p>{settings.hours.sunday}</p>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
          <div className="overflow-hidden rounded-[32px] border border-border bg-panel">
            <iframe
              title={t("mapNote")}
              src={mapUrl}
              className="h-[min(70vh,680px)] w-full grayscale-[20%] contrast-[1.05]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Container>
    </article>
  );
}
