import { cva } from "class-variance-authority";

export const statVariants = cva(
  "!border-l-4 h-full",
  {
    variants: {
      variant: {
        primary: "!border-indigo-500",
        success: "!border-emerald-500",
        warning: "!border-amber-500",
        error: "!border-rose-500",
        info: "!border-cyan-500",
        neutral: "!border-slate-300 dark:!border-slate-700",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export const statIconVariants = cva(
  "p-2 rounded-xl transition-colors",
  {
    variants: {
      variant: {
        primary: "!bg-indigo-50 dark:!bg-indigo-500/10 !text-indigo-600",
        success: "!bg-emerald-50 dark:!bg-emerald-500/10 !text-emerald-600",
        warning: "!bg-amber-50 dark:!bg-amber-500/10 !text-amber-600",
        error: "!bg-rose-50 dark:!bg-rose-500/10 !text-rose-600",
        info: "!bg-cyan-50 dark:!bg-cyan-500/10 !text-cyan-600",
        neutral: "!bg-slate-50 dark:!bg-slate-500/10 !text-slate-600",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

