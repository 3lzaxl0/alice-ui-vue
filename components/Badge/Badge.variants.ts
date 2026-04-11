import { cva } from 'class-variance-authority'

export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium border transition-all duration-200 rounded-full',
  {
    variants: {
      variant: {
        success: '',
        warning: '',
        error: '',
        info: '',
        primary: '',
        default: '',
        indigo: '',
        purple: '',
        pink: '',
        cyan: '',
        emerald: '',
        amber: '',
        blue: '',
        violet: '',
        teal: '',
      },
      type: {
        normal: 'border-transparent',
        filled: 'font-semibold',
        soft: '',
      },
    },
    compoundVariants: [
      // ── Success ──────────────────────────────────────────────
      { variant: 'success', type: 'normal', class: 'text-success-600 dark:text-success-300' },
      { variant: 'success', type: 'filled', class: 'bg-success-600 text-white border-success-600' },
      {
        variant: 'success',
        type: 'soft',
        class: 'bg-success-50 text-success-600 border-success-200 dark:bg-success-900/20 dark:text-success-300 dark:border-success-800/50',
      },

      // ── Warning ──────────────────────────────────────────────
      { variant: 'warning', type: 'normal', class: 'text-warning-600 dark:text-warning-300' },
      { variant: 'warning', type: 'filled', class: 'bg-warning-500 text-white border-warning-500' },
      {
        variant: 'warning',
        type: 'soft',
        class: 'bg-warning-50 text-warning-600 border-warning-200 dark:bg-warning-900/20 dark:text-warning-300 dark:border-warning-800/50',
      },

      // ── Error ────────────────────────────────────────────────
      { variant: 'error', type: 'normal', class: 'text-error-600 dark:text-error-300' },
      { variant: 'error', type: 'filled', class: 'bg-error-600 text-white border-error-600' },
      {
        variant: 'error',
        type: 'soft',
        class: 'bg-error-50 text-error-600 border-error-200 dark:bg-error-900/20 dark:text-error-300 dark:border-error-800/50',
      },

      // ── Info ─────────────────────────────────────────────────
      { variant: 'info', type: 'normal', class: 'text-info-600 dark:text-info-300' },
      { variant: 'info', type: 'filled', class: 'bg-info-600 text-white border-info-600' },
      {
        variant: 'info',
        type: 'soft',
        class: 'bg-info-50 text-info-600 border-info-200 dark:bg-info-900/20 dark:text-info-300 dark:border-info-800/50',
      },

      // ── Primary ──────────────────────────────────────────────
      { variant: 'primary', type: 'normal', class: 'text-primary-600 dark:text-primary-300' },
      { variant: 'primary', type: 'filled', class: 'bg-primary-600 text-white border-primary-600' },
      {
        variant: 'primary',
        type: 'soft',
        class: 'bg-primary-50 text-primary-600 border-primary-200 dark:bg-primary-900/20 dark:text-primary-300 dark:border-primary-800/50',
      },

      // ── Default ──────────────────────────────────────────────
      { variant: 'default', type: 'normal', class: 'text-gray-500 dark:text-gray-400' },
      { variant: 'default', type: 'filled', class: 'bg-gray-600 text-white border-gray-600' },
      {
        variant: 'default',
        type: 'soft',
        class: 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-slate-700/50 dark:text-gray-300 dark:border-slate-600',
      },

      // ── Aliases & Extras (Mapped to Semantic Tokens) ──────────
      { variant: 'blue', type: 'normal', class: 'text-info-600 dark:text-info-300' },
      { variant: 'blue', type: 'filled', class: 'bg-info-600 text-white border-info-600' },
      { variant: 'blue', type: 'soft', class: 'bg-info-50 text-info-600 border-info-200 dark:bg-info-900/20 dark:text-info-300 dark:border-info-800/50' },

      { variant: 'emerald', type: 'normal', class: 'text-success-600 dark:text-success-300' },
      { variant: 'emerald', type: 'filled', class: 'bg-success-600 text-white border-success-600' },
      { variant: 'emerald', type: 'soft', class: 'bg-success-50 text-success-600 border-success-200 dark:bg-success-900/20 dark:text-success-300 dark:border-success-800/50' },

      { variant: 'amber', type: 'normal', class: 'text-warning-600 dark:text-warning-300' },
      { variant: 'amber', type: 'filled', class: 'bg-warning-500 text-white border-warning-500' },
      { variant: 'amber', type: 'soft', class: 'bg-warning-50 text-warning-600 border-warning-200 dark:bg-warning-900/20 dark:text-warning-300 dark:border-warning-800/50' },

      // Legacy support for specific colors (using primary as fallback for brand-like colors)
      { variant: 'indigo', type: 'normal', class: 'text-primary-600 dark:text-primary-300' },
      { variant: 'indigo', type: 'filled', class: 'bg-primary-600 text-white border-primary-600' },
      { variant: 'indigo', type: 'soft', class: 'bg-primary-50 text-primary-600 border-primary-200 dark:bg-primary-900/20 dark:text-primary-300 dark:border-primary-800/50' },

      { variant: 'cyan', type: 'normal', class: 'text-primary-600 dark:text-primary-300' },
      { variant: 'cyan', type: 'filled', class: 'bg-primary-600 text-white border-primary-600' },
      { variant: 'cyan', type: 'soft', class: 'bg-primary-50 text-primary-600 border-primary-200 dark:bg-primary-900/20 dark:text-primary-300 dark:border-primary-800/50' },

      { variant: 'violet', type: 'normal', class: 'text-violet-600 dark:text-violet-300' },
      { variant: 'violet', type: 'filled', class: 'bg-violet-600 text-white border-violet-600' },
      { variant: 'violet', type: 'soft', class: 'bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800/50' },

      { variant: 'purple', type: 'normal', class: 'text-violet-600 dark:text-violet-300' },
      { variant: 'purple', type: 'filled', class: 'bg-violet-600 text-white border-violet-600' },
      { variant: 'purple', type: 'soft', class: 'bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800/50' },

      { variant: 'teal', type: 'normal', class: 'text-success-600 dark:text-success-300' },
      { variant: 'teal', type: 'filled', class: 'bg-success-600 text-white border-success-600' },
      { variant: 'teal', type: 'soft', class: 'bg-success-50 text-success-600 border-success-200 dark:bg-success-900/20 dark:text-success-300 dark:border-success-800/50' },

      { variant: 'pink', type: 'normal', class: 'text-pink-600 dark:text-pink-300' },
      { variant: 'pink', type: 'filled', class: 'bg-pink-600 text-white border-pink-600' },
      { variant: 'pink', type: 'soft', class: 'bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800/50' },
    ],
    defaultVariants: {
      variant: 'default',
      type: 'soft',
    },
  },
)
