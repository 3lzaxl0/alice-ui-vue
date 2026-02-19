import { cva } from 'class-variance-authority'

export const tableVariants = {
  header:
    'sticky top-0 z-50 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider bg-gray-50 dark:bg-slate-950',
  headerCell: cva(
    'px-6 py-4 border-b border-gray-100 dark:border-white/10 whitespace-nowrap group select-none relative text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider bg-gray-50 dark:bg-slate-950',
    {
      variants: {
        sortable: {
          true: 'cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700',
          false: '',
        },
        frozen: {
          true: 'sticky z-50',
          false: '',
        },
        dragging: {
          true: 'opacity-50',
          false: '',
        },
        divided: {
          true: 'border-r border-gray-100 dark:border-slate-700 last:border-r-0',
          false: '',
        },
      },
    },
  ),
  row: cva('transition-colors duration-150 group', {
    variants: {
      selected: {
        true: '!bg-blue-50 dark:!bg-blue-600/5',
        false: '',
      },
      striped: {
        true: '',
        false: 'bg-white dark:bg-transparent',
      },
    },
    compoundVariants: [
      {
        selected: false,
        striped: true,
        class:
          'bg-slate-50 dark:bg-white/2 odd:bg-white dark:odd:bg-transparent hover:bg-blue-50/50 dark:hover:bg-blue-900/10',
      },
    ],
    defaultVariants: {
      selected: false,
      striped: true,
    },
  }),
  cell: cva('whitespace-nowrap border-b border-gray-100 dark:border-slate-700', {
    variants: {
      frozen: {
        true: 'sticky z-30 bg-inherit',
        false: '',
      },
      selected: {
        true: 'bg-inherit',
        false: '',
      },
      dragging: {
        true: 'alice-column-moving animate-alice-pulse-subtle bg-blue-50/20 dark:bg-blue-900/10 border-x border-blue-200/30 dark:border-blue-700/30 grayscale-[0.1]',
        false: '',
      },
      divided: {
        true: 'border-r border-gray-100 dark:border-slate-700 last:border-r-0',
        false: '',
      },
    },
  }),
  selectionCell:
    'w-12 px-6 py-3 text-center sticky left-0 z-50 border-b border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-950 group-[.bg-slate-50]:bg-slate-50 dark:group-[.dark\:bg-white\/2]:bg-slate-950',
}
