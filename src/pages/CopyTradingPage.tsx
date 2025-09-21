import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  UserPlus, 
  Star, 
  Crown, 
  Medal, 
  Award,
  X,
  Filter,
  Search
} from 'lucide-react';
import { mockTraders, Trader } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const CopyTradingPage = () => {
  const [followedTraders, setFollowedTraders] = useState<Set<string>>(new Set());
  const [investmentAmount, setInvestmentAmount] = useState([1000]);
  const [profitShare, setProfitShare] = useState([10]);
  const [riskTolerance, setRiskTolerance] = useState('medium');
  const [showAllTraders, setShowAllTraders] = useState(false);
  
  const sortedTraders = [...mockTraders].sort((a, b) => b.pnlPercentage - a.pnlPercentage);

  const handleFollow = (traderId: string, traderName: string) => {
    const newFollowed = new Set(followedTraders);
    if (followedTraders.has(traderId)) {
      newFollowed.delete(traderId);
      toast({
        title: "Unfollowed",
        description: `Stopped copying ${traderName}`,
        className: "bg-muted"
      });
    } else {
      newFollowed.add(traderId);
      toast({
        title: "🎉 Now Following!",
        description: `Started copying ${traderName}'s trades`,
        className: "bg-success text-success-foreground border-success"
      });
    }
    setFollowedTraders(newFollowed);
  };

  const startCopyTrading = (trader: Trader) => {
    toast({
      title: "🚀 Copy Trading Started!",
      description: `Auto-copying ${trader.username} with $${investmentAmount[0]} and ${profitShare[0]}% profit share`,
      className: "bg-primary text-primary-foreground border-primary"
    });
  };

  const handleSellCopiedTokens = (trader: Trader) => {
    toast({
      title: "🚀 Sell Order Placed!",
      description: `Selling all copied tokens from ${trader.username}`,
      className: "bg-success text-success-foreground border-success"
    });
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="w-5 h-5 text-warning" />;
      case 1: return <Medal className="w-5 h-5 text-muted-foreground" />;
      case 2: return <Award className="w-5 h-5 text-warning/70" />;
      default: return <Trophy className="w-4 h-4 text-muted-foreground" />;
    }
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
              Copy Trading
            </h1>
            <p className="text-[rgba(0,0,0,0.3)] text-[30px] leading-[36px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Follow top traders
            </p>
          </div>

          {/* Stats Cards - Optimized for narrow container */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#f2f2f7] rounded-[16px] p-3 text-center">
              <Users className="w-5 h-5 mx-auto mb-1 text-[#0000ee]" />
              <div className="text-[16px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {mockTraders.length}
              </div>
              <div className="text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Pro Traders
              </div>
            </div>
            <div className="bg-[#f2f2f7] rounded-[16px] p-3 text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-600" />
              <div className="text-[16px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
                87%
              </div>
              <div className="text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Win Rate
              </div>
            </div>
            <div className="bg-[#f2f2f7] rounded-[16px] p-3 text-center">
              <Star className="w-5 h-5 mx-auto mb-1 text-yellow-600" />
              <div className="text-[16px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
                245%
              </div>
              <div className="text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Avg Returns
              </div>
            </div>
            <div className="bg-[#f2f2f7] rounded-[16px] p-3 text-center">
              <UserPlus className="w-5 h-5 mx-auto mb-1 text-blue-600" />
              <div className="text-[16px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {followedTraders.size}
              </div>
              <div className="text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Following
              </div>
            </div>
          </div>

          {/* Search and Filter - Optimized for narrow container */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(0,0,0,0.3)]" />
              <input
                type="text"
                placeholder="Search traders..."
                className="w-full bg-[#f2f2f7] border-0 rounded-[16px] h-10 pl-10 pr-4 text-[14px] placeholder:text-[#999999] focus:ring-0"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[rgba(0,0,0,0.7)] rounded-[16px] h-10 text-[12px]">
                <Filter className="w-3 h-3 mr-1" />
                Filter
              </Button>
              <Button className="flex-1 bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[rgba(0,0,0,0.7)] rounded-[16px] h-10 text-[12px]">
                <Trophy className="w-3 h-3 mr-1" />
                Top Rated
              </Button>
            </div>
          </div>

          {/* Top Traders List */}
          <div className="space-y-4">
            <h2 className="text-[18px] font-semibold text-[#0000ee] flex items-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
              Top Performers
            </h2>

            <div className="space-y-3">
              {(showAllTraders ? sortedTraders : sortedTraders.slice(0, 5)).map((trader, index) => (
                <motion.div
                  key={trader.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#f2f2f7] rounded-[16px] p-3 hover:bg-[#e5e5ea] transition-colors"
                >
                  {/* Top Row - Rank, Avatar, Name, P&L */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {getRankIcon(index)}
                        <span className="text-[10px] font-medium text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          #{index + 1}
                        </span>
                      </div>
                      <div className="text-2xl">{trader.avatar}</div>
                      <div>
                        <div className="text-[14px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {trader.username}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-[14px] font-bold text-green-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                        +${trader.pnl.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-green-600 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                        +{trader.pnlPercentage}%
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row - Stats and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <span>{trader.winRate}% win rate</span>
                      <span>Profit: {trader.profitShareRate}%</span>
                      <span>Min: ${trader.minInvestment}</span>
                      <span className="font-mono">{trader.walletAddress.slice(0, 6)}...{trader.walletAddress.slice(-4)}</span>
                    </div>
                    
                    <div className="flex flex-col gap-2 items-end">
                      <Button
                        onClick={() => handleFollow(trader.id, trader.username)}
                        variant={followedTraders.has(trader.id) ? "outline" : "default"}
                        className={`h-6 px-2 text-[10px] rounded-[8px] ${
                          followedTraders.has(trader.id) 
                            ? 'border-green-500 text-green-600 hover:bg-green-50' 
                            : 'bg-[#007aff] hover:bg-[#0056b3] text-white'
                        }`}
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        <UserPlus className="w-2.5 h-2.5 mr-1" />
                        {followedTraders.has(trader.id) ? 'Following' : 'Follow'}
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="h-6 px-2 text-[10px] rounded-[8px] bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[rgba(0,0,0,0.7)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Copy
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-[20px] border-0 shadow-xl max-w-sm">
                          <DialogHeader>
                            <DialogTitle className="text-[16px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Copy {trader.username}
                            </DialogTitle>
                            <DialogDescription className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Set up automatic copy trading
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            {/* Investment Amount */}
                            <div>
                              <Label className="text-[12px] font-medium text-[rgba(0,0,0,0.7)] mb-2 block" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Investment: ${investmentAmount[0]}
                              </Label>
                              <Slider
                                value={investmentAmount}
                                onValueChange={setInvestmentAmount}
                                max={50000}
                                min={100}
                                step={100}
                                className="w-full"
                              />
                            </div>

                            {/* Profit Share */}
                            <div>
                              <Label className="text-[12px] font-medium text-[rgba(0,0,0,0.7)] mb-2 block" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Profit Share: {profitShare[0]}%
                              </Label>
                              <Slider
                                value={profitShare}
                                onValueChange={setProfitShare}
                                max={30}
                                min={5}
                                step={1}
                                className="w-full"
                              />
                            </div>

                            {/* Risk Tolerance */}
                            <div>
                              <Label className="text-[12px] font-medium text-[rgba(0,0,0,0.7)] mb-2 block" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Risk Level
                              </Label>
                              <RadioGroup value={riskTolerance} onValueChange={setRiskTolerance}>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="low" id={`low-${trader.id}`} />
                                  <Label htmlFor={`low-${trader.id}`} className="text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Low Risk
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="medium" id={`medium-${trader.id}`} />
                                  <Label htmlFor={`medium-${trader.id}`} className="text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Medium Risk
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="high" id={`high-${trader.id}`} />
                                  <Label htmlFor={`high-${trader.id}`} className="text-[12px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    High Risk
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            <Button 
                              onClick={() => startCopyTrading(trader)}
                              className="w-full bg-[#007aff] hover:bg-[#0056b3] text-white rounded-[12px] h-10 text-[12px] font-normal"
                              style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                              Start Copy Trading
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* View More Button */}
            {!showAllTraders && (
              <div className="text-center pt-2">
                <Button 
                  onClick={() => setShowAllTraders(true)}
                  className="bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[rgba(0,0,0,0.7)] rounded-[16px] h-10 px-6 text-[12px]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  View More Traders
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-4">
          <Button
            onClick={() => window.history.back()}
            className="w-12 h-12 bg-black rounded-full p-0 hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default CopyTradingPage;