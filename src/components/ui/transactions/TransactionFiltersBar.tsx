"use client";

import { useRef, useState, useEffect } from "react";
import { FilterX } from "lucide-react";
import type { TransactionFilters, TransactionType, TransactionStatus, Currency } from "@/types/transaction";
import { CURRENCY_OPTIONS, TYPE_OPTIONS, STATUS_OPTIONS } from "@/types/transaction";

const statusLabels: Record<TransactionStatus, string> = {
  completed: "Completada",
  pending: "Pendiente",
  failed: "Fallida",
};

const typeLabels: Record<TransactionType, string> = {
  credit: "Crédito",
  debit: "Débito",
};

interface Props {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
  onClear: () => void;
}

export function TransactionFiltersBar({ filters, onChange, onClear }: Props) {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [searchText, setSearchText] = useState(filters.search ?? "");

  useEffect(() => {
    if (!filters.search) setSearchText("");
  }, [filters.search]);

  const set = (patch: Partial<TransactionFilters>) =>
    onChange({ ...filters, ...patch });

  const onSearch = (value: string) => {
    setSearchText(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      set({ search: value || undefined });
    }, 300);
  };

  return (
    <div className="flex flex-wrap gap-3 items-end py-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-400">Buscar</label>
        <input
          type="text"
          placeholder="Descripción, ID, cuenta..."
          value={searchText}
          onChange={(e) => onSearch(e.target.value)}
          className="border border-zinc-600 rounded px-3 py-1.5 text-sm w-56 bg-zinc-800 text-white placeholder:text-zinc-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-400">Tipo</label>
        <select
          value={filters.type ?? ""}
          onChange={(e) => set({ type: (e.target.value as TransactionType) || undefined })}
          className="border border-zinc-600 rounded px-3 py-1.5 text-sm bg-zinc-800 text-white"
        >
          <option value="">Todos</option>
          {TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>{typeLabels[type]}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-400">Estado</label>
        <select
          value={filters.status ?? ""}
          onChange={(e) => set({ status: (e.target.value as TransactionStatus) || undefined })}
          className="border border-zinc-600 rounded px-3 py-1.5 text-sm bg-zinc-800 text-white"
        >
          <option value="">Todos</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>{statusLabels[status]}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-400">Moneda</label>
        <select
          value={filters.currency ?? ""}
          onChange={(e) => set({ currency: (e.target.value as Currency) || undefined })}
          className="border border-zinc-600 rounded px-3 py-1.5 text-sm bg-zinc-800 text-white"
        >
          <option value="">Todas</option>
          {CURRENCY_OPTIONS.map((currency) => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-400">Desde</label>
        <input
          type="date"
          value={filters.dateFrom ?? ""}
          onChange={(e) => set({ dateFrom: e.target.value || undefined })}
          className="border border-zinc-600 rounded px-3 py-1.5 text-sm bg-zinc-800 text-white"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-400">Hasta</label>
        <input
          type="date"
          value={filters.dateTo ?? ""}
          onChange={(e) => set({ dateTo: e.target.value || undefined })}
          className="border border-zinc-600 rounded px-3 py-1.5 text-sm bg-zinc-800 text-white"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-400">Monto mín</label>
        <input
          type="number"
          placeholder="0"
          value={filters.amountMin ?? ""}
          onChange={(e) => set({ amountMin: e.target.value ? Number(e.target.value) : undefined })}
          className="border border-zinc-600 rounded px-3 py-1.5 text-sm w-24 bg-zinc-800 text-white placeholder:text-zinc-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-400">Monto máx</label>
        <input
          type="number"
          placeholder="∞"
          value={filters.amountMax ?? ""}
          onChange={(e) => set({ amountMax: e.target.value ? Number(e.target.value) : undefined })}
          className="border border-zinc-600 rounded px-3 py-1.5 text-sm w-24 bg-zinc-800 text-white placeholder:text-zinc-500"
        />
      </div>

      <button
        onClick={onClear}
        className="ml-auto flex items-center gap-1.5 text-sm text-[#FC2B60] bg-red-900/30 hover:bg-red-900/50 px-3 py-1.5 rounded-md transition-colors"
      >
        <FilterX size={14} />
        Limpiar filtros
      </button>
    </div>
  );
}