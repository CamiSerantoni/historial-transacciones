const COLS = [90, 200, 70, 90, 120, 140];

function SkeletonCell({ width }: { width: number }) {
  return (
    <td className="py-3 px-4">
      <div
        className="h-4 bg-zinc-200 rounded animate-pulse"
        style={{ width }}
      />
    </td>
  );
}

export function TransactionTableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className={i % 2 === 1 ? "bg-zinc-50/50" : ""}>
          {COLS.map((w, j) => (
            <SkeletonCell key={j} width={w} />
          ))}
        </tr>
      ))}
    </>
  );
}