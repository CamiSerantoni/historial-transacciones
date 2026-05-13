"use client";

import { useReducer, useEffect, useCallback, useMemo } from "react";
import { fetchTransactions } from "@/lib/fetchTransactions";
import type { Transaction, TransactionFilters, FetchResult, PageSizeOption, SortField, SortDirection } from "@/types/transaction";

interface State {
  data: FetchResult | null;
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
  | { t: "fetch_start" }
  | { t: "fetch_ok"; payload: FetchResult }
  | { t: "fetch_fail"; payload: string }
  | { t: "update"; payload: Partial<Pick<State, "page" | "pageSize" | "filters" | "sortField" | "sortDirection">> }
  | { t: "clear_sort" }
  | { t: "reset" }
  | { t: "retry" };

const PAGE_KEY = "page_size";

function initialState(): State {
  return {
    data: null,
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
  switch (action.t) {
    case "fetch_start":
      return { ...state, loading: true, error: null };
    case "fetch_ok":
      return { ...state, loading: false, data: action.payload };
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

  // Lee localStorage después de montar - paginación
  useEffect(() => {
    try {
      const v = localStorage.getItem(PAGE_KEY);
      if (v === "25" || v === "50") {
        dispatch({ t: "update", payload: { pageSize: Number(v) as PageSizeOption } });
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch data — sort se aplica client-side, no se envía al servidor
  useEffect(() => {
    let cancel = false;

    dispatch({ t: "fetch_start" });

    fetchTransactions({
      page: state.page,
      pageSize: state.pageSize,
      filters: state.filters,
    })
      .then((res) => {
        if (!cancel) dispatch({ t: "fetch_ok", payload: res });
      })
      .catch((err) => {
        if (!cancel) dispatch({ t: "fetch_fail", payload: err.message });
      });

    return () => { cancel = true; };
  }, [state.page, state.pageSize, state.filters, state.fetchId]);

  // Aplicar sort client-side con useMemo — no re-fetch al ordenar
  const sortedItems = useMemo(() => {
    const items = state.data?.items ?? [];
    if (!state.sortField || !state.sortDirection) return items;

    return [...items].sort((a: Transaction, b: Transaction) => {
      let cmp: number;
      if (state.sortField === "date") {
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        cmp = a.amount - b.amount;
      }
      return state.sortDirection === "desc" ? -cmp : cmp;
    });
  }, [state.data, state.sortField, state.sortDirection]);

  // Persistir pageSize en localStorage
  useEffect(() => {
    localStorage.setItem(PAGE_KEY, String(state.pageSize));
  }, [state.pageSize]);

  const update = useCallback(
    (patch: Partial<Pick<State, "page" | "pageSize" | "filters" | "sortField" | "sortDirection">>) =>
      dispatch({ t: "update", payload: patch }),
    []
  );

  const reset = useCallback(() => dispatch({ t: "reset" }), []);

  const retry = useCallback(() => dispatch({ t: "retry" }), []);

  const toggleSort = useCallback(
    (field: SortField) => {
      if (state.sortField !== field) {
        //  asc
        dispatch({ t: "update", payload: { sortField: field, sortDirection: "asc", page: 1 } });
      } else if (state.sortDirection === "asc") {
        // desc
        dispatch({ t: "update", payload: { sortDirection: "desc" } });
      } else {
        // limpia sort
        dispatch({ t: "clear_sort" });
      }
    },
    [state.sortField, state.sortDirection]
  );

  // Construir data con items ordenados
  const data = state.data
    ? { ...state.data, items: sortedItems }
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