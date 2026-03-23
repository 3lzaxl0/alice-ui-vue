# AliceCheckbox

Control nativo estructurado de encendido/apagado o pertenencia binaria múltiple. Emula completamente un `<input type="checkbox">` pero con estilos consistentes, focus rings nativos de Tailwind, e incluye soporte para estado "Indeterminado" visual (una rayita central en vez del check "v", útil para seleccionar matrices padres donde sólo algunos hijos están seleccionados).

## Props Activas
- `modelValue` (boolean): Enlazable por `v-model`. 
- `indeterminate` (boolean): Si es verdadero fuercha el icono negativo "-".
- `disabled` (boolean).
- `id` (string): Altamente indispensable para atar junto con `AliceLabel`.

## Manejador

Emite un tradicional `@change(value)` a la par que el `@update:modelValue`.
