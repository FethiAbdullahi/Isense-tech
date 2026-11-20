"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { buttonClass } from "@/components/ui/Button";

export function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  return (
    <form
      className="space-y-5 rounded-sm border border-border bg-panel p-7 md:p-8"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form).entries());
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        setStatus(res.ok ? "sent" : "error");
        if (res.ok) form.reset();
      }}
    >
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label>
          Company website
          <input tabIndex={-1} autoComplete="off" name="company_website" />
        </label>
      </div>
      <p className="font-display text-xl tracking-tight text-foreground">{t("submit")}</p>
      <label className="block text-sm text-text-secondary">
        {t("name")}
        <input
          required
          name="name"
          className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-accent/50"
        />
      </label>
      <label className="block text-sm text-text-secondary">
        {t("email")}
        <input
          required
          type="email"
          name="email"
          className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-accent/50"
        />
      </label>
      <label className="block text-sm text-text-secondary">
        {t("phoneField")}
        <input
          name="phone"
          className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-accent/50"
        />
      </label>
      <label className="block text-sm text-text-secondary">
        {t("message")}
        <textarea
          required
          name="message"
          rows={5}
          className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-accent/50"
        />
      </label>
      <button type="submit" className={buttonClass("primary")}>
        {t("submit")}
      </button>
      {status === "sent" ? <p className="text-sm text-accent">{t("sent")}</p> : null}
      {status === "error" ? <p className="text-sm text-danger">{t("error")}</p> : null}
    </form>
  );
}
