"use client";

import { useTransactions } from "@/hooks/useTransactions";
import { formatCurrency, formatDate, statusLabel, typeLabel } from "@/lib/formatters";
import type { Transaction, TransactionType, TransactionStatus } from "@/types/transaction";
import { TransactionPagination } from "@/components/ui/transactions/TransactionPagination";// nuevo import:
import { TransactionFiltersBar } from "@/components/ui/transactions/TransactionFiltersBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const amountColor: Record<TransactionType, string> = {
  credit: "text-emerald-600",
  debit: "text-red-600",
};


const statusBadge: Record<TransactionStatus, string> = {
  completed: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
};

const cellFailed = "line-through text-zinc-400";
const rowFailed = "bg-red-50/60";

function maskAccount(account: string): string {
  const parts = account.split("-");
  if (parts.length !== 3) return account;
  return `●●●●-●●●●-${parts[2].slice(-4)}`;
}

export default function HomePage() {
  const { data, loading, error, page, pageSize, filters, update } = useTransactions();
  
  if (loading) return <p className="p-6">Cargando...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <TooltipProvider>
      <main className="p-4 md:p-6 lg:p-8 w-full">
        <h1 className="text-xl font-semibold mb-4">Historial de transacciones</h1>
        <TransactionFiltersBar
  filters={filters}
  onChange={(f) => update({ filters: f, page: 1 })}
  onClear={() => update({ filters: {}, page: 1 })}
/>
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#FC2B60] hover:bg-[#FC2B60] sticky top-0 z-10">
                  <TableHead className="text-white font-semibold">Fecha</TableHead>
                  <TableHead className="text-white font-semibold">Descripción</TableHead>
                  <TableHead className="text-white font-semibold">Tipo</TableHead>
                  <TableHead className="text-white font-semibold">Estado</TableHead>
                  <TableHead className="text-white font-semibold text-right">Monto</TableHead>
                  <TableHead className="text-white font-semibold">Cuenta origen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.items ?? []).map((tx: Transaction, i: number) => {
                  const isFailed = tx.status === "failed";
                  return (
                    <TableRow
                      key={tx.id}
                      className={`${isFailed ? rowFailed : "hover:bg-zinc-50"} ${i % 2 === 1 ? "bg-zinc-50/50" : ""}`}
                    >
                      <TableCell className={isFailed ? cellFailed : undefined}>
                        {formatDate(tx.date)}
                      </TableCell>
                      <TableCell className={isFailed ? cellFailed : undefined}>
                        {tx.description}
                      </TableCell>
                      <TableCell className={isFailed ? cellFailed : undefined}>
                        {typeLabel(tx.type)}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${isFailed ? cellFailed : statusBadge[tx.status]}`}>
                          {statusLabel(tx.status)}
                        </span>
                      </TableCell>
                      <TableCell className={`text-right font-mono tabular-nums ${isFailed ? cellFailed : amountColor[tx.type]}`}>
                        {tx.type === "debit" ? "-" : "+"}
                        {formatCurrency(tx.amount, tx.currency)}
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger className="cursor-default">
                            <span className={isFailed ? cellFailed : "text-zinc-500"}>
                              {maskAccount(tx.accountOrigin)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tx.accountOrigin}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {data && (
          <TransactionPagination
            page={page}
            totalPages={data.totalPages}
            pageSize={pageSize}
            onPageChange={(p) => update({ page: p })}
            onPageSizeChange={(s) => update({ pageSize: s, page: 1 })}
          />
        )}
      </main>
    </TooltipProvider>
  );
}