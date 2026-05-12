"use client";

import { Download } from "lucide-react";
import { fetchAllForExport } from "@/lib/fetchTransactions";
import type { TransactionFilters } from "@/types/transaction";
import type { SortField, SortDirection } from "@/types/transaction";

interface Props {
  filters: TransactionFilters;
  sortField: SortField;
  sortDirection: SortDirection;
}

const HEADERS = [
  "Fecha",
  "Descripción",
  "Tipo",
  "Estado",
  "Monto",
  "Moneda",
  "Cuenta origen",
  "Cuenta destino",
];

function escape(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

function toRow(tx: {
  date: string;
  description: string;
  type: string;
  status: string;
  amount: number;
  currency: string;
  accountOrigin: string;
  accountDestination: string;
}): string {
  return [
    escape(tx.date),
    escape(tx.description),
    escape(tx.type),
    escape(tx.status),
    String(tx.amount),
    escape(tx.currency),
    escape(tx.accountOrigin),
    escape(tx.accountDestination),
  ].join(",");
}

export function TransactionExport({ filters, sortField, sortDirection }: Props) {
  const onExport = async () => {
    const items = await fetchAllForExport({
      page: 1,
      pageSize: 9999,
      filters,
      sortField,
      sortDirection,
    });

    const rows = [HEADERS.join(","), ...items.map(toRow)];
    const csv = "\uFEFF" + rows.join("\n"); // BOM para Excel

    const today = new Date().toISOString().split("T")[0];
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `movimientos-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={onExport}
      className="flex items-center gap-1.5 text-sm text-white bg-[#FC2B60] hover:bg-[#e0264f] px-4 py-1.5 rounded-lg transition-colors"
    >
      <Download size={14} />
      Exportar CSV
    </button>
  );
}