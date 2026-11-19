import type { BlogPost } from "@/types/database";

/** Offline / demo briefings sourced from iSense public marketing themes. */
export const fallbackBlogPosts: BlogPost[] = [
  {
    id: "fallback-intrusion",
    slug: "protect-home-and-business",
    title: {
      en: "Protect your home & business",
      am: "ቤትዎንና ንግድዎን ይጠብቁ",
      ar: "احمِ منزلك وعملك",
    },
    excerpt: {
      en: "Intrusion systems detect entry attempts, trigger on-site alarms, and alert a registered phone — so you can respond before damage is done.",
      am: "የወረራ ማንቂያ ስርዓቶች መግቢያ ሙከራዎችን ያውቃሉ፣ በቦታው ማንቂያ ያስነሳሉ እና ለተመዘገበ ስልክ ማስጠንቀቂያ ይልካሉ።",
      ar: "تكشف أنظمة الإنذار عن محاولات الدخول وتُفعّل إنذاراً في الموقع وترسل تنبيهاً إلى رقم مسجل.",
    },
    content: {
      en: "<p>By utilizing an intrusion alarm system, intruders can be detected when attempting to enter a secured area. An audible or visual alarm can be activated on site while simultaneously sending an alert to a registered phone number.</p><p>iSense designs partitioned zones for homes, offices, warehouses, and banks — with door/window contacts, PIR, and glass-break sensors tied into a response plan your team can actually run.</p>",
      am: "<p>የወረራ ማንቂያ ስርዓት በመጠቀም ወደ ደህንነቱ የተጠበቀ ቦታ ለመግባት ሲሞከር ማወቅ ይቻላል።</p>",
      ar: "<p>باستخدام نظام إنذار ضد التسلل يمكن اكتشاف محاولات الدخول إلى منطقة مؤمّنة وتفعيل إنذار في الموقع.</p>",
    },
    cover_image_url: "/products/intrusion.jpg",
    published: true,
    published_at: "2025-06-12T00:00:00.000Z",
    author_id: null,
    created_at: "2025-06-12T00:00:00.000Z",
    updated_at: "2025-06-12T00:00:00.000Z",
  },
  {
    id: "fallback-access",
    slug: "access-control-without-walls",
    title: {
      en: "Bringing down walls with access control",
      am: "በመዳረሻ ቁጥጥር ግድግዳዎችን ማፍረስ",
      ar: "إزالة الحواجز عبر التحكم في الوصول",
    },
    excerpt: {
      en: "Access control decides who enters an office or facility — by group, schedule, and credential — without slowing the people who belong there.",
      am: "የመዳረሻ ቁጥጥር ማን ወደ ቢሮ ወይም ተቋም እንደሚገባ በቡድን፣ በጊዜ ሰሌዳ እና በማረጋገጫ ይወስናል።",
      ar: "يحدد التحكم في الوصول من يدخل المكتب أو المنشأة حسب المجموعة والجدول وبيانات الاعتماد.",
    },
    content: {
      en: "<p>Access control is focused on controlling who has access, for example to an office or facility. This is typically achieved by restricting access by certain types of groups or access levels.</p><p>iSense supplies readers, controllers, locks, and turnstiles — and ties them into attendance and CCTV when the site needs a single command picture.</p>",
      am: "<p>የመዳረሻ ቁጥጥር ማን መግባት እንዳለበት በቡድን ወይም በደረጃ ይገድባል።</p>",
      ar: "<p>يركّز التحكم في الوصول على تحديد من يدخل عبر مجموعات ومستويات صلاحية.</p>",
    },
    cover_image_url: "/products/access.jpg",
    published: true,
    published_at: "2025-04-02T00:00:00.000Z",
    author_id: null,
    created_at: "2025-04-02T00:00:00.000Z",
    updated_at: "2025-04-02T00:00:00.000Z",
  },
  {
    id: "fallback-hrm",
    slug: "unif1ed-hrm-workforce",
    title: {
      en: "Unif1ed HRM — workforce without device chaos",
      am: "Unif1ed HRM — ያለ መሣሪያ ውዝግብ የሰራተኛ አስተዳደር",
      ar: "Unif1ed HRM — إدارة القوى العاملة بلا فوضى الأجهزة",
    },
    excerpt: {
      en: "Our in-house SaaS unifies biometric devices from multiple manufacturers for attendance, shifts, and Ethiopian payroll rules.",
      am: "የእኛ የውስጥ SaaS ከበርካታ አምራቾች ባዮሜትሪክ መሣሪያዎችን ለመገኘት፣ ለፈረቃ እና ለኢትዮጵያ የደመወዝ ህጎች ያዋህዳል።",
      ar: "منصتنا الداخلية توحد أجهزة المقاييس الحيوية من عدة مصنعين للحضور والورديات وقواعد الرواتب في إثيوبيا.",
    },
    content: {
      en: "<p>Unif1ed HRM Solution is our premiere in-house software for aiding companies manage their workforce. It unifies devices across manufacturers so HR is not trapped in one hardware silo.</p><p>Modules cover live attendance, job costing, deductions, income tax, and pension rules used in Ethiopia — at unlimited employee scale.</p>",
      am: "<p>Unif1ed HRM የሰራተኛ አስተዳደርን ለመርዳት የተሰራ የውስጥ ሶፍትዌር ነው።</p>",
      ar: "<p>Unif1ed HRM هو برنامجنا الداخلي لإدارة القوى العاملة وتوحيد الأجهزة عبر الشركات المصنعة.</p>",
    },
    cover_image_url: "/products/hrm.jpg",
    published: true,
    published_at: "2025-02-18T00:00:00.000Z",
    author_id: null,
    created_at: "2025-02-18T00:00:00.000Z",
    updated_at: "2025-02-18T00:00:00.000Z",
  },
];
