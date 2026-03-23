# AliceSidebar

Este subdirectorio consolida la barra de navegación lateral principal tipo "Side Navigation Tree" del panel de control de Alice (`AliceSidebar`). 
Es el encargado de administrar visualmente qué rutas están disponibles o activas según permisos de sesión simulada. Maneja también lógicas responsivas (colapso y overlay móvil en pantallas chicas).

Normalmente no invocado por vistas interiores, sino exclusivo para uso maestro de Layout (`MainLayout.vue` o similares en arquitectura).

## Componentes Internos
- `Sidebar.vue`: El contenedor marco padre de la barra y panel deslizable.
- `SidebarItem.vue`: La representación visual modular (hijo) de una de las filas (Módulos o Sub-Menús) que puede tener profundidad jerárquica (Acordeones interactivos si tiene subItems).

## Configuración y Atajos

El control del Sidebar de Alice ocurre a nivel "Domain" o constante global inyectada en `/src/features/main/constants/navigation.ts`, el Sidebar simplemente lee dicha constante interactuando con los arrays dinámicamente.
