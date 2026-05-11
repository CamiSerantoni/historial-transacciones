"use client";

import { useRef } from "react";
import type { TransactionFilters, TransactionType, TransactionStatus, Currency } from "@/types/transaction";
import { CURRENCY_OPTIONS, TYPE_OPTIONS, STATUS_OPTIONS } from "@/types/transaction";
import { FilterX } from "lucide-react";
interface Props {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
  onClear: () => void;
}

export function TransactionFiltersBar({ filters, onChange, onClear }: Props) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const set = (patch: Partial<TransactionFilters>) =>
    onChange({ ...filters, ...patch });

  const onSearch = (value: string) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      set({ search: value || undefined });
    }, 300);
  };

  return (
    <div className="flex flex-wrap gap-3 items-end py-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">Buscar</label>
        <input
          type="text"
          placeholder="Descripción, ID, cuenta..."
          defaultValue={filters.search ?? ""}
          onChange={(e) => onSearch(e.target.value)}
          className="border rounded px-3 py-1.5 text-sm w-56"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">Tipo</label>
        <select
          value={filters.type ?? ""}
          onChange={(e) => set({ type: (e.target.value as TransactionType) || undefined })}
          className="border rounded px-3 py-1.5 text-sm"
        >
          <option value="">Todos</option>
          {TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>{t === "credit" ? "Crédito" : "Débito"}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">Estado</label>
        <select
          value={filters.status ?? ""}
          onChange={(e) => set({ status: (e.target.value as TransactionStatus) || undefined })}
          className="border rounded px-3 py-1.5 text-sm"
        >
          <option value="">Todos</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === "completed" ? "Completada" : s === "pending" ? "Pendiente" : "Fallida"}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">Moneda</label>
        <select
          value={filters.currency ?? ""}
          onChange={(e) => set({ currency: (e.target.value as Currency) || undefined })}
          className="border rounded px-3 py-1.5 text-sm"
        >
          <option value="">Todas</option>
          {CURRENCY_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
  <label className="text-xs text-zinc-500">Desde</label>
  <input
    type="date"
    value={filters.dateFrom ?? ""}
    onChange={(e) => set({ dateFrom: e.target.value || undefined })}
    className="border rounded px-3 py-1.5 text-sm"
  />
</div>

<div className="flex flex-col gap-1">
  <label className="text-xs text-zinc-500">Hasta</label>
  <input
    type="date"
    value={filters.dateTo ?? ""}
    onChange={(e) => set({ dateTo: e.target.value || undefined })}
    className="border rounded px-3 py-1.5 text-sm"
  />
</div>

<div className="flex flex-col gap-1">
  <label className="text-xs text-zinc-500">Monto mín</label>
  <input
    type="number"
    placeholder="0"
    value={filters.amountMin ?? ""}
    onChange={(e) => set({ amountMin: e.target.value ? Number(e.target.value) : undefined })}
    className="border rounded px-3 py-1.5 text-sm w-24"
  />
</div>

<div className="flex flex-col gap-1">
  <label className="text-xs text-zinc-500">Monto máx</label>
  <input
    type="number"
    placeholder="∞"
    value={filters.amountMax ?? ""}
    onChange={(e) => set({ amountMax: e.target.value ? Number(e.target.value) : undefined })}
    className="border rounded px-3 py-1.5 text-sm w-24"
  />
</div>

  <button
    onClick={onClear}
    className="ml-auto flex items-center gap-1.5 text-sm text-[#FC2B60] bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
  >
    <FilterX size={14} />
    Limpiar filtros
  </button>

    </div>
  );
}