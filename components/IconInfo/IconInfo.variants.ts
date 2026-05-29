import { cva } from "class-variance-authority";

export const iconContainerVariants = cva(
  "p-1.5 rounded-full shrink-0 flex items-center justify-center transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "bg-slate-100 dark:bg-slate-800 text-slate-500",
        primary: "bg-primary-50 dark:bg-primary-900/20 text-primary-500",
        info: "bg-info-50 dark:bg-info-900/20 text-info-500",
        success: "bg-success-50 dark:bg-success-900/20 text-success-500",
        warning: "bg-warning-50 dark:bg-warning-900/20 text-warning-500",
        error: "bg-error-50 dark:bg-error-900/20 text-error-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const iconValueVariants = cva(
  "text-sm font-medium transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "text-gray-700 dark:text-gray-200",
        primary: "text-primary-600 dark:text-primary-400",
        info: "text-info-600 dark:text-info-400",
        success: "text-success-600 dark:text-success-400",
        warning: "text-warning-600 dark:text-warning-400",
        error: "text-error-600 dark:text-error-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
