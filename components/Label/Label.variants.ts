import { cva } from 'class-variance-authority'

export const labelVariants = cva(
  'text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest block mb-2 pl-1 transition-colors',
  {
    variants: {
      error: {
        true: 'text-red-500 dark:text-red-400',
        false: '',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: 'cursor-default',
      },
    },
    defaultVariants: {
      error: false,
      disabled: false,
    },
  },
)
