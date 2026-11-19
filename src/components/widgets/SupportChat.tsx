"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";
import {
  Aperture,
  ArrowUpRight,
  ChevronRight,
  MapPinned,
  MessageSquare,
  Package,
  Phone,
  Send,
  Shield,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "../../../config/site";
import type { AppLocale } from "@/i18n/routing";

type Turn = { role: "user" | "assistant"; content: string; href?: string; hrefLabel?: string };
type Step = "language" | "chat";
type FaqId = "solutions" | "products" | "coverage" | "contacts";

const LANGS: { code: AppLocale; label: string; native: string }[] = [
  { code: "en", label: "English", native: "EN" },
  { code: "am", label: "አማርኛ", native: "አማ" },
  { code: "ar", label: "العربية", native: "عر" },
];

const copy = {
  en: {
    open: "Open support chat",
    close: "Close",
    camLabel: "CAM 07 · SUPPORT DESK",
    online: "Live · Addis Ababa",
    langTitle: "Choose your language",
    langLead: "We’ll answer in the language you pick.",
    continue: "Continue",
    greeting: "How can I help you today?",
    greetingLead: "Tap a topic below, or type your own question.",
    topics: "Quick topics",
    faq: {
      solutions: "Our solutions",
      products: "Our products",
      coverage: "Coverage planner",
      contacts: "Contact us",
    },
    answers: {
      solutions:
        "We design and commission security for homes, offices, factories, and campuses — survey, camera mix, access, and alerts from one Addis Ababa team.",
      products:
        "IP CCTV (dome, bullet, PTZ, NVR), access control, attendance, intrusion, metal detection, fire alarms, and our Unif1ed HRM workforce platform.",
      coverage:
        "Use the coverage planner to place cameras on a floor plan, check field of view, and send a layout to our team.",
      contacts: `Call ${siteConfig.phoneDisplay}, email ${siteConfig.email}, or visit ${siteConfig.address}. Hours: ${siteConfig.hours.weekdays}; ${siteConfig.hours.saturday}.`,
    },
    openPage: {
      solutions: "Open solutions",
      products: "Browse products",
      coverage: "Design coverage",
      contacts: "Contact page",
    },
    placeholder: "Type a message…",
    send: "Send",
    continueWhatsApp: "Continue on WhatsApp",
    fallback:
      "The desk is unavailable. Call +251 11 111 4031 or continue on WhatsApp.",
    changeLang: "Change language",
  },
  am: {
    open: "የድጋፍ ውይይት ክፈት",
    close: "ዝጋ",
    camLabel: "CAM 07 · የድጋፍ ዴስክ",
    online: "ቀጥታ · አዲስ አበባ",
    langTitle: "ቋንቋዎን ይምረጡ",
    langLead: "በመረጡት ቋንቋ እንመልሳለን።",
    continue: "ቀጥል",
    greeting: "ዛሬ እንዴት ልረዳዎ?",
    greetingLead: "ከታች ያለውን ርዕስ ይንኩ፣ ወይም ጥያቄዎን ይጻፉ።",
    topics: "ፈጣን ርዕሶች",
    faq: {
      solutions: "መፍትሄዎቻችን",
      products: "ምርቶቻችን",
      coverage: "የሽፋን እቅድ",
      contacts: "ያግኙን",
    },
    answers: {
      solutions:
        "ለቤት፣ ቢሮ፣ ፋብሪካ እና ካምፓስ ደህንነት እንቀርፃለን እና እናስጀምራለን — ከአዲስ አበባ ቡድናችን ዳሰሳ፣ የካሜራ ድብልቅ፣ መዳረሻ እና ማንቂያ።",
      products:
        "IP CCTV (ዶም፣ ቡሌት፣ PTZ፣ NVR)፣ መዳረሻ ቁጥጥር፣ ሰዓት መቁጠሪያ፣ ወረራ ማንቂያ፣ ብረት መፈለጊያ፣ የእሳት ማንቂያ እና Unif1ed HRM።",
      coverage:
        "ካሜራዎችን በወለል እቅድ ላይ ለማስቀመጥ፣ የእይታ መስክ ለመፈተሽ እና ለቡድናችን ለመላክ የሽፋን እቅዱን ይጠቀሙ።",
      contacts: `ይደውሉ ${siteConfig.phoneDisplay}፣ ኢሜይል ${siteConfig.email}፣ ወይም ይጎብኙ ${siteConfig.address}። ሰዓታት፦ ${siteConfig.hours.weekdays}፤ ${siteConfig.hours.saturday}።`,
    },
    openPage: {
      solutions: "መፍትሄዎችን ክፈት",
      products: "ምርቶችን ይመልከቱ",
      coverage: "ሽፋን ይንደፉ",
      contacts: "የእውቂያ ገጽ",
    },
    placeholder: "መልዕክት ይጻፉ…",
    send: "ላክ",
    continueWhatsApp: "በWhatsApp ይቀጥሉ",
    fallback:
      "ድጋፍ አይገኝም። +251 11 111 4031 ይደውሉ ወይም በWhatsApp ይቀጥሉ።",
    changeLang: "ቋንቋ ቀይር",
  },
  ar: {
    open: "فتح دردشة الدعم",
    close: "إغلاق",
    camLabel: "CAM 07 · مكتب الدعم",
    online: "مباشر · أديس أبابا",
    langTitle: "اختر لغتك",
    langLead: "سنرد باللغة التي تختارها.",
    continue: "متابعة",
    greeting: "كيف يمكنني مساعدتك اليوم؟",
    greetingLead: "اضغط موضوعًا أدناه، أو اكتب سؤالك.",
    topics: "مواضيع سريعة",
    faq: {
      solutions: "حلولنا",
      products: "منتجاتنا",
      coverage: "مخطط التغطية",
      contacts: "تواصل معنا",
    },
    answers: {
      solutions:
        "نصمّم ونشغّل أنظمة الأمن للمنازل والمكاتب والمصانع والحرم الجامعي — مسح الموقع، مزيج الكاميرات، التحكم بالدخول والتنبيهات من فريقنا في أديس أبابا.",
      products:
        "كاميرات IP (قبة، رصاصة، PTZ، NVR)، التحكم بالدخول، الحضور، الإنذار ضد التسلل، كشف المعادن، إنذار الحريق، ومنصة Unif1ed HRM.",
      coverage:
        "استخدم مخطط التغطية لوضع الكاميرات على مخطط الأرضية وفحص مجال الرؤية وإرسال التخطيط لفريقنا.",
      contacts: `اتصل ${siteConfig.phoneDisplay} أو راسل ${siteConfig.email} أو زر ${siteConfig.address}. الساعات: ${siteConfig.hours.weekdays}؛ ${siteConfig.hours.saturday}.`,
    },
    openPage: {
      solutions: "افتح الحلول",
      products: "تصفح المنتجات",
      coverage: "صمّم التغطية",
      contacts: "صفحة الاتصال",
    },
    placeholder: "اكتب رسالة…",
    send: "إرسال",
    continueWhatsApp: "تابع على واتساب",
    fallback:
      "المكتب غير متاح. اتصل على +251 11 111 4031 أو تابع على واتساب.",
    changeLang: "تغيير اللغة",
  },
} as const;

const FAQ_META: Record<
  FaqId,
  { href: string; icon: typeof Shield }
> = {
  solutions: { href: "/solutions", icon: Shield },
  products: { href: "/products", icon: Package },
  coverage: { href: "/coverage", icon: MapPinned },
  contacts: { href: "/contact", icon: Phone },
};

const FAQ_ORDER: FaqId[] = ["solutions", "products", "coverage", "contacts"];

const CHAT_STATE_KEY = "isense-support-chat";

export function SupportChat({ whatsappUrl }: { whatsappUrl?: string }) {
  const siteLocale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("language");
  const [picked, setPicked] = useState<AppLocale>(siteLocale);
  const [chatLocale, setChatLocale] = useState<AppLocale>(siteLocale);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Turn[]>([]);
  const [showTopics, setShowTopics] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const wa = whatsappUrl || siteConfig.whatsappUrl;
  const t = copy[chatLocale];
  const rtl = chatLocale === "ar";

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CHAT_STATE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as {
          open?: boolean;
          step?: Step;
          chatLocale?: AppLocale;
        };
        if (saved.open) setOpen(true);
        if (saved.step === "chat" || saved.step === "language") {
          setStep(saved.step);
        }
        if (saved.chatLocale && copy[saved.chatLocale]) {
          setChatLocale(saved.chatLocale);
          setPicked(saved.chatLocale);
        }
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(
        CHAT_STATE_KEY,
        JSON.stringify({ open, step, chatLocale }),
      );
    } catch {
      // ignore
    }
  }, [open, step, chatLocale, hydrated]);

  useEffect(() => {
    if (!open) return;
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open, step, showTopics]);

  const topics = useMemo(
    () =>
      FAQ_ORDER.map((id) => ({
        id,
        label: t.faq[id],
        ...FAQ_META[id],
      })),
    [t],
  );

  function resetToLanguage() {
    setStep("language");
    setMessages([]);
    setShowTopics(true);
    setInput("");
  }

  function startChat(locale: AppLocale) {
    setChatLocale(locale);
    setStep("chat");
    setMessages([]);
    setShowTopics(true);
    if (locale !== siteLocale) {
      router.replace(pathname, { locale });
    }
  }

  async function askFaq(id: FaqId) {
    const question = t.faq[id];
    const answer = t.answers[id];
    setMessages((current) => [
      ...current,
      { role: "user", content: question },
      {
        role: "assistant",
        content: answer,
        href: FAQ_META[id].href,
        hrefLabel: t.openPage[id],
      },
    ]);
    setShowTopics(true);
  }

  async function sendText(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setInput("");
    setMessages((current) => [...current, { role: "user", content: trimmed }]);
    setBusy(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, locale: chatLocale }),
      });
      const data = (await response.json()) as { text?: string };
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.text ?? t.fallback },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        className="group fixed bottom-5 end-5 z-40 flex size-14 items-center justify-center rounded-full border border-cyan-400/40 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.35),transparent_55%),linear-gradient(145deg,#0b1220,#10243a)] text-cyan-100 shadow-[0_0_0_1px_rgba(56,189,248,0.15),0_12px_40px_rgba(8,47,73,0.55)]"
        aria-label={t.open}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
      >
        <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-cyan-400/20 [animation-duration:2.4s]" />
        <span className="pointer-events-none absolute inset-1 rounded-full border border-dashed border-cyan-300/30 group-hover:animate-spin [animation-duration:8s]" />
        <Aperture className="relative size-6 text-cyan-200" aria-hidden />
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t.camLabel}
            dir={rtl ? "rtl" : "ltr"}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="fixed bottom-[5.25rem] end-5 z-50 flex h-[min(34rem,calc(100dvh-7rem))] w-[min(23.5rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[22px] border border-cyan-400/25 bg-[linear-gradient(165deg,rgba(8,15,28,0.97),rgba(12,28,48,0.96))] text-slate-100 shadow-[0_0_0_1px_rgba(56,189,248,0.12),0_24px_80px_rgba(2,8,20,0.65)] backdrop-blur-xl"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(125,211,252,0.35)_3px)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 end-0 size-40 rounded-full bg-cyan-400/20 blur-3xl"
            />

            <header className="relative z-10 flex items-start justify-between gap-3 border-b border-cyan-400/15 px-4 py-3.5">
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-cyan-300/90">
                  <span className="inline-flex size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                  {t.camLabel}
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-white">
                  iSense Support
                </p>
                <p className="text-[11px] text-slate-400">{t.online}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-100"
                aria-label={t.close}
              >
                <X className="size-4" />
              </button>
            </header>

            <div
              ref={scrollerRef}
              className="relative z-10 min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
            >
              {step === "language" ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="inline-flex size-11 items-center justify-center rounded-xl border border-cyan-300/30 bg-[radial-gradient(circle_at_30%_20%,rgba(125,211,252,0.35),rgba(8,47,73,0.6))]">
                        <Aperture className="size-5 text-cyan-200" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {t.langTitle}
                        </p>
                        <p className="text-xs text-slate-400">{t.langLead}</p>
                      </div>
                    </div>

                    <fieldset className="space-y-2">
                      <legend className="sr-only">{t.langTitle}</legend>
                      {LANGS.map((lang) => {
                        const selected = picked === lang.code;
                        return (
                          <label
                            key={lang.code}
                            className={cn(
                              "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 transition",
                              selected
                                ? "border-cyan-300/50 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,0.12)]"
                                : "border-white/10 bg-white/[0.03] hover:border-cyan-400/25",
                              lang.code === "am" &&
                                "[font-family:var(--font-noto-ethiopic),sans-serif]",
                              lang.code === "ar" &&
                                "[font-family:var(--font-noto-arabic),sans-serif]",
                            )}
                          >
                            <span
                              className={cn(
                                "relative flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                                selected
                                  ? "border-cyan-300"
                                  : "border-slate-500",
                              )}
                              aria-hidden
                            >
                              {selected ? (
                                <span className="size-2.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.9)]" />
                              ) : null}
                            </span>
                            <input
                              type="radio"
                              name="chat-language"
                              value={lang.code}
                              checked={selected}
                              onChange={() => setPicked(lang.code)}
                              className="sr-only"
                            />
                            <span className="flex-1 text-sm font-medium text-slate-100">
                              {lang.label}
                            </span>
                            <span className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[10px] tracking-wider text-cyan-200/80">
                              {lang.native}
                            </span>
                          </label>
                        );
                      })}
                    </fieldset>
                  </div>

                  <button
                    type="button"
                    onClick={() => startChat(picked)}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#22d3ee,#38bdf8)] px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.35)] transition hover:brightness-110"
                  >
                    {t.continue}
                    <ChevronRight className={cn("size-4", rtl && "rotate-180")} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl border border-cyan-400/15 bg-white/[0.03] p-3.5">
                    <p className="text-sm font-semibold text-white">
                      {t.greeting}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      {t.greetingLead}
                    </p>
                  </div>

                  {messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={cn(
                        "max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                        message.role === "user"
                          ? "ms-auto bg-cyan-400/15 text-cyan-50"
                          : "border border-white/10 bg-slate-950/50 text-slate-200",
                      )}
                    >
                      <p>{message.content}</p>
                      {message.href && message.hrefLabel ? (
                        <Link
                          href={message.href}
                          onClick={() => setOpen(false)}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200"
                        >
                          {message.hrefLabel}
                          <ArrowUpRight className="size-3.5" />
                        </Link>
                      ) : null}
                    </div>
                  ))}

                  {showTopics ? (
                    <div className="space-y-2 pt-1">
                      <p className="font-mono text-[10px] tracking-[0.16em] text-cyan-300/70">
                        {t.topics}
                      </p>
                      <div className="grid gap-2">
                        {topics.map((topic) => {
                          const Icon = topic.icon;
                          return (
                            <button
                              key={topic.id}
                              type="button"
                              onClick={() => askFaq(topic.id)}
                              className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-start transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
                            >
                              <span className="inline-flex size-9 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                                <Icon className="size-4" />
                              </span>
                              <span className="flex-1 text-sm font-medium text-slate-100">
                                {topic.label}
                              </span>
                              <ChevronRight
                                className={cn(
                                  "size-4 text-slate-500 transition group-hover:text-cyan-300",
                                  rtl && "rotate-180",
                                )}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>

            {step === "chat" ? (
              <div className="relative z-10 space-y-2 border-t border-cyan-400/15 bg-slate-950/40 px-3 py-3">
                <div className="flex items-center justify-between gap-2 px-1">
                  <button
                    type="button"
                    onClick={resetToLanguage}
                    className="text-[11px] font-medium text-slate-400 transition hover:text-cyan-200"
                  >
                    {t.changeLang}
                  </button>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-300/90 hover:text-emerald-200"
                  >
                    <MessageSquare className="size-3" />
                    {t.continueWhatsApp}
                  </a>
                </div>
                <form
                  className="flex gap-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void sendText(input);
                  }}
                >
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={t.placeholder}
                    className="flex-1 rounded-full border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-300/50"
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex size-11 items-center justify-center rounded-full bg-cyan-400 text-slate-950 disabled:opacity-50"
                    aria-label={t.send}
                  >
                    <Send className="size-4" />
                  </button>
                </form>
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
