import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, Rocket, Crown, ArrowRight, Users, DollarSign, TrendingDown as SellIcon, Clock, CheckCircle, MessageSquare, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      token: 'DOGE',
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

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#f2f2f7] rounded-[16px] p-3 text-center">
              <DollarSign className="w-5 h-5 mx-auto mb-1 text-green-600" />
              <div className="text-[16px] font-semibold text-green-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                $2.4M
              </div>
              <div className="text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Volume 24h
              </div>
            </div>
            <div className="bg-[#f2f2f7] rounded-[16px] p-3 text-center">
              <Users className="w-5 h-5 mx-auto mb-1 text-[#0000ee]" />
              <div className="text-[16px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
                15.4K
              </div>
              <div className="text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Traders
              </div>
            </div>
            <div className="bg-[#f2f2f7] rounded-[16px] p-3 text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-orange-500" />
              <div className="text-[16px] font-semibold text-orange-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                +127%
              </div>
              <div className="text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Avg Returns
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
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

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3">
          <Link to="/copy-trading">
              <Button className="w-full bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[rgba(0,0,0,0.7)] rounded-[16px] h-10 text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                <Crown className="w-3 h-3 mr-1" />
              Copy Pros
            </Button>
          </Link>
            <Link to="/profile?tab=holdings">
              <Button className="w-full bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[rgba(0,0,0,0.7)] rounded-[16px] h-10 text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                <SellIcon className="w-3 h-3 mr-1" />
                Sell Tokens
            </Button>
          </Link>
        </div>

          {/* Trending Tokens Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[#0000ee] flex items-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                <BarChart3 className="w-5 h-5 mr-2 text-[#0000ee]" />
                {realTokens.length > 0 ? 'Created Tokens' : 'Trending'}
              </h2>
              <div className="flex items-center space-x-2">
                {realTokens.length > 0 && (
                  <Button
                    onClick={fetchTokens}
                    className="h-6 px-2 text-[10px] rounded-[8px] bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[rgba(0,0,0,0.7)]"
                    disabled={isLoadingTokens}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <RefreshCw className={`w-2.5 h-2.5 mr-1 ${isLoadingTokens ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                )}
                <Button
                  onClick={handleStartTrading}
                  className="h-6 px-2 text-[10px] rounded-[8px] bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[rgba(0,0,0,0.7)]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  View All
                  <ArrowRight className="w-2.5 h-2.5 ml-1" />
                </Button>
              </div>
            </div>

            {isLoadingTokens ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-[#f2f2f7] rounded-[16px] p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-2 w-12 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 w-12 bg-gray-200 rounded animate-pulse ml-auto" />
                        <div className="h-2 w-8 bg-gray-200 rounded animate-pulse ml-auto" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : tokenError ? (
              <div className="bg-[#f2f2f7] rounded-[16px] p-4 text-center">
                <div className="text-[12px] text-[rgba(0,0,0,0.5)] mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Failed to load tokens from contract
                </div>
                <Button
                  onClick={fetchTokens}
                  className="h-8 px-3 text-[10px] rounded-[8px] bg-[#007aff] hover:bg-[#0056b3] text-white mb-3"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Retry
                </Button>
                <p className="text-[10px] text-[rgba(0,0,0,0.3)]" style={{ fontFamily: 'Inter, sans-serif' }}>{tokenError}</p>
              </div>
            ) : realTokens.length > 0 ? (
              <div className="space-y-3">
                {realTokens.slice(0, 3).map((token, index) => (
                  <motion.div
                    key={token.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleCoinTrading(token.id)}
                    className="bg-[#f2f2f7] rounded-[16px] p-3 hover:bg-[#e5e5ea] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={token.logo}
                            alt={token.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-[14px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {token.symbol}
                          </div>
                          <div className="text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {token.isOpen ? '🟢 Active' : '🔴 Closed'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[14px] font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          ${token.price.toFixed(6)}
                        </div>
                        <div className={`text-[10px] ${token.change24h > 0 ? 'text-green-600' : 'text-red-600'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                          {token.change24h > 0 ? '+' : ''}{token.change24h.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {mockMemecoins.slice(0, 3).map((coin, index) => (
                  <motion.div
                    key={coin.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleCoinTrading(coin.id)}
                    className="bg-[#f2f2f7] rounded-[16px] p-3 hover:bg-[#e5e5ea] transition-colors cursor-pointer"
                  >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden">
                        <img 
                          src={coin.logo} 
                          alt={coin.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                          <div className="text-[14px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {coin.symbol}
                          </div>
                          <div className="text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {coin.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[14px] font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          ${coin.price.toFixed(6)}
                        </div>
                        <div className={`text-[10px] ${coin.change24h > 0 ? 'text-green-600' : 'text-red-600'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                          {coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div className="text-center py-4">
                  <p className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    No tokens created yet. <Link to="/create-coin" className="text-[#0000ee] hover:underline">Create the first one!</Link>
                  </p>
                      </div>
                    </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[#0000ee] flex items-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                <Clock className="w-5 h-5 mr-2 text-[#0000ee]" />
                Recent Transactions
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setIsFeedbackOpen(true)}
                  className="h-6 px-2 text-[10px] rounded-[8px] bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[rgba(0,0,0,0.7)]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  title="Share Feedback"
                >
                  <MessageSquare className="w-2.5 h-2.5 mr-1" />
                  Feedback
                </Button>
                <Link to="/profile?tab=trading">
                  <Button className="h-6 px-2 text-[10px] rounded-[8px] bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[rgba(0,0,0,0.7)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    View All
                  </Button>
                </Link>
                  </div>
                    </div>
                    
            <div className="space-y-3">
              {recentTransactions.slice(0, 2).map((tx, index) => (
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
                          {tx.amount} • {tx.timestamp}
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
            </motion.div>
          ))}
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