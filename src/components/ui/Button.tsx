import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-accent text-on-accent hover:brightness-105 border border-accent",
  secondary:
    "border border-border bg-panel/80 text-foreground hover:border-accent/60 hover:text-accent",
  ghost: "text-text-secondary hover:text-foreground",
} as const;

export function buttonClass(
  variant: keyof typeof variants = "primary",
  className?: string,
) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 font-sans text-sm font-semibold tracking-tight transition",
    variants[variant],
    className,
  );
}
