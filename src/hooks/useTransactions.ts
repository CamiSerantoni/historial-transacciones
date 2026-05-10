"use client";

import { useReducer, useEffect, useCallback } from "react";
import { fetchTransactions } from "@/lib/fetchTransactions";
import type { Filters, FetchResult } from "@/types/transaction";

export type PageSize = 10 | 25 | 50;
export type SortField = "date" | "amount";
export type SortDir = "asc" | "desc" | null;

interface State {
  data: FetchResult | null;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: PageSize;
  filters: Filters;
  sortField: SortField;
  sortDir: SortDir;
}

type Action =
  | { t: "fetch_start" }
  | { t: "fetch_ok"; payload: FetchResult }
  | { t: "fetch_fail"; payload: string }
  | { t: "update"; payload: Partial<Pick<State, "page" | "pageSize" | "filters" | "sortField" | "sortDir">> }
  | { t: "reset" };

const PAGE_KEY = "tx_page_size";

function readPageSize(): PageSize {
  if (typeof window === "undefined") return 10;
  const v = localStorage.getItem(PAGE_KEY);
  return v === "25" ? 25 : v === "50" ? 50 : 10;
}

function initialState(): State {
  return {
    data: null,
    loading: false,
    error: null,
    page: 1,
    pageSize: readPageSize(),
    filters: {},
    sortField: "date",
    sortDir: "desc",
  };
}

function reducer(state: State, action: Action): State {
  switch (action.t) {
    case "fetch_start":
      return { ...state, loading: true, error: null };
    case "fetch_ok":
      return { ...state, loading: false, data: action.payload };
    case "fetch_fail":
      return { ...state, loading: false, error: action.payload };
    case "update":
      return { ...state, ...action.payload };
    case "reset":
      return initialState();
    default:
      return state;
  }
}

export function useTransactions() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  // fetch automático cuando cambian filtros/página/sort
  useEffect(() => {
    let cancel = false;

    dispatch({ t: "fetch_start" });

    fetchTransactions({
      page: state.page,
      pageSize: state.pageSize,
      filters: state.filters,
      sortField: state.sortField,
      sortDir: state.sortDir,
    })
      .then((res) => {
        if (!cancel) dispatch({ t: "fetch_ok", payload: res });
      })
      .catch((err) => {
        if (!cancel) dispatch({ t: "fetch_fail", payload: err.message });
      });

    return () => { cancel = true; };
  }, [state.page, state.pageSize, state.filters, state.sortField, state.sortDir]);

  // persistir pageSize
  useEffect(() => {
    localStorage.setItem(PAGE_KEY, String(state.pageSize));
  }, [state.pageSize]);

  // wrapper para no exponer dispatch
  const update = useCallback(
    (patch: Parameters<typeof dispatch>[0] extends { t: "update"; payload: infer P } ? P : never) =>
      dispatch({ t: "update", payload: patch }),
    []
  );

  const reset = useCallback(() => dispatch({ t: "reset" }), []);

  const toggleSort = useCallback(
    (field: SortField) => {
      const next: SortDir =
        state.sortField !== field
          ? "asc"
          : state.sortDir === "asc"
          ? "desc"
          : state.sortDir === "desc"
          ? null
          : "asc";

      dispatch({
        t: "update",
        payload: {
          sortField: next ? field : "date",
          sortDir: next,
          page: 1,
        },
      });
    },
    [state.sortField, state.sortDir]
  );

  return {
    ...state,
    update,
    reset,
    toggleSort,
  };
}