# AliceLabel

Etiqueta de formulario simple, conectada con `cva` y totalmente agnóstica a su hijo. Simplemente envuelve el texto o slot que se le asigne con las directivas de tailwind necesarias para tener tamaño estándar de texto, color grisáceo de lectura base, o volverse rojo vibrante si se activa el modo error. Usado exhaustivamente por detrás en `AliceInput`, `AliceSelect` o invocable de manera independiente.

## Propiedades Clave

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `for` | `string` | `undefined` | ID del input HTML referenciado para enfocar automáticamente en clic. |
| `error` | `boolean` | `false` | Cambia la variante de color a rojo `text-red-500` denotando advertencia. |
| `disabled` | `boolean` | `false` | Baja la opacidad para comunicar deshabilitado junto al control. |
