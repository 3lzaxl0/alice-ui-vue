import { cva } from 'class-variance-authority'

export const inputVariants = cva(
  'w-full h-alice-input-height px-3 text-sm bg-white dark:bg-white/5 border text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-alice-input transition-all outline-none disabled:bg-gray-100 dark:disabled:bg-slate-900 disabled:text-gray-400 rounded-alice-md',
  {
    variants: {
      variant: {
        default: 'border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
        success: 'border-emerald-500 dark:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
        warning: 'border-amber-500 dark:border-amber-400 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500',
      },
      error: {
        true: 'border-rose-500 dark:border-rose-400 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 !border-rose-500 dark:!border-rose-400',
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
      variant: 'default',
      error: false,
      hasIcon: false,
      hasTrailing: false,
    },
  },
)
