import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, TrendingUp, TrendingDown, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { mockMemecoins } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

interface MemeCardProps {
  memecoin: typeof mockMemecoins[0];
  isActive: boolean;
}

const MemeCard = ({ memecoin, isActive }: MemeCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(memecoin.price);
  const { toast } = useToast();

  // Simulate live price updates
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 0.001 * memecoin.price;
      setCurrentPrice(prev => Math.max(0, prev + change));
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, memecoin.price]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: `${memecoin.name} ${isLiked ? 'removed from' : 'added to'} your favorites`,
    });
  };

  const handleQuickBuy = () => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    toast({
      title: "🚀 Quick Buy Executed!",
      description: `Bought $100 worth of ${memecoin.symbol}`,
      className: "bg-gradient-success border-0",
    });
  };

  const priceChange = ((currentPrice - memecoin.price) / memecoin.price) * 100;

  return (
    <motion.div
      className="feed-card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Base Mini App Background - Clean & Minimal */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/20">
        <div className="absolute inset-0 bg-background/80" />
      </div>

      {/* Memecoin Image/Logo - Base Mini App Style */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <img
            src={memecoin.logo}
            alt={memecoin.name}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Live Price Display - Base Mini App Style */}
      <motion.div
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="text-4xl font-bold text-foreground mb-2">
          ${currentPrice.toFixed(6)}
        </div>
        <div className={`text-lg font-medium flex items-center justify-center space-x-1 ${
          priceChange >= 0 ? 'text-success' : 'text-destructive'
        }`}>
          {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%</span>
        </div>
      </motion.div>

      {/* Info Panel - Base Mini App Style */}
      <div className="absolute bottom-20 left-4 right-4">
        <Card className="mini-app-card backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-foreground">{memecoin.name}</h2>
              <Badge variant="secondary" className="text-sm px-2 py-1">
                {memecoin.symbol}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{memecoin.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Market Cap</span>
                <div className="font-semibold text-foreground">{memecoin.marketCap}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Volume</span>
                <div className="font-semibold text-foreground">{memecoin.volume}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons - Base Mini App Style */}
      <div className="absolute right-4 bottom-32 flex flex-col space-y-3">
        <motion.button
          onClick={handleLike}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="social-button"
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'text-destructive fill-current' : 'text-muted-foreground'}`} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="social-button"
        >
          <Share2 className="w-5 h-5 text-muted-foreground" />
        </motion.button>

        <motion.button
          onClick={() => setIsMuted(!isMuted)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="social-button"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-muted-foreground" /> : <Volume2 className="w-5 h-5 text-muted-foreground" />}
        </motion.button>

        <motion.button
          onClick={handleQuickBuy}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-sm"
        >
          <TrendingUp className="w-5 h-5 text-primary-foreground" />
        </motion.button>
      </div>

      {/* Pull to Refresh Indicator - Base Mini App Style */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 rounded-full bg-muted/50 backdrop-blur-sm flex items-center justify-center"
        >
          <RefreshCw className="w-3 h-3 text-muted-foreground" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function MemeFeedPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Enhanced touch/scroll handling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startY = 0;
    let isScrolling = false;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isScrolling) return;
      
      const currentY = e.touches[0].clientY;
      const diff = startY - currentY;
      
      if (Math.abs(diff) > 100) {
        isScrolling = true;
        
        if (diff > 0 && currentIndex < mockMemecoins.length - 1) {
          // Scroll down - next memecoin
          setCurrentIndex(prev => prev + 1);
          if (navigator.vibrate) {
            navigator.vibrate(30);
          }
        } else if (diff < 0 && currentIndex > 0) {
          // Scroll up - previous memecoin
          setCurrentIndex(prev => prev - 1);
          if (navigator.vibrate) {
            navigator.vibrate(30);
          }
        } else if (diff < 0 && currentIndex === 0) {
          // Pull to refresh at top
          handleRefresh();
        }
        
        setTimeout(() => {
          isScrolling = false;
        }, 300);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling) return;
      
      isScrolling = true;
      
      if (e.deltaY > 0 && currentIndex < mockMemecoins.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
      
      setTimeout(() => {
        isScrolling = false;
      }, 300);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [currentIndex]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (navigator.vibrate) {
      navigator.vibrate([50, 100, 50]);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsRefreshing(false);
    toast({
      title: "🔄 Feed Refreshed",
      description: "Loaded latest meme trends!",
    });
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-background snap-y snap-mandatory rounded-2xl narrow-content"
    >
      <AnimatePresence mode="wait">
        <MemeCard
          key={currentIndex}
          memecoin={mockMemecoins[currentIndex]}
          isActive={true}
        />
      </AnimatePresence>

      {/* Navigation Dots - Base Mini App Style */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
        {mockMemecoins.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1.5 h-6 rounded-full transition-colors ${
              index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Refresh Indicator - Base Mini App Style */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm rounded-full px-3 py-2 flex items-center space-x-2 shadow-sm border border-border"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="w-3 h-3 text-muted-foreground" />
            </motion.div>
            <span className="text-muted-foreground text-xs">Refreshing...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}