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
        default: '',
        indigo: '',
        purple: '',
        pink: '',
        cyan: '',
        emerald: '',
        amber: '',
        blue: '',
        violet: '',
        rose: '',
        teal: '',
      },
      type: {
        normal: 'border-transparent',
        filled: 'font-semibold',
        soft: '',
      },
    },
    compoundVariants: [
      // ── Success → emerald ──────────────────────────────────────
      { variant: 'success', type: 'normal', class: 'text-emerald-600 dark:text-emerald-300' },
      {
        variant: 'success',
        type: 'filled',
        class: 'bg-emerald-600 text-white border-emerald-600',
      },
      {
        variant: 'success',
        type: 'soft',
        class:
          'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/50',
      },

      // ── Warning → amber ────────────────────────────────────────
      { variant: 'warning', type: 'normal', class: 'text-amber-600 dark:text-amber-300' },
      { variant: 'warning', type: 'filled', class: 'bg-amber-500 text-white border-amber-500' },
      {
        variant: 'warning',
        type: 'soft',
        class:
          'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/50',
      },

      // ── Error → rose ───────────────────────────────────────────
      { variant: 'error', type: 'normal', class: 'text-rose-600 dark:text-rose-300' },
      { variant: 'error', type: 'filled', class: 'bg-rose-600 text-white border-rose-600' },
      {
        variant: 'error',
        type: 'soft',
        class:
          'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800/50',
      },

      // ── Info → blue ────────────────────────────────────────────
      { variant: 'info', type: 'normal', class: 'text-blue-600 dark:text-blue-300' },
      { variant: 'info', type: 'filled', class: 'bg-blue-600 text-white border-blue-600' },
      {
        variant: 'info',
        type: 'soft',
        class:
          'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/50',
      },

      // ── Default ────────────────────────────────────────────────
      { variant: 'default', type: 'normal', class: 'text-gray-500 dark:text-gray-400' },
      { variant: 'default', type: 'filled', class: 'bg-gray-600 text-white border-gray-600' },
      {
        variant: 'default',
        type: 'soft',
        class:
          'bg-gray-50 text-gray-600 border-gray-200 dark:bg-slate-700/50 dark:text-gray-300 dark:border-slate-600',
      },

      // ── Indigo ─────────────────────────────────────────────────
      { variant: 'indigo', type: 'normal', class: 'text-indigo-600 dark:text-indigo-300' },
      { variant: 'indigo', type: 'filled', class: 'bg-indigo-600 text-white border-indigo-600' },
      {
        variant: 'indigo',
        type: 'soft',
        class:
          'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800/50',
      },

      // ── Purple → violet ────────────────────────────────────────
      { variant: 'purple', type: 'normal', class: 'text-violet-600 dark:text-violet-300' },
      { variant: 'purple', type: 'filled', class: 'bg-violet-600 text-white border-violet-600' },
      {
        variant: 'purple',
        type: 'soft',
        class:
          'bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800/50',
      },

      // ── Pink → rose ────────────────────────────────────────────
      { variant: 'pink', type: 'normal', class: 'text-rose-600 dark:text-rose-300' },
      { variant: 'pink', type: 'filled', class: 'bg-rose-600 text-white border-rose-600' },
      {
        variant: 'pink',
        type: 'soft',
        class:
          'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800/50',
      },

      // ── Cyan ───────────────────────────────────────────────────
      { variant: 'cyan', type: 'normal', class: 'text-cyan-600 dark:text-cyan-300' },
      { variant: 'cyan', type: 'filled', class: 'bg-cyan-600 text-white border-cyan-600' },
      {
        variant: 'cyan',
        type: 'soft',
        class:
          'bg-cyan-50 text-cyan-600 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800/50',
      },

      // ── Emerald (alias de success) ─────────────────────────────
      { variant: 'emerald', type: 'normal', class: 'text-emerald-600 dark:text-emerald-300' },
      { variant: 'emerald', type: 'filled', class: 'bg-emerald-600 text-white border-emerald-600' },
      {
        variant: 'emerald',
        type: 'soft',
        class:
          'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/50',
      },

      // ── Amber (alias de warning) ───────────────────────────────
      { variant: 'amber', type: 'normal', class: 'text-amber-600 dark:text-amber-300' },
      { variant: 'amber', type: 'filled', class: 'bg-amber-500 text-white border-amber-500' },
      {
        variant: 'amber',
        type: 'soft',
        class:
          'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/50',
      },

      // ── Blue (alias de info) ───────────────────────────────────
      { variant: 'blue', type: 'normal', class: 'text-blue-600 dark:text-blue-300' },
      { variant: 'blue', type: 'filled', class: 'bg-blue-600 text-white border-blue-600' },
      {
        variant: 'blue',
        type: 'soft',
        class:
          'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/50',
      },

      // ── Violet (alias de purple) ───────────────────────────────
      { variant: 'violet', type: 'normal', class: 'text-violet-600 dark:text-violet-300' },
      { variant: 'violet', type: 'filled', class: 'bg-violet-600 text-white border-violet-600' },
      {
        variant: 'violet',
        type: 'soft',
        class:
          'bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800/50',
      },

      // ── Rose (alias de error/pink) ─────────────────────────────
      { variant: 'rose', type: 'normal', class: 'text-rose-600 dark:text-rose-300' },
      { variant: 'rose', type: 'filled', class: 'bg-rose-600 text-white border-rose-600' },
      {
        variant: 'rose',
        type: 'soft',
        class:
          'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800/50',
      },

      // ── Teal ───────────────────────────────────────────────────
      { variant: 'teal', type: 'normal', class: 'text-teal-600 dark:text-teal-300' },
      { variant: 'teal', type: 'filled', class: 'bg-teal-600 text-white border-teal-600' },
      {
        variant: 'teal',
        type: 'soft',
        class:
          'bg-teal-50 text-teal-600 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800/50',
      },
    ],
    defaultVariants: {
      variant: 'default',
      type: 'soft',
    },
  },
)
