import { TableCell, TableRow } from "@/components/ui/table";

const COLUMN_WIDTHS = [90, 200, 70, 90, 120, 140];

export function TransactionTableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <TableRow key={rowIdx} className={rowIdx % 2 === 1 ? "bg-zinc-50/50" : ""}>
          {COLUMN_WIDTHS.map((width, colIdx) => (
            <TableCell key={colIdx}>
              <div
                className="h-4 bg-zinc-200 rounded animate-pulse"
                style={{ width }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}