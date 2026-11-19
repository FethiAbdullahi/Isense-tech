import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-md">
      <p className="font-hud text-xs tracking-[0.28em] text-accent">Restricted</p>
      <h1 className="mt-3 text-4xl">Admin access</h1>
      <div className="mt-8">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </section>
  );
}
