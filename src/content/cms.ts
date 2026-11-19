import { siteConfig } from "../../config/site";
import type { FaqRow, PackageRow, ProductRow, SiteSettings } from "@/types/database";

/** Fallback CMS when Supabase is offline — mirrors seedable table content. */

export const fallbackSettings: SiteSettings = {
  id: "default",
  whatsapp: siteConfig.whatsapp,
  phone: siteConfig.phoneDisplay,
  email: siteConfig.email,
  address: siteConfig.address,
  map_embed_url: siteConfig.map.embedUrl,
  hours: { ...siteConfig.hours },
};

export const fallbackPackages: PackageRow[] = [
  {
    id: "home-essential",
    sector: "home",
    name: { en: "Home Essential", am: "የቤት አስፈላጊ", ar: "المنزل الأساسي" },
    min_cameras: 1,
    max_cameras: 4,
    description: {
      en: "Entry coverage for apartments and villas.",
      am: "ለአፓርታማዎች እና ቪላዎች መግቢያ ሽፋን።",
      ar: "تغطية المداخل للشقق والفلل.",
    },
    sort_order: 1,
  },
  {
    id: "home-plus",
    sector: "home",
    name: { en: "Home Plus", am: "የቤት ፕላስ", ar: "المنزل بلس" },
    min_cameras: 5,
    max_cameras: 12,
    description: {
      en: "Perimeter plus living areas.",
      am: "ድንበር እና የመኖሪያ ቦታዎች።",
      ar: "المحيط ومناطق المعيشة.",
    },
    sort_order: 2,
  },
  {
    id: "office-core",
    sector: "office",
    name: { en: "Office Core", am: "የቢሮ ኮር", ar: "المكتب الأساسي" },
    min_cameras: 2,
    max_cameras: 8,
    description: {
      en: "Reception, corridors, and server rooms.",
      am: "አቀባበል፣ ኮሪደሮች እና የሰርቨር ክፍሎች።",
      ar: "الاستقبال والممرات وغرف الخوادم.",
    },
    sort_order: 1,
  },
  {
    id: "office-campus",
    sector: "office",
    name: { en: "Office Campus", am: "የቢሮ ካምፓስ", ar: "حرم المكتب" },
    min_cameras: 9,
    max_cameras: 40,
    description: {
      en: "Multi-floor office coverage with NVR.",
      am: "ባለብዙ ፎቅ የቢሮ ሽፋን ከNVR ጋር።",
      ar: "تغطية مكاتب متعددة الطوابق مع NVR.",
    },
    sort_order: 2,
  },
  {
    id: "factory-watch",
    sector: "factory",
    name: { en: "Factory Watch", am: "የፋብሪካ ክትትል", ar: "مراقبة المصنع" },
    min_cameras: 4,
    max_cameras: 20,
    description: {
      en: "Production lines and loading docks.",
      am: "የምርት መስመሮች እና የጭነት ቦታዎች።",
      ar: "خطوط الإنتاج وأرصفة التحميل.",
    },
    sort_order: 1,
  },
  {
    id: "factory-secure",
    sector: "factory",
    name: { en: "Factory Secure", am: "የፋብሪካ ደህንነት", ar: "أمن المصنع" },
    min_cameras: 21,
    max_cameras: 80,
    description: {
      en: "Full perimeter with PTZ overwatch.",
      am: "ሙሉ ድንበር ከPTZ ክትትል ጋር።",
      ar: "محيط كامل مع مراقبة PTZ.",
    },
    sort_order: 2,
  },
  {
    id: "campus-guard",
    sector: "campus",
    name: { en: "Campus Guard", am: "የካምፓስ ጥበቃ", ar: "حراسة الحرم" },
    min_cameras: 6,
    max_cameras: 30,
    description: {
      en: "Gates, parking, and shared facilities.",
      am: "በሮች፣ መኪና ማቆሚያ እና የጋራ መገልገያዎች።",
      ar: "البوابات والمواقف والمرافق المشتركة.",
    },
    sort_order: 1,
  },
  {
    id: "campus-command",
    sector: "campus",
    name: { en: "Campus Command", am: "የካምፓስ ትእዛዝ", ar: "قيادة الحرم" },
    min_cameras: 31,
    max_cameras: 120,
    description: {
      en: "Command-and-control grade coverage.",
      am: "የትእዛዝ እና ቁጥጥር ደረጃ ሽፋን።",
      ar: "تغطية بمستوى القيادة والتحكم.",
    },
    sort_order: 2,
  },
];

export const fallbackCameraProducts: ProductRow[] = [
  {
    id: "dome",
    category: "dome",
    sort_order: 1,
    title: { en: "Dome camera", am: "ዶም ካሜራ", ar: "كاميرا قبة" },
    excerpt: {
      en: "Discreet wide-area indoor/outdoor coverage.",
      am: "የተደበቀ ሰፊ የቤት ውስጥ/ውጭ ሽፋን።",
      ar: "تغطية واسعة داخلية/خارجية بتصميم غير ظاهر.",
    },
    body: {
      en: "Dome cameras deliver 360° aesthetic coverage with vandal-resistant housings — ideal for lobbies, corridors, and retail floors.",
      am: "ዶም ካሜራዎች ለሎቢ፣ ኮሪደር እና የችርቻሮ ወለሎች ተስማሚ ሰፊ ሽፋን ይሰጣሉ።",
      ar: "توفر كاميرات القبة تغطية جمالية واسعة بهياكل مقاومة للتخريب.",
    },
    specs: [
      { k: "FOV", v: "≈ 90–110°" },
      { k: "Range", v: "Up to 15 m IR" },
      { k: "Form", v: "Vandal-resistant dome" },
      { k: "Mount", v: "Ceiling / wall" },
    ],
    image_url: "/products/dome.svg",
    published: true,
  },
  {
    id: "bullet",
    category: "bullet",
    sort_order: 2,
    title: { en: "Bullet camera", am: "ቡሌት ካሜራ", ar: "كاميرا رصاصية" },
    excerpt: {
      en: "Long-range perimeter and driveway surveillance.",
      am: "ረጅም ርቀት ድንበር እና መንገድ ክትትል።",
      ar: "مراقبة المحيط والممرات بعيدة المدى.",
    },
    body: {
      en: "Bullet cameras project focused FOV with strong IR for gates, fences, and parking approaches.",
      am: "ቡሌት ካሜራዎች ለበር፣ አጥር እና መኪና ማቆሚያ ጠንካራ IR ጋር የተጠናከረ ሽፋን ይሰጣሉ።",
      ar: "توفر الكاميرات الرصاصية مجال رؤية مركّز مع أشعة تحت حمراء قوية للبوابات والأسوار.",
    },
    specs: [
      { k: "FOV", v: "≈ 70–90°" },
      { k: "Range", v: "Up to 30 m IR" },
      { k: "Form", v: "Weatherproof bullet" },
      { k: "Mount", v: "Wall / pole" },
    ],
    image_url: "/products/bullet.svg",
    published: true,
  },
  {
    id: "ptz",
    category: "ptz",
    sort_order: 3,
    title: { en: "PTZ camera", am: "PTZ ካሜራ", ar: "كاميرا PTZ" },
    excerpt: {
      en: "Pan-tilt-zoom overwatch for large sites.",
      am: "ለትላልቅ ቦታዎች የፓን-ቲልት-ዙም ክትትል።",
      ar: "مراقبة شاملة بتقنية pan-tilt-zoom للمواقع الكبيرة.",
    },
    body: {
      en: "PTZ units patrol wide campuses with optical zoom and preset tours for operators.",
      am: "PTZ ካሜራዎች ሰፊ ካምፓሶችን በኦፕቲካል ዙም እና በቅድመ ቅንብሮች ይቆጣጠራሉ።",
      ar: "تدور وحدات PTZ في الحرم الجامعي مع تقريب بصري وجولات مسبقة الإعداد.",
    },
    specs: [
      { k: "Coverage", v: "360° pan" },
      { k: "Range", v: "Up to 40 m+" },
      { k: "Zoom", v: "Optical zoom tours" },
      { k: "Control", v: "Joystick / VMS" },
    ],
    image_url: "/products/ptz.svg",
    published: true,
  },
  {
    id: "nvr",
    category: "nvr",
    sort_order: 4,
    title: { en: "NVR & storage", am: "NVR እና ማከማቻ", ar: "NVR والتخزين" },
    excerpt: {
      en: "Network video recorders and resilient storage.",
      am: "የአውታረ መረብ ቪዲዮ መቅረጫዎች እና ጠንካራ ማከማቻ።",
      ar: "مسجلات فيديو شبكية وتخزين مرن.",
    },
    body: {
      en: "NVR platforms centralise IP cameras with RAID options, remote viewing, and retention policies sized to your compliance needs.",
      am: "NVR ስርዓቶች የአይፒ ካሜራዎችን ከRAID፣ ሩቅ እይታ እና የማቆያ ፖሊሲዎች ጋር ያማከላሉ።",
      ar: "تجمع منصات NVR كاميرات IP مع خيارات RAID وعرض عن بُعد وسياسات احتفاظ.",
    },
    specs: [
      { k: "Channels", v: "4–64+ IP channels" },
      { k: "Storage", v: "HDD / RAID options" },
      { k: "Access", v: "Local + remote clients" },
      { k: "Analytics", v: "Motion / intrusion hooks" },
    ],
    image_url: "/products/nvr.svg",
    published: true,
  },
];

export const fallbackFaqs: FaqRow[] = [
  {
    id: "faq-about",
    tags: ["about", "who", "company", "ellis", "experience"],
    question: {
      en: "Who is iSense Technologies?",
      am: "iSense Technologies ማን ነው?",
      ar: "من هي iSense Technologies؟",
    },
    answer: {
      en: `iSense Technologies is the security division of ${siteConfig.legalName}, founded in ${siteConfig.founded}. We distribute, configure, and support complete IP security solutions across Ethiopia.`,
      am: `iSense Technologies የ${siteConfig.legalName} የደህንነት ክፍል ሲሆን ከ${siteConfig.founded} ጀምሮ በኢትዮጵያ የአይፒ ደህንነት መፍትሄዎችን ያቀርባል።`,
      ar: `iSense Technologies هي قسم الأمن التابع لـ ${siteConfig.legalName} منذ ${siteConfig.founded}، نوفر حلول أمن IP في إثيوبيا.`,
    },
    sort_order: 1,
    published: true,
  },
  {
    id: "faq-contact",
    tags: ["contact", "phone", "email", "address", "hours", "location"],
    question: {
      en: "How do I reach you?",
      am: "እንዴት ልደርስዎ?",
      ar: "كيف أتواصل معكم؟",
    },
    answer: {
      en: `Head office: ${siteConfig.address}. Call ${siteConfig.phoneDisplay} or email ${siteConfig.email}. Hours: ${siteConfig.hours.weekdays}; ${siteConfig.hours.saturday}.`,
      am: `ቢሮ: ${siteConfig.address}. ስልክ ${siteConfig.phoneDisplay} ወይም ኢሜይል ${siteConfig.email}።`,
      ar: `المكتب: ${siteConfig.address}. اتصل ${siteConfig.phoneDisplay} أو راسل ${siteConfig.email}.`,
    },
    sort_order: 2,
    published: true,
  },
  {
    id: "faq-quote",
    tags: ["quote", "price", "cost", "proposal"],
    question: {
      en: "How do I get a quote?",
      am: "ዋጋ እንዴት ማግኘት እችላለሁ?",
      ar: "كيف أحصل على عرض سعر؟",
    },
    answer: {
      en: `Share your site type and camera count via the coverage planner, WhatsApp (${siteConfig.whatsappUrl}), or ${siteConfig.email}. We prepare proposals after a short survey.`,
      am: `የቦታዎን አይነት እና የካሜራ ብዛት በሽፋን እቅድ፣ WhatsApp ወይም ${siteConfig.email} ያጋሩ።`,
      ar: `شارك نوع الموقع وعدد الكاميرات عبر مخطط التغطية أو واتساب أو ${siteConfig.email}.`,
    },
    sort_order: 3,
    published: true,
  },
];
