import { cva } from "class-variance-authority";

export const statVariants = cva(
  "!border-l-4 h-full",
  {
    variants: {
      variant: {
        primary: "!border-primary-500",
        success: "!border-success-500",
        warning: "!border-warning-500",
        error: "!border-error-500",
        info: "!border-info-500",
        neutral: "!border-gray-300 dark:!border-slate-700",
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
        primary: "!bg-primary-50 dark:!bg-primary-500/10 !text-primary-600",
        success: "!bg-success-50 dark:!bg-success-500/10 !text-success-600",
        warning: "!bg-warning-50 dark:!bg-warning-500/10 !text-warning-600",
        error: "!bg-error-50 dark:!bg-error-500/10 !text-error-600",
        info: "!bg-info-50 dark:!bg-info-500/10 !text-info-600",
        neutral: "!bg-gray-50 dark:!bg-slate-500/10 !text-gray-600",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

