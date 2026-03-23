# AliceWelcome

Página dashboard con carácter heroico (Hero Banner superior con gradiente) e iterador automatizado de grilla horizontal (Tarjetas/Cards dinámicos que cambian de color). Fue diseñado principalmente para la vista "Home/Index" ni bien el usuario loggea y necesita un acceso rápido con iconos vistosos para decidir a dónde de los módulos habilitados dirigirse.

## Seteo Activo

El componente es altamente controlable a través de prop de datos `items`, delegando el ruteo enteramente a dependencias con Vue-Router e imposibilitando la carga de código HTML spaghetti en el Layout.

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `userName` | `string` | *(Req)* | Nombre inyectado al final del "Bienvenido, Name". |
| `items` | `WelcomeItem[]` | *(Req)* | Configuración masiva de módulos a empujar en el GRID inferior. |

### Configuración del WelcomeItem

Un grid item requiere:
```ts
{
  label: 'Registro',
  description: 'Aplica consumos y labores a cada campo',
  icon: ClipboardList,
  to: '/main/registro',
  color: 'success' // Colores válidos tailwind: 'emerald'|'cyan'|'indigo'|'amber'|'blue'|'violet'|'rose'|'teal'|'default'
}
```
