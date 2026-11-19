export const products = [
  {
    id: "cctv",
    image: "/products/cctv.jpg",
    specs: [
      { k: "Type", v: "IP / analog hybrid CCTV" },
      { k: "Resolution", v: "Up to 4K network cameras" },
      { k: "Storage", v: "NVR / VMS with RAID options" },
      { k: "Analytics", v: "Motion, intrusion, line crossing" },
      { k: "Environment", v: "Indoor, outdoor, IR night vision" },
    ],
  },
  {
    id: "dome",
    image: "/products/dome.jpg",
    specs: [
      { k: "Form", v: "Indoor / outdoor dome" },
      { k: "Resolution", v: "Up to 4K" },
      { k: "Field of view", v: "90° fixed lens" },
      { k: "Night vision", v: "IR LEDs to 15 m" },
      { k: "Rating", v: "IP67 and IK10 housing" },
    ],
  },
  {
    id: "bullet",
    image: "/products/bullet.jpg",
    specs: [
      { k: "Form", v: "Bullet camera" },
      { k: "Resolution", v: "Up to 4K" },
      { k: "Field of view", v: "80°" },
      { k: "Night vision", v: "IR LEDs to 30 m" },
      { k: "Mount", v: "Wall, pole, or corner" },
    ],
  },
  {
    id: "ptz",
    image: "/products/ptz.jpg",
    specs: [
      { k: "Form", v: "Pan-tilt-zoom" },
      { k: "Coverage", v: "360° pan with optical zoom" },
      { k: "Range", v: "Identification out to 40 m" },
      { k: "Presets", v: "Guard tours and auto-tracking" },
      { k: "Use", v: "Yards, parking, large halls" },
    ],
  },
  {
    id: "nvr",
    image: "/products/nvr.jpg",
    specs: [
      { k: "Form", v: "Network video recorder" },
      { k: "Channels", v: "8, 16, 32, or 64" },
      { k: "Storage", v: "RAID-ready drive bays" },
      { k: "Analytics", v: "Motion, intrusion, line crossing" },
      { k: "Output", v: "HDMI for command centres" },
    ],
  },
  {
    id: "access",
    image: "/products/access.jpg",
    specs: [
      { k: "Credentials", v: "Card, PIN, fingerprint, face" },
      { k: "Doors", v: "Single door to enterprise multi-door" },
      { k: "Integration", v: "Time attendance, CCTV, HR software" },
      { k: "Hardware", v: "Readers, controllers, locks, turnstiles" },
      { k: "Modes", v: "Group and access-level restrictions" },
    ],
  },
  {
    id: "attendance",
    image: "/products/attendance.jpg",
    specs: [
      { k: "Biometrics", v: "Fingerprint, face, card, PIN" },
      { k: "Software", v: "Unif1ed HRM SaaS or device-native" },
      { k: "Capacity", v: "Unlimited employees and shifts" },
      { k: "Reports", v: "Live attendance and job costing" },
      { k: "Payroll", v: "Deductions, income tax, pension" },
    ],
  },
  {
    id: "intrusion",
    image: "/products/intrusion.jpg",
    specs: [
      { k: "Detection", v: "Door, window, PIR, glass break" },
      { k: "Alerting", v: "On-site siren plus registered phone" },
      { k: "Zones", v: "Partitioned home and business areas" },
      { k: "Response", v: "Audible, visual, and remote notification" },
      { k: "Use", v: "Homes, offices, warehouses, banks" },
    ],
  },
  {
    id: "metal",
    image: "/products/metal.jpg",
    specs: [
      { k: "Form", v: "Walk-through and handheld detectors" },
      { k: "Luggage", v: "X-ray inspection systems" },
      { k: "Sensitivity", v: "Multi-zone programmable detection" },
      { k: "Sites", v: "Airports, embassies, government, events" },
      { k: "Projects", v: "Presidential office WTMD, CDC X-ray" },
    ],
  },
  {
    id: "fire",
    image: "/products/fire.jpg",
    specs: [
      { k: "Detection", v: "Smoke, heat, multi-sensor detectors" },
      { k: "Panels", v: "Conventional and addressable panels" },
      { k: "Notification", v: "Sounders, beacons, voice alarm" },
      { k: "Integration", v: "CCTV, access control, command centres" },
      { k: "Compliance", v: "Life-safety design for occupied sites" },
    ],
  },
  {
    id: "hrm",
    image: "/products/hrm.jpg",
    specs: [
      { k: "Product", v: "Unif1ed HRM — in-house SaaS" },
      { k: "Purpose", v: "Unify devices from multiple manufacturers" },
      { k: "Modules", v: "Time & attendance + payroll" },
      { k: "Scale", v: "Unlimited employees, shifts, and breaks" },
      { k: "Localisation", v: "Ethiopian income tax and pension rules" },
    ],
  },
] as const;

export const projects = [
  {
    id: "ethiopian-airlines",
    system: "CCTV system",
    image: "/products/cctv.jpg",
  },
  {
    id: "office-of-the-president",
    system: "Walk through machine",
    image: "/products/metal.jpg",
  },
  {
    id: "cdc",
    system: "Video Surveillance System and X-ray machine",
    image: "/products/nvr.jpg",
  },
  {
    id: "cbo",
    system: "CCTV and Access Control Systems",
    image: "/products/access.jpg",
  },
  {
    id: "uae-embassy",
    system: "Biometric Time Attendance System",
    image: "/products/attendance.jpg",
  },
] as const;

/** Featured installs for the homepage proof strip */
export const featuredProjects = projects.slice(0, 4);

export const industries = [
  "industry",
  "government",
  "hotels",
  "commercial",
  "healthcare",
  "banking",
] as const;
