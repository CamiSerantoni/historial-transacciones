### Contexto

Debes construir el módulo de historial de transacciones que usan los operadores internos de un banco digital para revisar los movimientos de las cuentas de clientes.

---

### Entrega esperada

- Repositorio en GitHub con README
- App corriendo con `npm run dev`
- Guardar este archivo en la raiz del repositorio con el nombre de instructions.md

---

### Datos mock

Debes crear un archivo que simule la respuesta de un servidor. Cada transacción debe tener esta forma:

```typescript
type Currency = 'USD' | 'EUR' | 'CLP' | 'BTC'
type TransactionType = 'credit' | 'debit'
type TransactionStatus = 'completed' | 'pending' | 'failed'

interface Transaction {
  id: string
  date: string             // ISO 8601
  description: string
  type: TransactionType
  status: TransactionStatus
  amount: number
  currency: Currency
  accountOrigin: string
  accountDestination: string
}
```

Genera al menos 200 registros variados para que la paginación y los filtros tengan sentido.

---

### Requerimientos funcionales

#### Tabla principal

- Mostrar columnas: fecha, descripción, tipo, estado, monto con moneda, cuenta origen
- El monto debe mostrarse formateado según la moneda usando `Intl.NumberFormat`:
  - USD/EUR → símbolo y 2 decimales → `$1,234.56`
  - CLP → sin decimales → `$1.234`
  - BTC → 8 decimales → `₿0.00123456`
- Las filas de tipo `debit` deben mostrar el monto en rojo, `credit` en verde
- Las filas con estado `failed` deben tener un estilo visual diferenciado

#### Filtros

- Rango de fechas: desde / hasta
- Tipo: crédito / débito / todos
- Estado: completed / pending / failed / todos
- Moneda: USD / EUR / CLP / BTC / todas
- Monto mínimo y máximo
- Búsqueda por descripción (debounce de 300ms)
- Botón para limpiar todos los filtros a la vez
- Los filtros deben reflejarse en la URL como query params

#### Paginación server-side simulada

La función que simula el servidor debe recibir los filtros y página, y retornar solo el slice correspondiente:

```typescript
interface FetchParams {
  page: number
  pageSize: number
  filters: {
    dateFrom?: string
    dateTo?: string
    type?: TransactionType
    status?: TransactionStatus
    currency?: Currency
    amountMin?: number
    amountMax?: number
    search?: string
  }
}

interface FetchResult {
  data: Transaction[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
```

- Opciones de page size: 10, 25, 50
- Simular un delay de 600ms con `setTimeout`
- Simular errores aleatorios un 10% de las veces

#### Exportar CSV

- Exportar solo los registros que coinciden con los filtros activos
- El archivo debe llamarse `movimientos-{fecha-actual}.csv`
- Las columnas deben tener headers en español
- Los montos en el CSV deben ser números planos, la moneda en columna separada

---

### Requerimientos técnicos

- React + TypeScript sin `any`
- Manejo del estado de filtros con `useReducer` o estado centralizado
- Custom hook `useTransactions` que encapsule toda la lógica de fetching, paginación y filtros
- Skeleton loaders mientras carga (no spinner genérico)
- Estado de error con opción de reintentar la petición
- Estado vacío con mensaje cuando no hay resultados
- Filtros sincronizados con la URL usando `URLSearchParams`

---

### Criterios de evaluación

| Criterio 
|---
| Funcionamiento correcto de filtros y paginación 
| Calidad del tipado TypeScript 
| Arquitectura y organización del código 
| UX: skeletons, errores, vacío, feedback visual 
| Exportación CSV correcta 

---

### Bonus (opcional pero valorado)

- Columna con tooltip que muestra cuenta destino al hacer hover
- Ordenamiento por columna (fecha, monto) manteniendo los filtros activos
- Persistir el pageSize seleccionado en `localStorage`

---

Una vez finalizado, por favor compártenos el enlace a tu repositorio de GitHub.

Si tienes alguna duda sobre los requerimientos, no dudes en escribirnos.

¡Mucho éxito!
