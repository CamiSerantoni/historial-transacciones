"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { fetchAllFilteredTransactions } from "@/lib/fetchTransactions";
import type { Transaction, TransactionFilters } from "@/types/transaction";
import { typeLabel, statusLabel } from "@/lib/formatters";

interface Props {
  filters: TransactionFilters;
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

function toRow(transaccion: Transaction): string {
  return [
    escape(transaccion.date),
    escape(transaccion.description),
    escape(typeLabel(transaccion.type)),
    escape(statusLabel(transaccion.status)),
    String(transaccion.amount),
    escape(transaccion.currency),
    escape(transaccion.accountOrigin),
    escape(transaccion.accountDestination),
  ].join(",");
}

export function TransactionExport({ filters }: Props) {
  const [exporting, setExporting] = useState(false);

  const onExport = async () => {
    setExporting(true);
    try {
      const items = await fetchAllFilteredTransactions(filters);

      const rows = [HEADERS.join(","), ...items.map(toRow)];
      const csv = "\uFEFF" + rows.join("\n");

      const today = new Date().toISOString().split("T")[0];
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = `movimientos-${today}.csv`;
      enlace.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Error al exportar. Intente nuevamente.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={onExport}
      disabled={exporting}
      className="flex items-center gap-1.5 text-sm text-white bg-[#FC2B60] hover:bg-[#e0264f] disabled:opacity-50 px-4 py-1.5 rounded-lg transition-colors"
    >
      <Download size={14} />
      {exporting ? "Exportando..." : "Exportar CSV"}
    </button>
  );
}