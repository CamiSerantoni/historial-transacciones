"use client";

import { useReducer, useEffect, useCallback } from "react";
import { fetchTransactions } from "@/lib/fetchTransactions";
import type { TransactionFilters, FetchResult, PageSizeOption, SortField, SortDirection } from "@/types/transaction";

interface State {
  data: FetchResult | null;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: PageSizeOption;
  filters: TransactionFilters;
  sortField: SortField;
  sortDirection: SortDirection;
  fetchId: number;
}

type Action =
  | { t: "fetch_start" }
  | { t: "fetch_ok"; payload: FetchResult }
  | { t: "fetch_fail"; payload: string }
  | { t: "update"; payload: Partial<Pick<State, "page" | "pageSize" | "filters" | "sortField" | "sortDirection">> }
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
    sortField: "date",
    sortDirection: "desc",
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
    }
  }, []);

  useEffect(() => {
    let cancel = false;

    dispatch({ t: "fetch_start" });

    fetchTransactions({
      page: state.page,
      pageSize: state.pageSize,
      filters: state.filters,
      sortField: state.sortField,
      sortDirection: state.sortDirection,
    })
      .then((res) => {
        if (!cancel) dispatch({ t: "fetch_ok", payload: res });
      })
      .catch((err) => {
        if (!cancel) dispatch({ t: "fetch_fail", payload: err.message });
      });

    return () => { cancel = true; };
  }, [state.page, state.pageSize, state.filters, state.sortField, state.sortDirection, state.fetchId]);

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
      const next: SortDirection | null =
        state.sortField !== field
          ? "asc"
          : state.sortDirection === "asc"
          ? "desc"
          : state.sortDirection === "desc"
          ? null
          : "asc";

      dispatch({
        t: "update",
        payload: {
          sortField: next ? field : "date",
          sortDirection: next ?? "desc",
          page: 1,
        },
      });
    },
    [state.sortField, state.sortDirection]
  );

  return {
    ...state,
    update,
    reset,
    retry,
    toggleSort,
  };
}