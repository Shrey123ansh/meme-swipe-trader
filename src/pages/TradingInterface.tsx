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
    <div className="py-8 space-y-8 narrow-content">
      {/* Base Mini App Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Swipe to Trade</h1>
        <div className="flex items-center space-x-4">
          {selectedValue && (
            <div className="text-sm text-primary font-medium">
              {selectedValue} ETH
            </div>
          )}
          <div className="text-sm text-muted-foreground">
            {currentIndex + 1} / {mockMemecoins.length}
          </div>
        </div>
      </div>

      {/* Selected Investment Amount Display - Base Mini App Style */}
      {selectedValue && (
        <Card className="mini-app-card border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Investment Amount</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedValue} ETH
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary">
                  ${investmentAmount[0]}
                </div>
                <div className="text-sm text-muted-foreground">USD equivalent</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Swipe Instructions - Base Mini App Style */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-destructive" />
          </div>
          <span className="text-xs text-destructive font-medium">Pass</span>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
            <ArrowUp className="w-4 h-4 text-warning" />
          </div>
          <span className="text-xs text-warning font-medium">Watch</span>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
            <ArrowRight className="w-4 h-4 text-success" />
          </div>
          <span className="text-xs text-success font-medium">Invest</span>
        </div>
      </div>

      {/* Trading Card - Base Mini App Style */}
      <div className="relative h-[500px]">
        <motion.div
          key={currentIndex}
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          animate={controls}
          whileDrag={{ scale: 1.02, rotate: 2 }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          <Card className="h-full mini-app-card swipe-card">
            <CardContent className="p-6 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <img 
                      src={currentCoin.logo} 
                      alt={currentCoin.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{currentCoin.name}</CardTitle>
                    <div className="text-sm text-muted-foreground">{currentCoin.symbol}</div>
                  </div>
                </div>
                <Badge
                  variant={currentCoin.change24h > 0 ? "default" : "destructive"}
                  className={`text-sm ${
                    currentCoin.change24h > 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {currentCoin.change24h > 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(currentCoin.change24h).toFixed(2)}%
                </Badge>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold price-pulse mb-2">
                  ${currentCoin.price.toFixed(6)}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Market Cap</div>
                    <div className="font-semibold">${currentCoin.marketCap}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Volume 24h</div>
                    <div className="font-semibold">${currentCoin.volume}</div>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="flex-1 mb-6">
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="time" hide />
                      <YAxis hide />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground text-center mb-6 line-clamp-2">
                {currentCoin.description}
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleSwipe('left')}
                  className="border-destructive text-destructive hover:bg-destructive/10 mini-app-button"
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleSwipe('up')}
                  className="border-warning text-warning hover:bg-warning/10 mini-app-button"
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  onClick={() => handleSwipe('right')}
                  className="bg-success hover:bg-success/90 text-success-foreground mini-app-button"
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TradingInterface;