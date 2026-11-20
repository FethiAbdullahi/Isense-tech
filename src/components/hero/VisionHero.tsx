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
                    ? "absolute inset-0 h-full w-full max-w-none object-fill brightness-[1.65] contrast-[1.12] saturate-[1.08]"
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
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_30%_70%,rgba(240,160,48,0.12),transparent_65%),radial-gradient(ellipse_40%_48%_at_72%_58%,rgba(94,200,216,0.14),transparent_65%)]"
                />
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Graphite edge wash — keeps subjects visible */}
        <div className="pointer-events-none absolute inset-y-0 start-0 w-[min(36%,14rem)] bg-gradient-to-r from-background/80 via-background/25 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/70 to-transparent" />

        {/* Shutter blades — open on load instead of scan-line tropes */}
        {!reduced ? (
          <>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-20 h-1/2 origin-top bg-background"
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{ duration: 1.05, ease: [0.76, 0, 0.24, 1], delay: 0.12 }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1/2 origin-bottom bg-background"
              initial={{ scaleY: 1 }}
              animate={{ scaleY: 0 }}
              transition={{ duration: 1.05, ease: [0.76, 0, 0.24, 1], delay: 0.12 }}
            />
          </>
        ) : null}

        {pointer && !lite && !reduced ? (
          <div
            className="pointer-events-none absolute size-24 -translate-x-1/2 -translate-y-1/2 border border-signal/50"
            style={{ left: pointer.x, top: pointer.y }}
          />
        ) : null}

        <div className="absolute bottom-6 start-5 z-20 flex items-center gap-2 md:start-8">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-50" />
            <span className="relative inline-flex size-2 rounded-full bg-danger" />
          </span>
          <p className="border border-border bg-panel/90 px-3 py-1 font-mono text-[10px] font-medium tracking-[0.16em] text-text-secondary uppercase">
            {t("caption")}
          </p>
        </div>
      </div>

      <Container className="relative z-30 flex min-h-[100svh] flex-col justify-end pb-24 pt-28 md:justify-center md:pb-28 md:pt-24">
        <motion.div
          className="clip-angle relative z-10 max-w-lg border border-border bg-panel/95 p-6 shadow-[var(--shadow)] panel-shear md:max-w-md md:p-7"
          initial={reduced ? false : { opacity: 0, y: 28, skewX: -3 }}
          animate={{ opacity: 1, y: 0, skewX: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
        >
          <div className="mb-4 h-px w-12 bg-accent" />
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] text-accent uppercase">
            {t("eyebrow")}
          </p>
          <p className="mt-3 font-display text-[clamp(2.1rem,4.6vw,3.4rem)] leading-[0.92] font-semibold tracking-tight text-foreground">
            {t("brand")}
            <span className="mt-1.5 block font-mono text-[0.28em] font-medium tracking-[0.28em] text-text-secondary uppercase">
              {t("brandSub")}
            </span>
          </p>
          <h1 className="mt-3 max-w-md font-display text-[1.25rem] leading-[1.2] tracking-tight text-foreground md:text-[1.45rem]">
            {t("title")}
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-snug text-text-secondary md:line-clamp-2">
            {t("subtitle")}
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
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
