import type { ComponentDoc } from '@features/documentation/domain/entities/component-doc.entity'

export const dashboardLayoutMeta: ComponentDoc = {
  name: 'AliceDashboardLayout',
  description: 'Layout estructural completo para dashboards, que integra de forma automatizada barra lateral (Sidebar), cabecera de página (PageHeader), cuerpo con scroll independiente y sistema global de notificaciones (Toast).',
  category: 'Layout',
  props: [
    { name: 'sidebarTitle', type: 'string', default: '""', description: 'Título principal de la barra lateral.' },
    { name: 'userName', type: 'string', default: '""', description: 'Nombre de usuario a mostrar en el panel lateral.' },
    { name: 'headerTitle', type: 'string', default: '""', description: 'Título que se muestra en la cabecera.' },
    { name: 'headerDescription', type: 'string', default: '""', description: 'Descripción o subtítulo en la cabecera.' },
    { name: 'showThemeToggle', type: 'boolean', default: 'true', description: 'Muestra/oculta el interruptor de modo oscuro.' },
    { name: 'showLogout', type: 'boolean', default: 'true', description: 'Muestra/oculta el botón de cerrar sesión.' },
    { name: 'scrollable', type: 'boolean', default: 'false', description: 'Controla si el área de contenido principal tiene scroll vertical independiente.' },
  ],
  demoOptions: [
    { key: 'sidebarTitle', label: 'Sidebar Title', type: 'text', value: 'Alice Admin' },
    { key: 'userName', label: 'User Name', type: 'text', value: 'Administrador' },
    { key: 'headerTitle', label: 'Header Title', type: 'text', value: 'Panel Principal' },
    { key: 'headerDescription', label: 'Header Description', type: 'text', value: 'Resumen e indicadores clave de rendimiento.' },
    { key: 'showThemeToggle', label: 'Dark Mode Toggle', type: 'boolean', value: true },
    { key: 'scrollable', label: 'Content Scrollable', type: 'boolean', value: true },
  ],
  codeTemplate: (opts) => {
    return `<AliceDashboardLayout\n  sidebar-title="${opts.sidebarTitle || 'Alice Admin'}"\n  user-name="${opts.userName || 'Usuario'}"\n  header-title="${opts.headerTitle || 'Título'}"\n  header-description="${opts.headerDescription || 'Subtítulo'}"\n>\n  <template #sidebar>\n    <!-- Elementos del Sidebar -->\n  </template>\n  <!-- Contenido principal -->\n</AliceDashboardLayout>`
  },
  showcaseSections: [
    {
      title: 'Configuraciones de Visualización',
      items: [
        { label: 'Estructura Estándar de Panel', props: { sidebarTitle: 'Alice ERP', userName: 'Super User', headerTitle: 'Panel General', headerDescription: 'Vista de control central' } }
      ]
    }
  ]
}
