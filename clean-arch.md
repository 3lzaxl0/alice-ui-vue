# Clean Architecture Guide (Alice-UI Based)

> **Propósito de este documento**: Guía estándar de arquitectura Clean Architecture aplicada a proyectos que utilizan el design system **Alice-UI**. Sirve como referencia para el equipo y como **contexto de prompt** para asistentes de IA, garantizando consistencia en todos los módulos del sistema.

---

## 1. Visión General

La arquitectura busca separar las reglas de negocio de los detalles de implementación (Framework, API, UI). Las dependencias siempre apuntan hacia adentro, hacia el **dominio**.

```
src/
├── core/             ← Contratos y utilidades base (reutilizables)
├── features/         ← Módulos funcionales (módulos de negocio)
│   └── {feature_name}/
│       ├── data/             ← Implementación (API, Repositories)
│       ├── di/               ← Inyección de Dependencias
│       ├── domain/           ← Reglas de Negocio (Puro TS)
│       └── presentation/     ← UI (Vue Components, Composables)
└── shared/
    └── alice-ui/     ← Design System y componentes compartidos
```

---

## 2. El Contrato Base: `UseCase`

Todos los casos de uso deben seguir el contrato definido en `core/domain/use-case.ts`:

```typescript
export interface UseCase<Input, Output> {
  execute(param: Input): Promise<Output> | Output
}
```

---

## 3. Estructura de un Feature

Cada feature en `src/features/` debe seguir esta estructura interna:

```
{feature_name}/
├── data/
│   ├── datasources/
│   │   └── {entity}.remote.datasource.ts
│   └── repositories/
│       └── {entity}.repository.impl.ts
├── di/
│   └── {feature}.di.ts
├── domain/
│   ├── entities/
│   │   └── {entity}.model.ts
│   ├── repositories/
│   │   └── {entity}.repository.ts
│   └── usecases/
│       └── {action}-{entity}.usecase.ts
└── presentation/
    ├── components/    ← Componentes específicos del feature
    ├── composables/   ← Lógica de estado y orquestación
    ├── config/        ← Configuración de UI (columnas, filtros)
    └── views/         ← Páginas principales (enrutadas)
```

---

## 4. Definición de Capas

### 4.1 Dominio (`domain/`)
Es el corazón del feature. No depende de nada externo.

- **Entities**: Interfaces que definen los objetos de negocio.
- **Repositories (Interfaces)**: Contratos que definen qué datos se necesitan.
- **UseCases**: Clases que ejecutan una acción específica del negocio. Reciben el repositorio por constructor.

**Regla**: El código aquí debe ser TypeScript puro (sin imports de Vue o librerías de terceros).

### 4.2 Datos (`data/`)
Implementa los contratos del dominio.

- **DataSources**: Llamadas directas a la infraestructura (GraphQL, REST, LocalStorage).
- **Repository Implementation**: Orquesta los DataSources y mapea DTOs a entidades de dominio.

**Regla**: Los tipos de datos de la API (RemoteDTOs) se transforman en entidades de dominio antes de salir del repositorio.

### 4.3 Inyección de Dependencias (`di/`)
Único lugar donde se permite el uso de la palabra clave `new` para instanciar clases de la arquitectura.

```typescript
// {feature}.di.ts example
const dataSource = new EntityRemoteDataSource()
const repository = new EntityRepositoryImpl(dataSource)

export const actionUseCase = new ActionUseCase(repository)
```

### 4.4 Presentación (`presentation/`)
Capa de interacción con el usuario.

- **Composables**: Manejan el estado reactivo (`ref`, `computed`) e invocan a los UseCases del contenedor DI.
- **Views/Components**: Utilizan los componentes de **Alice-UI** (`AliceTable`, `AliceDialog`, etc.) y delegar lógica a los composables.

---

## 5. Sub-Features de Presentación

Para componentes de alta complejidad (ej: un detalle con múltiples pestañas y formularios), se permite crear una estructura dentro de `presentation/`.

```
presentation/
└── {sub_feature}/
    ├── components/
    ├── forms/
    └── use{SubFeature}.ts
```

**Criterios de uso**:
- Si el sub-feature **comparte** el repositorio y entidades del padre, se queda en `presentation/`.
- Si el sub-feature requiere **su propio repositorio o API**, se promueve a un feature independiente.

---

## 6. Convenciones de Nombrado

| Elemento | Convención | Ejemplo |
|---|---|---|
| Directorio de Feature | `snake_case` | `gestión_actas/` |
| Componente Vue | `PascalCase` con prefijo `Alice` o Feature | `AliceButton.vue`, `ActaDialog.vue` |
| Composable | `camelCase` con prefijo `use` | `useActas.ts` |
| Clase UseCase | `PascalCase` + `UseCase` | `GetActasUseCase` |
| Archivo UseCase | `kebab-case.usecase.ts` | `get-actas.usecase.ts` |
| Repository Impl | `{Name}RepositoryImpl` | `ActasRepositoryImpl.ts` |
| DataSource | `{Name}RemoteDataSource` | `ActasRemoteDataSource.ts` |

---

## 7. Reglas de Oro (Arquitectura Alice)

1. **Inversión de Dependencias**: Los componentes y composables dependen de interfaces (o instancias inyectadas), no de implementaciones concretas.
2. **No instanciación en UI**: Nunca hagas `new UseCase()` dentro de un componente o composable. Usa siempre el contenedor DI.
3. **Pureza del Dominio**: Si ves un `import { ref } from 'vue'` en la carpeta `domain/`, es un error de arquitectura.
4. **Mapeo de Datos**: La UI solo conoce entidades de dominio. Toda transformación de datos de API ocurre en la capa `data/`.
5. **Configuración de UI**: Las definiciones de columnas (`AliceTable`) o esquemas de validación van en `presentation/config/`.
6. **Alice-UI es agnóstico**: Los componentes de `shared/alice-ui` no deben importar nada de los `features/`. Se comunican mediante props y slots.
