# AliceSearchInput

Un Combobox (Input de texto enriquecido con búsqueda) superpoderoso, diseñado para conectarse con APIs o motores locales de listado de miles de elementos donde `<select>` pierde rendimiento.

Mientras escribes emite un evento `@search` hacia ti (el padre) para que puedas filtrar el array asíncronamente (ej. de DB o de VUEX/Pinia). A la vez, expone visualmente un componente flotante (estilo Typeahead) en el que subraya textualmente aquellos párrafos o letras (highlights algorítmicos) que están logrando coincidir.

## Props Destacadas

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `v-model` | `Result \| null` | `null` | El OBJETO RESULT seleccionado resultante total. |
| `results` | `Result[]` | `[]` | La matriz que tu buscador (padre) le retorna para mostrar al usuario a partir de su último Query. |
| `loading` | `boolean` | `false` | Modifica el icono de la lupa por un loader giratorio en caso tu petición asíncrona a "backend" esté pendiente. |
| `label` | `string` | `undefined` | Etiqueta en formato formulario `AliceLabel`. |

### Estructura del Result (Array Options)

Los objetos que devuelvas desde tu `search` y asocies a `results` deben verse abstractamente así:
```ts
{
   label: 'Mi Resultado Visible', 
   value: 29314, // el ID final
   description: 'Una descripción secundaria mostrada abajo' (Opcional),
   labelIndices: [0, 1] // Para colorear/subrayar "Mi" si el query es "Mi" (Opcional)
}
```

## Ejemplo Simplificado

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AliceSearchInput } from '@shared/alice-ui'

const seleccionado = ref(null)
const mockResults = ref([])
const spin = ref(false)

function onBuscarRemoto(query: string) {
  spin.value = true
  setTimeout(() => { // Mock Simulacro API
    mockResults.value = [{ label: query + ' - Resultado A', value: 1 }]
    spin.value = false
  }, 400)
}
</script>

<template>
  <AliceSearchInput 
    id="buscador_sap"
    label="Ingreso de Material"
    v-model="seleccionado"
    :results="mockResults"
    :loading="spin"
    @search="onBuscarRemoto"
    placeholder="Escribe el codigo del material SAP..."
  />
</template>
```
