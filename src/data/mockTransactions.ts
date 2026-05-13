import type { Transaction, Currency, TransactionType, TransactionStatus } from "@/types/transaction";

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 16807 + 0) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

const random = seededRandom(42);

const rand = (min: number, max: number) =>
  Math.floor(random() * (max - min + 1)) + min;

const pick = <T>(arr: readonly T[]): T => arr[rand(0, arr.length - 1)];

const CURRENCIES: Currency[] = ["USD", "EUR", "CLP", "BTC"];
const TYPES: TransactionType[] = ["credit", "debit"];
const STATUSES: [TransactionStatus, number][] = [
  ["completed", 50],
  ["pending", 30],
  ["failed", 20],
];

function weightedStatus(items: [TransactionStatus, number][]): TransactionStatus {
  const total = items.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = random() * total;
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

function generateAmount(currency: Currency): number {
  switch (currency) {
    case "CLP": return rand(5_000, 5_000_000);
    case "BTC": return parseFloat((random() * 2).toFixed(8));
    default: return parseFloat((random() * 50_000 + 100).toFixed(2));
  }
}

function randomDate(from: string, to: string): string {
  const startMs = new Date(from).getTime();
  const endMs = new Date(to).getTime();
  return new Date(startMs + random() * (endMs - startMs)).toISOString().split("T")[0];
}

const DESCRIPTIONS: Record<TransactionType, string[]> = {
  credit: ["Depósito recibido", "Transferencia entrante", "Pago recibido", "Reembolso"],
  debit: ["Transferencia enviada", "Pago de servicio", "Retiro cajero", "Compra con tarjeta"],
};

function makeOne(): Transaction {
  const currency = pick(CURRENCIES);
  const type = pick(TYPES);

  return {
    id: "TX-" + random().toString(36).substring(2, 10).toUpperCase(),
    date: randomDate("2026-01-01", "2026-05-31"),
    type,
    status: weightedStatus(STATUSES),
    currency,
    amount: generateAmount(currency),
    accountOrigin: accountId(),
    accountDestination: accountId(),
    description: pick(DESCRIPTIONS[type]),
  };
}

export const mockTransactions: Transaction[] = Array.from({ length: 250 }, () => makeOne());
