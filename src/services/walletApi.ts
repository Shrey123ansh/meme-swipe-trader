import { 
  DashboardStats, 
  Wallet, 
  CreateWalletRequest, 
  UpdateWalletRequest,
  Transaction,
  TransactionsResponse,
  PerformanceData,
  SearchWalletsParams,
  SearchWalletsResponse,
  CreateTradeRequest,
  RecentTradesParams,
  ApiError
} from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://blocktrain-backend-production.up.railway.app/api/v1';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(response.status, errorData.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

export class WalletApiService {
  // Dashboard Statistics
  static async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
    return handleResponse<DashboardStats>(response);
  }

  // Wallet Management
  static async getWallets(includeStats: boolean = true): Promise<Wallet[]> {
    const params = new URLSearchParams({ includeStats: includeStats.toString() });
    const response = await fetch(`${API_BASE_URL}/wallets?${params}`);
    return handleResponse<Wallet[]>(response);
  }

  static async getWallet(id: string, includeStats: boolean = true): Promise<Wallet> {
    const params = new URLSearchParams({ includeStats: includeStats.toString() });
    const response = await fetch(`${API_BASE_URL}/wallets/${id}?${params}`);
    return handleResponse<Wallet>(response);
  }

  static async createWallet(wallet: CreateWalletRequest): Promise<Wallet> {
    const response = await fetch(`${API_BASE_URL}/wallets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wallet),
    });
    return handleResponse<Wallet>(response);
  }

  static async updateWallet(id: string, updates: UpdateWalletRequest): Promise<Wallet> {
    const response = await fetch(`${API_BASE_URL}/wallets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    return handleResponse<Wallet>(response);
  }

  static async deleteWallet(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/wallets/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ApiError(response.status, errorData.error || `HTTP ${response.status}`);
    }
  }

  // Wallet Search and Filtering
  static async searchWallets(params: SearchWalletsParams = {}): Promise<SearchWalletsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.query) searchParams.append('query', params.query);
    if (params.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());
    if (params.minProfit !== undefined) searchParams.append('minProfit', params.minProfit.toString());
    if (params.maxProfit !== undefined) searchParams.append('maxProfit', params.maxProfit.toString());
    if (params.limit !== undefined) searchParams.append('limit', params.limit.toString());
    if (params.offset !== undefined) searchParams.append('offset', params.offset.toString());

    const response = await fetch(`${API_BASE_URL}/wallets/search?${searchParams}`);
    return handleResponse<SearchWalletsResponse>(response);
  }

  // Wallet Details
  static async getWalletTransactions(
    id: string, 
    limit: number = 10, 
    cursor?: string, 
    tradeType?: 'BUY' | 'SELL'
  ): Promise<TransactionsResponse> {
    const searchParams = new URLSearchParams({ limit: limit.toString() });
    if (cursor) searchParams.append('cursor', cursor);
    if (tradeType) searchParams.append('tradeType', tradeType);

    const response = await fetch(`${API_BASE_URL}/wallets/${id}/transactions?${searchParams}`);
    return handleResponse<TransactionsResponse>(response);
  }

  static async getWalletPerformance(id: string, days: number = 30): Promise<PerformanceData[]> {
    const params = new URLSearchParams({ days: days.toString() });
    const response = await fetch(`${API_BASE_URL}/wallets/${id}/performance?${params}`);
    return handleResponse<PerformanceData[]>(response);
  }

  // Export Functionality
  static async exportWallets(format: 'json' | 'csv' = 'json'): Promise<Blob> {
    const params = new URLSearchParams({ format });
    const response = await fetch(`${API_BASE_URL}/wallets/export?${params}`);
    
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ApiError(response.status, errorData.error || `HTTP ${response.status}`);
    }
    
    return response.blob();
  }

  // Trade Management
  static async createTrade(trade: CreateTradeRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/trade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trade),
    });
    
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ApiError(response.status, errorData.error || `HTTP ${response.status}`);
    }
  }

  static async getRecentTrades(params: RecentTradesParams): Promise<Transaction[]> {
    const searchParams = new URLSearchParams({ 
      walletAddress: params.walletAddress,
      limit: (params.limit || 5).toString()
    });
    if (params.cursor) searchParams.append('cursor', params.cursor);

    const response = await fetch(`${API_BASE_URL}/recent-trades?${searchParams}`);
    return handleResponse<Transaction[]>(response);
  }
}

export { ApiError };
