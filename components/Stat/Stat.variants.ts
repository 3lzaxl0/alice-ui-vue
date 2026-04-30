import { cva } from "class-variance-authority";

export const statVariants = cva(
  "h-full overflow-hidden",
  {
    variants: {
      variant: {
        primary: "",
        success: "",
        warning: "",
        error: "",
        info: "",
        neutral: "",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export const statValueVariants = cva(
  "leading-tight",
  {
    variants: {
      variant: {
        primary: "text-primary-600 dark:text-primary-400",
        success: "text-emerald-600 dark:text-emerald-400",
        warning: "text-amber-600 dark:text-amber-400",
        error: "text-rose-600 dark:text-rose-400",
        info: "text-sky-600 dark:text-sky-400",
        neutral: "text-slate-900 dark:text-white",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

