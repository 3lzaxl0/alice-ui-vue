# `AliceGrid`

El componente `AliceGrid` es la solución estándar de Alice-UI para manejar layouts de rejilla responsiva (50/50, 33/33, etc.). Su principal ventaja sobre el `grid` de Tailwind estándar es que utiliza internamente una técnica de **aislamiento de ancho** para evitar que contenidos largos (como textos sin truncar) estiren las celdas más allá de su proporción asignada.

## Características

- **Diseño Responsivo**: Soporta breakpoints independientes (`sm`, `md`, `lg`, `xl`).
- **Control de Contenido**: Implementa `minmax(0, 1fr)` para garantizar que las columnas respeten el espacio y permitan el truncado de sus hijos.
- **Alineación Flexible**: Control de alineación vertical de los elementos (`itemsAlign`).

## Props

| Prop         | Tipo             | Default   | Descripción                                      |
| ------------ | ---------------- | --------- | ------------------------------------------------ |
| `cols`       | `number\|string` | `1`       | Columnas base (móvil).                           |
| `smCols`     | `number\|string` | -         | Columnas en breakpoint `sm`.                     |
| `mdCols`     | `number\|string` | -         | Columnas en breakpoint `md`.                     |
| `lgCols`     | `number\|string` | -         | Columnas en breakpoint `lg`.                     |
| `xlCols`     | `number\|string` | -         | Columnas en breakpoint `xl`.                     |
| `gap`        | `string`         | `'md'`    | Espaciado (`none`, `xs`, `sm`, `md`, `lg`, `xl`).|
| `itemsAlign` | `string`         | `'stretch'`| Alineación vertical (`start`, `center`, `end`, `stretch`).|

## Uso Básico

```vue
<AliceGrid cols="1" mdCols="2" gap="lg">
  <div class="p-4 bg-blue-50">Columna 1 (50%)</div>
  <div class="p-4 bg-emerald-50">Columna 2 (50%)</div>
</AliceGrid>
```

## Prevención de Desbordamiento

A diferencia de un `grid` manual donde un texto largo puede empujar el diseño, `AliceGrid` obliga al contenido a truncarse si sus hijos tienen habilitado el truncado:

```vue
<AliceGrid cols="1" mdCols="2">
  <!-- Este contenido largo NO estirará la columna de la izquierda -->
  <div class="truncate">
    Texto extremadamente largo que normalmente rompería el 50/50...
  </div>
  <div>Contenido normal</div>
</AliceGrid>
```
