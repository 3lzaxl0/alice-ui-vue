import { cva } from 'class-variance-authority'

export const iconVariants = cva(
  'flex items-center justify-center shrink-0 transition-all duration-300',
  {
    variants: {
      variant: {
        primary: 'bg-primary-50 text-primary-500 dark:bg-primary-500/10',
        success: 'bg-success-50 text-success-500 dark:bg-success-500/10',
        warning: 'bg-warning-50 text-warning-500 dark:bg-warning-500/10',
        error: 'bg-error-50 text-error-500 dark:bg-error-500/10',
        info: 'bg-info-50 text-info-500 dark:bg-info-500/10',
        neutral: 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400',
        ghost: 'bg-transparent text-gray-500 dark:text-gray-400',
      },
      size: {
        xs: 'w-6 h-6 rounded-md',
        sm: 'w-8 h-8 rounded-lg',
        md: 'w-10 h-10 rounded-xl',
        lg: 'w-12 h-12 rounded-2xl',
        xl: 'w-14 h-14 rounded-3xl',
      },
      radius: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        full: 'rounded-full',
      }
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
      radius: 'xl',
    }
  }
)
