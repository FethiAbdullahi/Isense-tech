"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "../../../config/site";
import { cn } from "@/lib/utils";
import { shellClassName } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";

const links = [
  { href: "/", key: "home" },
  { href: "/products", key: "products" },
  { href: "/solutions", key: "solutions" },
  { href: "/coverage", key: "coverage" },
  { href: "/about", key: "about" },
  { href: "/blog", key: "blog" },
  { href: "/#feeds", key: "social" },
  { href: "/contact", key: "contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest?.("[data-menu-toggle]")) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-b border-border bg-background/90 backdrop-blur-2xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className={cn(shellClassName, "flex h-14 items-center justify-between gap-4 md:h-16")}>
        <Link href="/" className="relative z-10 shrink-0" onClick={() => setOpen(false)}>
          <Image
            src="/logo.png"
            alt={siteConfig.name}
            width={140}
            height={48}
            className="h-8 w-auto [[data-theme=light]_&]:invert"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-[13px] text-text-secondary transition-colors hover:text-foreground"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitcher compact />
          <ThemeToggle />
        </div>

        <button
          type="button"
          data-menu-toggle
          className="relative z-50 inline-flex size-10 items-center justify-center rounded-full border border-border text-text-secondary lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            className="absolute inset-x-0 top-full z-50 mx-3 mt-2 overflow-hidden rounded-3xl border border-border bg-background shadow-[var(--shadow)] lg:hidden"
          >
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
            <nav className="flex flex-col p-2" aria-label="Mobile">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3.5 font-display text-lg tracking-tight text-foreground transition hover:bg-panel"
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>
          </div>
        </>
      ) : null}
    </header>
  );
}
