# Clean Architecture — `pd_campo_web`

> **Propósito de este documento**: Guía canónica de la arquitectura Clean Architecture aplicada en esta aplicación Vue 3. Sirve tanto como referencia para el equipo como **prompt de contexto** para que la IA entienda los patrones establecidos y los reproduzca correctamente.

---

## 1. Visión General

La aplicación sigue **Clean Architecture** dentro de un monorepositorio Front-End. La idea central es que **las reglas de negocio (domain) no dependen de nada externo** — ni de Vue, ni de GraphQL, ni de componentes UI.

```
src/
├── core/             ← Contratos reutilizables en toda la app
├── features/         ← Módulos de negocio
│   ├── auth/
│   └── main/
│       ├── layouts/
│       ├── constants/
│       └── registro/          ← Namespace de tipo de registro
│           └── registro_campo/ ← Feature concreta
└── shared/
    └── alice-ui/     ← Design System / Componentes UI compartidos
```

---

## 2. El Contrato Raíz: `UseCase`

Todo caso de uso en la aplicación implementa esta interfaz ubicada en `src/core/domain/use-case.ts`:

```typescript
export interface UseCase<Input, Output> {
  execute(param: Input): Promise<Output> | Output
}
```

**Regla**: Cualquier clase que orqueste una operación de negocio **debe** implementar `UseCase<Input, Output>`. Esto garantiza que todos los casos de uso sean intercambiables, testeables, y que el DI container los pueda tratar uniformemente.

---

## 3. Estructura de un Feature Completo

Un feature vive en `src/features/main/<namespace>/<nombre_feature>/` y tiene **4 capas**:

```
registro_campo/
├── data/
│   ├── datasources/
│   │   └── registro.remote.datasource.ts
│   └── repositories/
│       └── registro.repository.impl.ts
├── di/
│   └── registro.di.ts
├── domain/
│   ├── entities/
│   │   ├── registro.model.ts
│   │   └── programacion.model.ts
│   ├── repositories/
│   │   └── registro.repository.ts
│   └── usecases/
│       ├── get-partes-abiertos.usecase.ts
│       ├── get-programas-abiertos.usecase.ts
│       ├── generar-partes-programacion.usecase.ts
│       └── anular-pd-cabs.usecase.ts
└── presentation/
    ├── components/
    │   ├── RegistroDialogAnular.vue
    │   ├── RegistroDialogDetalle.vue
    │   ├── RegistroDialogNuevo.vue
    │   └── RegistroDialogProgramacion.vue
    ├── composables/
    │   ├── useRegistro.ts
    │   ├── useRegistroDialogNuevo.ts
    │   └── useRegistroDialogProgramacion.ts
    ├── config/
    │   └── columns.ts
    └── views/
        └── RegistroView.vue
```

### Por qué este namespace (`registro/registro_campo`)?

El directorio `registro/` es el **namespace** para todos los tipos de registro de campo. Actualmente existe solo `registro_campo`, pero la estructura permite añadir futuros tipos sin conflicto:

```
registro/
├── registro_campo/   ← tipo: Parte Diario de Campo (implementado)
├── registro_riego/   ← tipo futuro
└── registro_cosecha/ ← tipo futuro
```

---

## 4. Las Cuatro Capas

### 4.1 Capa de Dominio (`domain/`)

**Regla crítica**: Esta capa NO IMPORTA nada de Vue, de la API, ni de alice-ui. Solo TypeScript puro.

#### Entidades (`domain/entities/`)

DTOs del negocio que la presentación consume. No tienen lógica.

```typescript
// registro.model.ts
export interface RegistroCabecera {
  idPdCab: number
  usrCreacion: string
  fechaNotificacion: string
  elemPep: string
  descripcionCampo: string
  codLabor: string
  descripcionLabor: string
  nroAplicacion: number
}

export interface RegistroFilter {
  fechaNotificacion: string
  idUser: string
  codUsr: string
}
```

#### Repositorio (interfaz) (`domain/repositories/`)

Define **qué** operaciones existen, sin decir **cómo** se ejecutan:

```typescript
export interface RegistroRepository {
  getPartesAbiertos(filter: RegistroFilter): Promise<RegistroCabecera[]>
  getProgramasAbiertos(filter: ProgramacionFilter): Promise<ProgramacionAbierta[]>
  generarPartesDesdeProgramacion(input: GenerarParteInput): Promise<boolean>
  anularPdCabs(ids: number[], usrAnulacion: string): Promise<boolean>
}
```

#### Casos de Uso (`domain/usecases/`)

Cada operación de negocio es una clase. Recibe el repositorio por constructor (inversión de dependencias):

```typescript
export class AnularPdCabsUseCase implements UseCase<AnularPdCabsInput, boolean> {
  constructor(private readonly repository: RegistroRepository) {}

  execute(input: AnularPdCabsInput): Promise<boolean> {
    return this.repository.anularPdCabs(input.ids, input.usrAnulacion)
  }
}
```

**Patrón de nombrado**: `<Verbo><Sustantivo>UseCase` en PascalCase, archivo en `kebab-case.usecase.ts`.

---

### 4.2 Capa de Datos (`data/`)

Implementa las interfaces del dominio. Aquí sí se tocan APIs, GraphQL, localStorage, etc.

#### DataSource Remoto (`data/datasources/`)

Hace las llamadas HTTP/GraphQL y devuelve DTOs crudos (los "Remote" types):

```typescript
const ANULAR_PD_CABS_MUTATION = `
  mutation AnularPdCabs($ids: [Int!]!, $usrAnulacion: String!) {
    anularPdCabs(ids: $ids, usrAnulacion: $usrAnulacion)
  }
`

export class RegistroRemoteDataSource {
  async anularPdCabs(ids: number[], usrAnulacion: string): Promise<boolean> {
    const data = await graphqlQuery<{ anularPdCabs: boolean }>(
      ANULAR_PD_CABS_MUTATION,
      { ids, usrAnulacion },
    )
    return !!data.anularPdCabs
  }
}
```

**Regla**: Los tipos `Remote*` se declaran aquí y NO salen de esta capa. Solo el mapeo los convierte a entidades de dominio.

#### Implementación del Repositorio (`data/repositories/`)

Conecta el DataSource con el dominio, haciendo el mapeo de DTOs:

```typescript
export class RegistroRepositoryImpl implements RegistroRepository {
  constructor(private readonly remoteDataSource: RegistroRemoteDataSource) {}

  async getPartesAbiertos(filter: RegistroFilter): Promise<RegistroCabecera[]> {
    const remote = await this.remoteDataSource.getPartesAbiertos(...)
    return remote.map(this.mapRegistroToDomain) // ← El mapeo ocurre aquí
  }

  private mapRegistroToDomain(remote: RemoteRegistroCabecera): RegistroCabecera {
    return { idPdCab: remote.idPdCab, ... }
  }
}
```

---

### 4.3 Capa de Inyección de Dependencias (`di/`)

Este archivo es el único lugar donde se construye el grafo de objetos. Nadie más hace `new Repository()` o `new UseCase()`.

```typescript
// registro.di.ts
const dataSource = new RegistroRemoteDataSource()
const repository = new RegistroRepositoryImpl(dataSource)

export const getPartesAbiertosUseCase = new GetPartesAbiertosUseCase(repository)
export const getProgramasAbiertosUseCase = new GetProgramasAbiertosUseCase(repository)
export const generarPartesUseCase = new GenerarPartesProgramacionUseCase(repository)
export const anularPdCabsUseCase = new AnularPdCabsUseCase(repository)
```

**Regla**: Los composables importan los use cases ya instanciados (`import { anularPdCabsUseCase } from '../../di/registro.di'`). **Nunca** hacen `new` directamente.

---

### 4.4 Capa de Presentación (`presentation/`)

ToDo lo que toca Vue, Tailwind, o alice-ui vive aquí.

#### `views/` — Vistas (páginas enrutadas)

Ensamblan todo. Solo deberían delegar lógica a composables:

```
RegistroView.vue ← Registrado en main.routes.ts como '/registro'
```

#### `composables/` — Lógica de UI (estado + llamadas a DI)

Contienen el estado reactivo (`ref`, `computed`) y llaman a los use cases del DI:

```typescript
// useRegistro.ts
import { getPartesAbiertosUseCase, anularPdCabsUseCase } from '../../di/registro.di'

export function useRegistro() {
  const registros = ref<RegistroCabecera[]>([])
  const isLoading = ref(false)
  // ... estado de diálogos, selección, etc.

  const fetchRegistros = async () => {
    registros.value = await getPartesAbiertosUseCase.execute({ ... })
  }

  return { registros, isLoading, fetchRegistros, ... }
}
```

**Convenio**: Un composable por "contexto de UI" (uno para la vista principal, uno por diálogo complejo).

#### `components/` — Dialogs y componentes reutilizables del feature

Dialogs y sub-componentes. No contienen lógica pesada (esa va en composables):

```
RegistroDialogAnular.vue      ← Confirmación de anulación
RegistroDialogDetalle.vue     ← Vista fullscreen de detalle (en desarrollo)
RegistroDialogNuevo.vue       ← Formulario de nuevo registro manual
RegistroDialogProgramacion.vue ← Tabla de programaciones para utilizar
```

#### `config/` — Configuración de UI

Configuración que es UI-específica y no pertenece a ninguna otra capa:

```typescript
// columns.ts — Definición de columnas para AliceTable
export function buildRegistroColumns(): Column<RegistroCabecera>[] { ... }
export function buildProgramacionColumns(): Column<ProgramacionAbierta>[] { ... }
```

**Regla**: Aquí va todo lo que es "configuración de cómo se ve", no lógica de negocio.

---

## 5. Diagrama de Dependencias

```
Presentation (Vue)
   │
   ├── imports use cases from ──→ di/ (DI Container)
   │                                    │
   │                                    └── creates ──→ data/ (Repository Impl)
   │                                                         │
   │                                                         └── calls ──→ data/ (DataSource)
   │
   └── uses types from ──→ domain/ (Entities)
                              ↑
                         data/ repositorio impl también satisface estas interfaces
```

**El dominio no sabe que Vue existe. Vue no sabe cómo funciona GraphQL.**

---

## 6. Sub-Features de Presentación

Un sub-feature **de presentación** es un módulo complejo dentro de `presentation/` que tiene su propia lógica interna pero **comparte el dominio y el DI** del feature padre.

### ¿Cuándo crear uno?

Cuando una sección del feature tiene complejidad suficiente como para tener:
- Su propio composable
- Múltiples componentes relacionados
- Lógica de estado propia (selección, pasos, formularios dinámicos)

### Ejemplo: Sub-feature `detalle/`

El detalle de un `RegistroCabecera` requiere su propio carrusel, formularios dinámicos y barra de acciones. Es demasiado para un solo componente, pero **no necesita su propio DataSource ni repositorio** porque consume datos ya cargados del feature padre.

```
presentation/
├── views/
│   └── RegistroView.vue
├── components/          ← Dialogs simples de la vista principal
├── composables/         ← Composables de la vista principal
├── config/              ← Columnas y configuración de UI
└── detalle/             ← Sub-feature de presentación
    ├── DetalleContent.vue         ← Orquestador principal
    ├── DetalleSummaryBar.vue      ← Barra de resumen (3 cols)
    ├── DetalleCarousel.vue        ← Carrusel de ítems de detalle
    ├── DetalleForm.vue            ← Router de formularios por tipo
    ├── forms/
    │   └── DefaultForm.vue        ← Formulario base/placeholder
    └── useDetalle.ts              ← Composable del sub-feature
```

### Reglas de los sub-features de presentación

1. **Pertenecen a `presentation/`** — No tienen `data/`, `domain/`, ni `di/` propios.
2. **Consumen el DI del padre** — Pueden importar use cases de `../../di/registro.di`.
3. **Se comunican con el padre vía props/emits** — El padre (ej. `RegistroDialogDetalle.vue`) pasa el `RegistroCabecera` como prop.
4. **Pueden tener composables propios** — `useDetalle.ts` maneja el estado interno.
5. **Promoverse a feature completo** — Si en el futuro necesita su propia API, se extrae de `presentation/` a una estructura `data/domain/di/presentation/` propia.

### Criterio de promoción a feature completo

| Condición | Sub-feature en `presentation/` | Feature completo |
|---|---|---|
| Tiene su propio endpoint de API | ✗ | ✓ |
| Solo consume datos del padre | ✓ | ✗ |
| Tiene entidades de dominio propias | ✗ | ✓ |
| Es reutilizado desde otros features | ✗ | ✓ |
| Solo tiene lógica de UI propia | ✓ | ✗ |

---

## 7. Añadir un Nuevo Feature — Checklist

Para añadir un feature nuevo (ej. `registro_riego`), seguir este orden:

```
1. domain/entities/          ← Definir interfaces de negocio
2. domain/repositories/      ← Definir la interfaz del repositorio
3. domain/usecases/          ← Implementar los casos de uso
4. data/datasources/         ← Implementar queries/mutations GraphQL
5. data/repositories/        ← Implementar el repositorio con mapeos
6. di/                       ← Ensamblar el grafo de dependencias
7. presentation/config/      ← Definir columnas, configuración de UI
8. presentation/composables/ ← Implementar lógica de UI
9. presentation/components/  ← Construir dialogs y componentes
10. presentation/views/      ← Construir la vista principal
11. main.routes.ts           ← Registrar la ruta
```

---

## 8. Convenciones de Nombrado

| Elemento | Convención | Ejemplo |
|---|---|---|
| Feature folder | `snake_case` | `registro_campo/` |
| Vue Component | `PascalCase` | `RegistroDialogAnular.vue` |
| Composable | `camelCase` con prefijo `use` | `useRegistro.ts` |
| UseCase class | `PascalCase` + sufijo `UseCase` | `AnularPdCabsUseCase` |
| UseCase file | `kebab-case` + `.usecase.ts` | `anular-pd-cabs.usecase.ts` |
| Repository interface | `PascalCase` + sufijo `Repository` | `RegistroRepository` |
| Repository impl | mismo + sufijo `Impl` | `RegistroRepositoryImpl` |
| DataSource | `PascalCase` + sufijo `RemoteDataSource` | `RegistroRemoteDataSource` |
| Remote DTO type | prefijo `Remote` + nombre | `RemoteRegistroCabecera` |
| DI file | `<feature>.di.ts` | `registro.di.ts` |
| Columns config | `build<Entity>Columns` function | `buildRegistroColumns()` |

---

## 9. Alice-UI y la Presentación

`@shared/alice-ui` es el Design System interno. La capa de presentación lo consume pero **nunca lo extiende desde dentro del feature**. Si un componente nuevo es reutilizable globalmente, se crea en `alice-ui/`.

### Componentes disponibles key

| Componente | Uso |
|---|---|
| `AliceDashboardLayout` | Layout principal con sidebar |
| `AliceTable` | Tablas con filtros, selección, paginación |
| `AliceDialog` | Modal base |
| `AlicePanel` | Contenedor con header coloreado |
| `AliceContainer` | Card simple con border/shadow configurable |
| `AliceGrid` | Grid CSS responsive |
| `AliceButton` | Botón con variants/designs/icons |
| `AliceToast` / `useAliceToast` | Notificaciones |
| `AliceEntityCard` | Card de entidad con metadata/badges |

### Pending: `AliceCarousel`

Un componente de carrusel horizontal está planificado para soportar el sub-feature `detalle/`. Debe vivir en `alice-ui/components/Carousel/` y exportarse desde `alice-ui/index.ts`.

---

## 10. Reglas Absolutas

1. **El dominio nunca importa Vue** — ni `ref`, ni `computed`, ni componentes.
2. **Los composables nunca hacen `new`** — solo importan del DI.
3. **El DI es el único lugar con `new`** — un archivo por feature.
4. **Los Remote DTOs no salen del DataSource** — el mapeo es responsabilidad del `RepositoryImpl`.
5. **La config de UI (columns, etc.) va en `presentation/config/`** — no en `di/`.
6. **Los sub-features viven en `presentation/<nombre>/`** — solo si no necesitan `data/domain/di` propios.
7. **Un feature nuevo no reutiliza el `di/` de otro** — cada feature tiene su propio grafo de dependencias.
