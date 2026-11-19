"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations("theme");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex size-9 items-center justify-center rounded-full border border-border text-text-secondary transition hover:border-accent hover:text-foreground"
      aria-label={theme === "dark" ? t("toLight") : t("toDark")}
      title={theme === "dark" ? t("toLight") : t("toDark")}
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
