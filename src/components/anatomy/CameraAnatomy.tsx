"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useTranslations } from "next-intl";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  PART_IDS,
  activePartId,
  chapterWeight,
  type PartId,
} from "./anatomyTimeline";
import { CameraAnatomyCanvas } from "./CameraAnatomyCanvas";

export function CameraAnatomy() {
  const t = useTranslations("anatomy");
  const reduced = Boolean(useReducedMotion());
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(reduced ? 1 : 0);
  const [active, setActive] = useState<PartId>(reduced ? "sensor" : "mount");
  const [weights, setWeights] = useState<Record<PartId, number>>(() =>
    Object.fromEntries(PART_IDS.map((id) => [id, reduced ? 1 : 0])) as Record<
      PartId,
      number
    >,
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const p = reduced ? 1 : value;
    progressRef.current = p;
    const nextActive = activePartId(p);
    setActive((current) => (current === nextActive ? current : nextActive));
    setWeights((current) => {
      let changed = false;
      const next = { ...current };
      for (const id of PART_IDS) {
        const w = reduced ? 1 : Math.round(chapterWeight(p, id) * 20) / 20;
        if (next[id] !== w) {
          next[id] = w;
          changed = true;
        }
      }
      return changed ? next : current;
    });
  });

  const hintOpacity = useTransform(
    scrollYProgress,
    [0, 0.06, 0.14, 0.22],
    reduced ? [0, 0, 0, 0] : [1, 0.85, 0.25, 0],
  );

  return (
    <div
      ref={containerRef}
      className="relative mt-10 h-[250vh] sm:h-[270vh] md:h-[300vh]"
    >
      <div className="sticky top-20 h-[calc(100svh-5.5rem)] overflow-hidden rounded-sm border border-border bg-panel">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_42%_28%,rgba(80,140,255,0.12),transparent_52%)]" />

        <div className="relative flex h-full flex-col md:flex-row">
          <div className="relative min-h-0 flex-[1.4]">
            <CameraAnatomyCanvas progressRef={progressRef} />

            <motion.p
              className="pointer-events-none absolute inset-x-0 bottom-4 z-20 text-center text-xs tracking-[0.14em] text-white/55 uppercase"
              style={{ opacity: hintOpacity }}
            >
              {t("scrollHint")}
            </motion.p>
          </div>

          <aside
            className={cn(
              "relative z-10 w-full shrink-0 border-t border-white/10 md:w-[min(100%,22rem)] md:border-t-0 md:border-s",
              "max-h-[42%] overflow-y-auto p-4 md:max-h-none md:self-center md:overflow-visible md:p-5",
            )}
            aria-label={t("kicker")}
          >
            <p className="mb-3 text-[11px] tracking-[0.16em] text-white/40 uppercase">
              {t("progress", {
                current: PART_IDS.indexOf(active) + 1,
                total: PART_IDS.length,
              })}
            </p>
            <ol className="flex flex-col gap-2.5">
              {PART_IDS.map((id, index) => {
                const selected = id === active;
                const weight = weights[id];
                return (
                  <li
                    key={id}
                    aria-current={selected ? "step" : undefined}
                    className={cn(
                      "relative flex gap-3 rounded-2xl border px-3.5 py-3 transition-[opacity,transform,border-color,background-color] duration-300",
                      selected
                        ? "border-accent/50 bg-accent/10"
                        : "border-white/10 bg-black/35",
                    )}
                    style={{
                      opacity: reduced ? 1 : 0.28 + weight * 0.72,
                      transform: selected
                        ? "translateX(0)"
                        : "translateX(6px)",
                    }}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition",
                        selected
                          ? "bg-accent text-on-accent shadow-[0_0_0_6px_color-mix(in_srgb,var(--accent)_24%,transparent)]"
                          : "bg-white/10 text-white/80",
                      )}
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium tracking-[0.16em] text-accent uppercase">
                        {t(`parts.${id}`)}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                        {t(`parts.${id}Body`)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
            {reduced ? (
              <p className="mt-3 text-xs text-text-secondary">{t("lite")}</p>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}
