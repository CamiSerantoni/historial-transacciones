"use client";

import { useReducer, useEffect, useCallback, useMemo } from "react";
import { fetchTransactions } from "@/lib/fetchTransactions";
import type { Transaction, TransactionFilters, FetchResult, PageSizeOption, SortField, SortDirection } from "@/types/transaction";

interface State {
  fetchResult: FetchResult | null;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: PageSizeOption;
  filters: TransactionFilters;
  sortField: SortField | undefined;
  sortDirection: SortDirection | undefined;
  fetchId: number;
}

type Action =
  | { kind: "fetch_start" }
  | { kind: "fetch_ok"; payload: FetchResult }
  | { kind: "fetch_fail"; payload: string }
  | { kind: "update"; payload: Partial<Pick<State, "page" | "pageSize" | "filters" | "sortField" | "sortDirection">> }
  | { kind: "clear_sort" }
  | { kind: "reset" }
  | { kind: "retry" };

const PAGE_KEY = "page_size";

function initialState(): State {
  return {
    fetchResult: null,
    loading: true,
    error: null,
    page: 1,
    pageSize: 10,
    filters: {},
    sortField: undefined,
    sortDirection: undefined,
    fetchId: 0,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.kind) {
    case "fetch_start":
      return { ...state, loading: true, error: null };
    case "fetch_ok":
      return { ...state, loading: false, fetchResult: action.payload };
    case "fetch_fail":
      return { ...state, loading: false, error: action.payload };
    case "update":
      return { ...state, ...action.payload };
    case "clear_sort":
      return { ...state, sortField: undefined, sortDirection: undefined };
    case "reset":
      return initialState();
    case "retry":
      return { ...state, fetchId: state.fetchId + 1, error: null, loading: true };
    default:
      return state;
  }
}

export function useTransactions() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PAGE_KEY);
      if (saved === "25" || saved === "50") {
        dispatch({ kind: "update", payload: { pageSize: Number(saved) as PageSizeOption } });
      }
    } catch {}
  }, []);

  useEffect(() => {
    let cancel = false;

    dispatch({ kind: "fetch_start" });

    fetchTransactions({
      page: state.page,
      pageSize: state.pageSize,
      filters: state.filters,
    })
      .then((res) => {
        if (!cancel) dispatch({ kind: "fetch_ok", payload: res });
      })
      .catch((err) => {
        if (!cancel) dispatch({ kind: "fetch_fail", payload: err.message });
      });

    return () => { cancel = true; };
  }, [state.page, state.pageSize, state.filters, state.fetchId]);

  const sortedData = useMemo(() => {
    const items = state.fetchResult?.data ?? [];
    if (!state.sortField || !state.sortDirection) return items;

    return [...items].sort((a, b) => {
      let diferencia: number;
      if (state.sortField === "date") {
        diferencia = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        const valorA = a.type === "debit" ? -a.amount : a.amount;
        const valorB = b.type === "debit" ? -b.amount : b.amount;
        diferencia = valorA - valorB;
      }
      return state.sortDirection === "desc" ? -diferencia : diferencia;
    });
  }, [state.fetchResult, state.sortField, state.sortDirection]);

  useEffect(() => {
    localStorage.setItem(PAGE_KEY, String(state.pageSize));
  }, [state.pageSize]);

  const update = useCallback(
    (patch: Partial<Pick<State, "page" | "pageSize" | "filters" | "sortField" | "sortDirection">>) =>
      dispatch({ kind: "update", payload: patch }),
    []
  );

  const reset = useCallback(() => dispatch({ kind: "reset" }), []);
  const retry = useCallback(() => dispatch({ kind: "retry" }), []);

  const toggleSort = useCallback(
    (field: SortField) => {
      if (state.sortField !== field) {
        dispatch({ kind: "update", payload: { sortField: field, sortDirection: "asc", page: 1 } });
      } else if (state.sortDirection === "asc") {
        dispatch({ kind: "update", payload: { sortDirection: "desc" } });
      } else {
        dispatch({ kind: "clear_sort" });
      }
    },
    [state.sortField, state.sortDirection]
  );

  const data = state.fetchResult
    ? { ...state.fetchResult, data: sortedData }
    : null;

  return {
    ...state,
    data,
    update,
    reset,
    retry,
    toggleSort,
  };
}