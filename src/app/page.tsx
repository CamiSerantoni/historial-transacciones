"use client";

import { useTransactions } from "@/hooks/useTransactions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function HomePage() {
  const { data, loading, error } = useTransactions();

  if (loading) return <p className="p-6">Cargando...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Historial de transacciones: Tabla de datos </h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Moneda</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(data?.items ?? []).map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>{tx.date}</TableCell>
              <TableCell>{tx.description}</TableCell>
              <TableCell>{tx.type}</TableCell>
              <TableCell>{tx.status}</TableCell>
              <TableCell>{tx.amount}</TableCell>
              <TableCell>{tx.currency}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}