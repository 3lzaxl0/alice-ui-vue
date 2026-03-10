import { cva } from 'class-variance-authority'

export const bannerVariants = cva(
  'flex items-center gap-4 px-5 py-4 border rounded-alice-lg shadow-alice-sm transition-all duration-300',
  {
    variants: {
      variant: {
        primary: '',
        success: '',
        warning: '',
        error: '',
        info: '',
        gray: '',
      },
      type: {
        soft: '',
        filled: '',
      },
    },
    compoundVariants: [
      // Primary
      {
        variant: 'primary',
        type: 'soft',
        class:
          'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100/50 dark:border-blue-800/30 text-blue-700 dark:text-blue-300',
      },
      {
        variant: 'primary',
        type: 'filled',
        class: 'bg-blue-600 text-white border-blue-600 shadow-md',
      },
      // Success
      {
        variant: 'success',
        type: 'soft',
        class:
          'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100/50 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-300',
      },
      {
        variant: 'success',
        type: 'filled',
        class: 'bg-emerald-600 text-white border-emerald-600 shadow-md',
      },
      // Warning
      {
        variant: 'warning',
        type: 'soft',
        class:
          'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100/50 dark:border-amber-800/30 text-amber-700 dark:text-amber-300',
      },
      {
        variant: 'warning',
        type: 'filled',
        class: 'bg-amber-500 text-white border-amber-500 shadow-md',
      },
      // Error
      {
        variant: 'error',
        type: 'soft',
        class:
          'bg-rose-50/50 dark:bg-rose-900/10 border-rose-100/50 dark:border-rose-800/30 text-rose-700 dark:text-rose-300',
      },
      {
        variant: 'error',
        type: 'filled',
        class: 'bg-rose-600 text-white border-rose-600 shadow-md',
      },
      // Info
      {
        variant: 'info',
        type: 'soft',
        class:
          'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100/50 dark:border-indigo-800/30 text-indigo-700 dark:text-indigo-300',
      },
      {
        variant: 'info',
        type: 'filled',
        class: 'bg-indigo-600 text-white border-indigo-600 shadow-md',
      },
      // Gray
      {
        variant: 'gray',
        type: 'soft',
        class:
          'bg-gray-50/50 dark:bg-gray-800/10 border-gray-200/50 dark:border-gray-700/30 text-gray-700 dark:text-gray-300',
      },
      {
        variant: 'gray',
        type: 'filled',
        class: 'bg-gray-700 text-white border-gray-700 shadow-md',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      type: 'soft',
    },
  },
)

export const bannerIconVariants = cva(
  'p-2.5 rounded-full shrink-0 flex items-center justify-center shadow-sm border transition-colors duration-300',
  {
    variants: {
      variant: {
        primary: '',
        success: '',
        warning: '',
        error: '',
        info: '',
        gray: '',
      },
      type: {
        soft: 'bg-white/50 dark:bg-black/20 border-black/5 dark:border-white/5',
        filled: 'bg-white border-transparent',
      },
    },
    compoundVariants: [
      { variant: 'primary', type: 'filled', class: 'text-blue-600 dark:text-blue-500' },
      { variant: 'success', type: 'filled', class: 'text-emerald-600 dark:text-emerald-500' },
      { variant: 'warning', type: 'filled', class: 'text-amber-500 dark:text-amber-500' },
      { variant: 'error', type: 'filled', class: 'text-rose-600 dark:text-rose-500' },
      { variant: 'info', type: 'filled', class: 'text-indigo-600 dark:text-indigo-500' },
      { variant: 'gray', type: 'filled', class: 'text-gray-700 dark:text-gray-300' },
    ],
    defaultVariants: {
      variant: 'primary',
      type: 'soft',
    },
  },
)
