import { TableCell, TableRow } from "@/components/ui/table";

const WIDTHS = [90, 200, 70, 90, 120, 140];

export function TransactionTableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i} className={i % 2 === 1 ? "bg-zinc-50/50" : ""}>
          {WIDTHS.map((w, j) => (
            <TableCell key={j}>
              <div
                className="h-4 bg-zinc-200 rounded animate-pulse"
                style={{ width: w }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}