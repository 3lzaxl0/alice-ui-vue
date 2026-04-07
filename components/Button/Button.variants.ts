import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'group relative flex items-center justify-center gap-2 font-semibold transition-all duration-300 outline-none select-none disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        primary: '',
        success: '',
        warning: '',
        error: '',
        info: '',
        ghost: '',
      },
      design: {
        solid: '',
        ghost: '',
        outline: '',
        'ghost-subtle': '',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
        icon: 'p-1.5 w-8 h-8',
        'icon-sm': 'p-1 w-6 h-6',
      },
      rounded: {
        true: 'rounded-full',
        false: 'rounded-alice-md',
      },
    },
    compoundVariants: [
      // --- SOLID DESIGNS ---
      {
        variant: 'primary',
        design: 'solid',
        class:
          'bg-blue-600 text-white shadow-sm hover:shadow-md hover:bg-blue-500 active:bg-blue-800 focus:ring-blue-500/50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:active:bg-blue-600 dark:text-white',
      },
      {
        variant: 'success',
        design: 'solid',
        class:
          'bg-emerald-600 text-white shadow-sm hover:shadow-md hover:bg-emerald-500 active:bg-emerald-800 focus:ring-emerald-500/50 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:active:bg-emerald-600 dark:text-white',
      },
      {
        variant: 'warning',
        design: 'solid',
        class:
          'bg-amber-500 text-white shadow-sm hover:shadow-md hover:bg-amber-500 active:bg-amber-700 focus:ring-amber-500/50 dark:bg-amber-400 dark:hover:bg-amber-300 dark:active:bg-amber-500 dark:text-white',
      },
      {
        variant: 'error',
        design: 'solid',
        class:
          'bg-red-600 text-white shadow-sm hover:shadow-md hover:bg-red-500 active:bg-red-800 focus:ring-red-500/50 dark:bg-red-500 dark:hover:bg-red-400 dark:active:bg-red-600 dark:text-white',
      },
      {
        variant: 'info',
        design: 'solid',
        class:
          'bg-cyan-600 text-white shadow-sm hover:shadow-md hover:bg-cyan-500 active:bg-cyan-800 focus:ring-cyan-500/50 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:active:bg-cyan-600 dark:text-white',
      },

      // --- GHOST DESIGNS ---
      {
        variant: 'primary',
        design: 'ghost',
        class:
          'text-blue-600 hover:bg-blue-50 active:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/40 dark:active:bg-blue-900/60',
      },
      {
        variant: 'success',
        design: 'ghost',
        class:
          'text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-900/40 dark:active:bg-emerald-900/60',
      },
      {
        variant: 'warning',
        design: 'ghost',
        class:
          'text-amber-600 hover:bg-amber-50 active:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/40 dark:active:bg-amber-900/60',
      },
      {
        variant: 'error',
        design: 'ghost',
        class:
          'text-red-600 hover:bg-red-50 active:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/40 dark:active:bg-red-900/60',
      },
      {
        variant: 'info',
        design: 'ghost',
        class:
          'text-cyan-600 hover:bg-cyan-50 active:bg-cyan-100 dark:text-cyan-400 dark:hover:bg-cyan-900/40 dark:active:bg-cyan-900/60',
      },

      // --- OUTLINE DESIGNS ---
      {
        variant: 'primary',
        design: 'outline',
        class:
          'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white active:bg-blue-700 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white',
      },
      {
        variant: 'success',
        design: 'outline',
        class:
          'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white active:bg-emerald-700 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white',
      },
      {
        variant: 'warning',
        design: 'outline',
        class:
          'border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white active:bg-amber-600 dark:border-amber-400 dark:text-amber-400 dark:hover:bg-amber-400 dark:hover:text-white',
      },
      {
        variant: 'error',
        design: 'outline',
        class:
          'border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white active:bg-red-700 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white',
      },
      {
        variant: 'info',
        design: 'outline',
        class:
          'border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white active:bg-cyan-700 dark:border-cyan-500 dark:text-cyan-400 dark:hover:bg-cyan-500 dark:hover:text-white',
      },

      // --- GHOST VARIANT (Neutral/Gray) ---
      {
        variant: 'ghost',
        class:
          'text-gray-600 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-400 dark:hover:bg-slate-800 dark:active:bg-slate-700',
      },

      // --- SUBTLE GHOST DESIGNS ---
      {
        variant: 'primary',
        design: 'ghost-subtle',
        class:
          'text-gray-400 dark:text-gray-500 hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100 dark:hover:bg-blue-900/20 dark:active:bg-blue-900/40 dark:hover:text-blue-400 transition-colors',
      },
      {
        variant: 'success',
        design: 'ghost-subtle',
        class:
          'text-gray-400 dark:text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100 dark:hover:bg-emerald-900/20 dark:active:bg-emerald-900/40 dark:hover:text-emerald-400 transition-colors',
      },
      {
        variant: 'warning',
        design: 'ghost-subtle',
        class:
          'text-gray-400 dark:text-gray-500 hover:text-amber-600 hover:bg-amber-50 active:bg-amber-100 dark:hover:bg-amber-900/20 dark:active:bg-amber-900/40 dark:hover:text-amber-400 transition-colors',
      },
      {
        variant: 'error',
        design: 'ghost-subtle',
        class:
          'text-gray-400 dark:text-gray-500 hover:text-red-600 hover:bg-red-50 active:bg-red-100 dark:hover:bg-red-900/20 dark:active:bg-red-900/40 dark:hover:text-red-400 transition-colors',
      },
      {
        variant: 'info',
        design: 'ghost-subtle',
        class:
          'text-gray-400 dark:text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 active:bg-cyan-100 dark:hover:bg-cyan-900/20 dark:active:bg-cyan-900/40 dark:hover:text-cyan-400 transition-colors',
      },
      {
        variant: 'ghost',
        design: 'ghost-subtle',
        class:
          'text-gray-400 dark:text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-slate-800 dark:active:bg-slate-700 dark:hover:text-gray-300 transition-colors',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      design: 'solid',
      size: 'md',
      rounded: false,
    },
  },
)
