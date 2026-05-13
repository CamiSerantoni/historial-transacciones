import { mockTransactions } from "@/data/mockTransactions";
import type { FetchParams, FetchResult, Transaction } from "@/types/transaction";

function applyFilters(items: Transaction[], params: FetchParams): Transaction[] {
  const { filters } = params;

  return items.filter((tx) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !tx.id.toLowerCase().includes(q) &&
        !tx.description.toLowerCase().includes(q) &&
        !tx.accountOrigin.toLowerCase().includes(q) &&
        !tx.accountDestination.toLowerCase().includes(q)
      ) return false;
    }
    if (filters.type && tx.type !== filters.type) return false;
    if (filters.status && tx.status !== filters.status) return false;
    if (filters.currency && tx.currency !== filters.currency) return false;
    if (filters.dateFrom && new Date(tx.date) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(tx.date) > new Date(filters.dateTo + "T23:59:59")) return false;
    if (filters.amountMin != null && tx.amount < filters.amountMin) return false;
    if (filters.amountMax != null && tx.amount > filters.amountMax) return false;

    return true;
  });
}

function applySort(items: Transaction[], params: FetchParams): Transaction[] {
  if (!params.sortField || !params.sortDirection) return items;

  const { sortField, sortDirection } = params;

  return [...items].sort((a, b) => {
    const cmp = sortField === "date"
      ? new Date(a.date).getTime() - new Date(b.date).getTime()
      : a.amount - b.amount;
    return sortDirection === "desc" ? -cmp : cmp;
  });
}

function applyPage(items: Transaction[], params: FetchParams): Transaction[] {
  const start = (params.page - 1) * params.pageSize;
  return items.slice(start, start + params.pageSize);
}

export async function fetchTransactions(params: FetchParams): Promise<FetchResult> {
  await new Promise((r) => setTimeout(r, 600));

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
  await new Promise((r) => setTimeout(r, 300));

  if (Math.random() < 0.1) {
    throw new Error("Error de conexión al exportar. Intente nuevamente.");
  }

  const filtered = applyFilters(mockTransactions, params);
  return applySort(filtered, params);
}