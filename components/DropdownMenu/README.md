# AliceDropdownMenu

Es el super-componente base para cajas estructuradas que despliegan opciones por clic, internamente utiliza listas `role="listbox"`, enfocado a emular la mecánica `<select>`. `AliceSelect` utiliza esta misma arquitectura visual subyacente. 

Está expuesto como componente aparte en caso necesite crear subvariantes compactas, pero usualmente, usarás `AliceSelect` directamente en lugar de instanciar crudo `DropdownMenu`. Existen dos "diseños": el regular en forma text-box, y el de modo "ghost" (transparente) muy usado internamente en las barras de tareas.

## Parámetros Relevantes
- `options`: Arrays de objetos con `{ label, value }`.
- `modelValue`: string o number enlazables.
- `design` (`'default' | 'ghost'`): El empaque visual que rodea al label.
- `size`: (`'sm' | 'md'`).
