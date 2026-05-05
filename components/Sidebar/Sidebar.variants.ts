import { cva } from 'class-variance-authority'

export const sidebarItemVariants = cva(
  'group relative flex items-center gap-3 px-3 py-2.5 w-full transition-all duration-200 outline-none select-none cursor-pointer overflow-hidden rounded-xl shrink-0',
  {
    variants: {
      active: {
        true: 'bg-primary-600 text-white shadow-md shadow-primary-600/20 font-medium',
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
          'bg-error-600 text-white hover:bg-error-500 hover:text-white dark:bg-error-500 dark:hover:bg-error-400 text-white dark:text-white',
      },
      {
        variant: 'error',
        design: 'ghost',
        active: false,
        class:
          'text-error-600 hover:text-error-700 hover:bg-error-50 dark:text-error-400 dark:hover:text-error-300 dark:hover:bg-error-900/40',
      },
    ],
    defaultVariants: {
      active: false,
      variant: 'default',
      design: 'ghost',
    },
  },
)
