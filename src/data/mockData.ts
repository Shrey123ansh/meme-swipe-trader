import dogeceoLogo from '@/assets/dogeceo-logo.jpg';
import pepeCorpLogo from '@/assets/pepecorp-logo.jpg';
import shibaKingLogo from '@/assets/shibakinb-logo.jpg';
import flokiMoonLogo from '@/assets/flokimoon-logo.jpg';
import safeRocketLogo from '@/assets/saferocket-logo.jpg';

// Mock OHLC data generator
const generateOHLCData = (basePrice: number, days: number = 30) => {
  const data = [];
  let price = basePrice;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  for (let i = 0; i < days * 24; i++) {
    const date = new Date(startDate);
    date.setHours(date.getHours() + i);
    
    const volatility = 0.02;
    const change = (Math.random() - 0.5) * volatility;
    const open = price;
    const high = price * (1 + Math.random() * volatility);
    const low = price * (1 - Math.random() * volatility);
    const close = price * (1 + change);
    
    data.push({
      timestamp: date.getTime(),
      open: parseFloat(open.toFixed(6)),
      high: parseFloat(high.toFixed(6)),
      low: parseFloat(low.toFixed(6)),
      close: parseFloat(close.toFixed(6)),
      volume: Math.floor(Math.random() * 1000000) + 100000
    });
    
    price = close;
  }
  
  return data;
};

export interface Memecoin {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: string;
  volume: string;
  description: string;
  logo: string;
  chartData: Array<{
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
}

export interface Trader {
  id: string;
  username: string;
  avatar: string;
  pnl: number;
  pnlPercentage: number;
  winRate: number;
  followers: number;
  totalTrades: number;
  profitShareRate: number;
  minInvestment: number;
  walletAddress: string;
  recentTrades: Array<{
    token: string;
    type: 'buy' | 'sell';
    amount: string;
    profit: number;
    timestamp: string;
  }>;
}

export interface WalletData {
  address: string;
  nickname: string;
  totalPnl: number;
  lastActive: string;
  transactions: Array<{
    id: string;
    token: string;
    type: 'buy' | 'sell';
    amount: string;
    price: number;
    pnl: number;
    timestamp: string;
  }>;
}

export const mockMemecoins: Memecoin[] = [
  {
    id: '1',
    name: 'DogeCEO',
    symbol: 'DCEO',
    price: 0.000123,
    change24h: 15.34,
    marketCap: '1.2M',
    volume: '456K',
    description: 'The ultimate business dog meme leading the crypto revolution with corporate excellence!',
    logo: dogeceoLogo,
    chartData: generateOHLCData(0.000123)
  },
  {
    id: '2',
    name: 'PepeCorp',
    symbol: 'PEPE',
    price: 0.000456,
    change24h: -8.21,
    marketCap: '2.8M',
    volume: '892K',
    description: 'Corporate Pepe bringing memes to the boardroom with institutional-grade entertainment.',
    logo: pepeCorpLogo,
    chartData: generateOHLCData(0.000456)
  },
  {
    id: '3',
    name: 'ShibaKing',
    symbol: 'KING',
    price: 0.000789,
    change24h: 42.67,
    marketCap: '5.1M',
    volume: '1.2M',
    description: 'Royal Shiba ruling the crypto kingdom with diamond paws and moon missions!',
    logo: shibaKingLogo,
    chartData: generateOHLCData(0.000789)
  },
  {
    id: '4',
    name: 'FlokiMoon',
    symbol: 'FLOKI',
    price: 0.000234,
    change24h: 23.45,
    marketCap: '3.4M',
    volume: '678K',
    description: 'Viking dog sailing to the moon with Nordic strength and crypto valor!',
    logo: flokiMoonLogo,
    chartData: generateOHLCData(0.000234)
  },
  {
    id: '5',
    name: 'SafeRocket',
    symbol: 'SAFE',
    price: 0.000567,
    change24h: -12.89,
    marketCap: '987K',
    volume: '234K',
    description: 'The safest rocket to the moon with audit-grade security and community trust!',
    logo: safeRocketLogo,
    chartData: generateOHLCData(0.000567)
  }
];

export const mockTraders: Trader[] = [
  {
    id: '1',
    username: 'CryptoWhale99',
    avatar: '🐋',
    pnl: 125000,
    pnlPercentage: 340.5,
    winRate: 87.3,
    followers: 15420,
    totalTrades: 892,
    profitShareRate: 12,
    minInvestment: 500,
    walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    recentTrades: [
      { token: 'DCEO', type: 'buy', amount: '10K', profit: 2400, timestamp: '2h ago' },
      { token: 'KING', type: 'sell', amount: '5K', profit: 1800, timestamp: '4h ago' },
      { token: 'PEPE', type: 'buy', amount: '15K', profit: -600, timestamp: '6h ago' }
    ]
  },
  {
    id: '2',
    username: 'MemeKing',
    avatar: '👑',
    pnl: 89000,
    pnlPercentage: 245.2,
    winRate: 82.1,
    followers: 9876,
    totalTrades: 654,
    profitShareRate: 10,
    minInvestment: 200,
    walletAddress: '0x8ba1f109551bD432803012645Hac136c4c4c4c4c',
    recentTrades: [
      { token: 'FLOKI', type: 'buy', amount: '8K', profit: 1200, timestamp: '1h ago' },
      { token: 'SAFE', type: 'sell', amount: '12K', profit: 2100, timestamp: '3h ago' }
    ]
  },
  {
    id: '3',
    username: 'DiamondHands',
    avatar: '💎',
    pnl: 67500,
    pnlPercentage: 189.7,
    winRate: 79.8,
    followers: 12340,
    totalTrades: 445,
    profitShareRate: 15,
    minInvestment: 1000,
    walletAddress: '0x9cA855777E4b8C5d3f2b1a0e9d8c7b6a5f4e3d2c1',
    recentTrades: [
      { token: 'DCEO', type: 'buy', amount: '20K', profit: 3400, timestamp: '30m ago' },
      { token: 'KING', type: 'buy', amount: '7K', profit: 980, timestamp: '2h ago' }
    ]
  }
];

export const mockWallets: WalletData[] = [
  {
    address: '0x1234...5678',
    nickname: 'Main Trading Wallet',
    totalPnl: 45600,
    lastActive: '5m ago',
    transactions: [
      { id: '1', token: 'DCEO', type: 'buy', amount: '5000', price: 0.000123, pnl: 1200, timestamp: '2h ago' },
      { id: '2', token: 'KING', type: 'sell', amount: '3000', price: 0.000789, pnl: 2400, timestamp: '4h ago' },
      { id: '3', token: 'PEPE', type: 'buy', amount: '8000', price: 0.000456, pnl: -300, timestamp: '6h ago' }
    ]
  },
  {
    address: '0xabcd...efgh',
    nickname: 'HODL Vault',
    totalPnl: 23400,
    lastActive: '1h ago',
    transactions: [
      { id: '4', token: 'FLOKI', type: 'buy', amount: '10000', price: 0.000234, pnl: 1800, timestamp: '1h ago' },
      { id: '5', token: 'SAFE', type: 'buy', amount: '6000', price: 0.000567, pnl: 600, timestamp: '3h ago' }
    ]
  }
];