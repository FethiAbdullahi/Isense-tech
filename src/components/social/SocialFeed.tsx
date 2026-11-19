"use client";

import { useState, type ReactNode } from "react";
import {
  Bookmark,
  Globe2,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Send,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  postsForPlatform,
  socialProfiles,
  type SocialFeedPost,
  type SocialPlatform,
} from "@/content/social-feed";

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}

function VerifiedBadge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-3.5 shrink-0", className)}
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M10.2 15.4 7.4 12.6l1.1-1.1 1.7 1.7 4.3-4.3 1.1 1.1-5.4 5.4Z"
        fill="#fff"
      />
    </svg>
  );
}

/** Brand-colored platform marks — readable in light and dark mode */
function PlatformAvatar({
  platform,
  size = "md",
  ring = false,
}: {
  platform: SocialPlatform;
  size?: "sm" | "md" | "lg";
  ring?: boolean;
}) {
  const dim =
    size === "lg" ? "size-11" : size === "sm" ? "size-7" : "size-10";

  if (platform === "instagram") {
    const icon = (
      <svg viewBox="0 0 24 24" className="size-[55%] fill-white" aria-hidden>
        <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm6.1-8.2a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0ZM12 2.5c-2.45 0-2.76.01-3.72.05-.95.04-1.6.2-2.17.42a4.4 4.4 0 0 0-1.59 1.03 4.4 4.4 0 0 0-1.03 1.59c-.23.57-.38 1.22-.42 2.17C3.01 9.24 3 9.55 3 12s.01 2.76.05 3.72c.04.95.2 1.6.42 2.17a4.4 4.4 0 0 0 1.03 1.59 4.4 4.4 0 0 0 1.59 1.03c.57.23 1.22.38 2.17.42.96.04 1.27.05 3.72.05s2.76-.01 3.72-.05c.95-.04 1.6-.2 2.17-.42a4.4 4.4 0 0 0 1.59-1.03 4.4 4.4 0 0 0 1.03-1.59c.23-.57.38-1.22.42-2.17.04-.96.05-1.27.05-3.72s-.01-2.76-.05-3.72c-.04-.95-.2-1.6-.42-2.17a4.4 4.4 0 0 0-1.03-1.59 4.4 4.4 0 0 0-1.59-1.03c-.57-.23-1.22-.38-2.17-.42C14.76 2.51 14.45 2.5 12 2.5Zm0 1.53c2.4 0 2.69.01 3.64.05.88.04 1.35.19 1.67.31.42.16.72.36 1.04.67.31.32.51.62.67 1.04.12.32.27.79.31 1.67.04.95.05 1.24.05 3.64s-.01 2.69-.05 3.64c-.04.88-.19 1.35-.31 1.67-.16.42-.36.72-.67 1.04-.32.31-.62.51-1.04.67-.32.12-.79.27-1.67.31-.95.04-1.24.05-3.64.05s-2.69-.01-3.64-.05c-.88-.04-1.35-.19-1.67-.31a2.8 2.8 0 0 1-1.04-.67 2.8 2.8 0 0 1-.67-1.04c-.12-.32-.27-.79-.31-1.67-.04-.95-.05-1.24-.05-3.64s.01-2.69.05-3.64c.04-.88.19-1.35.31-1.67.16-.42.36-.72.67-1.04.32-.31.62-.51 1.04-.67.32-.12.79-.27 1.67-.31.95-.04 1.24-.05 3.64-.05Z" />
      </svg>
    );
    const mark = (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full bg-[linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)] text-white shadow-sm",
          dim,
        )}
        aria-hidden
      >
        {icon}
      </span>
    );
    if (!ring) return mark;
    return (
      <span
        className="inline-flex shrink-0 rounded-full bg-[linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)] p-[2px]"
        aria-hidden
      >
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-[linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)] ring-2 ring-white [[data-theme=light]_&]:ring-white",
            dim,
          )}
        >
          {icon}
        </span>
      </span>
    );
  }

  if (platform === "facebook") {
    const fSize =
      size === "lg" ? "text-2xl" : size === "sm" ? "text-lg" : "text-xl";
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-sm",
          dim,
        )}
        aria-hidden
      >
        <span
          className={cn(
            "-mt-0.5 font-[Helvetica,Arial,sans-serif] font-bold leading-none",
            fSize,
          )}
        >
          f
        </span>
      </span>
    );
  }

  const inSize =
    size === "lg" ? "text-[15px]" : size === "sm" ? "text-[11px]" : "text-[13px]";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg bg-[#0A66C2] text-white shadow-sm",
        dim,
      )}
      aria-hidden
    >
      <span
        className={cn(
          "font-[Helvetica,Arial,sans-serif] font-bold leading-none tracking-tight",
          inSize,
        )}
      >
        in
      </span>
    </span>
  );
}

function LikeButton({
  initial,
  activeClass,
  idleClass,
  icon: Icon,
  label,
}: {
  initial: number;
  activeClass: string;
  idleClass: string;
  icon: typeof Heart;
  label?: string;
}) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initial);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setLiked((v) => !v);
        setCount((c) => (liked ? c - 1 : c + 1));
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-[13px] font-medium transition",
        liked ? activeClass : idleClass,
      )}
      aria-pressed={liked}
    >
      <Icon
        className={cn("size-4", liked && Icon === Heart && "fill-current")}
      />
      {label ? <span>{label}</span> : null}
      <span className="tabular-nums">{formatCount(count)}</span>
    </button>
  );
}

function FeedShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex h-[550px] flex-col overflow-hidden rounded-[16px] border border-border bg-panel shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.28)]",
        className,
      )}
    >
      {children}
    </article>
  );
}

function InstagramCard({ posts }: { posts: SocialFeedPost[] }) {
  const profile = socialProfiles.instagram;
  const t = useTranslations("social");

  return (
    <FeedShell className="bg-[#0a0a0a] text-white [[data-theme=light]_&]:bg-white [[data-theme=light]_&]:text-neutral-900">
      <a
        href={profile.followUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="sticky top-0 z-10 flex items-center gap-3 border-b border-white/10 bg-[#0a0a0a]/95 px-3.5 py-3 backdrop-blur [[data-theme=light]_&]:border-neutral-200 [[data-theme=light]_&]:bg-white/95"
      >
        <PlatformAvatar platform="instagram" size="md" ring />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-sm font-semibold">
            <span className="truncate">{profile.handle}</span>
            {profile.verified ? (
              <VerifiedBadge className="text-[#3897f0]" />
            ) : null}
          </p>
          <p className="truncate text-xs text-white/55 [[data-theme=light]_&]:text-neutral-500">
            Addis Ababa
          </p>
        </div>
        <MoreHorizontal className="size-5 text-white/70 [[data-theme=light]_&]:text-neutral-500" />
      </a>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-0 py-2">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="flex items-center gap-2.5 px-3.5 pb-2">
              <PlatformAvatar platform="instagram" size="sm" ring />
              <p className="text-[13px] font-semibold">{profile.handle}</p>
              <span className="text-xs text-white/45">· {post.date}</span>
            </div>
            <div className="aspect-[4/5] w-full overflow-hidden bg-neutral-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between px-3.5 pt-2.5">
              <div className="flex items-center gap-3">
                <LikeButton
                  initial={post.likes}
                  icon={Heart}
                  activeClass="text-[#ff3040]"
                  idleClass="text-white hover:text-white/70 [[data-theme=light]_&]:text-neutral-800"
                />
                <span className="inline-flex items-center gap-1 text-[13px] text-white/80">
                  <MessageCircle className="size-4" />
                  {formatCount(post.comments)}
                </span>
                <Send className="size-4 text-white/80" />
              </div>
              <Bookmark className="size-4 text-white/80" />
            </div>
            <p className="px-3.5 pt-1.5 text-[13px] leading-snug">
              <span className="font-semibold">{profile.handle}</span>{" "}
              <span className="text-white/85 [[data-theme=light]_&]:text-neutral-700">
                {post.content}
              </span>
            </p>
          </a>
        ))}
      </div>

      <a
        href={profile.followUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="border-t border-white/10 px-3.5 py-3 text-center text-sm font-semibold text-[#3897f0] transition hover:bg-white/5"
      >
        {t("followInstagram")}
      </a>
    </FeedShell>
  );
}

function FacebookCard({ posts }: { posts: SocialFeedPost[] }) {
  const profile = socialProfiles.facebook;
  const t = useTranslations("social");

  return (
    <FeedShell className="bg-[#242526] text-[#e4e6eb] [[data-theme=light]_&]:bg-white [[data-theme=light]_&]:text-neutral-900">
      <a
        href={profile.followUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="sticky top-0 z-10 flex items-center gap-3 border-b border-white/10 bg-[#242526]/95 px-3.5 py-3 backdrop-blur [[data-theme=light]_&]:border-neutral-200 [[data-theme=light]_&]:bg-white/95"
      >
        <PlatformAvatar platform="facebook" size="md" />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-sm font-semibold text-[#e7f3ff] [[data-theme=light]_&]:text-[#0866ff]">
            <span className="truncate">{profile.name}</span>
            {profile.verified ? (
              <VerifiedBadge className="text-[#0866ff]" />
            ) : null}
          </p>
          <p className="text-xs text-[#b0b3b8]">Facebook Page</p>
        </div>
        <MoreHorizontal className="size-5 text-[#b0b3b8]" />
      </a>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-3">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-xl border border-white/10 bg-[#3a3b3c]/40 [[data-theme=light]_&]:border-neutral-200 [[data-theme=light]_&]:bg-neutral-50"
          >
            <div className="flex items-start gap-2.5 px-3 pt-3">
              <PlatformAvatar platform="facebook" size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-semibold">{profile.name}</p>
                <p className="flex items-center gap-1 text-[11px] text-[#b0b3b8]">
                  {post.date}
                  <Globe2 className="size-3" />
                </p>
              </div>
            </div>
            <p className="px-3 pt-2 text-[14px] leading-snug">{post.content}</p>
            <div className="mt-2 aspect-[16/10] w-full overflow-hidden bg-black/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex items-center justify-between border-t border-white/10 px-2 py-1.5 text-[#b0b3b8] [[data-theme=light]_&]:border-neutral-200">
              <LikeButton
                initial={post.likes}
                icon={ThumbsUp}
                label="Like"
                activeClass="text-[#0866ff]"
                idleClass="hover:bg-white/5"
              />
              <span className="inline-flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-[13px]">
                <MessageCircle className="size-4" />
                Comment
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-[13px]">
                <Share2 className="size-4" />
                Share
              </span>
            </div>
          </a>
        ))}
      </div>

      <a
        href={profile.followUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="border-t border-white/10 px-3.5 py-3 text-center text-sm font-semibold text-[#0866ff] transition hover:bg-white/5"
      >
        {t("followFacebook")}
      </a>
    </FeedShell>
  );
}

function LinkedInCard({ posts }: { posts: SocialFeedPost[] }) {
  const profile = socialProfiles.linkedin;
  const t = useTranslations("social");

  return (
    <FeedShell className="bg-[#1b1f23] text-[#f3f2ef] [[data-theme=light]_&]:bg-white [[data-theme=light]_&]:text-neutral-900">
      <a
        href={profile.followUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="sticky top-0 z-10 flex items-center gap-3 border-b border-white/10 bg-[#1b1f23]/95 px-3.5 py-3 backdrop-blur [[data-theme=light]_&]:border-neutral-200 [[data-theme=light]_&]:bg-white/95"
      >
        <PlatformAvatar platform="linkedin" size="lg" />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-sm font-semibold">
            <span className="truncate">{profile.name}</span>
            {profile.verified ? (
              <VerifiedBadge className="text-[#0a66c2]" />
            ) : null}
          </p>
          <p className="truncate text-xs text-[#a6a9ad]">
            {profile.headline}
          </p>
        </div>
        <MoreHorizontal className="size-5 text-[#a6a9ad]" />
      </a>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-3">
        {posts.map((post) => {
          const truncated =
            post.content.length > 140
              ? `${post.content.slice(0, 140).trim()}…`
              : post.content;
          return (
            <a
              key={post.id}
              href={post.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-xl border border-white/10 bg-[#2a2e33]/50 [[data-theme=light]_&]:border-neutral-200 [[data-theme=light]_&]:bg-neutral-50"
            >
              <div className="flex items-start gap-2.5 px-3 pt-3">
                <PlatformAvatar platform="linkedin" size="md" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{profile.name}</p>
                  <p className="truncate text-[11px] text-[#a6a9ad]">
                    {post.headline || profile.headline}
                  </p>
                  <p className="flex items-center gap-1 text-[11px] text-[#a6a9ad]">
                    {post.date}
                    <Globe2 className="size-3" />
                  </p>
                </div>
              </div>
              <p className="px-3 pt-2 text-[14px] leading-snug">
                {truncated}{" "}
                {post.content.length > 140 ? (
                  <span className="font-semibold text-[#a6a9ad]">
                    {t("seeMore")}
                  </span>
                ) : null}
              </p>
              <div className="mx-3 mt-3 overflow-hidden rounded-lg border border-white/10 [[data-theme=light]_&]:border-neutral-200">
                <div className="aspect-[16/9] w-full overflow-hidden bg-black/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="bg-[#1b1f23] px-3 py-2 [[data-theme=light]_&]:bg-neutral-100">
                  <p className="text-[13px] font-semibold">
                    {post.mediaTitle || "iSense Technologies"}
                  </p>
                  <p className="text-[11px] text-[#a6a9ad]">
                    {post.mediaSubtitle || "isense-tech.com"}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1 border-t border-white/10 px-2 py-1.5 text-[#a6a9ad] [[data-theme=light]_&]:border-neutral-200">
                <LikeButton
                  initial={post.likes}
                  icon={ThumbsUp}
                  label="Like"
                  activeClass="text-[#0a66c2]"
                  idleClass="hover:bg-white/5"
                />
                <span className="inline-flex items-center gap-1 rounded-lg px-1.5 py-1 text-[12px]">
                  👏 Celebrate
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg px-1.5 py-1 text-[12px]">
                  💚 Support
                </span>
                <span className="ml-auto inline-flex items-center gap-1 rounded-lg px-1.5 py-1 text-[12px]">
                  <MessageCircle className="size-3.5" />
                  {formatCount(post.comments)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg px-1.5 py-1 text-[12px]">
                  <Repeat2 className="size-3.5" />
                  Repost
                </span>
              </div>
            </a>
          );
        })}
      </div>

      <a
        href={profile.followUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="border-t border-white/10 px-3.5 py-3 text-center text-sm font-semibold text-[#0a66c2] transition hover:bg-white/5"
      >
        {t("followLinkedin")}
      </a>
    </FeedShell>
  );
}

const PLATFORMS: SocialPlatform[] = ["instagram", "facebook", "linkedin"];

export function SocialFeed() {
  const t = useTranslations("social");

  return (
    <section
      id="feeds"
      className="scroll-mt-28 border-y border-border bg-[radial-gradient(ellipse_at_20%_0%,color-mix(in_srgb,var(--accent)_14%,transparent),transparent_50%)] py-20 md:py-28"
    >
      <Container>
        <SectionHeader
          kicker={t("kicker")}
          title={t("title")}
          lead={t("lead")}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {PLATFORMS.map((platform) => {
            const posts = postsForPlatform(platform);
            if (platform === "instagram") {
              return <InstagramCard key={platform} posts={posts} />;
            }
            if (platform === "facebook") {
              return <FacebookCard key={platform} posts={posts} />;
            }
            return <LinkedInCard key={platform} posts={posts} />;
          })}
        </div>
      </Container>
    </section>
  );
}
