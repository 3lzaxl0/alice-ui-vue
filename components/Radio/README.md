# AliceRadio

Componente simple que simula el `<input type="radio">` de HTML para seleccionar una única variable dentro de un grupo excluyente. Internamente se conecta reactivamente usando `v-model` con `boolean` o valores comparables.

En Alice el Radio viene pre-construido con unas amigables transiciones de foco "Ring" y colores primarios azulados cuando es pulsado.

## Atributos Básicos
- `modelValue` (boolean): Activo o desactivo directamente controlado.
- `disabled` (boolean): Bloquea interacciones.
- `id` (string): Vinculación necesaria para que un label actúe de clic secundario.

A la par de actualizar su prop reactiva por modelo, generará un evento natural nativo `@change` para encadenar efectos. Usado en listas pequeñas o formularios muy específicos.
