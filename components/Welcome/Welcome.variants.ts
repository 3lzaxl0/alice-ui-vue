import { cva } from 'class-variance-authority'

export const welcomeCardVariants = cva(
  'group relative bg-slate-950/1 dark:bg-white/1 p-2.5 sm:p-4 md:p-6 shadow-sm dark:shadow-black/60 border border-gray-100 dark:border-white/10 hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 rounded-2xl',
  {
    variants: {
      color: {
        success: 'hover:border-success-500 dark:hover:border-success-400',
        primary: 'hover:border-primary-500 dark:hover:border-primary-400',
        warning: 'hover:border-warning-500 dark:hover:border-warning-400',
        info: 'hover:border-info-500 dark:hover:border-info-400',
        error: 'hover:border-error-500 dark:hover:border-error-400',
        default: 'hover:border-primary-500 dark:hover:border-primary-400',
      },
    },
    defaultVariants: {
      color: 'default',
    },
  },
)

export const welcomeIconVariants = cva(
  'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center transition-colors duration-300 rounded-xl',
  {
    variants: {
      color: {
        success:
          'text-success-600 bg-success-50 dark:bg-success-900/20 dark:text-success-300 group-hover:bg-success-600 group-hover:text-white',
        primary:
          'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-300 group-hover:bg-primary-600 group-hover:text-white',
        warning:
          'text-warning-600 bg-warning-50 dark:bg-warning-900/20 dark:text-warning-300 group-hover:bg-warning-600 group-hover:text-white',
        info: 'text-info-600 bg-info-50 dark:bg-info-900/20 dark:text-info-300 group-hover:bg-info-600 group-hover:text-white',
        error: 'text-error-600 bg-error-50 dark:bg-error-900/20 dark:text-error-300 group-hover:bg-error-600 group-hover:text-white',
        default:
          'text-primary-900 bg-primary-600/10 dark:text-primary-200 dark:bg-primary-900/20 group-hover:bg-primary-900 group-hover:text-white',
      },
    },
    defaultVariants: {
      color: 'default',
    },
  },
)

export const welcomeTitleVariants = cva(
  'font-bold text-gray-900 dark:text-white text-xs sm:text-sm md:text-base mb-1 transition-colors leading-tight',
  {
    variants: {
      color: {
        success: 'group-hover:text-success-600 dark:group-hover:text-success-400',
        primary: 'group-hover:text-primary-600 dark:group-hover:text-primary-400',
        warning: 'group-hover:text-warning-600 dark:group-hover:text-warning-400',
        info: 'group-hover:text-info-600 dark:group-hover:text-info-400',
        error: 'group-hover:text-error-600 dark:group-hover:text-error-400',
        default: 'group-hover:text-primary-900 dark:group-hover:text-primary-300',
      },
    },
    defaultVariants: {
      color: 'default',
    },
  },
)