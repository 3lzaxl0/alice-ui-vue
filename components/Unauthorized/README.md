# AliceUnauthorized / AliceUnderConstruction

Componentes ilustrativos hermanos (Full-Page o Component-Size) pensados para lidiar estéticamente con los estados vacíos y topes de usabilidad estructural. Ambos ofrecen una interfaz muy pulida e invitan (opcionalmente) a una acción redentora, previniendo pantallas blancas o errores 404 feos.

## Unauthorized (Acceso Bloqueado 403)

Visualmente muestra un Escudo y la notificación de permisos faltantes con estilo pulsante moderno. Perfecto para usarse bajo verificaciones de roles (`v-if="!canRead"`).

- **Props:** `title`, `message`, `showHome` (bool).
- **Emits:** `@logout` o `@go-home` forzando deslogueos proactivos al usuario bloqueado.

## UnderConstruction (WIP - Trabajo en Progreso)

De carácter más neutral. Un espacio con una herramienta de construcción en azul para reservar menús que aun no hemos programado pero que ya existen en el sidebar.

- **Props:** `title`, `message`.
- **Slots:** Puedes sobre-escribir `#icon` o inyectar debajo un layout en `#action`.
