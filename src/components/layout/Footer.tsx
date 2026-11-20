import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "../../../config/site";

export async function Footer() {
  const t = await getTranslations("footer");
  const n = await getTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-panel/40">
      <Container className="grid gap-14 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image
            src="/logo-full.png"
            alt={siteConfig.name}
            width={160}
            height={56}
            className="h-8 w-auto"
          />
          <p className="mt-6 max-w-sm font-display text-xl leading-snug tracking-tight text-foreground">
            {siteConfig.name}
          </p>
          <p className="mt-2 text-sm text-text-secondary">{t("parent")}</p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-text-secondary">
            {siteConfig.address}
          </p>
        </div>
        <div>
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] text-accent uppercase">
            {t("explore")}
          </p>
          <div className="mt-5 grid gap-3 text-sm">
            {(
              [
                ["products", "/products"],
                ["solutions", "/solutions"],
                ["coverage", "/coverage"],
                ["about", "/about"],
                ["blog", "/blog"],
                ["contact", "/contact"],
              ] as const
            ).map(([key, href]) => (
              <Link
                key={href}
                href={href}
                className="text-foreground/85 transition hover:text-accent"
              >
                {n(key)}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] text-accent uppercase">
            {t("contact")}
          </p>
          <div className="mt-5 space-y-3 text-sm text-text-secondary">
            <p>
              <a
                className="text-foreground transition hover:text-accent"
                href={`tel:${siteConfig.phoneTel}`}
              >
                {siteConfig.phoneDisplay}
              </a>
            </p>
            <p>
              <a className="hover:text-accent" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </p>
            <div className="space-y-1 border-t border-border pt-4">
              <p>{siteConfig.hours.weekdays}</p>
              <p>{siteConfig.hours.saturday}</p>
            </div>
          </div>
        </div>
      </Container>
      <div className="border-t border-border py-5">
        <Container className="flex flex-col gap-2 font-mono text-[11px] tracking-wide text-text-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>{t("rights", { year })}</p>
          <p>
            {t("support")}: {siteConfig.phoneDisplay}
          </p>
        </Container>
      </div>
    </footer>
  );
}
