import { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo, useAnimation } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, ArrowUp, TrendingUp, TrendingDown, DollarSign, Heart, X, Check } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { mockMemecoins, Memecoin } from '@/data/mockData';
import { useSearchParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const TradingInterface = () => {
  const [searchParams] = useSearchParams();
  const initialCoinId = searchParams.get('coin');
  const selectedValue = searchParams.get('value');
  
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialCoinId) {
      const index = mockMemecoins.findIndex(coin => coin.id === initialCoinId);
      return index !== -1 ? index : 0;
    }
    return 0;
  });
  
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

  const currentCoin = mockMemecoins[currentIndex];

  const chartData = currentCoin.chartData.slice(-24).map((item, index) => ({
    time: `${index}:00`,
    price: item.close,
    volume: item.volume
  }));

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
      toast({
        title: "🚀 Investment Placed!",
        description: `Invested $${investmentAmount[0]} in ${currentCoin.name}`,
        className: "bg-success text-success-foreground border-success"
      });
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
    setCurrentIndex((prev) => (prev + 1) % mockMemecoins.length);
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
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
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
                  {currentCoin.description}
                </p>
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
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex % 4 ? 'bg-gray-900' : 'bg-gray-300'
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
            className="h-12 bg-red-50 text-red-600 rounded-xl font-medium transition-colors hover:bg-red-100"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Pass
          </button>
          <button
            onClick={() => handleSwipe('up')}
            className="h-12 bg-yellow-50 text-yellow-600 rounded-xl font-medium transition-colors hover:bg-yellow-100"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Watch
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="h-12 bg-green-50 text-green-600 rounded-xl font-medium transition-colors hover:bg-green-100"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Invest
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradingInterface;