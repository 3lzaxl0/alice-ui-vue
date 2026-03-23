# AliceInput

Un campo de texto enriquecido que combina accesibilidad nativa y facilidades estructurales de UX, como iconos sufijo y prefijo para control de contraseña, e integración implícita con `AliceLabel` en la misma jerarquía.

## Atributos

Hereda orgánicamente casi todos los atributos estándar nativos de una etiqueta `<input>` tradicional HTML (ej. `placeholder`, `type`, `disabled`, `maxlength`). Adicionalmente implementa las siguientes propiedades de valor de ecosistema UX:

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `label` | `string` | `undefined` | Cadena mostrada encima del input para identificarlo. |
| `icon` | `Component` | `undefined` | Ícono visual que antecede al texto introducido. |
| `clearable` | `boolean` | `false` | Construye una pequeña "✖" al final del text para blanquarlo de inmediato (""). |

## Notas de Validación Numérica (Avanzada)

Al construir campos que pidan "números restringidos", por ejemplo números de DNI enteros, puedes pasar atributos nativos directamente.

```html
<AliceInput 
  type="text"
  inputmode="numeric"
  pattern="[0-9]*"
/>
```

## Ejemplo Rápido

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Key } from 'lucide-vue-next'
import { AliceInput } from '@shared/alice-ui'

const pw = ref('')
</script>

<template>
  <AliceInput 
    id="field_password"
    v-model="pw"
    type="password"
    label="Clave de acceso"
    :icon="Key"
    placeholder="Tu contraseña secreta"
    clearable
  />
</template>
```
