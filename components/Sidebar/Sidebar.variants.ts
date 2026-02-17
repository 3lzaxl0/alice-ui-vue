import { cva } from 'class-variance-authority'

export const sidebarItemVariants = cva(
  'relative flex items-center gap-3 px-3 py-2.5 transition-all duration-200 group outline-none select-none cursor-pointer overflow-hidden rounded-alice-md shrink-0',
  {
    variants: {
      active: {
        true: 'bg-white text-blue-700 shadow-md font-semibold',
        false: 'text-white/80 hover:text-white dark:text-blue-100/80 dark:hover:text-white',
      },
      variant: {
        default: '',
        error: '',
      },
      design: {
        filled: '',
        ghost: '',
        outline: '',
      },
    },
    compoundVariants: [
      // Default Hover for Ghost/Outline when not active
      {
        variant: 'default',
        active: false,
        class: 'hover:bg-white/10',
      },
      // Error Variant
      {
        variant: 'error',
        design: 'filled',
        active: false,
        class: 'bg-red-500 text-red-100 hover:bg-red-600 hover:text-white',
      },
      {
        variant: 'error',
        design: 'ghost',
        active: false,
        class: 'text-red-200 hover:text-white hover:bg-red-500/20',
      },
      // Active overrides everything else generally, but let's see current logic.
      // Current logic: if props.active -> returns active class.
      // if error -> checks filled vs ghost.
      // So Active takes precedence.
    ],
    defaultVariants: {
      active: false,
      variant: 'default',
      design: 'ghost',
    },
  },
)
