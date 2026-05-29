import { cva } from "class-variance-authority";

export const containerVariants = cva(
  "flex items-center border-b border-slate-200/50 dark:border-white/10 select-none",
  {
    variants: {
      gap: {
        sm: "gap-1",
        md: "gap-4",
        lg: "gap-8",
      },
      expanded: {
        true: "w-full",
        false: "w-fit",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      gap: "md",
      expanded: false,
      disabled: false,
    },
  }
);

export const buttonVariants = cva(
  "relative flex items-center justify-center gap-2 pb-3 px-2 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 select-none cursor-pointer border-b-2 -mb-[2px] [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0",
  {
    variants: {
      active: {
        true: "border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 font-semibold",
        false: "border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300",
      },
      disabled: {
        true: "cursor-not-allowed pointer-events-none opacity-50",
        false: "",
      },
    },
    defaultVariants: {
      active: false,
      disabled: false,
    },
  }
);
