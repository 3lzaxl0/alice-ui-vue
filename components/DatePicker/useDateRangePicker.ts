import { ref, computed } from 'vue'

export function useDateRangePicker(
  props: {
    modelValue: [string, string] | null
    displayFormat: string
  },
  emit: {
    (e: 'update:modelValue', value: [string, string] | null): void
  },
) {
  const isOpen = ref(false)
  const containerRef = ref<HTMLElement | null>(null)

  const formatSegment = (isoDate: string) => {
    if (!isoDate) return ''
    const [year, month, day] = isoDate.split('-')
    if (props.displayFormat === 'DD/MM/YYYY') {
      return `${day}/${month}/${year}`
    }
    return isoDate
  }

  const displayText = computed(() => {
    if (!props.modelValue || !props.modelValue[0] || !props.modelValue[1]) {
      return ''
    }
    const start = formatSegment(props.modelValue[0])
    const end = formatSegment(props.modelValue[1])
    return `${start} - ${end}`
  })

  // Calendar Selection Handler
  function selectRange(val: [string, string] | null) {
    emit('update:modelValue', val)
    if (val && val[0] && val[1]) {
      isOpen.value = false // Close automatically when full range is selected
    }
  }

  function clearRange() {
    emit('update:modelValue', null)
    isOpen.value = false
  }

  function toggleCalendar() {
    isOpen.value = !isOpen.value
  }

  function handleClickOutside(event: MouseEvent) {
    if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
      isOpen.value = false
    }
  }

  // Handle manual typing via keyboard (simplified format: ddmmyyyyddmmyyyy) could be added,
  // but for ranges, read-only click-to-open is much more robust for accessibility initially
  // We'll treat the input as readonly to force calendar usage for ranges.

  return {
    isOpen,
    containerRef,
    displayText,
    selectRange,
    clearRange,
    toggleCalendar,
    handleClickOutside,
  }
}
