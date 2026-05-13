import type { Transaction, Currency, TransactionType, TransactionStatus } from "@/types/transaction";

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rng = seededRandom(42);

const rand = (min: number, max: number) =>
  Math.floor(rng() * (max - min + 1)) + min;

const pick = <T>(arr: readonly T[]): T => arr[rand(0, arr.length - 1)];

const CURRENCIES: Currency[] = ["USD", "EUR", "CLP", "BTC"];
const TYPES: TransactionType[] = ["credit", "debit"];
const STATUSES: [TransactionStatus, number][] = [
  ["completed", 50],
  ["pending", 30],
  ["failed", 20],
];

function weighted(items: [TransactionStatus, number][]): TransactionStatus {
  const total = items.reduce((s, [, w]) => s + w, 0);
  let roll = rng() * total;
  for (const [item, weight] of items) {
    roll -= weight;
    if (roll < 0) return item;
  }
  return items[0][0];
}

function accountId(): string {
  const bank = pick(["BCH", "SANT", "ITAU", "BICE", "ESTD", "BCI"] as const);
  return `${bank}-${rand(1000, 9999)}-${rand(10000000, 99999999)}`;
}

function amount(cur: Currency): number {
  switch (cur) {
    case "CLP": return rand(5_000, 5_000_000);
    case "BTC": return parseFloat((rng() * 2).toFixed(8));
    default: return parseFloat((rng() * 50_000 + 100).toFixed(2));
  }
}

function dateRange(from: string, to: string): string {
  const ms = new Date(from).getTime();
  const me = new Date(to).getTime();
  return new Date(ms + rng() * (me - ms)).toISOString().split("T")[0];
}

const DESCRIPTIONS: Record<TransactionType, string[]> = {
  credit: ["Depósito recibido", "Transferencia entrante", "Pago recibido", "Reembolso"],
  debit: ["Transferencia enviada", "Pago de servicio", "Retiro cajero", "Compra con tarjeta"],
};

function makeOne(): Transaction {
  const currency = pick(CURRENCIES);
  const type = pick(TYPES);

  return {
    id: "TX-" + rng().toString(36).substring(2, 10).toUpperCase(),
    date: dateRange("2026-01-01", "2026-05-31"),
    type,
    status: weighted(STATUSES),
    currency,
    amount: amount(currency),
    accountOrigin: accountId(),
    accountDestination: accountId(),
    description: pick(DESCRIPTIONS[type]),
  };
}

export const mockTransactions: Transaction[] = Array.from({ length: 250 }, () => makeOne());