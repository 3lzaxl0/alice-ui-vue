# AliceMultiSelect

Evolución natural del `AliceDropdownMenu` adaptado para elegir **múltiples ítems de manera simultánea**. Su modelo reactivo requiere un array de IDs/valores y devuelve el arreglo actualizado a medida que el usuario marca o desmarca los `AliceCheckbox` generados internamente por cada opción.

Trae incorporado funciones UX de alto valor como: atajo para limpiar toda la selección y un conmutador nativo de "Seleccionar Todos". Se conecta también al ciclo de vida del `AliceFilterPanel`.

## Props Soportadas

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `v-model` | `(string \| number)[]` | `[]` | Matriz reactiva para las selecciones hechas. |
| `options` | `{ label: string, value: any }[]` | `[]` | Arreglo de opciones (diccionario). |
| `enableSelectAll` | `boolean` | `false` | Si activar la visibilidad del botón "Seleccionar todos". |
| `label` y `placeholder` | `string` | `Seleccionar...` | Textos guía para inputs. |

## Ejemplo
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AliceMultiSelect } from '@shared/alice-ui'

const rolesAplicados = ref<string[]>(['ADMIN'])
</script>

<template>
  <AliceMultiSelect 
    id="selector_roles"
    v-model="rolesAplicados"
    label="Módulos Asignados"
    enable-select-all
    :options="[
      { label: 'Administrador', value: 'ADMIN' },
      { label: 'Visor Básico', value: 'VISITOR' },
    ]"
  />
</template>
```
