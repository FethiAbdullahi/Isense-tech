export type Keyframe = {
  t: number;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type TrackChild = {
  id: string;
  label: string;
  visible: { from: number; to: number };
  relative: { x: number; y: number; w: number; h: number };
};

export type DetectionTrack = {
  id: string;
  label: string;
  kind?: "person" | "vehicle" | "zone";
  baseConfidence: number;
  visible: { from: number; to: number };
  keyframes: Keyframe[];
  children?: TrackChild[];
};

export type HeroDetections = {
  version: number;
  video: {
    night: string;
    day: string;
    posterNight: string;
    posterDay: string;
    aspect: { w: number; h: number };
    duration: number;
  };
  caption: string;
  tracks?: DetectionTrack[];
  themes?: {
    dark?: { tracks: DetectionTrack[] };
    light?: { tracks: DetectionTrack[] };
  };
};

export function tracksForTheme(
  data: HeroDetections,
  theme: "dark" | "light",
): DetectionTrack[] {
  return data.themes?.[theme]?.tracks ?? data.tracks ?? [];
}

export type DrawnBox = {
  id: string;
  label: string;
  kind: "person" | "vehicle" | "zone" | "plate";
  confidence: number;
  x: number;
  y: number;
  w: number;
  h: number;
  opacity: number;
};

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function interpolateBox(keyframes: Keyframe[], time: number): Keyframe | null {
  if (!keyframes.length) return null;
  if (time <= keyframes[0].t) return keyframes[0];
  const last = keyframes[keyframes.length - 1];
  if (time >= last.t) return last;

  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (time >= a.t && time <= b.t) {
      const raw = (time - a.t) / (b.t - a.t || 1);
      const t = easeInOut(raw);
      return {
        t: time,
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t),
        w: lerp(a.w, b.w, t),
        h: lerp(a.h, b.h, t),
      };
    }
  }
  return last;
}

function visibilityOpacity(from: number, to: number, time: number, fade = 0.4) {
  if (time < from || time > to) return 0;
  const inFade = Math.min(1, (time - from) / fade);
  const outFade = Math.min(1, (to - time) / fade);
  return Math.max(0, Math.min(inFade, outFade));
}

export function jitterConfidence(base: number, id: string, time: number) {
  const seed = id.split("").reduce((n, c) => n + c.charCodeAt(0), 0);
  const wave = Math.sin(time * 4.2 + seed) * 0.012 + Math.sin(time * 1.7 + seed * 0.3) * 0.006;
  return Math.max(0.5, Math.min(0.999, base + wave));
}

/** Map normalised cover-space coords into the container, matching object-fit: cover. */
export function coverRect(
  containerW: number,
  containerH: number,
  contentAspectW: number,
  contentAspectH: number,
) {
  const contentRatio = contentAspectW / contentAspectH;
  const containerRatio = containerW / containerH;
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
    displayW,
    displayH,
    offsetX: (containerW - displayW) / 2,
    offsetY: (containerH - displayH) / 2,
  };
}

export function boxesAtTime(
  data: HeroDetections,
  time: number,
  containerW: number,
  containerH: number,
  theme: "dark" | "light" = "dark",
): DrawnBox[] {
  const { offsetX, offsetY, displayW, displayH } = coverRect(
    containerW,
    containerH,
    data.video.aspect.w,
    data.video.aspect.h,
  );

  const out: DrawnBox[] = [];

  for (const track of tracksForTheme(data, theme)) {
    const opacity = visibilityOpacity(track.visible.from, track.visible.to, time);
    if (opacity <= 0) continue;
    const box = interpolateBox(track.keyframes, time);
    if (!box) continue;

    const parent = {
      x: offsetX + box.x * displayW,
      y: offsetY + box.y * displayH,
      w: box.w * displayW,
      h: box.h * displayH,
    };

    out.push({
      id: track.id,
      label: track.label,
      kind: track.kind ?? "person",
      confidence: jitterConfidence(track.baseConfidence, track.id, time),
      ...parent,
      opacity,
    });

    for (const child of track.children ?? []) {
      const childOpacity = visibilityOpacity(child.visible.from, child.visible.to, time);
      if (childOpacity <= 0) continue;
      out.push({
        id: child.id,
        label: child.label,
        kind: "plate",
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
