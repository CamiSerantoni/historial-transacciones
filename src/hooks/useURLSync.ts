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
  onRead: (filters: TransactionFilters, page: number, pageSize: number) => void
) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const urlFilters: TransactionFilters = {};

    const search = searchParams.get("search");
    if (search) urlFilters.search = search;

    const type = searchParams.get("type");
    if (type && validTypes.includes(type as TransactionType)) urlFilters.type = type as TransactionType;

    const status = searchParams.get("status");
    if (status && validStatuses.includes(status as TransactionStatus)) urlFilters.status = status as TransactionStatus;

    const currency = searchParams.get("currency");
    if (currency && validCurrencies.includes(currency as Currency)) urlFilters.currency = currency as Currency;

    const dateFrom = searchParams.get("dateFrom");
    if (dateFrom) urlFilters.dateFrom = dateFrom;

    const dateTo = searchParams.get("dateTo");
    if (dateTo) urlFilters.dateTo = dateTo;

    const amountMin = searchParams.get("amountMin");
    if (amountMin) urlFilters.amountMin = Number(amountMin);

    const amountMax = searchParams.get("amountMax");
    if (amountMax) urlFilters.amountMax = Number(amountMax);

    const urlPage = searchParams.get("page");
    const urlPageSize = searchParams.get("pageSize");

    onRead(urlFilters, urlPage ? Number(urlPage) : 1, urlPageSize ? Number(urlPageSize) : 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  }, [filters, page, pageSize, pathname, router]);
}