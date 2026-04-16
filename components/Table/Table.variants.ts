import { cva } from 'class-variance-authority'

const selectedBg = '!bg-primary-100 dark:!bg-primary-950'
const baseBg = 'bg-white dark:bg-slate-950'
const stripeBg = 'bg-slate-50 dark:bg-slate-900'
const hoverClasses = 'hover:bg-primary-50 dark:hover:bg-slate-800'
const groupHoverClasses = 'group-hover:bg-primary-50 dark:group-hover:bg-slate-800'

export const tableVariants = {
  header: `sticky top-0 z-50 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider ${baseBg}`,
  headerCell: cva(
    `px-3 py-3 border-b border-gray-100 dark:border-white/10 whitespace-nowrap group select-none relative text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider ${baseBg}`,
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
        frozenRight: {
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
        true: selectedBg,
        false: '',
      },
      striped: {
        true: '',
        false: `${baseBg} ${hoverClasses}`,
      },
      isEvenIndex: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        selected: false,
        striped: true,
        isEvenIndex: true,
        class: `${baseBg} ${hoverClasses}`,
      },
      {
        selected: false,
        striped: true,
        isEvenIndex: false,
        class: `${stripeBg} ${hoverClasses}`,
      },
    ],
    defaultVariants: {
      selected: false,
      striped: true,
      isEvenIndex: false,
    },
  }),
  cell: cva(
    'whitespace-nowrap border-b border-gray-100 dark:border-slate-700 transition-colors duration-150',
    {
      variants: {
        frozen: {
          true: 'sticky z-30',
          false: '',
        },
        frozenRight: {
          true: 'sticky z-30',
          false: '',
        },
        selected: {
          true: selectedBg,
          false: '',
        },
        dragging: {
          true: 'alice-column-moving animate-alice-pulse-subtle bg-primary-50/20 dark:bg-primary-900/10 border-x border-primary-200/30 dark:border-primary-700/30 grayscale-[0.1]',
          false: '',
        },
        divided: {
          true: 'border-r border-gray-100 dark:border-slate-700 last:border-r-0',
          false: '',
        },
        striped: {
          true: '',
          false: '',
        },
        isEvenIndex: {
          true: '',
          false: '',
        },
      },
      compoundVariants: [
        {
          frozen: true,
          striped: true,
          isEvenIndex: true,
          selected: false,
          class: `${baseBg} ${groupHoverClasses}`,
        },
        {
          frozen: true,
          striped: true,
          isEvenIndex: false,
          selected: false,
          class: `${stripeBg} ${groupHoverClasses}`,
        },
        {
          frozenRight: true,
          striped: true,
          isEvenIndex: true,
          selected: false,
          class: `${baseBg} ${groupHoverClasses}`,
        },
        {
          frozenRight: true,
          striped: true,
          isEvenIndex: false,
          selected: false,
          class: `${stripeBg} ${groupHoverClasses}`,
        },
        {
          frozen: true,
          striped: false,
          selected: false,
          class: `${baseBg} ${groupHoverClasses}`,
        },
        {
          frozenRight: true,
          striped: false,
          selected: false,
          class: `${baseBg} ${groupHoverClasses}`,
        },
        // Selected frozen cells — explicit bg so sticky doesn't show through
        {
          frozen: true,
          selected: true,
        },
        {
          frozenRight: true,
          selected: true,
        },
      ],
    },
  ),
  selectionCell: `w-12 px-3 py-3 text-center sticky left-0 z-50 border-b border-gray-100 dark:border-slate-700`,
}
