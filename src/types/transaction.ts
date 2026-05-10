export type Currency = 'USD' | 'EUR' | 'CLP' | 'BTC';
export type TransactionType = 'credit' | 'debit';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: Currency;
  accountOrigin: string;
  accountDestination: string;
}

export interface TransactionFilters {
  dateFrom?: string;
  dateTo?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  currency?: Currency;
  amountMin?: number;
  amountMax?: number;
  search?: string;
}

export interface FetchParams {
  page: number;
  pageSize: number;
  filters: TransactionFilters;
  sortField?: SortField;
  sortDirection?: SortDirection;
}

export type SortField = 'date' | 'amount';
export type SortDirection = 'asc' | 'desc';

export interface FetchResult {
  items: Transaction[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

export const CURRENCY_OPTIONS: Currency[] = ['USD', 'EUR', 'CLP', 'BTC'];
export const TYPE_OPTIONS: TransactionType[] = ['credit', 'debit'];
export const STATUS_OPTIONS: TransactionStatus[] = ['completed', 'pending', 'failed'];