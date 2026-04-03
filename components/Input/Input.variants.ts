import { cva } from 'class-variance-authority'

export const inputVariants = cva(
  'w-full h-alice-input-height px-3 text-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-alice-input focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none disabled:bg-gray-100 dark:disabled:bg-slate-900 disabled:text-gray-400 rounded-alice-md',
  {
    variants: {
      error: {
        true: 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/20',
        false: '',
      },
      hasIcon: {
        true: 'pl-10',
        false: 'pl-3',
      },
      hasTrailing: {
        true: 'pr-10',
        false: 'pr-3',
      },
    },
    defaultVariants: {
      error: false,
      hasIcon: false,
      hasTrailing: false,
    },
  },
)
