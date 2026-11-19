export const PART_IDS = ["mount", "housing", "ir", "lens", "sensor"] as const;
export type PartId = (typeof PART_IDS)[number];

/**
 * Shared scroll chapters — 3D motion and copy use the same windows
 * so labels always match the part that is separating.
 */
export const CHAPTERS: Record<
  PartId,
  { enter: number; focus: number; exit: number }
> = {
  mount: { enter: 0.02, focus: 0.14, exit: 0.28 },
  housing: { enter: 0.22, focus: 0.34, exit: 0.48 },
  ir: { enter: 0.42, focus: 0.54, exit: 0.68 },
  lens: { enter: 0.62, focus: 0.74, exit: 0.86 },
  sensor: { enter: 0.8, focus: 0.9, exit: 1 },
};

export function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

export function smoothstep(t: number) {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

/** 0–1 how “focused” a chapter is at the current scroll progress. */
export function chapterWeight(progress: number, id: PartId) {
  const { enter, focus, exit } = CHAPTERS[id];
  if (progress <= enter) return 0;
  if (progress >= exit) return 0.22;
  if (progress <= focus) {
    return smoothstep((progress - enter) / Math.max(0.0001, focus - enter));
  }
  const fall = smoothstep((exit - progress) / Math.max(0.0001, exit - focus));
  return 0.22 + 0.78 * fall;
}

export function activePartId(progress: number): PartId {
  let best: PartId = "mount";
  let bestScore = -1;
  for (const id of PART_IDS) {
    const { enter, focus, exit } = CHAPTERS[id];
    if (progress < enter || progress > exit) continue;
    const score =
      progress <= focus
        ? (progress - enter) / Math.max(0.0001, focus - enter)
        : (exit - progress) / Math.max(0.0001, exit - focus);
    if (score > bestScore) {
      bestScore = score;
      best = id;
    }
  }
  if (progress < CHAPTERS.mount.enter) return "mount";
  if (progress > CHAPTERS.sensor.exit) return "sensor";
  return best;
}

/** Overall explode amount (0 assembled → 1 fully open). */
export function explodeAmount(progress: number) {
  return smoothstep(clamp01((progress - 0.04) / 0.92));
}
