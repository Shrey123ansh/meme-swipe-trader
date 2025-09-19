import { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo, useAnimation } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, ArrowRight, ArrowUp, TrendingUp, TrendingDown, DollarSign, Heart, X, Check } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { mockMemecoins, Memecoin } from '@/data/mockData';
import { useSearchParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const TradingInterface = () => {
  const [searchParams] = useSearchParams();
  const initialCoinId = searchParams.get('coin');
  
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialCoinId) {
      const index = mockMemecoins.findIndex(coin => coin.id === initialCoinId);
      return index !== -1 ? index : 0;
    }
    return 0;
  });
  
  const [investmentAmount, setInvestmentAmount] = useState([100]);
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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold gradient-text">Swipe to Trade</h1>
          <div className="text-sm text-muted-foreground">
            {currentIndex + 1} / {mockMemecoins.length}
          </div>
        </div>

        {/* Investment Amount Selector */}
        <Card className="mb-6 bg-gradient-card border-0 shadow-card-custom">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Investment Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Slider
                value={investmentAmount}
                onValueChange={setInvestmentAmount}
                max={10000}
                min={10}
                step={10}
                className="w-full"
              />
              <div className="text-center">
                <span className="text-2xl font-bold text-primary">${investmentAmount[0]}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Swipe Instructions */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-center text-sm">
          <div className="flex flex-col items-center space-y-1">
            <div className="w-10 h-10 bg-destructive/20 rounded-full flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-destructive" />
            </div>
            <span className="text-destructive">Pass</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
              <ArrowUp className="w-5 h-5 text-warning" />
            </div>
            <span className="text-warning">Watch</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-success" />
            </div>
            <span className="text-success">Invest</span>
          </div>
        </div>

        {/* Trading Card */}
        <div className="relative h-[600px] perspective-1000">
          <motion.div
            key={currentIndex}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            animate={controls}
            whileDrag={{ scale: 1.05, rotate: 5 }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <Card className="h-full bg-gradient-card border-0 shadow-glow overflow-hidden swipe-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/50">
                      <img 
                        src={currentCoin.logo} 
                        alt={currentCoin.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{currentCoin.name}</CardTitle>
                      <div className="text-muted-foreground">{currentCoin.symbol}</div>
                    </div>
                  </div>
                  <Badge
                    variant={currentCoin.change24h > 0 ? "default" : "destructive"}
                    className={`${currentCoin.change24h > 0 ? 'bg-success text-success-foreground' : 'bg-destructive'} text-lg px-3 py-1`}
                  >
                    {currentCoin.change24h > 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(currentCoin.change24h).toFixed(2)}%
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price */}
                <div className="text-center">
                  <div className="text-4xl font-bold price-pulse mb-2">
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
                <div className="h-40">
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

                {/* Volume Chart */}
                <div className="h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="time" hide />
                      <YAxis hide />
                      <Bar dataKey="volume" fill="hsl(var(--muted))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-center">
                  {currentCoin.description}
                </p>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleSwipe('left')}
                    className="border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleSwipe('up')}
                    className="border-warning text-warning hover:bg-warning/10"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => handleSwipe('right')}
                    className="bg-gradient-success hover:opacity-90"
                  >
                    <Check className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TradingInterface;