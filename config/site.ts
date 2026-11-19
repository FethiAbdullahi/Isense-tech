export const DEFAULT_THEME = "dark" as const;

export type ThemeMode = "dark" | "light";

export const siteConfig = {
  name: "iSense Technologies",
  legalName: "Ellis Trading House PLC",
  founded: 2007,
  tagline: "Always watching. Never seen.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.isense-tech.com",
  phone: "+251 11 111 4031",
  phoneDisplay: "+251 11 111 4031",
  phoneTel: "+251111114031",
  faxDisplay: "+251 11 111 4035",
  faxTel: "+251111114035",
  email: "info@isense-tech.com",
  whatsapp: "251111114031",
  whatsappUrl: "https://wa.me/251111114031",
  address:
    "MK Business Center, Churchill Avenue, 7th Floor, Suites 707–71, Addis Ababa, Ethiopia",
  hours: {
    weekdays: "Mon–Fri: 8:30am – 5:00pm",
    saturday: "Sat: 8:30am – 12:30pm",
    sunday: "Sunday: Closed",
  },
  map: {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.385709042434!2d38.749833514241224!3d9.028534593521199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b856b809a46d1%3A0x219ecb4e2e45bfeb!2siSense%20technologies!5e0!3m2!1sen!2set!4v1626472430450!5m2!1sen!2set",
    lat: 9.028535,
    lng: 38.752106,
    placeName: "iSense Technologies",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/isense-technologies",
    facebook: "https://www.facebook.com/124192680976214",
  },
  stats: [
    { value: "1150+", key: "projects" },
    { value: "8+", key: "partners" },
    { value: "15+", key: "years" },
    { value: "600+", key: "customers" },
  ],
  themeStorageKey: "isense-theme",
} as const;

/** @deprecated Prefer siteConfig from config/site */
export const site = siteConfig;
