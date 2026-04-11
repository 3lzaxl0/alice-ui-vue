import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "group relative flex items-center justify-center gap-2 font-semibold transition-all duration-300 outline-none select-none disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "",
        success: "",
        warning: "",
        error: "",
        info: "",
        ghost: "",
      },
      design: {
        solid: "",
        ghost: "",
        outline: "",
        "ghost-subtle": "",
      },
      size: {
        sm: "px-3 py-1.5 text-xs",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
        icon: "p-1.5 w-8 h-8",
        "icon-sm": "p-1 w-6 h-6",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-alice-md",
        lg: "rounded-alice-lg",
        full: "rounded-full",
      },
      rounded: {
        true: "rounded-full",
        false: "rounded-alice-md",
      },
    },
    compoundVariants: [
      // --- SOLID DESIGNS ---
      {
        variant: "primary",
        design: "solid",
        class:
          "bg-primary-600 text-white shadow-sm hover:shadow-md hover:bg-primary-500 active:bg-primary-800 focus:ring-primary-500/50 dark:bg-primary-500 dark:hover:bg-primary-400 dark:active:bg-primary-600 dark:text-white",
      },
      {
        variant: "success",
        design: "solid",
        class:
          "bg-success-600 text-white shadow-sm hover:shadow-md hover:bg-success-500 active:bg-success-800 focus:ring-success-500/50 dark:bg-success-500 dark:hover:bg-success-400 dark:active:bg-success-600 dark:text-white",
      },
      {
        variant: "warning",
        design: "solid",
        class:
          "bg-warning-500 text-white shadow-sm hover:shadow-md hover:bg-warning-500 active:bg-warning-700 focus:ring-warning-500/50 dark:bg-warning-400 dark:hover:bg-warning-300 dark:active:bg-warning-500 dark:text-white",
      },
      {
        variant: "error",
        design: "solid",
        class:
          "bg-error-600 text-white shadow-sm hover:shadow-md hover:bg-error-500 active:bg-error-800 focus:ring-error-500/50 dark:bg-error-500 dark:hover:bg-error-400 dark:active:bg-error-600 dark:text-white",
      },
      {
        variant: "info",
        design: "solid",
        class:
          "bg-info-600 text-white shadow-sm hover:shadow-md hover:bg-info-500 active:bg-info-800 focus:ring-info-500/50 dark:bg-info-500 dark:hover:bg-info-400 dark:active:bg-info-600 dark:text-white",
      },

      // --- GHOST DESIGNS ---
      {
        variant: "primary",
        design: "ghost",
        class:
          "text-primary-600 hover:bg-primary-50 active:bg-primary-100 dark:text-primary-400 dark:hover:bg-primary-900/40 dark:active:bg-primary-900/60",
      },
      {
        variant: "success",
        design: "ghost",
        class:
          "text-success-600 hover:bg-success-50 active:bg-success-100 dark:text-success-400 dark:hover:bg-success-900/40 dark:active:bg-success-900/60",
      },
      {
        variant: "warning",
        design: "ghost",
        class:
          "text-warning-600 hover:bg-warning-50 active:bg-warning-100 dark:text-warning-400 dark:hover:bg-warning-900/40 dark:active:bg-warning-900/60",
      },
      {
        variant: "error",
        design: "ghost",
        class:
          "text-error-600 hover:bg-error-50 active:bg-error-100 dark:text-error-400 dark:hover:bg-error-900/40 dark:active:bg-error-900/60",
      },
      {
        variant: "info",
        design: "ghost",
        class:
          "text-info-600 hover:bg-info-50 active:bg-info-100 dark:text-info-400 dark:hover:bg-info-900/40 dark:active:bg-info-900/60",
      },

      // --- OUTLINE DESIGNS ---
      {
        variant: "primary",
        design: "outline",
        class:
          "border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white active:bg-primary-700 dark:border-primary-500 dark:text-primary-400 dark:hover:bg-primary-500 dark:hover:text-white",
      },
      {
        variant: "success",
        design: "outline",
        class:
          "border-2 border-success-600 text-success-600 hover:bg-success-600 hover:text-white active:bg-success-700 dark:border-success-500 dark:text-success-400 dark:hover:bg-success-500 dark:hover:text-white",
      },
      {
        variant: "warning",
        design: "outline",
        class:
          "border-2 border-warning-500 text-warning-600 hover:bg-warning-500 hover:text-white active:bg-warning-600 dark:border-warning-400 dark:text-warning-400 dark:hover:bg-warning-400 dark:hover:text-white",
      },
      {
        variant: "error",
        design: "outline",
        class:
          "border-2 border-error-600 text-error-600 hover:bg-error-600 hover:text-white active:bg-error-700 dark:border-error-500 dark:text-error-400 dark:hover:bg-error-500 dark:hover:text-white",
      },
      {
        variant: "info",
        design: "outline",
        class:
          "border-2 border-info-600 text-info-600 hover:bg-info-600 hover:text-white active:bg-info-700 dark:border-info-500 dark:text-info-400 dark:hover:bg-info-500 dark:hover:text-white",
      },

      // --- GHOST VARIANT (Neutral/Gray) ---
      {
        variant: "ghost",
        class:
          "text-gray-600 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-400 dark:hover:bg-slate-800 dark:active:bg-slate-700",
      },

      // --- SUBTLE GHOST DESIGNS ---
      {
        variant: "primary",
        design: "ghost-subtle",
        class:
          "text-gray-400 dark:text-gray-500 hover:text-primary-600 hover:bg-primary-50 active:bg-primary-100 dark:hover:bg-primary-900/20 dark:active:bg-primary-900/40 dark:hover:text-primary-400 transition-colors",
      },
      {
        variant: "success",
        design: "ghost-subtle",
        class:
          "text-gray-400 dark:text-gray-500 hover:text-success-600 hover:bg-success-50 active:bg-success-100 dark:hover:bg-success-900/20 dark:active:bg-success-900/40 dark:hover:text-success-400 transition-colors",
      },
      {
        variant: "warning",
        design: "ghost-subtle",
        class:
          "text-gray-400 dark:text-gray-500 hover:text-warning-600 hover:bg-warning-50 active:bg-warning-100 dark:hover:bg-warning-900/20 dark:active:bg-warning-900/40 dark:hover:text-warning-400 transition-colors",
      },
      {
        variant: "error",
        design: "ghost-subtle",
        class:
          "text-gray-400 dark:text-gray-500 hover:text-error-600 hover:bg-error-50 active:bg-error-100 dark:hover:bg-error-900/20 dark:active:bg-error-900/40 dark:hover:text-error-400 transition-colors",
      },
      {
        variant: "info",
        design: "ghost-subtle",
        class:
          "text-gray-400 dark:text-gray-500 hover:text-info-600 hover:bg-info-50 active:bg-info-100 dark:hover:bg-info-900/20 dark:active:bg-info-900/40 dark:hover:text-info-400 transition-colors",
      },
      {
        variant: "ghost",
        design: "ghost-subtle",
        class:
          "text-gray-400 dark:text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-slate-800 dark:active:bg-slate-700 dark:hover:text-gray-300 transition-colors",
      },
    ],
    defaultVariants: {
      variant: "primary",
      design: "solid",
      size: "md",
      rounded: false,
    },
  },
);
