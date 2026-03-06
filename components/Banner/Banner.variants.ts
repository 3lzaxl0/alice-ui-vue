import { cva } from 'class-variance-authority'

export const bannerVariants = cva(
  'flex items-center gap-4 px-5 py-4 border rounded-alice-md shadow-alice-sm transition-all duration-300',
  {
    variants: {
      variant: {
        primary:
          'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100/50 dark:border-blue-800/30 text-blue-700 dark:text-blue-300',
        success:
          'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100/50 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-300',
        warning:
          'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100/50 dark:border-amber-800/30 text-amber-700 dark:text-amber-300',
        error:
          'bg-rose-50/50 dark:bg-rose-900/10 border-rose-100/50 dark:border-rose-800/30 text-rose-700 dark:text-rose-300',
        info: 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100/50 dark:border-indigo-800/30 text-indigo-700 dark:text-indigo-300',
        gray: 'bg-gray-50/50 dark:bg-gray-800/10 border-gray-200/50 dark:border-gray-700/30 text-gray-700 dark:text-gray-300',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)
