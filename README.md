<div align="center">

# 💳 Historial de Transacciones

**Módulo de consulta de movimientos para operadores bancarios**

![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-18181B?style=flat-square&logo=shadcnui&logoColor=white)

 [Instrucciones del desafío](./instructions.md)

</div>

---

## Descripción

Interfaz de consulta de transacciones para operadores internos de un banco digital. Permite buscar movimientos por múltiples criterios, navegar resultados paginados y exportar los datos filtrados a CSV.

Simula comunicación con un servidor mediante un delay de 600ms y errores aleatorios (10%) para representar condiciones reales de red.

---

## Inicio rápido

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

---

## Funcionalidades

### 📋 Tabla de transacciones

Vista principal con todas las transacciones. Cada fila muestra fecha, descripción, tipo, estado, monto formateado y cuenta origen enmascarada.

- Montos formateados con `Intl.NumberFormat` según la moneda
- Créditos con dato en color verde, débitos en rojo
- Transacciones fallidas con fila visiblemente diferente
- Tooltip al hover sobre la cuenta origen muestra origen y destino completos

### 🔍 Filtros

Barra de filtros con búsqueda por descripción (debounce 300ms), rango de fechas, tipo, estado, moneda y rango de monto. Botón para limpiar todos los filtros. Los filtros se sincronizan con la URL como query params.

### 📄 Paginación

Paginación simulada server-side con selector de filas por página (10, 25, 50). La preferencia de pageSize se persiste en `localStorage`.

### 📥 Exportar CSV

Descarga `movimientos-{fecha}.csv` con los registros filtrados. Headers en español, montos como números planos y moneda en columna separada. BOM incluido para compatibilidad con Excel.

### 🎨 Estados de UI

| Estado | Implementación |
|---|---|
| Primera carga | Skeleton loader que replica la estructura de la tabla |
| Carga posterior | Datos anteriores visibles mientras carga la nueva página |
| Error | Mensaje con botón para reintentar |
| Sin resultados | Mensaje contextual con opción de limpiar filtros |

---


## Stack

- **Next.js 14** — App Router
- **TypeScript** — tipado estricto sin `any`
- **Tailwind CSS** — estilos
- **shadcn/ui** — componentes base (New York, Zinc)