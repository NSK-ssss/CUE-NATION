import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        brass: "border-brass/30 bg-brass/10 text-brass hover:bg-brass/20",
        felt: "border-felt/30 bg-felt/10 text-felt dark:text-emerald-400 hover:bg-felt/20",
        free: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        booked: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
        running: "border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
        maintenance: "border-gray-500/30 bg-gray-500/10 text-gray-600 dark:text-gray-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
