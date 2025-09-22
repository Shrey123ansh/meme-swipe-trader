// API Types for Wallet Tracker

export interface DashboardStats {
  totalWallets: number;
  totalProfit: number;
  activeWallets: number;
  totalTransactions: number;
}

export interface WalletStats {
  totalProfit: number;
  transactionCount: number;
  lastUpdate: string;
}

export interface Wallet {
  id: string;
  address: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  stats?: WalletStats;
}

export interface CreateWalletRequest {
  address: string;
  name: string;
  description: string;
}

export interface UpdateWalletRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface Transaction {
  id: string;
  walletAddress: string;
  tokenAddress: string;
  tradeType: 'BUY' | 'SELL';
  amount: number;
  tradedAt: string;
  priceAt: number;
}

export interface TransactionsResponse {
  limit: number;
  cursor: string;
  data: Transaction[];
}

export interface PerformanceData {
  date: string;
  profit: number;
  transactionCount: number;
}

export interface SearchWalletsParams {
  query?: string;
  isActive?: boolean;
  minProfit?: number;
  maxProfit?: number;
  limit?: number;
  offset?: number;
}

export interface SearchWalletsResponse {
  wallets: Wallet[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateTradeRequest {
  walletAddress: string;
  tokenAddress: string;
  tradeType: 'BUY' | 'SELL';
  amount: number;
  tradedAt: string;
  priceAt: number;
}

export interface RecentTradesParams {
  walletAddress: string;
  limit?: number;
  cursor?: string;
}

export interface ApiError {
  error: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading?: boolean;
}
