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
          'bg-primary-50/50 dark:bg-primary-900/10 border-primary-100/50 dark:border-primary-800/30 text-primary-700 dark:text-primary-300',
      },
      {
        variant: 'primary',
        type: 'filled',
        class: 'bg-primary-600 text-white border-primary-600 shadow-md',
      },
      // Success
      {
        variant: 'success',
        type: 'soft',
        class:
          'bg-success-50/50 dark:bg-success-900/10 border-success-100/50 dark:border-success-800/30 text-success-700 dark:text-success-300',
      },
      {
        variant: 'success',
        type: 'filled',
        class: 'bg-success-600 text-white border-success-600 shadow-md',
      },
      // Warning
      {
        variant: 'warning',
        type: 'soft',
        class:
          'bg-warning-50/50 dark:bg-warning-900/10 border-warning-100/50 dark:border-warning-800/30 text-warning-700 dark:text-warning-300',
      },
      {
        variant: 'warning',
        type: 'filled',
        class: 'bg-warning-500 text-white border-warning-500 shadow-md',
      },
      // Error
      {
        variant: 'error',
        type: 'soft',
        class:
          'bg-error-50/50 dark:bg-error-900/10 border-error-100/50 dark:border-error-800/30 text-error-700 dark:text-error-300',
      },
      {
        variant: 'error',
        type: 'filled',
        class: 'bg-error-600 text-white border-error-600 shadow-md',
      },
      // Info
      {
        variant: 'info',
        type: 'soft',
        class:
          'bg-info-50/50 dark:bg-info-900/10 border-info-100/50 dark:border-info-800/30 text-info-700 dark:text-info-300',
      },
      {
        variant: 'info',
        type: 'filled',
        class: 'bg-info-600 text-white border-info-600 shadow-md',
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
      { variant: 'primary', type: 'filled', class: 'text-primary-600 dark:text-primary-500' },
      { variant: 'success', type: 'filled', class: 'text-success-600 dark:text-success-500' },
      { variant: 'warning', type: 'filled', class: 'text-warning-500 dark:text-warning-500' },
      { variant: 'error', type: 'filled', class: 'text-error-600 dark:text-error-500' },
      { variant: 'info', type: 'filled', class: 'text-info-600 dark:text-info-500' },
      { variant: 'gray', type: 'filled', class: 'text-gray-700 dark:text-gray-300' },
    ],
    defaultVariants: {
      variant: 'primary',
      type: 'soft',
    },
  },
)
