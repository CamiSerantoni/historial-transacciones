import { Inbox } from "lucide-react";

interface Props {
  hasFilters: boolean;
  onClear: () => void;
}

export function TransactionEmpty({ hasFilters, onClear }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
      <Inbox size={48} className="mb-3 text-zinc-600" />
      <p className="text-lg font-medium mb-1 text-zinc-300">No hay transacciones</p>
      {hasFilters ? (
        <p className="text-sm mb-3">
          No se encontraron resultados con los filtros actuales.
        </p>
      ) : (
        <p className="text-sm mb-3">
          Aún no se han registrado transacciones.
        </p>
      )}
      {hasFilters && (
        <button
          onClick={onClear}
          className="text-sm text-[#FC2B60] hover:underline"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}