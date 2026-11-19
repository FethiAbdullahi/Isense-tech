import Link from "next/link";
import { deleteSocial } from "./actions";
import { SocialForm } from "@/components/admin/SocialForm";
import { pickLocalized } from "@/lib/i18n-fields";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { fallbackBlogPosts } from "@/content/blog";
import { getSocialPosts } from "@/lib/queries";
import type { BlogPost, SocialPost } from "@/types/database";

export default async function AdminHome() {
  const configured = isSupabaseConfigured();

  if (!configured) {
    const social = await getSocialPosts();
    return (
      <div className="space-y-10">
        <div className="rounded-3xl border border-accent/30 bg-accent/5 p-6">
          <p className="text-sm font-medium tracking-[0.14em] text-accent uppercase">
            Demo mode
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-tight">
            Connect Supabase to unlock publishing
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
            Copy <code className="text-foreground">.env.example</code> to{" "}
            <code className="text-foreground">.env.local</code>, add your project
            URL and keys, then restart the server. Until then the public site
            shows starter blog posts and social placeholders.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <Link href="/blog" className="text-accent hover:underline">
              View blog →
            </Link>
            <Link href="/#feeds" className="text-accent hover:underline">
              View social feeds →
            </Link>
            <Link href="/admin/coverage" className="text-accent hover:underline">
              Coverage requests →
            </Link>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <section>
            <h2 className="text-2xl">Starter blog posts</h2>
            <ul className="mt-5 space-y-3">
              {fallbackBlogPosts.map((post) => (
                <li
                  key={post.id}
                  className="rounded-2xl border border-border bg-panel px-4 py-3"
                >
                  <p className="font-medium text-foreground">
                    {pickLocalized(post.title, "en")}
                  </p>
                  <p className="mt-1 text-xs tracking-wide text-text-secondary">
                    /blog/{post.slug} · FALLBACK
                  </p>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-2xl">Social placeholders</h2>
            <ul className="mt-5 space-y-3">
              {social.map((post) => (
                <li
                  key={post.id}
                  className="rounded-2xl border border-border bg-panel px-4 py-3"
                >
                  <p className="text-[11px] tracking-[0.14em] text-accent uppercase">
                    {post.platform}
                  </p>
                  <p className="mt-1 text-sm text-foreground">{post.title}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-text-secondary">
              Paste live post URLs here after Supabase is configured.
            </p>
          </section>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const [{ data: posts }, { data: social }] = await Promise.all([
    supabase!.from("blog_posts").select("*").order("updated_at", { ascending: false }),
    supabase!.from("social_posts").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Control panel</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Publish blog briefings and social feed cards for the homepage.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/admin/posts/new" className="text-accent hover:underline">
            New blog post
          </Link>
          <Link href="/admin/coverage" className="text-accent hover:underline">
            Coverage requests
          </Link>
          <Link href="/#feeds" className="hover:underline">
            View feeds
          </Link>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <section>
          <h2 className="text-2xl">Blog posts</h2>
          <ul className="mt-6 space-y-3">
            {((posts as BlogPost[]) ?? []).map((post) => (
              <li
                key={post.id}
                className="rounded-2xl border border-border bg-panel px-4 py-3"
              >
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="font-medium text-foreground hover:text-accent"
                >
                  {pickLocalized(post.title, "en")}
                </Link>
                <p className="mt-1 text-[11px] tracking-widest text-text-secondary">
                  {post.published ? "PUBLISHED" : "DRAFT"}
                </p>
              </li>
            ))}
            {!(posts as BlogPost[] | null)?.length ? (
              <li className="text-sm text-text-secondary">
                No posts yet.{" "}
                <Link href="/admin/posts/new" className="text-accent hover:underline">
                  Create one
                </Link>
                .
              </li>
            ) : null}
          </ul>
        </section>
        <section>
          <h2 className="text-2xl">Social feeds</h2>
          <div className="mt-6">
            <SocialForm />
          </div>
          <ul className="mt-6 space-y-3">
            {((social as SocialPost[]) ?? []).map((post) => (
              <li
                key={post.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-panel px-4 py-3"
              >
                <div>
                  <p className="text-[11px] tracking-widest text-accent uppercase">
                    {post.platform}
                  </p>
                  <p className="text-sm">{post.title}</p>
                </div>
                <form action={deleteSocial}>
                  <input type="hidden" name="id" value={post.id} />
                  <button className="text-[11px] tracking-widest text-danger uppercase">
                    Delete
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
