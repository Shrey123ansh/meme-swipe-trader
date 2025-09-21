export interface TokenDetails {
  tokenAddress: string;
  name: string;
  symbol: string;
  creator: string;
  sold: string;
  raised: string;
  isOpen: boolean;
  totalSupply: string;
  remainingTokens: string;
}

export interface BasicTokenInfo {
  tokenAddress: string;
  name: string;
  symbol: string;
  creator: string;
}

export interface DisplayToken {
  id: string;
  name: string;
  symbol: string;
  tokenAddress: string;
  creator: string;
  price: number;
  change24h: number;
  logo: string;
  isOpen: boolean;
  sold: string;
  raised: string;
  marketCap?: string;
  description?: string;
  chartData?: Array<{
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
}