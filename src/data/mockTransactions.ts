import type { Transaction, Currency, TransactionType, TransactionStatus } from "@/types/transaction";

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

const random = seededRandom(42);

const randInt = (min: number, max: number) =>
  Math.floor(random() * (max - min + 1)) + min;

const pick = <T>(arr: readonly T[]): T => arr[randInt(0, arr.length - 1)];

const CURRENCY_WEIGHTS: [Currency, number][] = [
  ["CLP", 50],
  ["USD", 30],
  ["EUR", 15],
  ["BTC", 5],
];

function weightedPick(options: [string, number][]): string {
  const total = options.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = random() * total;
  for (const [option, weight] of options) {
    roll -= weight;
    if (roll < 0) return option;
  }
  return options[0][0];
}

function chooseCurrency(): Currency {
  return weightedPick(CURRENCY_WEIGHTS) as Currency;
}

const STATUS_WEIGHTS: [TransactionStatus, number][] = [
  ["completed", 55],
  ["pending", 30],
  ["failed", 15],
];

function chooseStatus(): TransactionStatus {
  return weightedPick(STATUS_WEIGHTS) as TransactionStatus;
}

const TYPE_WEIGHTS: [TransactionType, number][] = [
  ["credit", 45],
  ["debit", 55],
];

function chooseType(): TransactionType {
  return weightedPick(TYPE_WEIGHTS) as TransactionType;
}

const BANKS = ["BCH", "SANT", "ITAU", "BICE", "ESTD", "BCI", "SCOT", "BBVA"] as const;

function accountId(): string {
  const bank = pick(BANKS);
  return `${bank}-${randInt(1000, 9999)}-${randInt(10000000, 99999999)}`;
}

function generateAmount(currency: Currency): number {
  switch (currency) {
    case "CLP": {
      const ranges = [
        [1_000, 50_000],
        [50_000, 500_000],
        [500_000, 5_000_000],
      ] as const;
      const [min, max] = pick(ranges);
      return randInt(min, max);
    }
    case "BTC":
      return parseFloat((random() * 0.5).toFixed(8));
    case "USD": {
      const ranges = [
        [10, 500],
        [500, 5_000],
        [5_000, 50_000],
      ] as const;
      const [min, max] = pick(ranges);
      return parseFloat((min + random() * (max - min)).toFixed(2));
    }
    case "EUR": {
      const ranges = [
        [10, 400],
        [400, 4_000],
        [4_000, 40_000],
      ] as const;
      const [min, max] = pick(ranges);
      return parseFloat((min + random() * (max - min)).toFixed(2));
    }
  }
}

function randomDate(from: string, to: string): string {
  const startMs = new Date(from).getTime();
  const endMs = new Date(to).getTime();
  return new Date(startMs + random() * (endMs - startMs)).toISOString().split("T")[0];
}

const DESCRIPTIONS: Record<TransactionType, string[]> = {
  credit: [
    "Depósito recibido",
    "Transferencia entrante",
    "Pago recibido",
    "Reembolso",
    "Acreditación de interés",
    "Cobro de dividendo",
    "Reversa de cargo",
    "Transferencia desde tercero",
    "Depósito en efectivo",
    "Cobro de comisión revertida",
  ],
  debit: [
    "Transferencia enviada",
    "Pago de servicio",
    "Retiro cajero",
    "Compra con tarjeta",
    "Pago de nómina",
    "Cargo por mantención",
    "Transferencia a tercero",
    "Pago de cuenta",
    "GIRO en caja",
    "Compra internacional",
  ],
};

function generateId(): string {
  const prefix = pick(["TX", "OP", "MV", "TR"]);
  const timestamp = String(randInt(1704067200, 1748390400));
  const suffix = random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp.slice(-6)}${suffix}`;
}

function makeOne(): Transaction {
  const currency = chooseCurrency();
  const type = chooseType();
  const status = chooseStatus();

  return {
    id: generateId(),
    date: randomDate("2026-01-01", "2026-05-31"),
    type,
    status,
    currency,
    amount: generateAmount(currency),
    accountOrigin: accountId(),
    accountDestination: accountId(),
    description: pick(DESCRIPTIONS[type]),
  };
}

export const mockTransactions: Transaction[] = Array.from({ length: 250 }, () => makeOne());