import { mockTransactions } from "@/data/mockTransactions";
import type { FetchParams, FetchResult, Transaction } from "@/types/transaction";

function applyFilters(items: Transaction[], params: FetchParams): Transaction[] {
  const { filters } = params;

  return items.filter((transaccion) => {
    if (filters.search) {
      const busqueda = filters.search.toLowerCase();
      if (
        !transaccion.id.toLowerCase().includes(busqueda) &&
        !transaccion.description.toLowerCase().includes(busqueda) &&
        !transaccion.accountOrigin.toLowerCase().includes(busqueda) &&
        !transaccion.accountDestination.toLowerCase().includes(busqueda)
      ) return false;
    }
    if (filters.type && transaccion.type !== filters.type) return false;
    if (filters.status && transaccion.status !== filters.status) return false;
    if (filters.currency && transaccion.currency !== filters.currency) return false;
    if (filters.dateFrom && new Date(transaccion.date) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(transaccion.date) > new Date(filters.dateTo + "T23:59:59")) return false;
    if (filters.amountMin != null && transaccion.amount < filters.amountMin) return false;
    if (filters.amountMax != null && transaccion.amount > filters.amountMax) return false;

    return true;
  });
}

function applySort(items: Transaction[], params: FetchParams): Transaction[] {
  if (!params.sortField || !params.sortDirection) return items;

  const { sortField, sortDirection } = params;

  return [...items].sort((actual, siguiente) => {
    let diferencia: number;
    if (sortField === "date") {
      diferencia = new Date(actual.date).getTime() - new Date(siguiente.date).getTime();
    } else {
      const valorA = actual.type === "debit" ? -actual.amount : actual.amount;
      const valorB = siguiente.type === "debit" ? -siguiente.amount : siguiente.amount;
      diferencia = valorA - valorB;
    }
    return sortDirection === "desc" ? -diferencia : diferencia;
  });
}

function applyPage(items: Transaction[], params: FetchParams): Transaction[] {
  const start = (params.page - 1) * params.pageSize;
  return items.slice(start, start + params.pageSize);
}

export async function fetchTransactions(params: FetchParams): Promise<FetchResult> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (Math.random() < 0.1) {
    throw new Error("Error de conexión. Intente nuevamente.");
  }

  const filtered = applyFilters(mockTransactions, params);
  const sorted = applySort(filtered, params);
  const paged = applyPage(sorted, params);

  return {
    data: paged,
    total: filtered.length,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: Math.ceil(filtered.length / params.pageSize),
  };
}

export async function fetchAllForExport(params: FetchParams): Promise<Transaction[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (Math.random() < 0.1) {
    throw new Error("Error de conexión al exportar. Intente nuevamente.");
  }

  const filtered = applyFilters(mockTransactions, params);
  return applySort(filtered, params);
}