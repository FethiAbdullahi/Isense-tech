import { PostEditor } from "@/components/admin/PostEditor";

export default function NewPostPage() {
  return (
    <section>
      <h1 className="mb-6 text-3xl">New post</h1>
      <PostEditor />
    </section>
  );
}
