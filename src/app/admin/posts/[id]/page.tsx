import { notFound } from "next/navigation";
import { PostEditor } from "@/components/admin/PostEditor";
import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/types/database";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) notFound();
  const { data } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <section>
      <h1 className="mb-6 text-3xl">Edit post</h1>
      <PostEditor post={data as BlogPost} />
    </section>
  );
}
