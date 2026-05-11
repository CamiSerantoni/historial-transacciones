"use client";

import type { TransactionFilters, TransactionType, TransactionStatus, Currency } from "@/types/transaction";
import { CURRENCY_OPTIONS, TYPE_OPTIONS, STATUS_OPTIONS } from "@/types/transaction";

interface Props {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
  onClear: () => void;
}

export function TransactionFiltersBar({ filters, onChange, onClear }: Props) {
  const set = (patch: Partial<TransactionFilters>) =>
    onChange({ ...filters, ...patch });

  return (
    <div className="flex flex-wrap gap-3 items-end py-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">Buscar</label>
        <input
          type="text"
          placeholder="Descripción, ID, cuenta..."
          value={filters.search ?? ""}
          onChange={(e) => set({ search: e.target.value || undefined })}
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

      <button
        onClick={onClear}
        className="text-sm text-zinc-500 hover:text-zinc-700 underline"
      >
        Limpiar filtros
      </button>
    </div>
  );
}