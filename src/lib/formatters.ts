import type { Currency, TransactionStatus, TransactionType } from "@/types/transaction";

const currencyFmt: Record<Currency, (n: number) => string> = {
  USD: new Intl.NumberFormat("es-CL", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format,
  EUR: new Intl.NumberFormat("es-CL", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format,
  CLP: new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format,
  BTC: (n) => `\u20BF${n.toFixed(8)}`,
};

export function formatCurrency(amount: number, currency: Currency): string {
  return currencyFmt[currency](amount);
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

const statusMap: Record<TransactionStatus, string> = {
  completed: "Completada",
  pending: "Pendiente",
  failed: "Fallida",
};

export function statusLabel(s: TransactionStatus): string {
  return statusMap[s];
}

const typeMap: Record<TransactionType, string> = {
  credit: "Crédito",
  debit: "Débito",
};

export function typeLabel(t: TransactionType): string {
  return typeMap[t];
}