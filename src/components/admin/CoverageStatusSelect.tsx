"use client";

import { useFormStatus } from "react-dom";
import { updateCoverageStatus } from "@/app/admin/actions";

const statuses = ["new", "contacted", "closed"] as const;

function StatusField({ status }: { status: string }) {
  const { pending } = useFormStatus();

  return (
    <select
      name="status"
      defaultValue={status}
      aria-label="Status"
      disabled={pending}
      onChange={(event) => event.currentTarget.form?.requestSubmit()}
      className="rounded-sm border border-border bg-background px-2 py-1 text-sm text-foreground disabled:opacity-60"
    >
      {statuses.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
}

export function CoverageStatusSelect({ id, status }: { id: string; status: string }) {
  return (
    <form key={`${id}:${status}`} action={updateCoverageStatus}>
      <input type="hidden" name="id" value={id} />
      <StatusField status={status} />
    </form>
  );
}
