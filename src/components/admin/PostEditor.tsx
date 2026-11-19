"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { deletePost, savePost } from "@/app/admin/actions";
import { pickLocalized } from "@/lib/i18n-fields";
import type { BlogPost } from "@/types/database";

export function PostEditor({ post }: { post?: BlogPost }) {
  const editLocale = post?.locale === "am" || post?.locale === "ar" ? post.locale : "en";
  const initialTitle = pickLocalized(post?.title, editLocale);
  const initialExcerpt = pickLocalized(post?.excerpt, editLocale);
  const initialContent = pickLocalized(post?.content, editLocale) || "<p></p>";
  const [cover, setCover] = useState(post?.cover_image_url ?? "");
  const [content, setContent] = useState(initialContent);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      ImageExtension,
      Placeholder.configure({ placeholder: "Write the briefing…" }),
    ],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor: current }) => setContent(current.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-64 border border-steel-line bg-panel px-3 py-2 text-sm normal-case outline-none",
      },
    },
  });

  async function upload(file: File) {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    if (!supabase) return;
    const path = `${Date.now()}-${file.name.replace(/[^\w.-]/g, "")}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file);
    if (error) return;
    const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
    setCover(data.publicUrl);
    editor?.chain().focus().setImage({ src: data.publicUrl }).run();
  }

  return (
    <form action={savePost} className="space-y-4">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="cover_image_url" value={cover} />
      <label className="block text-sm">
        Title
        <input
          required
          name="title"
          defaultValue={initialTitle}
          className="mt-1 w-full border border-steel-line bg-panel px-3 py-2 normal-case"
        />
      </label>
      <label className="block text-sm">
        Slug
        <input
          name="slug"
          defaultValue={post?.slug}
          placeholder="auto from title if empty"
          className="mt-1 w-full border border-steel-line bg-panel px-3 py-2 normal-case"
        />
      </label>
      <label className="block text-sm">
        Excerpt
        <textarea
          name="excerpt"
          defaultValue={initialExcerpt}
          rows={2}
          className="mt-1 w-full border border-steel-line bg-panel px-3 py-2 normal-case"
        />
      </label>
      <label className="block text-sm">
        Locale
        <select
          name="locale"
          defaultValue={editLocale}
          className="mt-1 w-full border border-steel-line bg-panel px-3 py-2"
        >
          <option value="en">English</option>
          <option value="am">Amharic</option>
          <option value="ar">Arabic</option>
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={post?.published ?? true} />
        Published
      </label>
      <div className="flex flex-wrap gap-2 font-hud text-[11px] tracking-widest">
        <button type="button" className="border border-steel-line px-2 py-1" onClick={() => editor?.chain().focus().toggleBold().run()}>
          Bold
        </button>
        <button type="button" className="border border-steel-line px-2 py-1" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
        <button type="button" className="border border-steel-line px-2 py-1" onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          List
        </button>
        <label className="cursor-pointer border border-steel-line px-2 py-1">
          Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
            }}
          />
        </label>
      </div>
      <EditorContent editor={editor} />
      <div className="flex gap-3">
        <button type="submit" className="bg-accent px-5 py-3 font-hud text-xs tracking-[0.16em] text-background uppercase">
          Save
        </button>
      </div>
      {post ? (
        <button
          type="submit"
          formAction={deletePost}
          className="font-hud text-xs tracking-widest text-danger uppercase"
        >
          Delete
        </button>
      ) : null}
    </form>
  );
}
