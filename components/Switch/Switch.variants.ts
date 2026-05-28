import { cva } from "class-variance-authority";

export const trackVariants = cva(
  "relative rounded-full transition-colors duration-200 flex items-center border select-none outline-none",
  {
    variants: {
      variant: {
        primary: "", // Handled conditionally by component state
        status: "",  // Handled conditionally by component state
      },
      size: {
        sm: "w-7 h-4 px-0.5",
        md: "w-9 h-5 px-0.5",
        lg: "w-12 h-7 px-0.5",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed grayscale",
        false: "cursor-pointer",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      disabled: false,
    }
  }
);

export const knobVariants = cva(
  "bg-white rounded-full shadow-alice-sm transition-transform duration-200 ease-out transform",
  {
    variants: {
      size: {
        sm: "w-2.5 h-2.5",
        md: "w-3.5 h-3.5",
        lg: "w-5 h-5",
      }
    },
    defaultVariants: {
      size: "md",
    }
  }
);
