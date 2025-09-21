import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Trophy,
  TrendingUp,
  Users,
  UserPlus,
  Star,
  Crown,
  Medal,
  Award,
  X,
  Filter,
  Search,
  Wallet,
  Plus
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { contractService } from '@/utils/contract';

const CopyTradingPage = () => {
  const [followedTraders, setFollowedTraders] = useState<Set<string>>(new Set());
  const [investmentAmount, setInvestmentAmount] = useState([1000]);
  const [profitShare, setProfitShare] = useState([10]);
  const [riskTolerance, setRiskTolerance] = useState('medium');
  const [showAllTraders, setShowAllTraders] = useState(false);
  const [traders, setTraders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string>('');
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: '',
    minimumInvestment: '0.1',
    profitShare: 10
  });

  const sortedTraders = [...traders].sort((a, b) => b.pnlPercentage - a.pnlPercentage);

  useEffect(() => {
    loadTraders();
  }, []);

  useEffect(() => {
    // Auto-refresh trader data when connected
    if (isConnected) {
      loadTraders();
    }
  }, [isConnected]);

  // Real-time refresh every 30 seconds when connected
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      console.log('Auto-refreshing trader data...');
      loadTraders();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isConnected]);

  const connectWallet = async () => {
    try {
      const address = await contractService.connect();
      setUserAddress(address);
      setIsConnected(true);
      loadTraders();
      toast({
        title: "🎉 Wallet Connected!",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
        className: "bg-success text-success-foreground border-success"
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message,
        className: "bg-destructive text-destructive-foreground"
      });
    }
  };

  const loadTraders = async () => {
    if (!isConnected) {
      setTraders([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Fetch real data from smart contract only
      const tradersData = await contractService.getAllTraders();
      console.log('Real traders data from contract:', tradersData);
      setTraders(tradersData);
    } catch (error: any) {
      console.error('Error loading traders:', error);
      toast({
        title: "Failed to Load Traders",
        description: "Could not fetch trader data from blockchain",
        className: "bg-destructive text-destructive-foreground"
      });
      setTraders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const registerAsTrader = async () => {
    if (!isConnected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet first",
        className: "bg-warning text-warning-foreground"
      });
      return;
    }

    try {
      const tx = await contractService.registerTrader(
        registerForm.name,
        registerForm.minimumInvestment,
        registerForm.profitShare
      );

      toast({
        title: "🎉 Registration Submitted!",
        description: `Transaction hash: ${tx.hash}`,
        className: "bg-success text-success-foreground border-success"
      });

      // Reload traders after registration
      setTimeout(() => {
        loadTraders();
      }, 3000);

      setShowRegisterDialog(false);
      setRegisterForm({ name: '', minimumInvestment: '0.1', profitShare: 10 });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        className: "bg-destructive text-destructive-foreground"
      });
    }
  };

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

  const startCopyTrading = async (trader: any) => {
    if (!isConnected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet first",
        className: "bg-warning text-warning-foreground"
      });
      return;
    }

    const investmentEth = (investmentAmount[0] / 1000).toString(); // Convert to ETH
    const minimumRequired = parseFloat(trader.minimumInvestment || '0');

    if (parseFloat(investmentEth) < minimumRequired) {
      toast({
        title: "Investment Too Low",
        description: `Minimum investment is ${minimumRequired} ETH`,
        className: "bg-warning text-warning-foreground"
      });
      return;
    }

    try {
      const tx = await contractService.investInTrader(trader.address || trader.id, investmentEth);

      toast({
        title: "🚀 Investment Submitted!",
        description: `Investing ${investmentEth} ETH in ${trader.username}. TX: ${tx.hash}`,
        className: "bg-success text-success-foreground border-success"
      });

      // Add to followed traders
      const newFollowed = new Set(followedTraders);
      newFollowed.add(trader.id);
      setFollowedTraders(newFollowed);

    } catch (error: any) {
      toast({
        title: "Investment Failed",
        description: error.message,
        className: "bg-destructive text-destructive-foreground"
      });
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="w-5 h-5 text-warning" />;
      case 1: return <Medal className="w-5 h-5 text-muted-foreground" />;
      case 2: return <Award className="w-5 h-5 text-warning/70" />;
      default: return <Trophy className="w-4 h-4 text-muted-foreground" />;
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[30px] font-normal text-[#0000ee] leading-[45px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Copy Trading
                </h1>
                <p className="text-[rgba(0,0,0,0.3)] text-[30px] leading-[36px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Follow top traders
                </p>
              </div>
              <div className="flex gap-2">
                {!isConnected ? (
                  <Button
                    onClick={connectWallet}
                    className="bg-[#007aff] hover:bg-[#0056b3] text-white rounded-[12px] h-8 px-3 text-[10px]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <Wallet className="w-3 h-3 mr-1" />
                    Connect
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Badge className="bg-green-100 text-green-800 text-[8px] px-2 py-1">
                      {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                    </Badge>
                    <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
                      <DialogTrigger asChild>
                        <Button
                          className="bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[rgba(0,0,0,0.7)] rounded-[8px] h-6 px-2 text-[8px]"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          <Plus className="w-2 h-2 mr-1" />
                          Register
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white rounded-[20px] border-0 shadow-xl max-w-sm">
                        <DialogHeader>
                          <DialogTitle className="text-[16px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Register as Trader
                          </DialogTitle>
                          <DialogDescription className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Start earning by letting others copy your trades
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          {/* Trader Name */}
                          <div>
                            <Label className="text-[12px] font-medium text-[rgba(0,0,0,0.7)] mb-2 block" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Trader Name
                            </Label>
                            <Input
                              value={registerForm.name}
                              onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Enter your trader name"
                              className="bg-[#f2f2f7] border-0 rounded-[12px] h-10 text-[12px]"
                              style={{ fontFamily: 'Inter, sans-serif' }}
                            />
                          </div>

                          {/* Minimum Investment */}
                          <div>
                            <Label className="text-[12px] font-medium text-[rgba(0,0,0,0.7)] mb-2 block" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Minimum Investment: {registerForm.minimumInvestment} ETH
                            </Label>
                            <Input
                              type="number"
                              step="0.1"
                              min="0.1"
                              value={registerForm.minimumInvestment}
                              onChange={(e) => setRegisterForm(prev => ({ ...prev, minimumInvestment: e.target.value }))}
                              className="bg-[#f2f2f7] border-0 rounded-[12px] h-10 text-[12px]"
                              style={{ fontFamily: 'Inter, sans-serif' }}
                            />
                          </div>

                          {/* Profit Share */}
                          <div>
                            <Label className="text-[12px] font-medium text-[rgba(0,0,0,0.7)] mb-2 block" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Profit Share: {registerForm.profitShare}% (Max 50%)
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              max="50"
                              value={registerForm.profitShare}
                              onChange={(e) => setRegisterForm(prev => ({ ...prev, profitShare: parseInt(e.target.value) || 1 }))}
                              className="bg-[#f2f2f7] border-0 rounded-[12px] h-10 text-[12px]"
                              style={{ fontFamily: 'Inter, sans-serif' }}
                            />
                          </div>

                          <Button
                            onClick={registerAsTrader}
                            className="w-full bg-[#007aff] hover:bg-[#0056b3] text-white rounded-[12px] h-10 text-[12px] font-normal"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            Register as Trader
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards - Optimized for narrow container */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#f2f2f7] rounded-[16px] p-3 text-center">
              <Users className="w-5 h-5 mx-auto mb-1 text-[#0000ee]" />
              <div className="text-[16px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {isConnected ? traders.length : '--'}
              </div>
              <div className="text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Pro Traders
              </div>
            </div>
            <div className="bg-[#f2f2f7] rounded-[16px] p-3 text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-600" />
              <div className="text-[16px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {isConnected ? `${traders.filter(t => t.isActive).length}` : '--'}
              </div>
              <div className="text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Active
              </div>
            </div>
            <div className="bg-[#f2f2f7] rounded-[16px] p-3 text-center">
              <Star className="w-5 h-5 mx-auto mb-1 text-yellow-600" />
              <div className="text-[16px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {isConnected ? traders.reduce((sum, t) => sum + (t.totalTrades || 0), 0) : '--'}
              </div>
              <div className="text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Total Trades
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
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[#0000ee] flex items-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
                Top Performers
              </h2>
              <Button
                onClick={loadTraders}
                disabled={isLoading}
                className="h-6 px-2 text-[8px] bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[rgba(0,0,0,0.7)] rounded-[8px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {isLoading ? '⟳' : '↻'} Refresh
              </Button>
            </div>

            {!isConnected && (
              <div className="text-center py-8 bg-[#f2f2f7] rounded-[16px]">
                <Wallet className="w-8 h-8 mx-auto mb-2 text-[rgba(0,0,0,0.3)]" />
                <div className="text-[14px] font-medium text-[rgba(0,0,0,0.7)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Connect Wallet to View Traders
                </div>
                <div className="text-[10px] text-[rgba(0,0,0,0.5)] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Real-time data from blockchain
                </div>
              </div>
            )}

            {isConnected && isLoading && (
              <div className="text-center py-4">
                <div className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Loading traders from blockchain...
                </div>
              </div>
            )}

            {isConnected && !isLoading && traders.length === 0 && (
              <div className="text-center py-8 bg-[#f2f2f7] rounded-[16px]">
                <Users className="w-8 h-8 mx-auto mb-2 text-[rgba(0,0,0,0.3)]" />
                <div className="text-[14px] font-medium text-[rgba(0,0,0,0.7)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  No Traders Found
                </div>
                <div className="text-[10px] text-[rgba(0,0,0,0.5)] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Be the first to register as a trader!
                </div>
              </div>
            )}

            {isConnected && traders.length > 0 && (
              <div className="space-y-3">
                {(showAllTraders ? sortedTraders : sortedTraders.slice(0, 5)).map((trader, index) => (
                <motion.div
                  key={trader.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#f2f2f7] rounded-[16px] p-3 hover:bg-[#e5e5ea] transition-colors"
                >
                  {/* Top Row - Rank, Avatar, Name, Address */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {getRankIcon(index)}
                        <span className="text-[10px] font-medium text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          #{index + 1}
                        </span>
                      </div>
                      <div className="text-2xl">{trader.avatar}</div>
                      <div className="flex-1">
                        <div className="text-[14px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {trader.name || trader.username}
                        </div>
                        <div className="text-[10px] text-[rgba(0,0,0,0.5)] font-mono" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {trader.address ? `${trader.address.slice(0, 6)}...${trader.address.slice(-4)}` : 'Loading...'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[12px] font-bold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {trader.totalTrades || 0} Trades
                      </div>
                      <div className="text-[10px] text-green-600 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {trader.isActive !== undefined ? (trader.isActive ? 'Active' : 'Inactive') : 'Active'}
                      </div>
                    </div>
                  </div>

                  {/* Middle Row - Key Stats */}
                  <div className="mb-2 grid grid-cols-3 gap-2 text-[10px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <div className="bg-white rounded-[8px] p-2 text-center">
                      <div className="text-[8px] text-[rgba(0,0,0,0.5)]">Min Investment</div>
                      <div className="text-[10px] font-semibold text-[#0000ee]">
                        {trader.minimumInvestment || '0.1'} ETH
                      </div>
                    </div>
                    <div className="bg-white rounded-[8px] p-2 text-center">
                      <div className="text-[8px] text-[rgba(0,0,0,0.5)]">Pool Value</div>
                      <div className="text-[10px] font-semibold text-[#0000ee]">
                        {trader.totalPoolValue ? parseFloat(trader.totalPoolValue).toFixed(2) : '0.00'} ETH
                      </div>
                    </div>
                    <div className="bg-white rounded-[8px] p-2 text-center">
                      <div className="text-[8px] text-[rgba(0,0,0,0.5)]">Investors</div>
                      <div className="text-[10px] font-semibold text-[#0000ee]">
                        {trader.totalInvestors || 0}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row - Stats and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <span>{trader.followers || trader.totalInvestors || 0} followers</span>
                      <span>{trader.winRate || 85}% win rate</span>
                    </div>
                    
                    <div className="flex gap-1">
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
                                Investment: {(investmentAmount[0] / 1000).toFixed(3)} ETH (Min: {trader.minimumInvestment || '0.1'} ETH)
                              </Label>
                              <Slider
                                value={investmentAmount}
                                onValueChange={setInvestmentAmount}
                                max={5000}
                                min={parseFloat(trader.minimumInvestment || '0.1') * 1000}
                                step={50}
                                className="w-full"
                              />
                              <div className="text-[10px] text-[rgba(0,0,0,0.5)] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                                ${((investmentAmount[0] / 1000) * 2000).toLocaleString()} USD (approx)
                              </div>
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
            )}

            {/* View More Button */}
            {isConnected && traders.length > 5 && !showAllTraders && (
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