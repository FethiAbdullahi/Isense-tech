import Link from "next/link";
import { CoverageStatusSelect } from "@/components/admin/CoverageStatusSelect";
import { CoveragePreview } from "@/components/coverage/CoveragePreview";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { CoverageRequest } from "@/types/database";

export default async function AdminCoveragePage() {
  if (!isSupabaseConfigured()) {
    return (
      <p className="text-text-secondary">
        Supabase is not configured. Copy .env.example to .env.local and add your project keys.
      </p>
    );
  }

  const supabase = await createClient();
  if (!supabase) {
    return <p className="text-text-secondary">Supabase is not configured.</p>;
  }

  const { data, error } = await supabase
    .from("coverage_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-danger">{error.message}</p>;
  }

  const rows = (data as CoverageRequest[]) ?? [];

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl text-foreground">Coverage requests</h1>
        <Link href="/admin" className="text-sm text-accent hover:underline">
          Back to control panel
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-text-secondary">No coverage requests yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-sm border border-border bg-panel">
          <table className="w-full min-w-[880px] border-collapse text-start text-sm">
            <thead>
              <tr className="border-b border-border text-text-secondary">
                <th className="px-3 py-2 text-start font-medium">When</th>
                <th className="px-3 py-2 text-start font-medium">Contact</th>
                <th className="px-3 py-2 text-start font-medium">Sector</th>
                <th className="px-3 py-2 text-start font-medium">Cameras</th>
                <th className="px-3 py-2 text-start font-medium">Coverage</th>
                <th className="px-3 py-2 text-start font-medium">Status</th>
                <th className="px-3 py-2 text-start font-medium">Plan</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-border align-top last:border-b-0">
                  <td className="px-3 py-3 text-text-secondary">
                    {new Date(row.created_at).toLocaleString("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                    <span className="mt-1 block text-xs uppercase">{row.language}</span>
                  </td>
                  <td className="px-3 py-3 text-foreground">
                    <p>{row.name}</p>
                    <p className="text-text-secondary">{row.phone}</p>
                    <p className="text-text-secondary">{row.email}</p>
                    {row.notes ? <p className="mt-2 max-w-xs text-text-secondary">{row.notes}</p> : null}
                  </td>
                  <td className="px-3 py-3 capitalize text-foreground">{row.sector}</td>
                  <td className="px-3 py-3 text-foreground">{row.camera_count}</td>
                  <td className="px-3 py-3 text-foreground">{Number(row.coverage_percent)}%</td>
                  <td className="px-3 py-3">
                    <CoverageStatusSelect id={row.id} status={row.status} />
                  </td>
                  <td className="w-44 px-3 py-3">
                    <CoveragePreview layout={row.layout} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
