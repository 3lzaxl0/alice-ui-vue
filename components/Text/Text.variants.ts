import { cva } from 'class-variance-authority'

export const textVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-3xl lg:text-4xl xl:text-5xl font-black leading-tight',
      h2: 'text-2xl lg:text-3xl font-black leading-tight',
      h3: 'text-xl lg:text-2xl font-bold leading-snug',
      title: 'text-base font-bold',
      subtitle: 'text-sm lg:text-base font-medium',
      label: 'text-xs font-black uppercase tracking-widest',
      body: 'text-base leading-relaxed',
      description: 'text-sm leading-relaxed',
      caption: 'text-xs',
      error: 'text-xs font-medium',
    },
    color: {
      default: 'text-slate-800 dark:text-white', // Default for headings
      muted: 'text-slate-500 dark:text-slate-400', // Default for descriptions/captions
      success: 'text-emerald-600 dark:text-emerald-400',
      warning: 'text-amber-600 dark:text-amber-400',
      error: 'text-red-500 dark:text-red-400',
      primary: 'text-indigo-600 dark:text-indigo-400',
      white: 'text-white',
      inherit: 'text-inherit',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      black: 'font-black',
      inherit: '',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    truncate: {
      true: 'truncate',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'body',
  },
})
