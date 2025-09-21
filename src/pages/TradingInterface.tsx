import { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo, useAnimation } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, ArrowUp, TrendingUp, TrendingDown, DollarSign, Heart, X, Check, RefreshCw, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { mockMemecoins, Memecoin } from '@/data/mockData';
import { useSearchParams, Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { contractService } from '@/utils/contract';
import { DisplayToken } from '@/types/token';

const TradingInterface = () => {
  const [searchParams] = useSearchParams();
  const initialCoinId = searchParams.get('coin');
  const selectedValue = searchParams.get('value');

  const [realTokens, setRealTokens] = useState<DisplayToken[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBuying, setIsBuying] = useState(false);
  const [buyingTokens, setBuyingTokens] = useState<Set<string>>(new Set());

  // Use selected value from URL params, fallback to slider default
  const [investmentAmount, setInvestmentAmount] = useState(() => {
    if (selectedValue) {
      const value = parseFloat(selectedValue);
      return [value * 2000]; // Convert ETH to USD equivalent
    }
    return [100];
  });
  const [timeframe, setTimeframe] = useState('1h');
  const controls = useAnimation();

  // Use real tokens if available, fallback to mock data
  const tokensToUse = realTokens.length > 0 ? realTokens : mockMemecoins;
  const currentCoin = tokensToUse[currentIndex] || mockMemecoins[0];

  // Helper function to get token address safely
  const getTokenAddress = (token: DisplayToken | Memecoin): string | undefined => {
    return 'tokenAddress' in token ? token.tokenAddress : undefined;
  };

  // Generate chart data - use real data if available, fallback to mock
  const chartData = currentCoin.chartData
    ? currentCoin.chartData.slice(-24).map((item: any, index: number) => ({
        time: `${index}:00`,
        price: item.close,
        volume: item.volume
      }))
    : Array.from({ length: 24 }, (_, index) => ({
        time: `${index}:00`,
        price: currentCoin.price * (0.95 + Math.random() * 0.1),
        volume: Math.random() * 1000
      }));

  const fetchTokens = async () => {
    setIsLoadingTokens(true);
    setTokenError(null);

    try {
      await contractService.connect();
      const tokenDetails = await contractService.getAllTokenDetails();

      // Transform contract data to display format with generated chart data
      const displayTokens: DisplayToken[] = tokenDetails.map((token, index) => ({
        id: token.tokenAddress,
        name: token.name,
        symbol: token.symbol,
        tokenAddress: token.tokenAddress,
        creator: token.creator,
        price: 0.0001, // Fixed price from contract
        change24h: Math.random() * 20 - 10, // Mock change for now
        logo: `https://api.dicebear.com/7.x/shapes/svg?seed=${token.symbol}`,
        isOpen: token.isOpen,
        sold: token.sold,
        raised: token.raised,
        marketCap: (parseFloat(token.sold) * 0.0001).toFixed(4),
        description: `${token.name} is a memecoin token created on our platform. Trade with caution and do your own research.`,
        chartData: Array.from({ length: 24 }, (_, i) => ({
          time: `${i}:00`,
          open: 0.0001 * (0.95 + Math.random() * 0.1),
          high: 0.0001 * (1.0 + Math.random() * 0.1),
          low: 0.0001 * (0.9 + Math.random() * 0.1),
          close: 0.0001 * (0.95 + Math.random() * 0.1),
          volume: Math.random() * 1000
        }))
      }));

      setRealTokens(displayTokens);

      // Set initial index based on URL param if provided
      if (initialCoinId && displayTokens.length > 0) {
        const tokenIndex = displayTokens.findIndex(token => token.id === initialCoinId);
        if (tokenIndex !== -1) {
          setCurrentIndex(tokenIndex);
        }
      }
    } catch (error: any) {
      console.error('Error fetching tokens:', error);
      setTokenError(error.message || 'Failed to load tokens');
    } finally {
      setIsLoadingTokens(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, [initialCoinId]);

  const buyToken = async (tokenData: DisplayToken | Memecoin, amount: string) => {
    const tokenAddress = getTokenAddress(tokenData);
    if (!tokenAddress) {
      throw new Error('Token address not available - this token is from mock data');
    }

    setIsBuying(true);
    setBuyingTokens(prev => new Set(prev).add(tokenAddress));

    try {
      await contractService.connect();

      // Calculate ETH cost based on investment amount
      const ethAmount = selectedValue || "0.05"; // Default to 0.05 ETH if no amount selected
      const tokensToBuy = amount; // Amount of tokens to buy

      console.log(`Buying ${tokensToBuy} tokens of ${tokenData.symbol} for ${ethAmount} ETH`);

      const result = await contractService.buyToken(
        tokenAddress,
        tokensToBuy,
        ethAmount
      );

      return result;
    } finally {
      setIsBuying(false);
      setBuyingTokens(prev => {
        const newSet = new Set(prev);
        newSet.delete(tokenAddress);
        return newSet;
      });
    }
  };

  const handleSwipe = async (direction: 'left' | 'right' | 'up', info?: PanInfo) => {
    const swipeThreshold = 100;
    const velocityThreshold = 500;

    if (info) {
      const swipeDistance = Math.abs(info.offset.x) + Math.abs(info.offset.y);
      const swipeVelocity = Math.abs(info.velocity.x) + Math.abs(info.velocity.y);

      if (swipeDistance < swipeThreshold && swipeVelocity < velocityThreshold) {
        return;
      }
    }

    // Prevent buying if already in progress
    const currentTokenAddress = getTokenAddress(currentCoin);
    if (direction === 'right' && (isBuying || buyingTokens.has(currentTokenAddress || ''))) {
      return;
    }

    // Animate the card out
    const exitX = direction === 'left' ? -window.innerWidth : direction === 'right' ? window.innerWidth : 0;
    const exitY = direction === 'up' ? -window.innerHeight : 0;

    await controls.start({
      x: exitX,
      y: exitY,
      rotate: direction === 'left' ? -30 : direction === 'right' ? 30 : 0,
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 }
    });

    // Handle the action
    if (direction === 'right') {
      // Calculate default token amount to buy (e.g., 1000 tokens)
      const defaultTokenAmount = "1000";

      try {
        toast({
          title: "🔄 Processing Purchase...",
          description: `Buying ${defaultTokenAmount} ${currentCoin.symbol} tokens`,
          className: "bg-blue-50 text-blue-900 border-blue-200"
        });

        const result = await buyToken(currentCoin, defaultTokenAmount);

        toast({
          title: "🚀 Purchase Successful!",
          description: `Bought ${defaultTokenAmount} ${currentCoin.symbol} tokens! Tx: ${result.hash.slice(0, 10)}...`,
          className: "bg-green-50 text-green-900 border-green-200"
        });
      } catch (error: any) {
        console.error('Purchase failed:', error);
        toast({
          title: "❌ Purchase Failed",
          description: error.message || "Transaction failed. Please try again.",
          className: "bg-red-50 text-red-900 border-red-200"
        });

        // Reset card position if purchase failed
        await controls.start({
          x: 0,
          y: 0,
          rotate: 0,
          opacity: 1,
          scale: 1,
          transition: { duration: 0.3 }
        });
        return; // Don't move to next coin if purchase failed
      }
    } else if (direction === 'left') {
      toast({
        title: "👎 Passed",
        description: `Skipped ${currentCoin.name}`,
        className: "bg-muted"
      });
    } else if (direction === 'up') {
      toast({
        title: "⭐ Added to Watchlist",
        description: `${currentCoin.name} added to your watchlist`,
        className: "bg-warning text-warning-foreground border-warning"
      });
    }

    // Move to next coin and reset position
    setCurrentIndex((prev) => (prev + 1) % tokensToUse.length);
    await controls.start({
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.1 }
    });
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset } = info;
    
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      // Horizontal swipe
      if (offset.x > 100) {
        handleSwipe('right', info);
      } else if (offset.x < -100) {
        handleSwipe('left', info);
      } else {
        controls.start({ x: 0, y: 0, rotate: 0 });
      }
    } else {
      // Vertical swipe
      if (offset.y < -100) {
        handleSwipe('up', info);
      } else {
        controls.start({ x: 0, y: 0, rotate: 0 });
      }
    }
  };

  // Handle loading and error states
  if (isLoadingTokens) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 text-center">
            <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Loading Tokens
            </h2>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              Fetching tokens from smart contract...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Handle no tokens available
  if (!isLoadingTokens && realTokens.length === 0 && !tokenError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              No Tokens Available
            </h2>
            <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              No tokens have been created yet. Be the first to create one!
            </p>
            <Link to="/create-coin">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12" style={{ fontFamily: 'Inter, sans-serif' }}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Token
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (tokenError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 text-center">
            <X className="w-8 h-8 mx-auto mb-4 text-red-400" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Connection Failed
            </h2>
            <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              {tokenError}
            </p>
            <Button
              onClick={fetchTokens}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 mb-3"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <p className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
              Using demo tokens for now
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Main Trading Card - Helix Inspired */}
      <div className="w-full max-w-sm">
        {/* Trading Card Container */}
        <div className="relative">
          <motion.div
            key={currentIndex}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            animate={controls}
            whileDrag={{ scale: 1.02, rotate: 2 }}
            className="cursor-grab active:cursor-grabbing"
          >
            {/* Main Card - Clean & Minimal */}
            <div className={`bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden ${
              buyingTokens.has(getTokenAddress(currentCoin) || '') ? 'opacity-75' : ''
            }`}>
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                      <img 
                        src={currentCoin.logo} 
                        alt={currentCoin.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {currentCoin.symbol}
                      </h2>
                      <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {currentCoin.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                      ${currentCoin.price.toFixed(6)}
                    </div>
                    <div className={`text-sm font-medium ${
                      currentCoin.change24h > 0 ? 'text-green-600' : 'text-red-600'
                    }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                      {currentCoin.change24h > 0 ? '+' : ''}{currentCoin.change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="px-6 pb-4">
                <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {currentCoin.description || `${currentCoin.name} is a memecoin token. Trade with caution and do your own research.`}
                </p>

                {/* Show contract info for real tokens */}
                {realTokens.length > 0 && getTokenAddress(currentCoin) && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Contract:</span>
                      <span className="font-mono">{getTokenAddress(currentCoin)!.slice(0, 6)}...{getTokenAddress(currentCoin)!.slice(-4)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <span>Status:</span>
                      <span className={`font-medium ${'isOpen' in currentCoin && currentCoin.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                        {'isOpen' in currentCoin && currentCoin.isOpen ? '🟢 Active' : '🔴 Closed'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <span>Tokens Sold:</span>
                      <span>{parseFloat(('sold' in currentCoin ? currentCoin.sold : '0') || '0').toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Market Data */}
              <div className="px-6 pb-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Market Cap
                  </span>
                  <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                    ${currentCoin.marketCap}
                  </span>
                </div>
              </div>

              {/* Chart Section */}
              <div className="px-6 pb-6">
                <div className="h-24 bg-gray-50 rounded-xl p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="time" hide />
                      <YAxis hide />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke={currentCoin.change24h > 0 ? "#10b981" : "#ef4444"}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Investment Amount - Only if selected */}
              {selectedValue && (
                <div className="px-6 pb-6">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Investment Amount
                        </p>
                        <p className="text-xs text-blue-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {selectedValue} ETH
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                          ${investmentAmount[0]}
                        </p>
                        <p className="text-xs text-blue-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                          USD equivalent
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Purchase Loading Overlay */}
          {buyingTokens.has(getTokenAddress(currentCoin) || '') && (
            <div className="absolute inset-0 bg-black bg-opacity-20 rounded-3xl flex items-center justify-center">
              <div className="bg-white rounded-2xl p-4 flex items-center space-x-3 shadow-lg">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Processing Purchase...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation - Clean & Minimal */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              Pass
            </span>
          </div>
          
          {/* Progress Dots */}
          <div className="flex space-x-2">
            {Array.from({ length: Math.min(tokensToUse.length, 5) }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex % Math.min(tokensToUse.length, 5) ? 'bg-gray-900' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              Invest
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
            Swipe or tap to decide
          </p>
        </div>

        {/* Action Buttons - Hidden but functional */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <button
            onClick={() => handleSwipe('left')}
            disabled={isBuying || buyingTokens.has(getTokenAddress(currentCoin) || '')}
            className="h-12 bg-red-50 text-red-600 rounded-xl font-medium transition-colors hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Pass
          </button>
          <button
            onClick={() => handleSwipe('up')}
            disabled={isBuying || buyingTokens.has(getTokenAddress(currentCoin) || '')}
            className="h-12 bg-yellow-50 text-yellow-600 rounded-xl font-medium transition-colors hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Watch
          </button>
          <button
            onClick={() => handleSwipe('right')}
            disabled={isBuying || buyingTokens.has(getTokenAddress(currentCoin) || '')}
            className="h-12 bg-green-50 text-green-600 rounded-xl font-medium transition-colors hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {buyingTokens.has(getTokenAddress(currentCoin) || '') ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Buying...
              </>
            ) : (
              'Invest'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default TradingInterface;