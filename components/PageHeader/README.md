# AlicePageHeader

Componente utilitario puramente visual que estandariza los empaques de título y descripción en la parte superior de todas las vistas del sistema.

Roba aproximadamente 28px de icono para la cabecera (en azul/primario), seguido de un `h1` muy grande de letra bold gris oscura y una pequeña descripción muteada por debajo.

## Ejemplo Básico

```vue
<script setup lang="ts">
import { ComponentIcon } from 'lucide-vue-next'
import { AlicePageHeader } from '@shared/alice-ui'
</script>

<template>
  <AlicePageHeader 
    title="Panel Maestro de Usuarios"
    description="Administre todos los accesos, contraseñas y permisos del entorno aquí."
    :icon="ComponentIcon"
  />
</template>
```
