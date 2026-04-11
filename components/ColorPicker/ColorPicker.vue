<script setup lang="ts">
import { ref, watch, computed, inject } from 'vue'
import { RotateCcw, Hash, Check } from 'lucide-vue-next'
import { useTheme } from '../../composables/useTheme'
import AlicePopover from '../Popover/Popover.vue'
import AliceButton from '../Button/Button.vue'
import AliceInput from '../Input/Input.vue'
import { cva, type VariantProps } from 'class-variance-authority'

const colorPickerVariants = cva(
  'group relative flex items-center gap-3 px-3 py-2.5 transition-all duration-300 outline-none select-none cursor-pointer overflow-hidden rounded-xl shrink-0 focus:outline-none focus:ring-0',
  {
    variants: {
      active: {
        true: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
        false: 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10',
      },
      variant: {
        sidebar: 'w-full',
        button: 'px-4 py-2 w-auto border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm',
      }
    },
    defaultVariants: {
      active: false,
      variant: 'sidebar',
    }
  }
)

type ColorPickerProps = VariantProps<typeof colorPickerVariants>

interface ColorPreset {
  hex: string
  name: string
  type: 'vibrant' | 'pastel'
}

interface Props {
  variant?: ColorPickerProps['variant']
  expanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'sidebar',
  expanded: undefined,
})

const emit = defineEmits<{
  (e: 'open-change', open: boolean): void
}>()

const { primaryColor, setPrimaryColor, resetPrimaryColor } = useTheme()
const injectedExpanded = inject('alice-sidebar-expanded', { value: false })
const isExpanded = computed(() => props.expanded ?? injectedExpanded.value)

const internalHex = ref(primaryColor.value.replace('#', ''))
watch(primaryColor, (newV) => {
  internalHex.value = newV.replace('#', '')
})

const handleHexUpdate = (val: string | number) => {
  const cleanHex = String(val).replace('#', '')
  internalHex.value = cleanHex
  if (cleanHex.length === 3 || cleanHex.length === 6) {
    setPrimaryColor(`#${cleanHex}`)
  }
}

const presets: ColorPreset[] = [
  // Vibrant Group
  { hex: '#3b82f6', name: 'Blue', type: 'vibrant' },
  { hex: '#10b981', name: 'Emerald', type: 'vibrant' },
  { hex: '#f59e0b', name: 'Amber', type: 'vibrant' },
  { hex: '#f43f5e', name: 'Rose', type: 'vibrant' },
  { hex: '#6366f1', name: 'Indigo', type: 'vibrant' },
  { hex: '#8b5cf6', name: 'Violet', type: 'vibrant' },
  { hex: '#475569', name: 'Slate', type: 'vibrant' },
  // Pastel Group
  { hex: '#93c5fd', name: 'Sky', type: 'pastel' },
  { hex: '#4ade80', name: 'Mint', type: 'pastel' },
  { hex: '#fcd34d', name: 'Peach', type: 'pastel' },
  { hex: '#fecdd3', name: 'Soft Pink', type: 'pastel' },
  { hex: '#c7d2fe', name: 'Lavender', type: 'pastel' },
  { hex: '#ddd6fe', name: 'Soft Purple', type: 'pastel' },
  { hex: '#cbd5e1', name: 'Soft Gray', type: 'pastel' },
]

const vibrants = computed(() => presets.filter(p => p.type === 'vibrant'))
const pastels = computed(() => presets.filter(p => p.type === 'pastel'))

const colorIndicatorStyle = computed(() => ({
  backgroundColor: primaryColor.value,
  boxShadow: `0 0 12px ${primaryColor.value}40`
}))

defineOptions({
  name: 'AliceColorPicker',
})
</script>

<template>
  <AlicePopover
    placement="bottom-right"
    teleport
    mobile-fullscreen
    :close-on-click="false"
    @update:modelValue="(val) => emit('open-change', val)"
  >
    <template #trigger="{ open }">
      <button :class="colorPickerVariants({ variant, active: open })" title="Personalizar Color Primario">
        <div class="flex items-center gap-2 transition-transform duration-300 ease-out group-hover:scale-[1.03] origin-left">
          <!-- Color Dot Indicator -->
          <div
            class="shrink-0 flex items-center justify-center w-6 h-6 rounded-lg border border-white/20 shadow-sm overflow-hidden transition-all duration-500"
            :style="colorIndicatorStyle"
          >
          </div>

          <!-- Label (Sidebar variant) -->
          <span
            class="whitespace-nowrap font-medium text-sm transition-all duration-300 origin-left"
            :class="[
              isExpanded || variant === 'button'
                ? 'opacity-100 translate-x-0 w-auto'
                : 'opacity-0 -translate-x-4 w-0 overflow-hidden',
            ]"
          >
            Color Primario
          </span>
        </div>

        <!-- Nothing-style Dot Decoration -->
        <div
          v-if="variant === 'sidebar'"
          class="ml-auto w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors"
          :class="[
            isExpanded ? 'opacity-100' : 'opacity-0',
            open ? 'bg-primary-500' : 'group-hover:bg-primary-500'
          ]"
        ></div>
      </button>
    </template>

    <div class="p-4 flex flex-col gap-6 w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-alice-lg border border-gray-100 dark:border-white/5 shadow-alice-panel overflow-hidden relative select-none">
      <!-- Background Matrix -->
      <div class="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
           style="background-image: radial-gradient(#000 1px, transparent 0); background-size: 8px 8px;"></div>

      <div class="flex items-center justify-end relative z-10">
        <AliceButton
          variant="primary" design="ghost-subtle"
          expanded @click="resetPrimaryColor"
          :icon="RotateCcw"
        >
          Reestablecer
        </AliceButton>
      </div>

      <!-- Color Grid Sections -->
      <div class="flex flex-col gap-4 relative z-10">
        <!-- Vibrants -->
        <div class="space-y-2">
          <div class="grid grid-cols-7 gap-2">
            <button
              v-for="color in vibrants"
              :key="color.hex"
              @click="setPrimaryColor(color.hex)"
              class="relative w-7 h-7 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 group/color"
              :style="{ backgroundColor: color.hex }"
            >
              <Check
                v-if="primaryColor.toLowerCase() === color.hex.toLowerCase()"
                class="absolute inset-0 m-auto text-white mix-blend-difference"
                :size="14"
              />
              <!-- Hover Tooltip/Ring -->
              <div class="absolute -inset-1 rounded-full border border-primary-500/0 group-hover/color:border-primary-500/50 transition-colors"></div>
            </button>
          </div>
        </div>

        <!-- Pastels -->
        <div class="space-y-2">
          <div class="grid grid-cols-7 gap-2">
            <button
              v-for="color in pastels"
              :key="color.hex"
              @click="setPrimaryColor(color.hex)"
              class="relative w-7 h-7 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 group/color"
              :style="{ backgroundColor: color.hex }"
            >
              <Check
                v-if="primaryColor.toLowerCase() === color.hex.toLowerCase()"
                class="absolute inset-0 m-auto text-white mix-blend-difference"
                :size="14"
              />
              <div class="absolute -inset-1 rounded-full border border-primary-500/0 group-hover/color:border-primary-500/30 transition-colors"></div>
            </button>
          </div>
        </div>
      </div>

      <!-- Hex Input & Preview -->
      <div class="relative z-10 flex flex-col gap-3 pt-2 border-t border-gray-100 dark:border-white/5">
        <AliceInput
          id="color-hex-input"
          v-model="internalHex"
          @update:modelValue="handleHexUpdate"
          placeholder="000000"
          :icon="Hash"
          size="sm"
        />

        <!-- Preview Bar -->
        <div class="h-1 w-full rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
           <div class="h-full transition-all duration-500" :style="{ width: '100%', backgroundColor: primaryColor }"></div>
        </div>
      </div>
    </div>
  </AlicePopover>
</template>
