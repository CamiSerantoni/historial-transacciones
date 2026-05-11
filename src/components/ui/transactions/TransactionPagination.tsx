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
      <div className="flex items-center gap-2 text-sm text-zinc-600">
        <span>Filas:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value) as PageSizeOption)}
          className="border rounded px-2 py-1 text-sm"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 text-sm text-zinc-600">
        <span>Página {page} de {totalPages}</span>
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}