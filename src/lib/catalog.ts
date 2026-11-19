export type ProductSlug =
  | "cctv"
  | "access-control"
  | "time-attendance"
  | "intrusion-alarms"
  | "metal-detection"
  | "fire-alarm"
  | "unified-hrm";

export type SpecRow = { label: string; value: string };

export const productSlugs: ProductSlug[] = [
  "cctv",
  "access-control",
  "time-attendance",
  "intrusion-alarms",
  "metal-detection",
  "fire-alarm",
  "unified-hrm",
];

export const industryKeys = [
  "industry",
  "government",
  "hotels",
  "commercial",
  "healthcare",
  "banking",
] as const;

export const projectKeys = [
  "ethiopianAirlines",
  "officeOfPresident",
  "cdc",
  "coopBank",
  "uaeEmbassy",
] as const;
