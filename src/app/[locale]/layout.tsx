import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { HtmlLang } from "@/components/layout/HtmlLang";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SupportChat } from "@/components/widgets/SupportChat";
import { WhatsAppButton } from "@/components/widgets/WhatsAppButton";
import { routing } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/queries";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [messages, settings] = await Promise.all([getMessages(), getSiteSettings()]);
  const whatsappUrl = `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`;

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider>
        <HtmlLang locale={locale} />
        <div className="flex min-h-full flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton href={whatsappUrl} />
          <SupportChat whatsappUrl={whatsappUrl} />
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
