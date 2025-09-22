export interface StockDataPoint {
  datetime: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockData {
  symbol: string;
  fromDate: string;
  toDate: string;
  timeframe: string;
  totalCandles: number;
  fetchedAt: string;
  data: StockDataPoint[];
}

// List of available stock symbols in order
const STOCK_SYMBOLS = [
  'ALKEM',
  'COFORGE',
  'CUMMINSIND',
  'DIXON',
  'HDFCAMC',
  'HINDZINC',
  'MAXHEALTH',
  'MAZAGON',
  'SOLARINDS',
  'VIPUL'
];

// Cache for loaded stock data
const stockDataCache: Map<string, StockData> = new Map();

export const loadStockData = async (symbol: string): Promise<StockData | null> => {
  // Check cache first
  if (stockDataCache.has(symbol)) {
    return stockDataCache.get(symbol)!;
  }

  try {
    const response = await fetch(`/stock_data_1years/${symbol}_2024-09-19_to_2025-09-19_day.json`);
    if (!response.ok) {
      console.warn(`Failed to load stock data for ${symbol}`);
      return null;
    }

    const stockData: StockData = await response.json();
    stockDataCache.set(symbol, stockData);
    return stockData;
  } catch (error) {
    console.error(`Error loading stock data for ${symbol}:`, error);
    return null;
  }
};

export const getStockDataForIndex = async (index: number): Promise<StockData | null> => {
  const symbol = STOCK_SYMBOLS[index % STOCK_SYMBOLS.length];
  return loadStockData(symbol);
};

export const formatChartData = (stockData: StockData | null, dataPoints?: number) => {
  if (!stockData || !stockData.data) {
    return [];
  }

  // Use all data if no dataPoints specified, otherwise take the specified number from the end
  const dataToUse = dataPoints ? stockData.data.slice(-dataPoints) : stockData.data;

  // Format for chart display
  return dataToUse.map((point) => ({
    time: new Date(point.datetime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }),
    price: point.close,
    volume: point.volume,
    open: point.open,
    high: point.high,
    low: point.low,
    close: point.close,
    date: point.datetime
  }));
};

export const getStockSymbols = () => STOCK_SYMBOLS;