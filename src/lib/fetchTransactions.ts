import { mockTransactions } from "@/data/mockTransactions";
import type { FetchParams, FetchResult, Transaction } from "@/types/transaction";

function applyFilters(items: Transaction[], params: FetchParams): Transaction[] {
  const { filters } = params;

  return items.filter((tx) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        tx.id.toLowerCase().includes(q) ||
        tx.description.toLowerCase().includes(q) ||
        tx.accountOrigin.toLowerCase().includes(q) ||
        tx.accountDestination.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filters.type && tx.type !== filters.type) return false;
    if (filters.status && tx.status !== filters.status) return false;
    if (filters.currency && tx.currency !== filters.currency) return false;
    if (filters.dateFrom && tx.date < filters.dateFrom) return false;
    if (filters.dateTo && tx.date > filters.dateTo) return false;
    if (filters.amountMin != null && tx.amount < filters.amountMin) return false;
    if (filters.amountMax != null && tx.amount > filters.amountMax) return false;

    return true;
  });
}

function applySort(items: Transaction[], params: FetchParams): Transaction[] {
  if (!params.sortField || !params.sortDirection) return items;

  const { sortField, sortDirection } = params;

  return [...items].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    let cmp: number;
    if (typeof valA === "string" && typeof valB === "string") {
      cmp = valA.localeCompare(valB);
    } else {
      cmp = (valA as number) - (valB as number);
    }
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
    throw new Error("Error de conexión. Intenta nuevamente.");
  }

  const filtered = applyFilters(mockTransactions, params);
  const sorted = applySort(filtered, params);
  const paged = applyPage(sorted, params);

  return {
    items: paged,
    total: filtered.length,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: Math.ceil(filtered.length / params.pageSize),
  };
}

export async function fetchAllForExport(params: FetchParams): Promise<Transaction[]> {
  await new Promise((r) => setTimeout(r, 300));
  const filtered = applyFilters(mockTransactions, params);
  return applySort(filtered, params);
}