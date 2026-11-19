import {
  getCameraType,
  getScene,
  type Layout,
  type LayoutCamera,
  type Point,
  type Scene,
  type Wall,
  type Zone,
} from "../../content/coverage.config";

export type {
  CameraTypeId,
  Layout,
  LayoutCamera,
  Point,
  Scene,
  Zone,
} from "../../content/coverage.config";

export {
  cameraTypes,
  defaultLayouts,
  getCameraType,
  getScene,
  scenes,
} from "../../content/coverage.config";

export type Sector = Scene["sector"];

export type ZoneTip = {
  zoneId: string;
  name: string;
  uncoveredPercent: number;
};

export type CoverageCone = {
  cameraId: string;
  polygon: Point[];
};

export type CoverageAnalysis = {
  percent: number;
  covered: number;
  total: number;
  cones: CoverageCone[];
  tips: ZoneTip[];
};

const SECTORS: Sector[] = ["home", "office", "factory", "campus"];
const CAMERA_TYPES: LayoutCamera["type"][] = ["dome", "bullet", "ptz"];

/** Grid step in metres. Fine enough for small rooms, cheap enough to recompute while dragging. */
export const COVERAGE_CELL_M = 0.5;

const HIT_EPS = 1e-3;
const ANGLE_EPS = 0.2;

function wrap360(deg: number) {
  return ((deg % 360) + 360) % 360;
}

/** Smallest signed difference, in degrees, from `fromDeg` to `toDeg`. */
export function wrapSigned(deg: number) {
  const wrapped = wrap360(deg);
  return wrapped > 180 ? wrapped - 360 : wrapped;
}

function direction(deg: number): Point {
  const rad = (deg * Math.PI) / 180;
  return { x: Math.sin(rad), y: -Math.cos(rad) };
}

/** Compass heading: 0° faces up (−y) and angles increase clockwise, matching SVG rotate. */
export function pointAngle(from: Point, to: Point) {
  const rad = Math.atan2(to.x - from.x, -(to.y - from.y));
  return wrap360((rad * 180) / Math.PI);
}

function inFov(heading: number, angle: number, fov: number) {
  if (fov >= 359.5) return true;
  return Math.abs(wrapSigned(angle - heading)) <= fov / 2 + 0.05;
}

type RayHit = { point: Point; distance: number };

function segmentHit(a: Point, b: Point, c: Point, d: Point): RayHit | null {
  const rx = b.x - a.x;
  const ry = b.y - a.y;
  const sx = d.x - c.x;
  const sy = d.y - c.y;
  const denom = rx * sy - ry * sx;
  if (Math.abs(denom) < 1e-9) return null;
  const qpx = c.x - a.x;
  const qpy = c.y - a.y;
  const t = (qpx * sy - qpy * sx) / denom;
  const u = (qpx * ry - qpy * rx) / denom;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  const point = { x: a.x + t * rx, y: a.y + t * ry };
  return { point, distance: Math.hypot(point.x - a.x, point.y - a.y) };
}

function tidy(point: Point): Point {
  return {
    x: Math.round(point.x * 100) / 100,
    y: Math.round(point.y * 100) / 100,
  };
}

function castRay(origin: Point, angleDeg: number, range: number, walls: Wall[]): Point {
  const dir = direction(angleDeg);
  const end = { x: origin.x + dir.x * range, y: origin.y + dir.y * range };
  let bestDist = range;
  let best = end;
  for (const wall of walls) {
    const hit = segmentHit(origin, end, wall.a, wall.b);
    if (!hit || hit.distance <= HIT_EPS || hit.distance >= bestDist) continue;
    bestDist = hit.distance;
    best = hit.point;
  }
  return tidy(best);
}

function collectAngles(camera: LayoutCamera, scene: Scene, fov: number) {
  const origin = { x: camera.x, y: camera.y };
  const heading = camera.rotationDeg;
  const full = fov >= 359.5;
  const start = heading - fov / 2;
  const angles: number[] = [];

  const accept = (deg: number) => {
    if (!full) {
      const rel = wrap360(deg - start);
      if (rel > fov + 0.25 && rel < 360 - 0.25) return;
    }
    angles.push(wrap360(deg));
  };

  const steps = full ? 72 : 36;
  for (let i = 0; i <= steps; i++) accept(start + (fov * i) / steps);

  for (const wall of scene.walls) {
    for (const end of [wall.a, wall.b]) {
      if (Math.hypot(end.x - origin.x, end.y - origin.y) < HIT_EPS) continue;
      const ang = pointAngle(origin, end);
      accept(ang - ANGLE_EPS);
      accept(ang);
      accept(ang + ANGLE_EPS);
    }
  }

  const sortKey = (deg: number) => (full ? deg : wrap360(deg - start));
  angles.sort((a, b) => sortKey(a) - sortKey(b));

  const unique: number[] = [];
  for (const ang of angles) {
    const key = sortKey(ang);
    const prev = unique[unique.length - 1];
    if (prev === undefined || Math.abs(key - sortKey(prev)) > 0.05) unique.push(ang);
  }

  if (full && unique.length > 2) {
    const first = unique[0];
    const last = unique[unique.length - 1];
    if (first !== undefined && last !== undefined && Math.abs(wrapSigned(last - first)) < 0.4) {
      unique.pop();
    }
  }

  return unique;
}

/** Visible FOV polygon. Rays stop at the first wall. */
export function fovPolygon(camera: LayoutCamera, scene: Scene): Point[] {
  const spec = getCameraType(camera.type);
  const origin = { x: camera.x, y: camera.y };
  const fov = Math.min(Math.max(spec.fovDeg, 0), 360);
  if (fov <= 0 || spec.rangeM <= 0) return [origin];

  const ring = collectAngles(camera, scene, fov).map((angle) =>
    castRay(origin, angle, spec.rangeM, scene.walls),
  );

  if (fov >= 359.5) return ring;
  return [tidy(origin), ...ring];
}

export function cameraSees(camera: LayoutCamera, point: Point, walls: Wall[]) {
  const spec = getCameraType(camera.type);
  const origin = { x: camera.x, y: camera.y };
  const dist = Math.hypot(point.x - origin.x, point.y - origin.y);
  if (dist > spec.rangeM + 1e-6) return false;
  if (dist > HIT_EPS) {
    if (!inFov(camera.rotationDeg, pointAngle(origin, point), spec.fovDeg)) return false;
    for (const wall of walls) {
      const hit = segmentHit(origin, point, wall.a, wall.b);
      if (hit && hit.distance > HIT_EPS && hit.distance < dist - HIT_EPS) return false;
    }
  }
  return true;
}

export function pointInPolygon(point: Point, polygon: Point[]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i];
    const b = polygon[j];
    if (!a || !b) continue;
    const crosses = a.y > point.y !== b.y > point.y;
    if (!crosses) continue;
    const xCross = ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x;
    if (point.x < xCross) inside = !inside;
  }
  return inside;
}

function gridSamples(scene: Scene, cellM: number): Point[] {
  const samples: Point[] = [];
  const step = Math.max(cellM, 0.25);
  for (let y = step / 2; y < scene.heightM; y += step) {
    for (let x = step / 2; x < scene.widthM; x += step) {
      samples.push({ x, y });
    }
  }
  return samples;
}

function samplesInZone(zone: Zone, grid: Point[]): Point[] {
  const inside = grid.filter((point) => pointInPolygon(point, zone.polygon));
  if (inside.length >= 6) return inside;

  const xs = zone.polygon.map((point) => point.x);
  const ys = zone.polygon.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  if (!(maxX > minX) || !(maxY > minY)) return inside;

  const extra: Point[] = [];
  const steps = 5;
  for (let iy = 0; iy < steps; iy++) {
    for (let ix = 0; ix < steps; ix++) {
      const point = {
        x: minX + ((ix + 0.5) / steps) * (maxX - minX),
        y: minY + ((iy + 0.5) / steps) * (maxY - minY),
      };
      if (pointInPolygon(point, zone.polygon)) extra.push(point);
    }
  }
  return extra.length ? extra : inside;
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

export function analyzeCoverage(layout: Layout, cellM = COVERAGE_CELL_M): CoverageAnalysis {
  const scene = getScene(layout.sector);
  const samples = gridSamples(scene, cellM);
  const coveredFlags = samples.map((point) =>
    layout.cameras.some((camera) => cameraSees(camera, point, scene.walls)),
  );
  const covered = coveredFlags.filter(Boolean).length;
  const total = samples.length;
  const percent = total === 0 ? 0 : round1((covered / total) * 100);

  const tips: ZoneTip[] = scene.zones
    .filter((zone) => zone.priority === "high")
    .flatMap((zone) => {
      const zonePoints = samplesInZone(zone, samples);
      if (!zonePoints.length) return [];
      const seen = zonePoints.filter((point) =>
        layout.cameras.some((camera) => cameraSees(camera, point, scene.walls)),
      ).length;
      const uncoveredPercent = Math.round(((zonePoints.length - seen) / zonePoints.length) * 100);
      if (uncoveredPercent < 10) return [];
      return [{ zoneId: zone.id, name: zone.name, uncoveredPercent }];
    });

  return {
    percent,
    covered,
    total,
    cones: layout.cameras.map((camera) => ({
      cameraId: camera.id,
      polygon: fovPolygon(camera, scene),
    })),
    tips,
  };
}

export function isLayout(value: unknown): value is Layout {
  if (!value || typeof value !== "object") return false;
  const layout = value as Partial<Layout>;
  if (layout.version !== 1) return false;
  if (typeof layout.sector !== "string" || !SECTORS.includes(layout.sector as Sector)) return false;
  if (!Array.isArray(layout.cameras) || layout.cameras.length > 24) return false;
  return layout.cameras.every((camera) => {
    if (!camera || typeof camera !== "object") return false;
    const row = camera as Partial<LayoutCamera>;
    return (
      typeof row.id === "string" &&
      row.id.length > 0 &&
      row.id.length <= 40 &&
      typeof row.type === "string" &&
      CAMERA_TYPES.includes(row.type as LayoutCamera["type"]) &&
      typeof row.x === "number" &&
      Number.isFinite(row.x) &&
      row.x >= -5 &&
      row.x <= 200 &&
      typeof row.y === "number" &&
      Number.isFinite(row.y) &&
      row.y >= -5 &&
      row.y <= 200 &&
      typeof row.rotationDeg === "number" &&
      Number.isFinite(row.rotationDeg)
    );
  });
}
