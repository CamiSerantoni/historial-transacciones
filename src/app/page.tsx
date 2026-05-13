"use client";

import { Suspense } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useURLSync } from "@/hooks/useURLSync";
import { formatCurrency, formatDate, statusLabel, typeLabel } from "@/lib/formatters";
import type { Transaction, TransactionType, TransactionStatus, SortField, SortDirection } from "@/types/transaction";
import { TransactionPagination } from "@/components/ui/transactions/TransactionPagination";
import { TransactionFiltersBar } from "@/components/ui/transactions/TransactionFiltersBar";
import { TransactionEmpty } from "@/components/ui/transactions/TransactionEmpty";
import { TransactionTableSkeleton } from "@/components/ui/transactions/TransactionTableSkeleton";
import { TransactionExport } from "@/components/ui/transactions/TransactionExportCsv";
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
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

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

function SortIcon({ field, sortField, sortDirection }: { field: SortField; sortField: SortField | undefined; sortDirection: SortDirection | undefined }) {
  if (sortField !== field || !sortDirection) return <ArrowUpDown className="inline ml-1 h-3 w-3 opacity-40" />;
  return sortDirection === "asc"
    ? <ArrowUp className="inline ml-1 h-3 w-3" />
    : <ArrowDown className="inline ml-1 h-3 w-3" />;
}

function TableHeaderRow({ sortField, sortDirection, onSort }: { sortField: SortField | undefined; sortDirection: SortDirection | undefined; onSort: (field: SortField) => void }) {
  return (
    <TableRow className="bg-[#FC2B60] hover:bg-[#FC2B60] sticky top-0 z-10">
      <TableHead className="text-white font-semibold">
        <button onClick={() => onSort("date")} className="flex items-center gap-1 hover:opacity-80">
          Fecha
          <SortIcon field="date" sortField={sortField} sortDirection={sortDirection} />
        </button>
      </TableHead>
      <TableHead className="text-white font-semibold">Descripción</TableHead>
      <TableHead className="text-white font-semibold">Tipo</TableHead>
      <TableHead className="text-white font-semibold">Estado</TableHead>
      <TableHead className="text-white font-semibold text-right">
        <button onClick={() => onSort("amount")} className="flex items-center gap-1 ml-auto hover:opacity-80">
          Monto
          <SortIcon field="amount" sortField={sortField} sortDirection={sortDirection} />
        </button>
      </TableHead>
      <TableHead className="text-white font-semibold">Cuenta origen</TableHead>
    </TableRow>
  );
}

function Dashboard() {
  const { data, loading, error, page, pageSize, filters, sortField, sortDirection, update, retry, toggleSort } = useTransactions();

  useURLSync(filters, page, pageSize, (filtrosUrl, paginaUrl, tamanoUrl) =>
    update({ filters: filtrosUrl, page: paginaUrl, pageSize: tamanoUrl as 10 | 25 | 50 })
  );

  if (loading && !data) return (
    <main className="p-4 md:p-6 lg:p-8 w-full bg-zinc-900 min-h-screen">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-white">Historial de transacciones</h1>
        <p className="text-sm text-zinc-400">Módulo de consulta de movimientos para operadores internos</p>
      </div>
      <div className="rounded-lg border border-zinc-700 shadow-sm overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableHeaderRow sortField={sortField} sortDirection={sortDirection} onSort={toggleSort} />
          </TableHeader>
          <TableBody>
            <TransactionTableSkeleton />
          </TableBody>
        </Table>
      </div>
    </main>
  );

  if (error && !data) return (
    <div className="p-6 text-center bg-zinc-900 min-h-screen flex flex-col items-center justify-center">
      <p className="text-red-400 mb-4">{error}</p>
      <button onClick={retry} className="text-sm text-[#FC2B60] underline hover:no-underline">
        Reintentar
      </button>
    </div>
  );

  const hasFilters = Object.values(filters).some((valor) => valor !== undefined && valor !== "");

  return (
    <TooltipProvider>
      <main className="p-4 md:p-6 lg:p-8 w-full bg-zinc-900 min-h-screen">
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-white">Historial de transacciones</h1>
          <p className="text-sm text-zinc-400">Módulo de consulta de movimientos para operadores internos</p>
        </div>

        <TransactionFiltersBar
          filters={filters}
          onChange={(nuevosFiltros) => update({ filters: nuevosFiltros, page: 1 })}
          onClear={() => update({ filters: {}, page: 1 })}
        />

        <div className="flex justify-end mb-2">
          <TransactionExport
            filters={filters}
            sortField={sortField}
            sortDirection={sortDirection}
          />
        </div>

        {error && (
          <div className="mb-2 p-3 rounded-lg bg-red-900/30 text-red-400 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={retry} className="underline hover:no-underline">
              Reintentar
            </button>
          </div>
        )}

        <div className="rounded-lg border border-zinc-700 shadow-sm overflow-hidden bg-white">
          <div className="max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden">
            <Table>
              <TableHeader>
                <TableHeaderRow sortField={sortField} sortDirection={sortDirection} onSort={toggleSort} />
              </TableHeader>
              <TableBody>
                {(data?.data ?? []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="border-0">
                      <TransactionEmpty
                        hasFilters={hasFilters}
                        onClear={() => update({ filters: {}, page: 1 })}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  (data?.data ?? []).map((transaccion: Transaction, indice: number) => {
                    const isFailed = transaccion.status === "failed";
                    return (
                      <TableRow
                        key={transaccion.id}
                        className={`${isFailed ? rowFailed : "hover:bg-zinc-50"} ${indice % 2 === 1 ? "bg-zinc-50/50" : ""}`}
                      >
                        <TableCell className={isFailed ? cellFailed : undefined}>
                          {formatDate(transaccion.date)}
                        </TableCell>
                        <TableCell className={isFailed ? cellFailed : undefined}>
                          {transaccion.description}
                        </TableCell>
                        <TableCell className={isFailed ? cellFailed : undefined}>
                          {typeLabel(transaccion.type)}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${isFailed ? cellFailed : statusBadge[transaccion.status]}`}>
                            {statusLabel(transaccion.status)}
                          </span>
                        </TableCell>
                        <TableCell className={`text-right font-mono tabular-nums ${isFailed ? cellFailed : amountColor[transaccion.type]}`}>
                          {transaccion.type === "debit" ? "-" : "+"}
                          {formatCurrency(transaccion.amount, transaccion.currency)}
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger className="cursor-default">
                              <span className={isFailed ? cellFailed : "text-zinc-500"}>
                                {maskAccount(transaccion.accountOrigin)}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Origen: {transaccion.accountOrigin}</p>
                              <p>Destino: {transaccion.accountDestination}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {data && (
          <TransactionPagination
            page={page}
            totalPages={data.totalPages}
            pageSize={pageSize}
            onPageChange={(nuevaPagina) => update({ page: nuevaPagina })}
            onPageSizeChange={(nuevoTamano) => update({ pageSize: nuevoTamano, page: 1 })}
          />
        )}
      </main>
    </TooltipProvider>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  );
}