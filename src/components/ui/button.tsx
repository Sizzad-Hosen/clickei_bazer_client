import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-primary to-primary/80 text-white shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-95",
    destructive:
  "bg-amber-600  text-white shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-95 transition duration-200 ease-in-out",

        outline:
          "border border-input bg-background hover:bg-muted hover:text-foreground dark:hover:bg-muted/40 text-foreground shadow-sm active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground shadow hover:shadow-md hover:bg-secondary/80 active:scale-95",
        ghost:
          "text-muted-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 active:scale-95",
        link:
          "text-primary underline underline-offset-4 hover:text-primary/80",
        state:
          "bg-state text-white shadow-md hover:bg-state/90 hover:shadow-xl active:scale-95",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 px-3 rounded-md text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
