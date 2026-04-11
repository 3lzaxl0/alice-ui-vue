<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useCalendar } from './useCalendar'

defineOptions({
  name: 'AliceCalendar',
})

const props = defineProps<{
  modelValue: string | null // YYYY-MM-DD
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const {
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
} = useCalendar(props, emit)
</script>

<template>
  <div class="calendar-container w-[280px] max-md:w-full p-2 mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <button
        type="button"
        @click.stop="prevMonth"
        class="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500 transition-all cursor-pointer active:scale-95"
      >
        <ChevronLeft :size="18" />
      </button>
      <span class="text-sm font-bold text-gray-700 dark:text-gray-200 capitalize">
        {{ currentMonthLabel }}
      </span>
      <button
        type="button"
        @click.stop="nextMonth"
        class="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500 transition-all cursor-pointer active:scale-95"
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
    <div
      ref="gridRef"
      class="grid grid-cols-7 gap-1 outline-none focus:ring-2 focus:ring-primary-500/20 rounded-md p-1"
      tabindex="0"
      role="grid"
      @keydown="handleKeydown"
    >
      <button
        type="button"
        role="gridcell"
        :aria-selected="modelValue === dayObj.dateStr"
        v-for="(dayObj, idx) in calendarDays"
        :key="idx"
        @click.stop="selectDate(dayObj.dateStr)"
        tabindex="-1"
        class="h-8 w-8 text-xs rounded-full flex items-center justify-center transition-all relative cursor-pointer active:scale-90 mx-auto"
        :class="[
          !dayObj.isCurrentMonth
            ? 'text-gray-300 dark:text-slate-600'
            : 'text-gray-700 dark:text-gray-200',
          modelValue === dayObj.dateStr
            ? 'bg-primary-600 text-white font-bold shadow-md hover:bg-primary-700 ring-2 ring-primary-500/20'
            : 'hover:bg-gray-100 dark:hover:bg-slate-700',
          isToday(dayObj.dateStr) && modelValue !== dayObj.dateStr
            ? 'ring-1 ring-primary-500 text-primary-600 font-bold'
            : '',
          activeDateStr === dayObj.dateStr && modelValue !== dayObj.dateStr
            ? 'bg-gray-200 dark:bg-slate-600 ring-2 ring-inset ring-primary-500/30'
            : '',
        ]"
      >
        {{ dayObj.day }}
      </button>
    </div>

    <!-- Footer -->
    <div class="mt-4 pt-2 border-t border-gray-100 dark:border-white/5">
      <button
        type="button"
        @click.stop="goToday"
        class="w-full py-1.5 text-xs font-bold text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all active:scale-[0.98] cursor-pointer"
      >
        Hoy
      </button>
    </div>
  </div>
</template>
