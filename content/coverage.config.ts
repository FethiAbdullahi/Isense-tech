export type CameraTypeId = "dome" | "bullet" | "ptz";

export type CameraType = {
  id: CameraTypeId;
  name: string;
  rangeM: number;
  fovDeg: number;
};

export type Point = { x: number; y: number };

export type Zone = {
  id: string;
  name: string;
  priority: "high" | "normal";
  polygon: Point[];
};

export type Wall = {
  id: string;
  a: Point;
  b: Point;
};

export type Scene = {
  id: string;
  sector: "home" | "office" | "factory" | "campus";
  label: string;
  widthM: number;
  heightM: number;
  walls: Wall[];
  zones: Zone[];
};

export type LayoutCamera = {
  id: string;
  type: CameraTypeId;
  x: number;
  y: number;
  rotationDeg: number;
};

export type Layout = {
  version: 1;
  sector: Scene["sector"];
  cameras: LayoutCamera[];
};

export const cameraTypes: CameraType[] = [
  { id: "dome", name: "Dome", rangeM: 15, fovDeg: 90 },
  { id: "bullet", name: "Bullet", rangeM: 30, fovDeg: 80 },
  { id: "ptz", name: "PTZ", rangeM: 40, fovDeg: 360 },
];

export const scenes: Scene[] = [
  {
    id: "home",
    sector: "home",
    label: "Home",
    widthM: 18,
    heightM: 14,
    walls: [
      { id: "w1", a: { x: 6, y: 0 }, b: { x: 6, y: 8 } },
      { id: "w2", a: { x: 6, y: 8 }, b: { x: 12, y: 8 } },
      { id: "w3", a: { x: 12, y: 8 }, b: { x: 12, y: 14 } },
    ],
    zones: [
      {
        id: "entrance",
        name: "Entrance",
        priority: "high",
        polygon: [
          { x: 7.5, y: 0 },
          { x: 10.5, y: 0 },
          { x: 10.5, y: 2.5 },
          { x: 7.5, y: 2.5 },
        ],
      },
      {
        id: "living",
        name: "Living",
        priority: "normal",
        polygon: [
          { x: 1, y: 1 },
          { x: 5.5, y: 1 },
          { x: 5.5, y: 7 },
          { x: 1, y: 7 },
        ],
      },
    ],
  },
  {
    id: "office",
    sector: "office",
    label: "Office",
    widthM: 24,
    heightM: 16,
    walls: [
      { id: "w1", a: { x: 8, y: 0 }, b: { x: 8, y: 10 } },
      { id: "w2", a: { x: 8, y: 10 }, b: { x: 16, y: 10 } },
      { id: "w3", a: { x: 16, y: 0 }, b: { x: 16, y: 10 } },
    ],
    zones: [
      {
        id: "reception",
        name: "Reception",
        priority: "high",
        polygon: [
          { x: 9, y: 0 },
          { x: 15, y: 0 },
          { x: 15, y: 4 },
          { x: 9, y: 4 },
        ],
      },
      {
        id: "server",
        name: "Server room",
        priority: "high",
        polygon: [
          { x: 18, y: 11 },
          { x: 23, y: 11 },
          { x: 23, y: 15 },
          { x: 18, y: 15 },
        ],
      },
    ],
  },
  {
    id: "factory",
    sector: "factory",
    label: "Factory",
    widthM: 40,
    heightM: 24,
    walls: [
      { id: "w1", a: { x: 12, y: 0 }, b: { x: 12, y: 18 } },
      { id: "w2", a: { x: 28, y: 6 }, b: { x: 28, y: 24 } },
    ],
    zones: [
      {
        id: "dock",
        name: "Loading dock",
        priority: "high",
        polygon: [
          { x: 30, y: 18 },
          { x: 39, y: 18 },
          { x: 39, y: 23 },
          { x: 30, y: 23 },
        ],
      },
      {
        id: "line",
        name: "Production line",
        priority: "normal",
        polygon: [
          { x: 2, y: 4 },
          { x: 11, y: 4 },
          { x: 11, y: 20 },
          { x: 2, y: 20 },
        ],
      },
    ],
  },
  {
    id: "campus",
    sector: "campus",
    label: "Campus",
    widthM: 48,
    heightM: 32,
    walls: [
      { id: "w1", a: { x: 16, y: 8 }, b: { x: 32, y: 8 } },
      { id: "w2", a: { x: 16, y: 8 }, b: { x: 16, y: 24 } },
      { id: "w3", a: { x: 32, y: 8 }, b: { x: 32, y: 24 } },
      { id: "w4", a: { x: 16, y: 24 }, b: { x: 32, y: 24 } },
    ],
    zones: [
      {
        id: "gate",
        name: "Main gate",
        priority: "high",
        polygon: [
          { x: 20, y: 0 },
          { x: 28, y: 0 },
          { x: 28, y: 4 },
          { x: 20, y: 4 },
        ],
      },
      {
        id: "parking",
        name: "Parking",
        priority: "normal",
        polygon: [
          { x: 2, y: 20 },
          { x: 14, y: 20 },
          { x: 14, y: 30 },
          { x: 2, y: 30 },
        ],
      },
    ],
  },
];

export const defaultLayouts: Record<Scene["sector"], Layout> = {
  home: {
    version: 1,
    sector: "home",
    cameras: [
      { id: "c1", type: "dome", x: 9, y: 3, rotationDeg: 180 },
      { id: "c2", type: "bullet", x: 3, y: 4, rotationDeg: 45 },
    ],
  },
  office: {
    version: 1,
    sector: "office",
    cameras: [
      { id: "c1", type: "dome", x: 12, y: 2, rotationDeg: 180 },
      { id: "c2", type: "bullet", x: 20, y: 13, rotationDeg: 270 },
      { id: "c3", type: "ptz", x: 4, y: 8, rotationDeg: 0 },
    ],
  },
  factory: {
    version: 1,
    sector: "factory",
    cameras: [
      { id: "c1", type: "ptz", x: 20, y: 12, rotationDeg: 0 },
      { id: "c2", type: "bullet", x: 34, y: 20, rotationDeg: 225 },
      { id: "c3", type: "dome", x: 6, y: 12, rotationDeg: 90 },
    ],
  },
  campus: {
    version: 1,
    sector: "campus",
    cameras: [
      { id: "c1", type: "ptz", x: 24, y: 6, rotationDeg: 0 },
      { id: "c2", type: "bullet", x: 8, y: 25, rotationDeg: 45 },
      { id: "c3", type: "dome", x: 24, y: 16, rotationDeg: 180 },
    ],
  },
};

export function getCameraType(id: CameraTypeId) {
  return cameraTypes.find((c) => c.id === id) ?? cameraTypes[0];
}

export function getScene(sector: Scene["sector"]) {
  return scenes.find((s) => s.sector === sector) ?? scenes[0];
}
