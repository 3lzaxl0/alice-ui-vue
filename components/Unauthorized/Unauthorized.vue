<script setup lang="ts">
import { ShieldAlert, LogOut, Home } from 'lucide-vue-next'
import AliceButton from '../Button/Button.vue'

defineOptions({
  name: 'AliceUnauthorized',
})

defineProps<{
  title?: string
  message?: string
  showHome?: boolean
}>()

const emit = defineEmits<{
  (e: 'logout'): void
  (e: 'go-home'): void
}>()
</script>

<template>
  <div class="flex items-center justify-center min-h-[400px] p-6 text-center">
    <div
      class="relative overflow-hidden bg-white/95 dark:bg-slate-900/95 border border-white/20 dark:border-white/10 p-10 md:p-14 rounded-[3rem] shadow-2xl max-w-lg w-full transition-all duration-500 animate-alice-dropdown"
    >
      <!-- Background Accents (Subtle) -->
      <div
        class="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl"
      ></div>

      <div class="relative z-10 flex flex-col items-center">
        <!-- Icon with Animation -->
        <div
          class="w-20 h-20 mb-8 rounded-full bg-rose-50 dark:bg-rose-900/40 flex items-center justify-center text-rose-500 shadow-alice-sm animate-pulse-subtle border border-rose-100 dark:border-rose-800/50"
        >
          <ShieldAlert :size="40" stroke-width="2.5" />
        </div>

        <h1
          class="text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight leading-tight"
        >
          {{ title || 'Acceso No Autorizado' }}
        </h1>

        <p class="text-slate-500 dark:text-slate-400 mb-10 text-lg font-light leading-relaxed">
          {{
            message ||
            'Lo sentimos, pero tu cuenta no tiene los roles necesarios para acceder a este sistema. Si crees que esto es un error, por favor contacta al administrador.'
          }}
        </p>

        <div class="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
          <AliceButton
            v-if="showHome"
            variant="ghost-subtle"
            @click="emit('go-home')"
            :icon="Home"
            :icon-size="18"
          >
            Volver al Inicio
          </AliceButton>

          <AliceButton
            variant="error"
            @click="emit('logout')"
            :icon="LogOut"
            :icon-size="18"
            class="group"
          >
            Cerrar Sesión
          </AliceButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-alice-dropdown {
  animation: alice-dropdown 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes pulse-subtle {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 3s ease-in-out infinite;
}
</style>
