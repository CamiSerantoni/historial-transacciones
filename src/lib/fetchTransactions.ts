import type { FetchParams, FetchResult, Transaction, TransactionFilters } from '@/types/transaction';
import { mockTransactions } from '@/data/mockTransactions';

function applyFilters(transactions: Transaction[], filters: TransactionFilters): Transaction[] {
  let filtered = [...transactions];

  if (filters.dateFrom) {
    const from = new Date(filters.dateFrom).getTime();
    filtered = filtered.filter((transaccion) => new Date(transaccion.date).getTime() >= from);
  }

  if (filters.dateTo) {
    const to = new Date(filters.dateTo + 'T23:59:59.999').getTime();
    filtered = filtered.filter((transaccion) => new Date(transaccion.date).getTime() <= to);
  }

  if (filters.type) {
    filtered = filtered.filter((transaccion) => transaccion.type === filters.type);
  }

  if (filters.status) {
    filtered = filtered.filter((transaccion) => transaccion.status === filters.status);
  }

  if (filters.currency) {
    filtered = filtered.filter((transaccion) => transaccion.currency === filters.currency);
  }

  if (filters.amountMin !== undefined) {
    filtered = filtered.filter((transaccion) => transaccion.amount >= filters.amountMin!);
  }

  if (filters.amountMax !== undefined) {
    filtered = filtered.filter((transaccion) => transaccion.amount <= filters.amountMax!);
  }

  if (filters.search) {
    const busqueda = filters.search.toLowerCase();
    filtered = filtered.filter((transaccion) =>
      transaccion.description.toLowerCase().includes(busqueda) ||
      transaccion.id.toLowerCase().includes(busqueda) ||
      transaccion.accountOrigin.toLowerCase().includes(busqueda) ||
      transaccion.accountDestination.toLowerCase().includes(busqueda)
    );
  }

  return filtered;
}

function applySorting(
  transactions: Transaction[],
  sortField?: 'date' | 'amount',
  sortDirection?: 'asc' | 'desc'
): Transaction[] {
  if (!sortField || !sortDirection) return transactions;

  return [...transactions].sort((actual, siguiente) => {
    let diferencia = 0;
    if (sortField === 'date') {
      diferencia = new Date(actual.date).getTime() - new Date(siguiente.date).getTime();
    } else if (sortField === 'amount') {
      const valorA = actual.type === 'debit' ? -actual.amount : actual.amount;
      const valorB = siguiente.type === 'debit' ? -siguiente.amount : siguiente.amount;
      diferencia = valorA - valorB;
    }
    return sortDirection === 'asc' ? diferencia : -diferencia;
  });
}

export function fetchTransactions(params: FetchParams): Promise<FetchResult> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.1) {
        reject(new Error('Error de conexión. Intente nuevamente.'));
        return;
      }

      const filtered = applyFilters(mockTransactions, params.filters);
      const sorted = applySorting(filtered, params.sortField, params.sortDirection);

      const total = sorted.length;
      const totalPages = Math.ceil(total / params.pageSize);
      const startIndex = (params.page - 1) * params.pageSize;
      const data = sorted.slice(startIndex, startIndex + params.pageSize);

      resolve({
        data,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages,
      });
    }, 600);
  });
}

export function fetchAllFilteredTransactions(filters: TransactionFilters): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.1) {
        reject(new Error('Error de conexión al exportar. Intente nuevamente.'));
        return;
      }
      const filtered = applyFilters(mockTransactions, filters);
      resolve(filtered);
    }, 300);
  });
}