import { siteConfig } from "../../config/site";

export type SocialPlatform = "instagram" | "facebook" | "linkedin";

export type SocialFeedPost = {
  id: string;
  platform: SocialPlatform;
  date: string;
  content: string;
  imageUrl: string;
  likes: number;
  comments: number;
  postUrl: string;
  /** LinkedIn-only optional fields */
  headline?: string;
  mediaTitle?: string;
  mediaSubtitle?: string;
};

export const socialProfiles = {
  instagram: {
    handle: "isense.tech",
    name: "iSense Technologies",
    verified: true,
    avatar: "/logo.png",
    followUrl: siteConfig.social.facebook,
    followersLabel: "Follow",
  },
  facebook: {
    handle: "iSense Technologies",
    name: "iSense Technologies",
    verified: true,
    avatar: "/logo.png",
    followUrl: siteConfig.social.facebook,
    followersLabel: "Follow Page",
  },
  linkedin: {
    handle: "iSense Technologies",
    name: "iSense Technologies",
    verified: true,
    avatar: "/logo.png",
    followUrl: siteConfig.social.linkedin,
    followersLabel: "Follow",
    headline: "IP Security Solutions · Addis Ababa",
  },
} as const;

export const socialFeedPosts: SocialFeedPost[] = [
  // Instagram
  {
    id: "ig-1",
    platform: "instagram",
    date: "2d",
    content:
      "Night-ready perimeter for a campus gate in Addis. IR coverage + PTZ overwatch — always watching, never seen. #iSense #CCTV",
    imageUrl: "/media/social/instagram.jpg",
    likes: 214,
    comments: 18,
    postUrl: siteConfig.social.facebook,
  },
  {
    id: "ig-2",
    platform: "instagram",
    date: "5d",
    content:
      "Dome installs that disappear into the ceiling — vandal-resistant shells for corridors and lobbies.",
    imageUrl: "/products/dome.jpg",
    likes: 167,
    comments: 9,
    postUrl: siteConfig.social.facebook,
  },
  {
    id: "ig-3",
    platform: "instagram",
    date: "1w",
    content:
      "Walk-through detection ready for high-security sites. Spec’d, commissioned, supported locally.",
    imageUrl: "/products/metal.jpg",
    likes: 132,
    comments: 11,
    postUrl: siteConfig.social.facebook,
  },
  // Facebook
  {
    id: "fb-1",
    platform: "facebook",
    date: "Yesterday at 10:14 AM",
    content:
      "Command-ready installs across Addis Ababa campuses. From survey to commissioning, our team keeps your site covered — day and night.",
    imageUrl: "/media/social/facebook.jpg",
    likes: 86,
    comments: 14,
    postUrl: siteConfig.social.facebook,
  },
  {
    id: "fb-2",
    platform: "facebook",
    date: "Mar 12 at 4:02 PM",
    content:
      "Access control that matches how your teams move: card, PIN, fingerprint, or face — tied into attendance when you need one picture of the site.",
    imageUrl: "/products/access.jpg",
    likes: 64,
    comments: 7,
    postUrl: siteConfig.social.facebook,
  },
  {
    id: "fb-3",
    platform: "facebook",
    date: "Mar 3 at 9:30 AM",
    content:
      "Intrusion systems that alert a registered phone the moment a zone trips — homes, offices, warehouses, and banks.",
    imageUrl: "/products/intrusion.jpg",
    likes: 51,
    comments: 5,
    postUrl: siteConfig.social.facebook,
  },
  // LinkedIn
  {
    id: "li-1",
    platform: "linkedin",
    date: "3d",
    content:
      "IP security systems engineered for Ethiopian sites. We distribute, configure, and support leading platforms — with local commissioning from our Addis Ababa team.",
    imageUrl: "/media/social/linkedin.jpg",
    likes: 128,
    comments: 22,
    postUrl: siteConfig.social.linkedin,
    headline: "IP Security Solutions · Addis Ababa",
    mediaTitle: "Always watching. Never seen.",
    mediaSubtitle: "iSense Technologies · Field briefing",
  },
  {
    id: "li-2",
    platform: "linkedin",
    date: "1w",
    content:
      "Unif1ed HRM unifies biometric devices across manufacturers so HR isn’t trapped in one hardware silo — attendance, shifts, and Ethiopian payroll rules in one SaaS.",
    imageUrl: "/products/hrm.jpg",
    likes: 97,
    comments: 16,
    postUrl: siteConfig.social.linkedin,
    headline: "IP Security Solutions · Addis Ababa",
    mediaTitle: "Unif1ed HRM",
    mediaSubtitle: "Workforce platform · In-house SaaS",
  },
  {
    id: "li-3",
    platform: "linkedin",
    date: "2w",
    content:
      "Recent commissioning highlights: cargo terminal CCTV, presidential WTMD, embassy biometric attendance, and bank access + video stacks.",
    imageUrl: "/products/cctv.jpg",
    likes: 143,
    comments: 19,
    postUrl: siteConfig.social.linkedin,
    headline: "IP Security Solutions · Addis Ababa",
    mediaTitle: "Successful projects",
    mediaSubtitle: "Airlines · Government · Banking · Embassies",
  },
];

export function postsForPlatform(platform: SocialPlatform) {
  return socialFeedPosts.filter((post) => post.platform === platform);
}
