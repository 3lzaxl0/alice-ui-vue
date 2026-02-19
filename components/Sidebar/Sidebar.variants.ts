import { cva } from 'class-variance-authority'

export const sidebarItemVariants = cva(
  'relative flex items-center gap-3 px-3 py-2.5 transition-all duration-200 group outline-none select-none cursor-pointer overflow-hidden rounded-xl shrink-0',
  {
    variants: {
      active: {
        true: 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-medium',
        false: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
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
        class: 'hover:bg-gray-100 dark:hover:bg-white/10',
      },
      // Error Variant
      {
        variant: 'error',
        design: 'filled',
        active: false,
        class:
          'bg-red-500 text-white hover:bg-red-600 hover:text-white dark:text-white dark:hover:text-white',
      },
      {
        variant: 'error',
        design: 'ghost',
        active: false,
        class:
          'text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-500/10',
      },
    ],
    defaultVariants: {
      active: false,
      variant: 'default',
      design: 'ghost',
    },
  },
)
