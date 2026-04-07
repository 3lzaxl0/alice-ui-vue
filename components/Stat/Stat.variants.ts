import { cva } from "class-variance-authority";

export const statVariants = cva(
  "flex-1 flex flex-col justify-center px-6 py-4",
  {
    variants: {
      variant: {
        primary: "bg-blue-50/50 dark:bg-blue-500/10",
        success: "bg-emerald-50/50 dark:bg-emerald-500/10",
        warning: "bg-amber-50/50 dark:bg-amber-500/10",
        error: "bg-red-50/50 dark:bg-red-500/10",
        info: "bg-cyan-50/50 dark:bg-cyan-500/10",
        neutral: "bg-gray-50/50 dark:bg-slate-800/40",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export const statTitleVariants = cva(
  "text-[10px] font-black uppercase tracking-widest mb-1",
  {
    variants: {
      variant: {
        primary: "text-blue-500/70",
        success: "text-emerald-500/70",
        warning: "text-amber-500/70",
        error: "text-red-500/70",
        info: "text-cyan-500/70",
        neutral: "text-gray-500/70 dark:text-gray-400/70",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);
