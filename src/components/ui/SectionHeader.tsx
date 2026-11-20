"use client";

import { motion, useReducedMotion } from "framer-motion";
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
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn("max-w-2xl", className)}
      initial={reduced ? false : { opacity: 0, y: 18, skewX: -2 }}
      whileInView={{ opacity: 1, y: 0, skewX: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {kicker ? (
        <p className="font-mono text-[11px] font-medium tracking-[0.18em] text-accent uppercase">
          {kicker}
        </p>
      ) : null}
      <Title className="mt-3 font-display text-4xl leading-[1.05] tracking-tight text-foreground md:text-5xl">
        {title}
      </Title>
      {lead ? (
        <p className="mt-4 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
          {lead}
        </p>
      ) : null}
    </motion.div>
  );
}
