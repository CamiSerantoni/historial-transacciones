"use client";

import { PAGE_SIZE_OPTIONS, type PageSizeOption } from "@/types/transaction";
import { Button } from "@/components/ui/button";

interface Props {
  page: number;
  totalPages: number;
  pageSize: PageSizeOption;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: PageSizeOption) => void;
}

export function TransactionPagination({
  page,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: Props) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2 text-sm text-zinc-300">
        <span>Filas:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value) as PageSizeOption)}
          className="border border-zinc-600 rounded px-2 py-1 text-sm bg-zinc-800 text-white"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 text-sm text-zinc-300">
        <span>Página {page} de {totalPages}</span>
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="border-zinc-600 rounded-lg"
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="border-zinc-600 rounded-lg"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}