<script setup lang="ts">
import { type Component, computed } from 'vue'
import AliceCard from '../Card/Card.vue'
import AliceBadge from '../Badge/Badge.vue'
import AliceDataList from '../DataList/DataList.vue'
import AliceIconInfo from '../IconInfo/IconInfo.vue'
import AliceDivider from '../Divider/Divider.vue'
import { CircleCheckBig } from 'lucide-vue-next'

defineOptions({
  name: 'AliceEntityCard',
})

const props = defineProps<{
  /** Título principal de la entidad (ej: Acta #123) */
  title: string
  /** Subtítulo (ej: Fecha de creación o ID corto) */
  subtitle?: string
  /** Texto del badge de estado principal */
  badgeLabel?: string
  /** Variante visual del badge */
  badgeVariant?:
    | 'emerald'
    | 'cyan'
    | 'indigo'
    | 'amber'
    | 'blue'
    | 'violet'
    | 'teal'
    | 'default'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'purple'
    | 'pink'
  /** Items para la lista de datos estructurados (label/value) */
  metadata?: { label: string; value: string | number | undefined | null }[]
  /** Items de información con icono (Solicitante, contacto, etc.) */
  infoItems?: {
    icon: Component | object
    label: string
    value: string | number | undefined | null
    variant?: 'default' | 'info' | 'success' | 'warning' | 'error'
  }[]
  /** Si la tarjeta puede ser seleccionada. Aplica estilos de hover y cursor */
  selectable?: boolean
  /** Si la tarjeta está actualmente seleccionada. Aplica anillos y bordes primarios */
  active?: boolean
  /** Texto para mostrar en un overlay completo sobre la tarjeta (usado para Anulados, Bloqueados) */
  overlayLabel?: string
  /** Variante visual del badge en el overlay */
  overlayVariant?: 'error' | 'warning' | 'info' | 'success' | 'default'
}>()

// Filter metadata to remove null/undefined values and ensure correct types for AliceDataList
const filteredMetadata = computed(() => {
  if (!props.metadata) return []
  return props.metadata
    .filter((m) => m.value !== null && m.value !== undefined)
    .map((m) => ({
      label: m.label,
      value: m.value as string | number,
    }))
})

// Clases computadas para comportamiento seleccionable
const interactiveClasses = computed(() => {
  const classes = []
  if (props.selectable) {
    classes.push('cursor-pointer transition-all duration-300 select-none')
  }

  if (props.active) {
    // We already have prominent classes in AliceCard for active state
    classes.push('border-primary-500! dark:border-primary-400!')
  } else if (props.selectable) {
    classes.push('hover:bg-gray-50/50 dark:hover:bg-white/5')
  }

  return classes.join(' ')
})

// Clases computadas para el fondo del overlay
const overlayBgClass = computed(() => {
  const map: Record<string, string> = {
    error: 'bg-error-50/70 dark:bg-error-950/60',
    warning: 'bg-warning-50/70 dark:bg-warning-950/60',
    info: 'bg-primary-50/70 dark:bg-primary-950/60',
    success: 'bg-success-50/70 dark:bg-success-950/60',
    default: 'bg-gray-50/70 dark:bg-slate-900/60',
  }
  return map[props.overlayVariant || 'default']
})
</script>

<template>
  <div class="relative h-full w-full">
    <AliceCard
      :title="title"
      :subtitle="subtitle"
      class="h-full w-full"
      :class="interactiveClasses"
      :aria-selected="active"
      :active="active"
    >
      <!-- Acciones de Cabecera (Badge por defecto) -->
      <template #action v-if="badgeLabel || $slots['header-action']">
        <slot name="header-action">
          <AliceBadge
            v-if="badgeLabel"
            :variant="(badgeVariant as any) || 'default'"
            :label="badgeLabel"
          />
        </slot>
      </template>

      <!-- Lista de Metadatos (CECO, Centro de Producción, Responsable, etc.) -->
      <div v-if="filteredMetadata.length > 0" class="mb-2">
        <AliceDataList :items="filteredMetadata" />
      </div>

      <!-- Divisoria automática si hay contenido inferior -->
      <AliceDivider
        v-if="filteredMetadata.length > 0 && (infoItems?.length || $slots.default)"
        variant="light"
        class="my-3"
      />

      <!-- Slot para contenido adicional personalizado -->
      <slot />

      <!-- Lista de Información con Iconos -->
      <div v-if="infoItems && infoItems.length > 0" class="flex flex-col gap-2 mt-2">
        <template v-for="(info, index) in infoItems" :key="index">
          <AliceIconInfo
            v-if="info.value"
            :icon="info.icon as Component"
            :label="info.label"
            :value="String(info.value)"
            :variant="info.variant || 'default'"
          />
        </template>
      </div>

      <!-- Footer para botones de acción (Aprobar, Rechazar, Ver detalles, etc.) -->
      <template #footer v-if="$slots.footer">
        <slot name="footer" />
      </template>
    </AliceCard>

    <!-- Indicador de Selección (Deseo del Usuario) -->
    <div
      v-if="active"
      class="absolute top-3 right-3 z-30 pointer-events-none"
    >
      <CircleCheckBig class="text-primary-600" />
    </div>

    <!-- Overlay de Estado (Anulado, Bloqueado, etc) -->
    <div
      v-if="overlayLabel"
      class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none rounded-inherit backdrop-blur-[1px]"
      :class="[overlayBgClass, 'rounded-[inherit]']"
    >
      <AliceBadge :label="overlayLabel" :variant="overlayVariant || 'default'" />
    </div>
  </div>
</template>
