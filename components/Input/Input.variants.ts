import { cva } from 'class-variance-authority'

export const inputVariants = cva(
  'w-full h-alice-input-height px-3 text-sm bg-white dark:bg-white/5 border text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-alice-input transition-all outline-none disabled:bg-gray-100 dark:disabled:bg-slate-900 disabled:text-gray-400 rounded-alice-md',
  {
    variants: {
      variant: {
        default: 'border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
        success: 'border-success-500 dark:border-success-400 focus:ring-2 focus:ring-success-500/20 focus:border-success-500',
        warning: 'border-warning-500 dark:border-warning-400 focus:ring-2 focus:ring-warning-500/20 focus:border-warning-500',
      },
      error: {
        true: 'border-error-500 dark:border-error-400 focus:ring-2 focus:ring-error-500/20 focus:border-error-500 !border-error-500 dark:!border-error-400',
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
