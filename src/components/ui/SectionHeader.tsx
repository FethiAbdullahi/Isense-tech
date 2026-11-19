import { cn } from "@/lib/utils";

export function SectionHeader({
  kicker,
  title,
  lead,
  className,
  as = "h2",
}: {
  kicker?: string;
  title: string;
  lead?: string;
  className?: string;
  as?: "h1" | "h2";
}) {
  const Title = as;
  return (
    <div className={cn("max-w-2xl", className)}>
      {kicker ? (
        <p className="text-sm font-medium text-accent">{kicker}</p>
      ) : null}
      <Title className="mt-3 text-4xl tracking-tight text-foreground md:text-5xl">
        {title}
      </Title>
      {lead ? (
        <p className="mt-4 text-base leading-relaxed text-text-secondary md:text-lg">
          {lead}
        </p>
      ) : null}
    </div>
  );
}
