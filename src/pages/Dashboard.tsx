import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, Rocket, Crown, Target, ArrowRight, Users, DollarSign, TrendingDown as SellIcon, Shield, Clock, CheckCircle, ExternalLink, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockMemecoins } from '@/data/mockData';
import { Link } from 'react-router-dom';
import SocialFeatures from '@/components/SocialFeatures';
import ValueSelectionModal from '@/components/ValueSelectionModal';
import FeedbackModal from '@/components/FeedbackModal';

const Dashboard = () => {
  const [isValueModalOpen, setIsValueModalOpen] = useState(false);
  const [selectedCoinId, setSelectedCoinId] = useState<string | undefined>();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([
    {
      id: '1',
      type: 'buy',
      token: 'DCEO',
      amount: '$100',
      status: 'confirmed',
      hash: '0x1234...5678',
      timestamp: '2m ago'
    },
    {
      id: '2',
      type: 'sell',
      token: 'PEPE',
      amount: '$50',
      status: 'pending',
      hash: '0xabcd...efgh',
      timestamp: '5m ago'
    }
  ]);

  const handleStartTrading = () => {
    setSelectedCoinId(undefined);
    setIsValueModalOpen(true);
  };

  const handleCoinTrading = (coinId: string) => {
    setSelectedCoinId(coinId);
    setIsValueModalOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    hover: {
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400
      }
    }
  };

  return (
    <div className="py-8 space-y-8 narrow-content">
      {/* Base Mini App Hero Section - Clean & Mobile-first */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold gradient-text">
          Trade Memecoins
        </h1>
        <p className="text-muted-foreground text-base">
          Discover and trade the best memecoin opportunities
        </p>
        
        {/* Quick Action Buttons - Simplified Process Flow */}
        <div className="space-y-4">
          {/* Primary Action - Guided Trading */}
          <div className="text-center">
            <Button 
              onClick={handleStartTrading}
              className="mini-app-button bg-primary hover:bg-primary/90 text-primary-foreground w-full h-12 text-base font-semibold"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Start Trading
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Choose amount → Select token → Confirm trade
            </p>
          </div>
          
          {/* Secondary Actions - Clear Categories */}
          <div className="grid grid-cols-2 gap-3">
            <Link to="/copy-trading">
              <Button variant="outline" className="mini-app-button border-primary text-primary hover:bg-primary/10 w-full h-10">
                <Crown className="w-4 h-4 mr-2" />
                Copy Pros
              </Button>
            </Link>
            <Link to="/profile?tab=holdings">
              <Button variant="outline" className="mini-app-button border-red-500 text-red-500 hover:bg-red-50 w-full h-10">
                <SellIcon className="w-4 h-4 mr-2" />
                Sell Tokens
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Market Stats - Base Mini App Style */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3"
      >
        <Card className="mini-app-card">
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-success mb-1">$2.4M</div>
            <div className="text-xs text-muted-foreground">Volume 24h</div>
          </CardContent>
        </Card>
        <Card className="mini-app-card">
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-primary mb-1">15.4K</div>
            <div className="text-xs text-muted-foreground">Traders</div>
          </CardContent>
        </Card>
        <Card className="mini-app-card">
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-warning mb-1">+127%</div>
            <div className="text-xs text-muted-foreground">Avg Returns</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Trending Memecoins - Base Mini App Style */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">🔥 Trending</h2>
          <Button 
            onClick={handleStartTrading}
            variant="ghost" 
            size="sm" 
            className="text-primary"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-3">
          {mockMemecoins.slice(0, 4).map((coin) => (
            <motion.div key={coin.id} variants={cardVariants}>
              <div onClick={() => handleCoinTrading(coin.id)}>
                <Card className="mini-app-card group cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden">
                          <img 
                            src={coin.logo} 
                            alt={coin.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-base">{coin.name}</CardTitle>
                          <CardDescription className="text-sm">{coin.symbol}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold price-pulse">
                          ${coin.price.toFixed(6)}
                        </div>
                        <Badge
                          variant={coin.change24h > 0 ? "default" : "destructive"}
                          className={`text-xs ${
                            coin.change24h > 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                          }`}
                        >
                          {coin.change24h > 0 ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {Math.abs(coin.change24h).toFixed(2)}%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Transaction Status - Real-time Updates */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFeedbackOpen(true)}
              className="h-8 w-8 p-0"
              title="Share Feedback"
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
            <Link to="/profile?tab=trading" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
        </div>
        
        <div className="space-y-2">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="mini-app-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.type === 'buy' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {tx.type === 'buy' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{tx.type.toUpperCase()} {tx.token}</div>
                    <div className="text-sm text-muted-foreground">{tx.amount}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                    tx.status === 'confirmed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {tx.status === 'confirmed' ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    <span className="capitalize">{tx.status}</span>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => window.open(`https://basescan.org/tx/${tx.hash}`, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{tx.timestamp}</span>
                <span className="font-mono">{tx.hash}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Social Features - Base Mini App Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold">Community Activity</h2>
        <SocialFeatures 
          memecoinId="trending"
          initialLikes={1247}
          initialComments={89}
          initialShares={156}
        />
      </motion.div>

      {/* Value Selection Modal */}
      <ValueSelectionModal
        isOpen={isValueModalOpen}
        onClose={() => setIsValueModalOpen(false)}
        coinId={selectedCoinId}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
};

export default Dashboard;