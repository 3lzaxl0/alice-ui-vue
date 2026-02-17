import { cva } from 'class-variance-authority'

export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold border transition-all duration-200 rounded-alice-md',
  {
    variants: {
      variant: {
        success: '',
        warning: '',
        error: '',
        info: '',
        default: '',
        indigo: '',
        purple: '',
        pink: '',
        cyan: '',
      },
      type: {
        normal: 'border-transparent',
        filled: '',
        soft: '',
      },
    },
    compoundVariants: [
      // Success
      { variant: 'success', type: 'normal', class: 'text-green-600 dark:text-green-400' },
      { variant: 'success', type: 'filled', class: 'bg-green-600 text-white border-green-600' },
      {
        variant: 'success',
        type: 'soft',
        class:
          'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/50',
      },

      // Warning
      { variant: 'warning', type: 'normal', class: 'text-yellow-600 dark:text-yellow-400' },
      { variant: 'warning', type: 'filled', class: 'bg-yellow-500 text-white border-yellow-500' },
      {
        variant: 'warning',
        type: 'soft',
        class:
          'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/50',
      },

      // Error
      { variant: 'error', type: 'normal', class: 'text-red-600 dark:text-red-400' },
      { variant: 'error', type: 'filled', class: 'bg-red-600 text-white border-red-600' },
      {
        variant: 'error',
        type: 'soft',
        class:
          'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/50',
      },

      // Info
      { variant: 'info', type: 'normal', class: 'text-blue-600 dark:text-blue-400' },
      { variant: 'info', type: 'filled', class: 'bg-blue-600 text-white border-blue-600' },
      {
        variant: 'info',
        type: 'soft',
        class:
          'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/50',
      },

      // Default
      { variant: 'default', type: 'normal', class: 'text-gray-500 dark:text-gray-400' },
      { variant: 'default', type: 'filled', class: 'bg-gray-600 text-white border-gray-600' },
      {
        variant: 'default',
        type: 'soft',
        class:
          'bg-gray-50 text-gray-700 border-gray-200 dark:bg-slate-700/50 dark:text-gray-300 dark:border-slate-600',
      },

      // Indigo
      { variant: 'indigo', type: 'normal', class: 'text-indigo-600 dark:text-indigo-400' },
      { variant: 'indigo', type: 'filled', class: 'bg-indigo-600 text-white border-indigo-600' },
      {
        variant: 'indigo',
        type: 'soft',
        class:
          'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800/50',
      },

      // Purple
      { variant: 'purple', type: 'normal', class: 'text-purple-600 dark:text-purple-400' },
      { variant: 'purple', type: 'filled', class: 'bg-purple-600 text-white border-purple-600' },
      {
        variant: 'purple',
        type: 'soft',
        class:
          'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/50',
      },

      // Pink
      { variant: 'pink', type: 'normal', class: 'text-pink-600 dark:text-pink-400' },
      { variant: 'pink', type: 'filled', class: 'bg-pink-600 text-white border-pink-600' },
      {
        variant: 'pink',
        type: 'soft',
        class:
          'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800/50',
      },

      // Cyan
      { variant: 'cyan', type: 'normal', class: 'text-cyan-600 dark:text-cyan-400' },
      { variant: 'cyan', type: 'filled', class: 'bg-cyan-600 text-white border-cyan-600' },
      {
        variant: 'cyan',
        type: 'soft',
        class:
          'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800/50',
      },
    ],
    defaultVariants: {
      variant: 'default',
      type: 'soft',
    },
  },
)
