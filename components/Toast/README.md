# AliceToast

Sistema de notificaciones emergentes (Snackbars) no bloqueantes que aparecen en la parte inferior derecha de la pantalla. No recibe sus props de un ancestro visual, sino que escucha un almacén/composable reactivo (`useToast()`). Esto significa que puedes disparar un "Toast" desde absolutamente cualquier lugar profundo de la lógica (ej. try/catch de un fetcher Axios).

## Invocación base

Para utilizarlo necesitas importar el composable utilitario en tu script. El componente `<AliceToast />` en este framework asume que ya está renderizado en el lugar más alto del DOM (ej. en `MainLayout` o `App.vue`).

```ts
import { useToast } from '@shared/alice-ui/components/Toast/useToast'

const { add } = useToast()

// Disparador genérico:
function miAccionExitosa() {
  add({
    type: 'success', // 'success' | 'warning' | 'error' | 'info'
    title: 'Operación Completada',
    message: 'Los datos fueron sincronizados con SAP.'
  })
}
```
