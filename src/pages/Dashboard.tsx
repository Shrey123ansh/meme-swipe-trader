import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, Rocket, Crown, Target, ArrowRight, Users, DollarSign, TrendingDown as SellIcon, Shield, Clock, CheckCircle, ExternalLink, MessageSquare, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockMemecoins } from '@/data/mockData';
import { Link, useNavigate } from 'react-router-dom';
import ValueSelectionModal from '@/components/ValueSelectionModal';
import FeedbackModal from '@/components/FeedbackModal';
import { contractService } from '@/utils/contract';
import { DisplayToken } from '@/types/token';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isValueModalOpen, setIsValueModalOpen] = useState(false);
  const [selectedCoinId, setSelectedCoinId] = useState<string | undefined>();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [realTokens, setRealTokens] = useState<DisplayToken[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
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

  const fetchTokens = async () => {
    setIsLoadingTokens(true);
    setTokenError(null);

    try {
      await contractService.connect();
      const tokenDetails = await contractService.getAllTokenDetails();

      // Transform contract data to display format
      const displayTokens: DisplayToken[] = tokenDetails.map((token, index) => ({
        id: token.tokenAddress,
        name: token.name,
        symbol: token.symbol,
        tokenAddress: token.tokenAddress,
        creator: token.creator,
        price: 0.0001, // Fixed price from contract
        change24h: Math.random() * 20 - 10, // Mock change for now
        logo: `https://api.dicebear.com/7.x/shapes/svg?seed=${token.symbol}`, // Generate avatar
        isOpen: token.isOpen,
        sold: token.sold,
        raised: token.raised,
        marketCap: (parseFloat(token.sold) * 0.0001).toFixed(4)
      }));

      setRealTokens(displayTokens);
    } catch (error: any) {
      console.error('Error fetching tokens:', error);
      setTokenError(error.message || 'Failed to load tokens');
    } finally {
      setIsLoadingTokens(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

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
    <div className="min-h-screen bg-[#f2f2f7] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Main Card - Clean White Design */}
        <div className="bg-white rounded-[30px] shadow-lg p-8 space-y-7">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-[30px] font-normal text-[#0000ee] leading-[45px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              MemeTrader
            </h1>
            <p className="text-[rgba(0,0,0,0.3)] text-[30px] leading-[36px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Trade memecoins
            </p>
          </div>

          {/* Quick Action Buttons - Consistent with WalletTracker */}
          <div className="space-y-3">
            <Button 
              onClick={handleStartTrading}
              className="w-full bg-[#007aff] hover:bg-[#0056b3] text-white rounded-[16px] h-12 text-[14px] font-normal"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Rocket className="w-4 h-4 mr-2" />
              Start Trading
            </Button>
            <p className="text-[12px] text-[rgba(0,0,0,0.5)] text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
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
          <h2 className="text-xl font-semibold">
            {realTokens.length > 0 ? '🚀 Created Tokens' : '🔥 Trending'}
          </h2>
          <div className="flex items-center space-x-2">
            {realTokens.length > 0 && (
              <Button
                onClick={fetchTokens}
                variant="ghost"
                size="sm"
                className="text-primary p-2"
                disabled={isLoadingTokens}
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingTokens ? 'animate-spin' : ''}`} />
              </Button>
            )}
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
        </div>

        {isLoadingTokens ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="mini-app-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto" />
                    <div className="h-3 w-12 bg-gray-200 rounded animate-pulse ml-auto" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : tokenError ? (
          <div className="mini-app-card p-6 text-center">
            <div className="text-muted-foreground mb-3">
              Failed to load tokens from contract
            </div>
            <Button
              onClick={fetchTokens}
              variant="outline"
              size="sm"
              className="mb-3"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
            <p className="text-xs text-muted-foreground">{tokenError}</p>
          </div>
        ) : realTokens.length > 0 ? (
          <div className="space-y-3">
            {realTokens.slice(0, 4).map((token) => (
              <motion.div key={token.id} variants={cardVariants}>
                <div onClick={() => handleCoinTrading(token.id)}>
                  <Card className="mini-app-card group cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={token.logo}
                              alt={token.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <CardTitle className="text-base">{token.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {token.symbol}
                              <span className="ml-2 text-xs text-muted-foreground">
                                {token.isOpen ? '🟢 Active' : '🔴 Closed'}
                              </span>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold price-pulse">
                            ${token.price.toFixed(6)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Sold: {parseFloat(token.sold).toFixed(2)}
                          </div>
                          <Badge
                            variant={token.change24h > 0 ? "default" : "destructive"}
                            className={`text-xs mt-1 ${
                              token.change24h > 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                            }`}
                          >
                            {token.change24h > 0 ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {Math.abs(token.change24h).toFixed(2)}%
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Address: {token.tokenAddress.slice(0, 6)}...{token.tokenAddress.slice(-4)}</span>
                          <span>Raised: {parseFloat(token.raised).toFixed(4)} ETH</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
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
            <div className="text-center text-muted-foreground text-sm py-4">
              No tokens created yet. <Link to="/create-coin" className="text-primary hover:underline">Create the first one!</Link>
            </div>
          </div>
        )}
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

          {/* Recent Transactions - Consistent Design */}
          <div className="space-y-4">
            <h2 className="text-[18px] font-semibold text-[#0000ee] flex items-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              <Clock className="w-5 h-5 mr-2 text-[#0000ee]" />
              Recent Transactions
            </h2>
            
            <div className="space-y-3">
              {recentTransactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#f2f2f7] rounded-[16px] p-3 hover:bg-[#e5e5ea] transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
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
                        <div className="text-[14px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {tx.type.toUpperCase()} {tx.token}
                        </div>
                        <div className="text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {tx.amount}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-[12px] px-2 py-1 rounded-[8px] ${
                        tx.status === 'confirmed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                        {tx.status === 'confirmed' ? (
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 inline mr-1" />
                        )}
                        {tx.status}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span>{tx.timestamp}</span>
                    <Button
                      onClick={() => window.open(`https://basescan.org/tx/${tx.hash}`, '_blank')}
                      className="h-6 px-2 text-[10px] rounded-[8px] bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[rgba(0,0,0,0.7)]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <ExternalLink className="w-2.5 h-2.5 mr-1" />
                      View
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Your Holdings - Consistent Design */}
          <div className="space-y-4">
            <h2 className="text-[18px] font-semibold text-[#0000ee] flex items-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              <Wallet className="w-5 h-5 mr-2 text-[#0000ee]" />
              Your Holdings
            </h2>

            {/* Holdings Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#f2f2f7] rounded-[16px] p-3 text-center">
                <Wallet className="w-5 h-5 mx-auto mb-1 text-[#0000ee]" />
                <div className="text-[16px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  4
                </div>
                <div className="text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Tokens Owned
                </div>
              </div>
              <div className="bg-[#f2f2f7] rounded-[16px] p-3 text-center">
                <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-600" />
                <div className="text-[16px] font-semibold text-green-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  +$2,400
                </div>
                <div className="text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Total P&L
                </div>
              </div>
              <div className="bg-[#f2f2f7] rounded-[16px] p-3 text-center">
                <BarChart3 className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                <div className="text-[16px] font-semibold text-orange-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                  +15.2%
                </div>
                <div className="text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Avg Returns
                </div>
              </div>
            </div>

            {/* Holdings List */}
            <div className="space-y-3">
              {[
                { symbol: 'PEPE', name: 'Pepe', amount: 1000000, value: 450, change: 12.5, logo: '🐸' },
                { symbol: 'DOGE', name: 'Dogecoin', amount: 500, value: 40, change: -2.3, logo: '🐕' },
                { symbol: 'SHIB', name: 'Shiba Inu', amount: 2000000, value: 20, change: 8.7, logo: '🐕‍🦺' }
              ].map((holding, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#f2f2f7] rounded-[16px] p-3 hover:bg-[#e5e5ea] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                        {holding.logo}
                      </div>
                      <div>
                        <div className="text-[14px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {holding.name}
                        </div>
                        <div className="text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {holding.symbol}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[14px] font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>
                        ${holding.value}
                      </div>
                      <div className={`text-[10px] ${holding.change > 0 ? 'text-green-600' : 'text-red-600'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                        {holding.change > 0 ? '+' : ''}{holding.change.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                onClick={() => navigate('/profile?section=holdings')}
                className="flex-1 bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[rgba(0,0,0,0.7)] rounded-[16px] h-10 text-[12px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Wallet className="w-3 h-3 mr-1" />
                Manage
              </Button>
              <Button
                onClick={() => navigate('/profile?section=holdings')}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-[16px] h-10 text-[12px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <TrendingDown className="w-3 h-3 mr-1" />
                Sell
              </Button>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-4">
          <Button
            onClick={() => navigate('/')}
            className="w-12 h-12 bg-black rounded-full p-0 hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </Button>
        </div>
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