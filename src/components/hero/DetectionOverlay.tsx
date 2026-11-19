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

function boxesInImageSpace(
  tracks: DetectionTrack[],
  time: number,
  imageW: number,
  imageH: number,
): Drawn[] {
  const out: Drawn[] = [];
  for (const track of tracks) {
    const opacity = visibilityOpacity(track.visible.from, track.visible.to, time);
    if (opacity <= 0) continue;
    const box = interpolateBox(track.keyframes, time);
    if (!box) continue;
    const parent = {
      x: box.x * imageW,
      y: box.y * imageH,
      w: box.w * imageW,
      h: box.h * imageH,
    };
    out.push({
      id: track.id,
      labelKey: labelKeyFor(track.id, track.kind),
      confidence: jitterConfidence(track.baseConfidence, track.id, time),
      danger: track.kind === "zone",
      ...parent,
      opacity,
    });
    for (const child of track.children ?? []) {
      const childOpacity = visibilityOpacity(child.visible.from, child.visible.to, time);
      if (childOpacity <= 0) continue;
      out.push({
        id: child.id,
        labelKey: labelKeyFor(child.id),
        confidence: jitterConfidence(0.94, child.id, time),
        x: parent.x + child.relative.x * parent.w,
        y: parent.y + child.relative.y * parent.h,
        w: child.relative.w * parent.w,
        h: child.relative.h * parent.h,
        opacity: childOpacity,
      });
    }
  }
  return out;
}

/** SVG uses the same cover crop math as object-fit: cover via preserveAspectRatio slice. */
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
  const imageW = data.video.aspect.w * 100;
  const imageH = data.video.aspect.h * 100;
  const boxes = useMemo(
    () => boxesInImageSpace(tracksForTheme(data, theme), time, imageW, imageH),
    [data, theme, time, imageW, imageH],
  );

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${imageW} ${imageH}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {boxes.map((box) => {
        const stroke = box.danger ? "var(--danger)" : "var(--accent)";
        const label = t(`labels.${box.labelKey}`);
        const labelW = Math.max(90, Math.min(box.w, 170));
        const labelH = 28;
        const labelY = Math.max(0, box.y - labelH - 6);
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
                  : "color-mix(in srgb, var(--accent) 6%, transparent)"
              }
              stroke={stroke}
              strokeWidth={1.75}
              vectorEffect="nonScalingStroke"
              rx={2}
            />
            <path
              d={`M${box.x} ${box.y + 14} V${box.y} H${box.x + 14}`}
              fill="none"
              stroke={stroke}
              strokeWidth={2.5}
              vectorEffect="nonScalingStroke"
            />
            <path
              d={`M${box.x + box.w - 14} ${box.y} H${box.x + box.w} V${box.y + 14}`}
              fill="none"
              stroke={stroke}
              strokeWidth={2.5}
              vectorEffect="nonScalingStroke"
            />
            <path
              d={`M${box.x} ${box.y + box.h - 14} V${box.y + box.h} H${box.x + 14}`}
              fill="none"
              stroke={stroke}
              strokeWidth={2.5}
              vectorEffect="nonScalingStroke"
            />
            <path
              d={`M${box.x + box.w - 14} ${box.y + box.h} H${box.x + box.w} V${box.y + box.h - 14}`}
              fill="none"
              stroke={stroke}
              strokeWidth={2.5}
              vectorEffect="nonScalingStroke"
            />
            <rect x={box.x} y={labelY} width={labelW} height={labelH} rx={6} fill={stroke} />
            <text
              x={box.x + 10}
              y={labelY + 18}
              fill="var(--on-accent)"
              fontSize={12}
              fontFamily="var(--font-jakarta), system-ui, sans-serif"
              fontWeight={600}
              letterSpacing="0.04em"
            >
              {label} {(box.confidence * 100).toFixed(0)}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}
