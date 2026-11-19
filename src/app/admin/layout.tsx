import Link from "next/link";
import { signOut } from "./actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-line px-5 py-4 md:px-8">
        <Link href="/admin" className="font-display text-xl tracking-tight">
          iSense control
        </Link>
        <nav className="flex items-center gap-5 text-sm text-mist">
          <Link href="/admin/coverage" className="hover:text-foreground">
            Coverage
          </Link>
          <Link href="/admin/posts/new" className="text-accent hover:underline">
            New post
          </Link>
          <Link href="/" className="hover:text-foreground">
            Site
          </Link>
          <form action={signOut}>
            <button className="hover:text-foreground">Sign out</button>
          </form>
        </nav>
      </header>
      <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">{children}</div>
    </div>
  );
}
