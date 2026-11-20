"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { DetectionTrack, HeroDetections } from "@/lib/hero-vision";
import { interpolateBox, jitterConfidence, tracksForTheme } from "@/lib/hero-vision";

type Drawn = {
  id: string;
  labelKey: "vehicle" | "person" | "gate" | "plate";
  confidence: number;
  danger?: boolean;
  /** Normalised 0–1 within the cover media frame */
  x: number;
  y: number;
  w: number;
  h: number;
  opacity: number;
};

function labelKeyFor(id: string, kind?: string): Drawn["labelKey"] {
  if (id.includes("plate")) return "plate";
  if (kind === "person" || id.startsWith("p")) return "person";
  if (kind === "zone" || id.includes("gate")) return "gate";
  return "vehicle";
}

function visibilityOpacity(from: number, to: number, time: number, fade = 0.35) {
  if (time < from || time > to) return 0;
  return Math.max(0, Math.min((time - from) / fade, (to - time) / fade, 1));
}

function boxesAtTime(tracks: DetectionTrack[], time: number): Drawn[] {
  const out: Drawn[] = [];
  for (const track of tracks) {
    const opacity = visibilityOpacity(track.visible.from, track.visible.to, time);
    if (opacity <= 0) continue;
    const box = interpolateBox(track.keyframes, time);
    if (!box) continue;
    out.push({
      id: track.id,
      labelKey: labelKeyFor(track.id, track.kind),
      confidence: jitterConfidence(track.baseConfidence, track.id, time),
      danger: track.kind === "zone",
      x: box.x,
      y: box.y,
      w: box.w,
      h: box.h,
      opacity,
    });
    for (const child of track.children ?? []) {
      const childOpacity = visibilityOpacity(child.visible.from, child.visible.to, time);
      if (childOpacity <= 0) continue;
      out.push({
        id: child.id,
        labelKey: labelKeyFor(child.id),
        confidence: jitterConfidence(0.94, child.id, time),
        x: box.x + child.relative.x * box.w,
        y: box.y + child.relative.y * box.h,
        w: child.relative.w * box.w,
        h: child.relative.h * box.h,
        opacity: childOpacity,
      });
    }
  }
  return out;
}

type LabelPlacement = {
  left: string;
  top: string;
  transform?: string;
};

/**
 * Per-kind chip placement so labels stay readable and clear of subjects / copy.
 * person → bottom, vehicle → right edge, gate/plate → top.
 */
function placeLabelChip(box: Drawn): LabelPlacement {
  const pad = 0.01;
  switch (box.labelKey) {
    case "person": {
      // Bottom of box; if too close to frame bottom, sit just inside
      const below = box.y + box.h + pad;
      if (below > 0.97) {
        return {
          left: `${(box.x + box.w / 2) * 100}%`,
          top: `${(box.y + box.h - pad) * 100}%`,
          transform: "translate(-50%, -100%)",
        };
      }
      return {
        left: `${(box.x + box.w / 2) * 100}%`,
        top: `${below * 100}%`,
        transform: "translate(-50%, 0)",
      };
    }
    case "vehicle": {
      // Right of box; if near frame edge, tuck inside the right edge
      const outside = box.x + box.w + pad;
      if (outside > 0.88) {
        return {
          left: `${(box.x + box.w - pad) * 100}%`,
          top: `${(box.y + pad) * 100}%`,
          transform: "translate(-100%, 0)",
        };
      }
      return {
        left: `${outside * 100}%`,
        top: `${(box.y + pad) * 100}%`,
        transform: "translate(0, 0)",
      };
    }
    case "gate":
      return {
        left: `${(box.x + box.w / 2) * 100}%`,
        top: `${(box.y - pad) * 100}%`,
        transform: "translate(-50%, -100%)",
      };
    case "plate":
    default:
      return {
        left: `${box.x * 100}%`,
        top: `${(box.y - pad) * 100}%`,
        transform: "translate(0, -100%)",
      };
  }
}

/**
 * Exact CSS object-fit: cover + object-position (percentages as 0–1).
 * Used by VisionHero to size the shared media+HUD frame.
 */
export function coverObjectPosition(
  containerW: number,
  containerH: number,
  aspectW: number,
  aspectH: number,
  focusX: number,
  focusY: number,
) {
  const contentRatio = aspectW / aspectH;
  const containerRatio = containerW / Math.max(containerH, 1);
  let displayW: number;
  let displayH: number;
  if (containerRatio > contentRatio) {
    displayW = containerW;
    displayH = containerW / contentRatio;
  } else {
    displayH = containerH;
    displayW = containerH * contentRatio;
  }
  return {
    width: containerW,
    height: containerH,
    displayW,
    displayH,
    offsetX: (containerW - displayW) * focusX,
    offsetY: (containerH - displayH) * focusY,
  };
}

export function DetectionOverlay({
  data,
  time,
  theme,
}: {
  data: HeroDetections;
  time: number;
  theme: "dark" | "light";
}) {
  const t = useTranslations("hero");

  const boxes = useMemo(
    () => boxesAtTime(tracksForTheme(data, theme), time),
    [data, theme, time],
  );

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
      >
        {boxes.map((box) => {
          const stroke = box.danger ? "var(--danger)" : "var(--signal)";
          const corner = Math.min(0.018, box.w * 0.2, box.h * 0.2);
          return (
            <g key={box.id} opacity={box.opacity}>
              <rect
                x={box.x}
                y={box.y}
                width={box.w}
                height={box.h}
                fill={
                  box.danger
                    ? "color-mix(in srgb, var(--danger) 12%, transparent)"
                    : "color-mix(in srgb, var(--signal) 8%, transparent)"
                }
                stroke={stroke}
                strokeWidth={0.002}
                rx={0.002}
              />
              <path
                d={`M${box.x} ${box.y + corner} V${box.y} H${box.x + corner}`}
                fill="none"
                stroke={stroke}
                strokeWidth={0.0035}
              />
              <path
                d={`M${box.x + box.w - corner} ${box.y} H${box.x + box.w} V${box.y + corner}`}
                fill="none"
                stroke={stroke}
                strokeWidth={0.0035}
              />
              <path
                d={`M${box.x} ${box.y + box.h - corner} V${box.y + box.h} H${box.x + corner}`}
                fill="none"
                stroke={stroke}
                strokeWidth={0.0035}
              />
              <path
                d={`M${box.x + box.w - corner} ${box.y + box.h} H${box.x + box.w} V${box.y + box.h - corner}`}
                fill="none"
                stroke={stroke}
                strokeWidth={0.0035}
              />
            </g>
          );
        })}
      </svg>

      {/* HTML chips — real px type so labels stay small and sharp (SVG 0–1 text stretches) */}
      {boxes.map((box) => {
        const label = t(`labels.${box.labelKey}`);
        const placement = placeLabelChip(box);
        const bg = box.danger ? "var(--danger)" : "var(--signal)";
        return (
          <span
            key={`${box.id}-chip`}
            className="absolute z-10 whitespace-nowrap rounded-sm px-1.5 py-0.5 font-mono text-[9px] leading-none font-semibold tracking-wide text-[#0a1214] shadow-sm md:text-[10px]"
            style={{
              left: placement.left,
              top: placement.top,
              transform: placement.transform,
              background: bg,
              opacity: box.opacity,
            }}
          >
            {label} {(box.confidence * 100).toFixed(0)}%
          </span>
        );
      })}
    </div>
  );
}
