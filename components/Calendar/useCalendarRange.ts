import { ref, computed, watch } from 'vue'

export function useCalendarRange(
  props: {
    modelValue: [string, string] | null // [YYYY-MM-DD, YYYY-MM-DD]
  },
  emit: {
    (e: 'update:modelValue', value: [string, string] | null): void
  },
) {
  // viewDate drives the left calendar. Right calendar is viewDate + 1 month.
  const viewDate = ref(new Date())

  const startDate = ref<string | null>(null)
  const endDate = ref<string | null>(null)
  const hoverDate = ref<string | null>(null)
  const selectingPhase = ref<'start' | 'end'>('start')

  // Sync internal state with prop
  watch(
    () => props.modelValue,
    (val) => {
      if (val && val.length === 2 && isValidDate(val[0]) && isValidDate(val[1])) {
        startDate.value = val[0]
        endDate.value = val[1]
        selectingPhase.value = 'start' // Reset phase when strictly set from outside

        // Focus viewDate on the start date
        const parts = val[0].split('-').map(Number)
        const year = parts[0] ?? 0
        const month = parts[1] ?? 1
        viewDate.value = new Date(year, month - 1, 1, 12, 0, 0)
      } else {
        startDate.value = null
        endDate.value = null
        selectingPhase.value = 'start'
      }
    },
    { immediate: true },
  )

  function isValidDate(dateString: string) {
    if (!dateString) return false
    const regEx = /^\d{4}-\d{2}-\d{2}$/
    if (!dateString.match(regEx)) return false
    const d = new Date(dateString)
    const dNum = d.getTime()
    if (!dNum && dNum !== 0) return false
    return d.toISOString().slice(0, 10) === dateString
  }

  const daysOfWeek = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']
  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]

  // Left Calendar (viewDate)
  const leftMonthLabel = computed(() => {
    return `${monthNames[viewDate.value.getMonth()]} ${viewDate.value.getFullYear()}`
  })

  // Right Calendar (viewDate + 1 month)
  const rightMonthLabel = computed(() => {
    const d = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1)
    return `${monthNames[d.getMonth()]} ${d.getFullYear()}`
  })

  function generateMonthDays(year: number, month: number) {
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    let startDay = firstDayOfMonth.getDay() - 1
    if (startDay === -1) startDay = 6

    const daysInMonth = lastDayOfMonth.getDate()
    const days: { day: number; dateStr: string; isCurrentMonth: boolean }[] = []

    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startDay - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i
      const d = new Date(year, month - 1, day)
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const da = String(day).padStart(2, '0')
      days.push({ day, dateStr: `${y}-${m}-${da}`, isCurrentMonth: false })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const m = String(month + 1).padStart(2, '0')
      const da = String(i).padStart(2, '0')
      days.push({ day: i, dateStr: `${year}-${m}-${da}`, isCurrentMonth: true })
    }

    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i)
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const da = String(i).padStart(2, '0')
      days.push({ day: i, dateStr: `${y}-${m}-${da}`, isCurrentMonth: false })
    }

    return days
  }

  const leftCalendarDays = computed(() => {
    return generateMonthDays(viewDate.value.getFullYear(), viewDate.value.getMonth())
  })

  const rightCalendarDays = computed(() => {
    return generateMonthDays(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1)
  })

  const prevMonth = () => {
    viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1)
  }

  const nextMonth = () => {
    viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1)
  }

  const handleDayEnter = (dateStr: string) => {
    if (selectingPhase.value === 'end') {
      hoverDate.value = dateStr
    }
  }

  const selectDate = (dateStr: string) => {
    if (selectingPhase.value === 'start') {
      startDate.value = dateStr
      endDate.value = null
      hoverDate.value = null
      selectingPhase.value = 'end'
    } else {
      // If end date is before start date, swap them
      if (startDate.value && dateStr < startDate.value) {
        endDate.value = startDate.value
        startDate.value = dateStr
      } else {
        endDate.value = dateStr
      }
      selectingPhase.value = 'start'
      hoverDate.value = null

      // Emit the completed tuple
      if (startDate.value && endDate.value) {
        emit('update:modelValue', [startDate.value, endDate.value])
      }
    }
  }

  const isToday = (dateStr: string) => {
    const today = new Date()
    const y = today.getFullYear()
    const m = String(today.getMonth() + 1).padStart(2, '0')
    const d = String(today.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}` === dateStr
  }

  const isSelected = (dateStr: string) => {
    return dateStr === startDate.value || dateStr === endDate.value
  }

  const isBetween = (dateStr: string) => {
    const start = startDate.value
    let end = endDate.value

    if (selectingPhase.value === 'end' && start && hoverDate.value) {
      end = hoverDate.value
      if (end < start) {
        return dateStr > end && dateStr < start
      }
    }

    if (start && end) {
      return dateStr > start && dateStr < end
    }

    return false
  }

  const isRangeStart = (dateStr: string) => {
    if (selectingPhase.value === 'end' && hoverDate.value && startDate.value) {
      const start = hoverDate.value < startDate.value ? hoverDate.value : startDate.value
      return dateStr === start
    }
    return dateStr === startDate.value
  }

  const isRangeEnd = (dateStr: string) => {
    if (selectingPhase.value === 'end' && hoverDate.value && startDate.value) {
      const end = hoverDate.value > startDate.value ? hoverDate.value : startDate.value
      return dateStr === end
    }
    return dateStr === endDate.value
  }

  return {
    daysOfWeek,
    leftMonthLabel,
    rightMonthLabel,
    leftCalendarDays,
    rightCalendarDays,
    prevMonth,
    nextMonth,
    selectDate,
    handleDayEnter,
    isToday,
    isSelected,
    isBetween,
    isRangeStart,
    isRangeEnd,
    startDate,
    endDate,
  }
}
