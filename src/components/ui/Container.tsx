import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Site-wide page shell — fluid on phones/tablets/laptops, capped on ultra-wide. */
export const shellClassName =
  "mx-auto w-full max-w-[min(100%,100rem)] px-5 sm:px-7 md:px-8 lg:px-10 xl:px-12 2xl:px-14";

export function Container({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(shellClassName, className)} {...props}>
      {children}
    </div>
  );
}
