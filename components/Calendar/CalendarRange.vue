<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useCalendarRange } from './useCalendarRange'

defineOptions({
  name: 'AliceCalendarRange',
})

const props = defineProps<{
  modelValue: [string, string] | null // [YYYY-MM-DD, YYYY-MM-DD]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: [string, string] | null): void
}>()

const {
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
} = useCalendarRange(props, emit)
</script>

<template>
  <div class="calendar-range-container flex flex-col md:flex-row gap-6 w-full md:w-[560px]">
    <!-- Left Calendar -->
    <div class="flex-1 w-[280px]">
      <div class="flex items-center justify-between mb-4">
        <button
          type="button"
          @click.stop="prevMonth"
          class="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500 transition-all cursor-pointer active:scale-95"
        >
          <ChevronLeft :size="18" />
        </button>
        <span class="text-sm font-bold text-gray-700 dark:text-gray-200 capitalize">
          {{ leftMonthLabel }}
        </span>
        <!-- Hidden Next to keep spacing but allow right calendar to have the real Next -->
        <button type="button" class="p-1 invisible"><ChevronRight :size="18" /></button>
      </div>

      <div class="grid grid-cols-7 mb-2">
        <div
          v-for="day in daysOfWeek"
          :key="day"
          class="text-center text-xs font-medium text-gray-400"
        >
          {{ day }}
        </div>
      </div>

      <div class="grid grid-cols-7 gap-y-1" role="grid">
        <div
          v-for="(dayObj, idx) in leftCalendarDays"
          :key="idx"
          @mouseenter="dayObj.isCurrentMonth && handleDayEnter(dayObj.dateStr)"
          class="relative h-8 w-full flex items-center justify-center isolate"
        >
          <!-- Between Highlight Background -->
          <div
            v-if="
              dayObj.isCurrentMonth &&
              (isBetween(dayObj.dateStr) ||
                isRangeStart(dayObj.dateStr) ||
                isRangeEnd(dayObj.dateStr))
            "
            class="absolute inset-y-0 w-full bg-blue-50 dark:bg-blue-900/20 -z-10"
            :class="{
              'rounded-l-full': isRangeStart(dayObj.dateStr),
              'rounded-r-full': isRangeEnd(dayObj.dateStr),
            }"
          ></div>

          <button
            type="button"
            role="gridcell"
            @click.stop="dayObj.isCurrentMonth && selectDate(dayObj.dateStr)"
            tabindex="-1"
            class="h-8 w-8 text-xs rounded-full flex items-center justify-center transition-all z-10 border border-transparent"
            :class="[
              !dayObj.isCurrentMonth
                ? 'text-gray-300 dark:text-slate-600 cursor-default'
                : 'text-gray-700 dark:text-gray-200 cursor-pointer',
              dayObj.isCurrentMonth && isSelected(dayObj.dateStr)
                ? 'bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700 ring-2 ring-blue-500/20'
                : dayObj.isCurrentMonth
                  ? 'hover:border-blue-500/30'
                  : '',
              dayObj.isCurrentMonth && isToday(dayObj.dateStr) && !isSelected(dayObj.dateStr)
                ? 'ring-1 ring-blue-500 text-blue-600 font-bold'
                : '',
            ]"
          >
            {{ dayObj.day }}
          </button>
        </div>
      </div>
    </div>

    <!-- Right Calendar -->
    <div class="flex-1 w-[280px]">
      <div class="flex items-center justify-between mb-4">
        <button type="button" class="p-1 invisible"><ChevronLeft :size="18" /></button>
        <span class="text-sm font-bold text-gray-700 dark:text-gray-200 capitalize">
          {{ rightMonthLabel }}
        </span>
        <button
          type="button"
          @click.stop="nextMonth"
          class="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500 transition-all cursor-pointer active:scale-95"
        >
          <ChevronRight :size="18" />
        </button>
      </div>

      <div class="grid grid-cols-7 mb-2">
        <div
          v-for="day in daysOfWeek"
          :key="day"
          class="text-center text-xs font-medium text-gray-400"
        >
          {{ day }}
        </div>
      </div>

      <div class="grid grid-cols-7 gap-y-1" role="grid">
        <div
          v-for="(dayObj, idx) in rightCalendarDays"
          :key="idx"
          @mouseenter="dayObj.isCurrentMonth && handleDayEnter(dayObj.dateStr)"
          class="relative h-8 w-full flex items-center justify-center isolate"
        >
          <!-- Between Highlight Background -->
          <div
            v-if="
              dayObj.isCurrentMonth &&
              (isBetween(dayObj.dateStr) ||
                isRangeStart(dayObj.dateStr) ||
                isRangeEnd(dayObj.dateStr))
            "
            class="absolute inset-y-0 w-full bg-blue-50 dark:bg-blue-900/20 -z-10"
            :class="{
              'rounded-l-full': isRangeStart(dayObj.dateStr),
              'rounded-r-full': isRangeEnd(dayObj.dateStr),
            }"
          ></div>

          <button
            type="button"
            role="gridcell"
            @click.stop="dayObj.isCurrentMonth && selectDate(dayObj.dateStr)"
            tabindex="-1"
            class="h-8 w-8 text-xs rounded-full flex items-center justify-center transition-all z-10 border border-transparent"
            :class="[
              !dayObj.isCurrentMonth
                ? 'text-gray-300 dark:text-slate-600 cursor-default'
                : 'text-gray-700 dark:text-gray-200 cursor-pointer',
              dayObj.isCurrentMonth && isSelected(dayObj.dateStr)
                ? 'bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700 ring-2 ring-blue-500/20'
                : dayObj.isCurrentMonth
                  ? 'hover:border-blue-500/30'
                  : '',
              dayObj.isCurrentMonth && isToday(dayObj.dateStr) && !isSelected(dayObj.dateStr)
                ? 'ring-1 ring-blue-500 text-blue-600 font-bold'
                : '',
            ]"
          >
            {{ dayObj.day }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
