"use client";

import { useTransactions } from "@/hooks/useTransactions";
import { formatCurrency, formatDate, statusLabel, typeLabel } from "@/lib/formatters";
import type { Transaction, TransactionType, TransactionStatus } from "@/types/transaction";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const amountColor: Record<TransactionType, string> = {
  credit: "text-emerald-600",
  debit: "text-red-600",
};

export default function HomePage() {
  const { data, loading, error } = useTransactions();

  if (loading) return <p className="p-6">Cargando...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Historial de transacciones</h1>

      <Table>
        <TableHeader>
          <TableRow className="bg-[#FC2B60] hover:bg-[#FC2B60]">
            <TableHead className="text-white font-semibold">Fecha</TableHead>
            <TableHead className="text-white font-semibold">Descripción</TableHead>
            <TableHead className="text-white font-semibold">Tipo</TableHead>
            <TableHead className="text-white font-semibold">Estado</TableHead>
            <TableHead className="text-white font-semibold">Monto</TableHead>
            <TableHead className="text-white font-semibold">Cuenta origen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(data?.items ?? []).map((tx: Transaction) => (
            <TableRow
              key={tx.id}
              className={tx.status === "failed" ? "opacity-50 line-through bg-red-50/50" : undefined}
            >
              <TableCell>{formatDate(tx.date)}</TableCell>
              <TableCell>{tx.description}</TableCell>
              <TableCell>{typeLabel(tx.type)}</TableCell>
              <TableCell>{statusLabel(tx.status)}</TableCell>
              <TableCell className={amountColor[tx.type]}>
                {tx.type === "debit" ? "-" : "+"}
                {formatCurrency(tx.amount, tx.currency)}
              </TableCell>
              <TableCell>{tx.accountOrigin}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}