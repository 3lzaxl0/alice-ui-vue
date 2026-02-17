<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

defineOptions({
  name: 'AliceCalendar',
})

const props = defineProps<{
  modelValue: string | null // YYYY-MM-DD
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

// Calendar State (View)
const viewDate = ref(new Date()) // Controls the month being viewed

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

// Helper: Check if string is YYYY-MM-DD
function isValidDate(dateString: string) {
  const regEx = /^\d{4}-\d{2}-\d{2}$/
  if (!dateString.match(regEx)) return false
  const d = new Date(dateString)
  const dNum = d.getTime()
  if (!dNum && dNum !== 0) return false
  return d.toISOString().slice(0, 10) === dateString
}

// Calendar Logic
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

  // 0 = Sunday, 1 = Monday. We want 0 = Monday, 6 = Sunday
  let startDay = firstDayOfMonth.getDay() - 1
  if (startDay === -1) startDay = 6

  const daysInMonth = lastDayOfMonth.getDate()
  const days: { day: number; dateStr: string; isCurrentMonth: boolean }[] = []

  // Previous Month Padding
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startDay - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i
    const d = new Date(year, month - 1, day)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const da = String(day).padStart(2, '0')
    days.push({ day, dateStr: `${y}-${m}-${da}`, isCurrentMonth: false })
  }

  // Current Month
  for (let i = 1; i <= daysInMonth; i++) {
    const m = String(month + 1).padStart(2, '0')
    const da = String(i).padStart(2, '0')
    days.push({ day: i, dateStr: `${year}-${m}-${da}`, isCurrentMonth: true })
  }

  // Next Month Padding (to fill 42 cells grid 6x7)
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

// Navigation
const prevMonth = () => {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1)
}
const nextMonth = () => {
  viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1)
}

// Selection
const selectDate = (dateStr: string) => {
  emit('update:modelValue', dateStr)
}

// Helper: Check if today
const isToday = (dateStr: string) => {
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const d = String(today.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}` === dateStr
}
</script>

<template>
  <div class="calendar-container w-[280px]">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <button
        @click.stop="prevMonth"
        class="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500 transition-colors"
      >
        <ChevronLeft :size="18" />
      </button>
      <span class="text-sm font-bold text-gray-700 dark:text-gray-200 capitalize">
        {{ currentMonthLabel }}
      </span>
      <button
        @click.stop="nextMonth"
        class="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500 transition-colors"
      >
        <ChevronRight :size="18" />
      </button>
    </div>

    <!-- Days Header -->
    <div class="grid grid-cols-7 mb-2">
      <div
        v-for="day in daysOfWeek"
        :key="day"
        class="text-center text-xs font-medium text-gray-400"
      >
        {{ day }}
      </div>
    </div>

    <!-- Days Grid -->
    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="(dayObj, idx) in calendarDays"
        :key="idx"
        @click.stop="selectDate(dayObj.dateStr)"
        class="h-8 w-8 text-xs rounded-full flex items-center justify-center transition-all relative"
        :class="[
          !dayObj.isCurrentMonth
            ? 'text-gray-300 dark:text-slate-600'
            : 'text-gray-700 dark:text-gray-200',
          modelValue === dayObj.dateStr
            ? 'bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700'
            : 'hover:bg-gray-100 dark:hover:bg-slate-700',
          isToday(dayObj.dateStr) && modelValue !== dayObj.dateStr
            ? 'ring-1 ring-blue-500 text-blue-600 font-bold'
            : '',
        ]"
      >
        {{ dayObj.day }}
      </button>
    </div>
  </div>
</template>
