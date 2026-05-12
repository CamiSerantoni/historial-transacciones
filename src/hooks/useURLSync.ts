"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { TransactionFilters, TransactionType, TransactionStatus, Currency } from "@/types/transaction";

const validTypes: TransactionType[] = ["credit", "debit"];
const validStatuses: TransactionStatus[] = ["completed", "pending", "failed"];
const validCurrencies: Currency[] = ["USD", "EUR", "CLP", "BTC"];

export function useURLSync(
  filters: TransactionFilters,
  page: number,
  pageSize: number,
  onRead: (f: TransactionFilters, page: number, ps: number) => void
) {
  const sp = useSearchParams();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const f: TransactionFilters = {};
    const search = sp.get("search");
    if (search) f.search = search;

    const type = sp.get("type");
    if (type && validTypes.includes(type as TransactionType)) f.type = type as TransactionType;

    const status = sp.get("status");
    if (status && validStatuses.includes(status as TransactionStatus)) f.status = status as TransactionStatus;

    const currency = sp.get("currency");
    if (currency && validCurrencies.includes(currency as Currency)) f.currency = currency as Currency;

    const dateFrom = sp.get("dateFrom");
    if (dateFrom) f.dateFrom = dateFrom;

    const dateTo = sp.get("dateTo");
    if (dateTo) f.dateTo = dateTo;

    const amountMin = sp.get("amountMin");
    if (amountMin) f.amountMin = Number(amountMin);

    const amountMax = sp.get("amountMax");
    if (amountMax) f.amountMax = Number(amountMax);

    const p = sp.get("page");
    const ps = sp.get("pageSize");

    onRead(f, p ? Number(p) : 1, ps ? Number(ps) : 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // escribir a URL cuando cambia el estado
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.type) params.set("type", filters.type);
    if (filters.status) params.set("status", filters.status);
    if (filters.currency) params.set("currency", filters.currency);
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    if (filters.amountMin != null) params.set("amountMin", String(filters.amountMin));
    if (filters.amountMax != null) params.set("amountMax", String(filters.amountMax));
    if (page > 1) params.set("page", String(page));
    if (pageSize !== 10) params.set("pageSize", String(pageSize));

    const qs = params.toString();
    router.replace(qs ? `${path}?${qs}` : path, { scroll: false });
  }, [filters, page, pageSize, path, router]);
}