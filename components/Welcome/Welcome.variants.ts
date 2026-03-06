import { cva } from 'class-variance-authority'

export const welcomeCardVariants = cva(
  'group relative bg-slate-950/1 dark:bg-white/1 p-6 shadow-sm dark:shadow-black/60 border border-gray-100 dark:border-white/10 hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 rounded-2xl',
  {
    variants: {
      color: {
        emerald: 'hover:border-emerald-500 dark:hover:border-emerald-400',
        cyan: 'hover:border-cyan-500 dark:hover:border-cyan-400',
        indigo: 'hover:border-indigo-500 dark:hover:border-indigo-400',
        amber: 'hover:border-amber-500 dark:hover:border-amber-400',
        blue: 'hover:border-blue-500 dark:hover:border-blue-400',
        violet: 'hover:border-violet-500 dark:hover:border-violet-400',
        rose: 'hover:border-rose-500 dark:hover:border-rose-400',
        teal: 'hover:border-teal-500 dark:hover:border-teal-400',
        default: 'hover:border-blue-500 dark:hover:border-blue-400',
      },
    },
    defaultVariants: {
      color: 'default',
    },
  },
)

export const welcomeIconVariants = cva(
  'w-12 h-12 flex items-center justify-center transition-colors duration-300 rounded-xl',
  {
    variants: {
      color: {
        emerald:
          'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-300 group-hover:bg-emerald-600 group-hover:text-white',
        cyan: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20 dark:text-cyan-300 group-hover:bg-cyan-600 group-hover:text-white',
        indigo:
          'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white',
        amber:
          'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-300 group-hover:bg-amber-600 group-hover:text-white',
        blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 group-hover:bg-blue-600 group-hover:text-white',
        violet:
          'text-violet-600 bg-violet-50 dark:bg-violet-900/20 dark:text-violet-300 group-hover:bg-violet-600 group-hover:text-white',
        rose: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-300 group-hover:bg-rose-600 group-hover:text-white',
        teal: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20 dark:text-teal-300 group-hover:bg-teal-600 group-hover:text-white',
        default:
          'text-blue-900 bg-blue-600/10 dark:text-blue-200 dark:bg-blue-900/20 group-hover:bg-blue-900 group-hover:text-white',
      },
    },
    defaultVariants: {
      color: 'default',
    },
  },
)

export const welcomeTitleVariants = cva(
  'font-bold text-gray-900 dark:text-white text-lg mb-1 transition-colors',
  {
    variants: {
      color: {
        emerald: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
        cyan: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400',
        indigo: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
        amber: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
        blue: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
        violet: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
        rose: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
        teal: 'group-hover:text-teal-600 dark:group-hover:text-teal-400',
        default: 'group-hover:text-blue-900 dark:group-hover:text-blue-300',
      },
    },
    defaultVariants: {
      color: 'default',
    },
  },
)

export const welcomeLinkVariants = cva('text-sm font-medium flex items-center gap-1', {
  variants: {
    color: {
      emerald: 'text-emerald-600',
      cyan: 'text-cyan-600',
      indigo: 'text-indigo-600',
      amber: 'text-amber-600',
      blue: 'text-blue-600',
      violet: 'text-violet-600',
      rose: 'text-rose-600',
      teal: 'text-teal-600',
      default: 'text-blue-900 dark:text-blue-300',
    },
  },
  defaultVariants: {
    color: 'default',
  },
})
