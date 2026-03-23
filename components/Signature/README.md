# AliceSignature

Componente interactivo envoltorio de `<canvas>` preparado específicamente para captura web de rúbricas o firmas táctiles/mouse. Integrado perfectamente con Tailwind, reacciona y escala automáticamente su contenedor aunque siempre internamente provee una excelente interpolación de trazado curvo (Bezzie).

Expone públicamente (vía `ref`) métodos para recolectar la firma dibujada lista para enviar por APIs.

## Configuración Visual

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `penColor` | `string` | `'#0f172a'` | Color hexadecimal de la "tinta". |
| `guideLine` | `boolean` | `true` | Si muestra la línea punteada gris al medio de firma. |
| `label` | `string` | `undefined` | Texto aclaratorio arriba del cuadro. |

*(Nota: Aunque tiene props default `width`/`height` es altamente sugerido colocar este componente dentro de un bloque fluido css ya que escala internamente su ratio)*.

## Control Programático (Refs expuestas)

Al atar una ref a la etiqueta modal (`<AliceSignature ref="firmaRef" />`), tu `<script>` puede acceder remotamente a:

- `clear()`: Limpiar todo el estado de lienzo, útil luego de Guardar o si el usuario erró gravemente.
- `isEmpty`: (Ref interna) Booleano true si el lienzo aún está sin toques.
- `getSignatureImage()`: Devuelve el equivalente `Base64` tipo `image/png` del encuadre para inyectarlo directo a JSONs API o a imágenes en reportes PDF.
