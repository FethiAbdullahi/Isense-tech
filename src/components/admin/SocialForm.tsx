"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SocialForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-3"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError(null);
        const form = event.currentTarget;
        const data = Object.fromEntries(new FormData(form).entries());
        const response = await fetch("/api/admin/social", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: data.url,
            title: data.title,
            thumbnailUrl: data.thumbnailUrl,
          }),
        });
        const body = (await response.json()) as { error?: string };
        setPending(false);
        if (!response.ok) {
          setError(body.error ?? "Could not save the feed.");
          return;
        }
        form.reset();
        router.refresh();
      }}
    >
      <label className="block text-sm">
        Post URL
        <input
          required
          name="url"
          type="url"
          placeholder="https://www.linkedin.com/…"
          className="mt-1 w-full border border-steel-line bg-panel px-3 py-2 normal-case"
        />
      </label>
      <label className="block text-sm">
        Manual title (Instagram / Facebook fallback)
        <input
          name="title"
          className="mt-1 w-full border border-steel-line bg-panel px-3 py-2 normal-case"
        />
      </label>
      <label className="block text-sm">
        Manual thumbnail URL
        <input
          name="thumbnailUrl"
          type="url"
          className="mt-1 w-full border border-steel-line bg-panel px-3 py-2 normal-case"
        />
      </label>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button
        disabled={pending}
        className="bg-accent px-4 py-2 font-hud text-xs tracking-[0.16em] text-background uppercase"
      >
        {pending ? "Fetching…" : "Fetch preview"}
      </button>
    </form>
  );
}
