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
      className="relative w-full h-screen snap-start"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 animate-gradient">
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Memecoin Image/Logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 360]
          }}
          transition={{
            scale: { duration: 2, repeat: Infinity },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" }
          }}
        >
          <img
            src={memecoin.logo}
            alt={memecoin.name}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Live Price Animation */}
      <motion.div
        className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-center"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-6xl font-bold text-white drop-shadow-lg">
          ${currentPrice.toFixed(6)}
        </div>
        <div className={`text-2xl font-semibold flex items-center justify-center space-x-2 ${
          priceChange >= 0 ? 'text-success' : 'text-destructive'
        }`}>
          {priceChange >= 0 ? <TrendingUp /> : <TrendingDown />}
          <span>{priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%</span>
        </div>
      </motion.div>

      {/* Info Panel */}
      <div className="absolute bottom-24 left-4 right-4">
        <Card className="bg-black/60 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-white">{memecoin.name}</h2>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {memecoin.symbol}
              </Badge>
            </div>
            <p className="text-white/80 mb-4">{memecoin.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/60">Market Cap</span>
                <div className="text-white font-semibold">{memecoin.marketCap}</div>
              </div>
              <div>
                <span className="text-white/60">Volume</span>
                <div className="text-white font-semibold">{memecoin.volume}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons - Right Side */}
      <div className="absolute right-4 bottom-32 flex flex-col space-y-4">
        <motion.button
          onClick={handleLike}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center"
        >
          <Heart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : 'text-white'}`} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center"
        >
          <Share2 className="w-6 h-6 text-white" />
        </motion.button>

        <motion.button
          onClick={() => setIsMuted(!isMuted)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center"
        >
          {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
        </motion.button>

        <motion.button
          onClick={handleQuickBuy}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg"
        >
          <TrendingUp className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Pull to Refresh Indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
        >
          <RefreshCw className="w-4 h-4 text-white" />
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
      className="relative w-full h-screen overflow-hidden bg-background snap-y snap-mandatory"
    >
      <AnimatePresence mode="wait">
        <MemeCard
          key={currentIndex}
          memecoin={mockMemecoins[currentIndex]}
          isActive={true}
        />
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
        {mockMemecoins.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-8 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/30'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Refresh Indicator */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md rounded-full px-4 py-2 flex items-center space-x-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="w-4 h-4 text-white" />
            </motion.div>
            <span className="text-white text-sm">Refreshing...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}