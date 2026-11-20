import type { Metadata } from "next";
import {
  Noto_Sans_Arabic,
  Noto_Sans_Ethiopic,
  Plus_Jakarta_Sans,
  Sora,
} from "next/font/google";
import { getLocale } from "next-intl/server";
import { themeInitScript } from "@/components/theme/theme-script";
import { siteConfig } from "../../config/site";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const notoEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-ethiopic",
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | IP Security Solutions Ethiopia`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "iSense Technologies by Ellis Trading House PLC — Ethiopian IP security solutions with 15+ years of experience.",
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo-full.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} | IP Security Solutions Ethiopia`,
    description:
      "iSense Technologies by Ellis Trading House PLC — Ethiopian IP security solutions with 15+ years of experience.",
    url: siteConfig.url,
    images: [
      {
        url: new URL("/og.png", siteConfig.url).toString(),
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | IP Security Solutions Ethiopia`,
    description:
      "iSense Technologies by Ellis Trading House PLC — Ethiopian IP security solutions with 15+ years of experience.",
    images: [new URL("/og.png", siteConfig.url).toString()],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let locale = "en";
  try {
    locale = await getLocale();
  } catch {
    locale = "en";
  }

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      data-theme="dark"
      className={`${sora.variable} ${jakarta.variable} ${notoEthiopic.variable} ${notoArabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
