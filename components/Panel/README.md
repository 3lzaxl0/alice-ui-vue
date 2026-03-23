# AlicePanel

Contenedor tipo "Card" modular. Posee una cabecera nativa coloreada según una variante visual temática, donde encaja a la perfección con iconos y subtítulos. 

Abrazará cualquier contenido con su Slot `#default` y le pondrá borde redondeado e intercalar fondos semi-transparentes o grises, dependiendo de resoluciones de pantalla y Dark Mode.

## Opciones Configurales (Props)

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `title` | `string` | *(Req)* | Título principal de la tarjeta. |
| `variant` | `'primary'\|'success'\|'warning'\|'error'\|'info'\|'gray'` | `'primary'` | La coloración del Header preensamblado. |
| `description` | `string` | `undefined` | Texto aclaratorio o minúsculo bajo el título principal. |
| `bodyPadding` | `string` | `'p-0'` | Utilidad libre de Tailwind inyectada a la caja contenedora por si desea padding (ej `'p-4'`). |
| `icon` | `Component` | `undefined` | Iconografía Lucide en el título principal. |
