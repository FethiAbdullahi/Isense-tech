import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-accent text-on-accent hover:brightness-110 shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_40%,transparent)]",
  secondary:
    "border border-border bg-transparent text-foreground hover:border-accent/50",
  ghost: "text-text-secondary hover:text-foreground",
} as const;

export function buttonClass(
  variant: keyof typeof variants = "primary",
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-tight transition",
    variants[variant],
    className,
  );
}
