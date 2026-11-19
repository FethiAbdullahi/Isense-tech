"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!isSupabaseConfigured()) {
    return (
      <p className="text-sm text-steel">
        Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local,
        then create an admin user in Supabase Auth.
      </p>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError(null);
        const form = new FormData(event.currentTarget);
        const supabase = createClient();
        if (!supabase) return;
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: String(form.get("email")),
          password: String(form.get("password")),
        });
        setPending(false);
        if (authError) {
          setError(authError.message);
          return;
        }
        router.push(params.get("next") || "/admin");
        router.refresh();
      }}
    >
      <label className="block text-sm">
        Email
        <input
          required
          type="email"
          name="email"
          className="mt-1 w-full border border-steel-line bg-panel px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        Password
        <input
          required
          type="password"
          name="password"
          className="mt-1 w-full border border-steel-line bg-panel px-3 py-2"
        />
      </label>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="bg-accent px-5 py-3 font-hud text-xs tracking-[0.16em] text-background uppercase"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
