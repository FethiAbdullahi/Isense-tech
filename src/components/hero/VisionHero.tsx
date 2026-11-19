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
import { DetectionOverlay } from "@/components/hero/DetectionOverlay";
import { buttonClass } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import detections from "../../../content/hero-detections.json";
import type { HeroDetections } from "@/lib/hero-vision";

const data = detections as HeroDetections;

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

export function VisionHero() {
  const t = useTranslations("hero");
  const { theme } = useTheme();
  const prefersReduced = useReducedMotion();
  const reduced = Boolean(prefersReduced);
  const lite = useLiteMode(reduced);

  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [time, setTime] = useState(3);
  const [videoReady, setVideoReady] = useState(false);
  const [parallax, setParallax] = useState(0);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  const isNight = theme === "dark";
  const poster = isNight ? data.video.posterNight : data.video.posterDay;
  const src = isNight ? data.video.night : data.video.day;

  // Poster-only mode: freeze detections on a calibrated pose so boxes don't
  // drift across a still frame when MP4s are missing.
  const POSTER_TIME = 3;

  useEffect(() => {
    if (lite || reduced || !videoReady) {
      setTime(POSTER_TIME);
      return;
    }
    let raf = 0;
    const tick = () => {
      const video = videoRef.current;
      if (
        video &&
        !video.paused &&
        Number.isFinite(video.currentTime) &&
        video.currentTime > 0
      ) {
        setTime(video.currentTime);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [lite, reduced, videoReady, src]);

  useEffect(() => {
    if (lite || reduced) return;
    const onScroll = () => setParallax(Math.min(36, window.scrollY * 0.1));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lite, reduced]);

  useEffect(() => setVideoReady(false), [src]);

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
        ref={stageRef}
        className="absolute inset-0"
        onPointerMove={onPointerMove}
        onPointerLeave={() => setPointer(null)}
      >
        {/* Media + detections share this exact box so tracking stays locked */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform:
              reduced || lite ? undefined : `translate3d(0, ${parallax}px, 0)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={poster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          {!lite && !reduced ? (
            <video
              key={src}
              ref={videoRef}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                videoReady ? "opacity-100" : "opacity-0"
              }`}
              src={src}
              poster={poster}
              muted
              playsInline
              loop
              autoPlay
              preload="none"
              onCanPlay={() => {
                setVideoReady(true);
                void videoRef.current?.play().catch(() => setVideoReady(false));
              }}
              onError={() => setVideoReady(false)}
            />
          ) : null}
          <DetectionOverlay
            data={data}
            time={time}
            theme={isNight ? "dark" : "light"}
          />
        </div>

        <div className="pointer-events-none absolute inset-y-0 start-0 w-[min(100%,36rem)] bg-gradient-to-r from-background via-background/85 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

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

      <Container className="relative z-30 flex min-h-[100svh] flex-col justify-end pb-28 pt-24 md:justify-center md:pb-28">
        <motion.div
          className="max-w-md rounded-[28px] border border-border/35 bg-background/75 p-5 shadow-[var(--shadow)] backdrop-blur-xl md:max-w-xl md:border-0 md:bg-background/65 md:p-6"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm font-medium text-accent">{t("eyebrow")}</p>
          <p className="mt-4 font-display text-[clamp(2.4rem,6.5vw,5.2rem)] leading-[0.92] font-semibold tracking-tight text-foreground">
            {t("brand")}
            <span className="mt-1.5 block font-sans text-[0.34em] font-medium tracking-[0.22em] text-text-secondary uppercase">
              {t("brandSub")}
            </span>
          </p>
          <h1 className="mt-5 max-w-lg font-display text-[1.65rem] leading-[1.12] tracking-tight text-foreground md:mt-7 md:text-4xl lg:text-[2.75rem]">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary md:mt-4 md:text-lg">
            {t("subtitle")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-9">
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
