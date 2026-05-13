import type { Currency, TransactionStatus, TransactionType } from "@/types/transaction";

const currencyFmt: Record<Currency, (monto: number) => string> = {
  USD: new Intl.NumberFormat("es-CL", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format,
  EUR: new Intl.NumberFormat("es-CL", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format,
  CLP: new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format,
  BTC: (monto) => `\u20BF${monto.toFixed(8)}`,
};

export function formatCurrency(amount: number, currency: Currency): string {
  return currencyFmt[currency](amount);
}

export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

const statusMap: Record<TransactionStatus, string> = {
  completed: "Completada",
  pending: "Pendiente",
  failed: "Fallida",
};

export function statusLabel(estado: TransactionStatus): string {
  return statusMap[estado];
}

const typeMap: Record<TransactionType, string> = {
  credit: "Crédito",
  debit: "Débito",
};

export function typeLabel(tipo: TransactionType): string {
  return typeMap[tipo];
}