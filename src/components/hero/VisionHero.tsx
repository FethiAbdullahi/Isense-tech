"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useTheme } from "@/components/theme/ThemeProvider";
import {
  coverObjectPosition,
  DetectionOverlay,
} from "@/components/hero/DetectionOverlay";
import { buttonClass } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import detections from "../../../content/hero-detections.json";
import type { HeroDetections } from "@/lib/hero-vision";

const data = detections as HeroDetections;

/** Calibrated still-frame time used by DetectionOverlay. */
const POSTER_TIME = 3;

function useLiteMode(reduced: boolean) {
  const [lite, setLite] = useState(false);
  useEffect(() => {
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean };
      deviceMemory?: number;
    };
    setLite(
      Boolean(
        nav.connection?.saveData ||
          reduced ||
          (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2),
      ),
    );
  }, [reduced]);
  return lite;
}

type CoverFrame = {
  displayW: number;
  displayH: number;
  offsetX: number;
  offsetY: number;
};

function useCoverFrame(
  aspectW: number,
  aspectH: number,
  focusX: number,
  focusY: number,
) {
  const ref = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState<CoverFrame | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const layout = coverObjectPosition(
        rect.width,
        rect.height,
        aspectW,
        aspectH,
        focusX,
        focusY,
      );
      setFrame({
        displayW: layout.displayW,
        displayH: layout.displayH,
        offsetX: layout.offsetX,
        offsetY: layout.offsetY,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [aspectW, aspectH, focusX, focusY]);

  return { ref, frame };
}

export function VisionHero() {
  const t = useTranslations("hero");
  const { theme } = useTheme();
  const prefersReduced = useReducedMotion();
  const reduced = Boolean(prefersReduced);
  const lite = useLiteMode(reduced);

  const [parallax, setParallax] = useState(0);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  const isNight = theme === "dark";
  const poster = isNight ? data.video.posterNight : data.video.posterDay;
  const focusX = isNight ? 0.5 : 0.28;
  const focusY = 1;
  const aspectW = data.video.aspect.w;
  const aspectH = data.video.aspect.h;

  const { ref: stageRef, frame } = useCoverFrame(
    aspectW,
    aspectH,
    focusX,
    focusY,
  );

  useEffect(() => {
    if (lite || reduced) return;
    const onScroll = () => setParallax(Math.min(36, window.scrollY * 0.1));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lite, reduced]);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (lite || reduced) return;
      const rect = event.currentTarget.getBoundingClientRect();
      setPointer({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    },
    [lite, reduced],
  );

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-background">
      <div
        className="absolute inset-0"
        onPointerMove={onPointerMove}
        onPointerLeave={() => setPointer(null)}
      >
        {/* Shared cover frame: image + HUD share one positioned box */}
        <div
          ref={stageRef}
          className="absolute inset-0 overflow-hidden will-change-transform"
          style={{
            transform:
              reduced || lite ? undefined : `translate3d(0, ${parallax}px, 0)`,
          }}
        >
          {frame ? (
            <div
              className="absolute"
              style={{
                width: frame.displayW,
                height: frame.displayH,
                left: frame.offsetX,
                top: frame.offsetY,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={poster}
                alt=""
                className={
                  isNight
                    ? "absolute inset-0 h-full w-full max-w-none object-fill brightness-[1.85] contrast-[1.16] saturate-[1.14]"
                    : "absolute inset-0 h-full w-full max-w-none object-fill"
                }
                draggable={false}
              />
              <DetectionOverlay
                data={data}
                time={POSTER_TIME}
                theme={isNight ? "dark" : "light"}
              />
              {isNight ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_28%_72%,rgba(190,210,240,0.4),transparent_68%),radial-gradient(ellipse_40%_48%_at_72%_62%,rgba(175,205,235,0.36),transparent_65%)]"
                />
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="pointer-events-none absolute inset-y-0 start-0 w-[min(28%,10rem)] bg-gradient-to-r from-background/30 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-background/35 to-transparent" />

        {!reduced && !lite ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-[22%] h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent"
            animate={{ top: ["20%", "75%", "20%"] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}

        {pointer && !lite && !reduced ? (
          <div
            className="pointer-events-none absolute size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/40"
            style={{ left: pointer.x, top: pointer.y }}
          />
        ) : null}

        <div className="absolute bottom-6 start-5 z-20 flex items-center gap-2 md:start-8">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-50" />
            <span className="relative inline-flex size-2 rounded-full bg-danger" />
          </span>
          <p className="rounded-full border border-border/50 bg-background/70 px-3 py-1 font-sans text-[11px] font-medium tracking-[0.16em] text-text-secondary uppercase backdrop-blur">
            {t("caption")}
          </p>
        </div>
      </div>

      <Container className="relative z-30 flex min-h-[100svh] flex-col justify-end pb-24 pt-24 md:justify-start md:pb-28 md:pt-24 lg:pt-28">
        <motion.div
          className="relative z-10 max-w-md rounded-[28px] border border-border/50 bg-background/95 p-5 shadow-[var(--shadow)] backdrop-blur-xl md:max-w-[22rem] md:p-6"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm font-medium text-accent">{t("eyebrow")}</p>
          <p className="mt-2 font-display text-[clamp(1.9rem,4.2vw,3.15rem)] leading-[0.92] font-semibold tracking-tight text-foreground">
            {t("brand")}
            <span className="mt-1 block font-sans text-[0.34em] font-medium tracking-[0.22em] text-text-secondary uppercase">
              {t("brandSub")}
            </span>
          </p>
          <h1 className="mt-2.5 max-w-md font-display text-[1.35rem] leading-[1.15] tracking-tight text-foreground md:text-[1.65rem] lg:text-[1.85rem]">
            {t("title")}
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-snug text-text-secondary md:line-clamp-2">
            {t("subtitle")}
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link href="/products" className={buttonClass("primary")}>
              {t("explore")}
            </Link>
            <Link href="/coverage" className={buttonClass("secondary")}>
              {t("design")}
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
