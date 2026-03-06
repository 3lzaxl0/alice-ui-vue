import { ref, computed, watch } from 'vue'

export function useCalendar(
  props: {
    modelValue: string | null // YYYY-MM-DD
  },
  emit: {
    (e: 'update:modelValue', value: string | null): void
  },
) {
  const viewDate = ref(new Date())
  const activeDateStr = ref<string | null>(null)
  const gridRef = ref<HTMLElement | null>(null)

  // Sync viewDate with modelValue on change
  watch(
    () => props.modelValue,
    (val) => {
      if (val && isValidDate(val)) {
        const [year, month, day] = val.split('-').map(Number)
        if (
          year !== undefined &&
          month !== undefined &&
          day !== undefined &&
          !isNaN(year) &&
          !isNaN(month) &&
          !isNaN(day)
        ) {
          viewDate.value = new Date(year, month - 1, day, 12, 0, 0)
        }
      }
    },
    { immediate: true },
  )

  // Initialize activeDateStr when dropdown opens or first rendered
  watch(
    () => props.modelValue,
    (val) => {
      if (val && isValidDate(val)) {
        activeDateStr.value = val
      } else {
        const today = new Date()
        const y = today.getFullYear()
        const m = String(today.getMonth() + 1).padStart(2, '0')
        const d = String(today.getDate()).padStart(2, '0')
        activeDateStr.value = `${y}-${m}-${d}`
      }
    },
    { immediate: true },
  )

  function isValidDate(dateString: string) {
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

  const currentMonthLabel = computed(() => {
    return `${monthNames[viewDate.value.getMonth()]} ${viewDate.value.getFullYear()}`
  })

  const calendarDays = computed(() => {
    const year = viewDate.value.getFullYear()
    const month = viewDate.value.getMonth()

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
  })

  const prevMonth = () => {
    viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1)
  }
  const nextMonth = () => {
    viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1)
  }

  const selectDate = (dateStr: string) => {
    emit('update:modelValue', dateStr)
  }

  const isToday = (dateStr: string) => {
    const today = new Date()
    const y = today.getFullYear()
    const m = String(today.getMonth() + 1).padStart(2, '0')
    const d = String(today.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}` === dateStr
  }

  const goToday = () => {
    const today = new Date()
    const y = today.getFullYear()
    const m = String(today.getMonth() + 1).padStart(2, '0')
    const d = String(today.getDate()).padStart(2, '0')
    const dateStr = `${y}-${m}-${d}`

    viewDate.value = new Date(y, today.getMonth(), 1)
    activeDateStr.value = dateStr
    selectDate(dateStr)
  }

  // --- Keyboard Handling (Grid) ---
  function changeActiveDateByDays(days: number) {
    if (!activeDateStr.value) return
    const parts = activeDateStr.value.split('-').map(Number)
    if (parts.length < 3) return
    const year = parts[0]
    const month = parts[1]
    const day = parts[2]

    if (year === undefined || month === undefined || day === undefined) return

    const newDate = new Date(year, month - 1, day + days)

    const y = newDate.getFullYear()
    const m = String(newDate.getMonth() + 1).padStart(2, '0')
    const d = String(newDate.getDate()).padStart(2, '0')
    activeDateStr.value = `${y}-${m}-${d}`

    // Ensure viewDate shows the new active month
    if (
      newDate.getMonth() !== viewDate.value.getMonth() ||
      newDate.getFullYear() !== viewDate.value.getFullYear()
    ) {
      viewDate.value = new Date(newDate.getFullYear(), newDate.getMonth(), 1)
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        changeActiveDateByDays(-7)
        break
      case 'ArrowDown':
        event.preventDefault()
        changeActiveDateByDays(7)
        break
      case 'ArrowLeft':
        event.preventDefault()
        changeActiveDateByDays(-1)
        break
      case 'ArrowRight':
        event.preventDefault()
        changeActiveDateByDays(1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (activeDateStr.value) {
          selectDate(activeDateStr.value)
        }
        break
    }
  }

  return {
    viewDate,
    activeDateStr,
    gridRef,
    daysOfWeek,
    currentMonthLabel,
    calendarDays,
    prevMonth,
    nextMonth,
    selectDate,
    isToday,
    goToday,
    handleKeydown,
  }
}
