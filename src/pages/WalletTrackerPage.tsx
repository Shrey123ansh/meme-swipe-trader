import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Download, 
  Copy, 
  ExternalLink,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { mockWallets, WalletData } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const WalletTrackerPage = () => {
  const navigate = useNavigate();
  const [trackedWallets, setTrackedWallets] = useState<WalletData[]>(mockWallets);
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [newWalletNickname, setNewWalletNickname] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);

  const filteredWallets = trackedWallets.filter(wallet =>
    wallet.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wallet.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addWallet = () => {
    if (!newWalletAddress || !newWalletNickname) {
      toast({
        title: "Error",
        description: "Please fill in both wallet address and nickname",
        variant: "destructive"
      });
      return;
    }

    const newWallet: WalletData = {
      address: newWalletAddress,
      nickname: newWalletNickname,
      totalPnl: 0,
      lastActive: 'Just added',
      transactions: []
    };

    setTrackedWallets([...trackedWallets, newWallet]);
    setNewWalletAddress('');
    setNewWalletNickname('');
    setIsAddModalOpen(false);

    toast({
      title: "🎉 Wallet Added!",
      description: `Now tracking ${newWalletNickname}`,
      className: "bg-success text-success-foreground border-success"
    });
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard",
      className: "bg-primary text-primary-foreground"
    });
  };

  const handleSellToken = (wallet: WalletData, token: any) => {
    toast({
      title: "🚀 Sell Order Placed!",
      description: `Selling ${token.amount} ${token.token} from ${wallet.nickname}`,
      className: "bg-success text-success-foreground border-success"
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(trackedWallets, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wallet-tracker-data.json';
    link.click();
    
    toast({
      title: "📁 Export Complete",
      description: "Wallet data exported successfully",
      className: "bg-success text-success-foreground"
    });
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
              Wallet Tracker
            </h1>
            <p className="text-[rgba(0,0,0,0.3)] text-[30px] leading-[36px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Monitor wallets
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#f2f2f7] rounded-[16px] p-3 text-center">
              <Wallet className="w-5 h-5 mx-auto mb-1 text-[#0000ee]" />
              <div className="text-[16px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {trackedWallets.length}
              </div>
              <div className="text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Tracked
              </div>
            </div>
            <div className="bg-[#f2f2f7] rounded-[16px] p-3 text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-600" />
              <div className="text-[16px] font-semibold text-green-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                +${trackedWallets.reduce((acc, wallet) => acc + Math.max(0, wallet.totalPnl), 0).toLocaleString()}
              </div>
              <div className="text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Profits
              </div>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(0,0,0,0.3)]" />
              <input
                type="text"
                placeholder="Search wallets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f2f2f7] border-0 rounded-[16px] h-10 pl-10 pr-4 text-[14px] placeholder:text-[#999999] focus:ring-0"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={exportData}
                className="flex-1 bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[rgba(0,0,0,0.7)] rounded-[16px] h-10 text-[12px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
              <Button 
                onClick={() => setShowAddresses(!showAddresses)}
                className="flex-1 bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[rgba(0,0,0,0.7)] rounded-[16px] h-10 text-[12px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {showAddresses ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                {showAddresses ? 'Hide' : 'Show'} Addr
              </Button>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#007aff] hover:bg-[#0056b3] text-white rounded-[16px] h-10 px-3">
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white rounded-[20px] border-0 shadow-xl max-w-sm">
                  <DialogHeader>
                    <DialogTitle className="text-[16px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Add New Wallet
                    </DialogTitle>
                    <DialogDescription className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Track a new wallet by entering its address
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-[12px] font-medium text-[rgba(0,0,0,0.7)] mb-2 block" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Wallet Address
                      </Label>
                      <Input
                        placeholder="0x..."
                        value={newWalletAddress}
                        onChange={(e) => setNewWalletAddress(e.target.value)}
                        className="bg-[#f2f2f7] border-0 rounded-[12px] h-10 text-[12px] placeholder:text-[#999999] focus:ring-0"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>
                    <div>
                      <Label className="text-[12px] font-medium text-[rgba(0,0,0,0.7)] mb-2 block" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Nickname
                      </Label>
                      <Input
                        placeholder="e.g., Main Wallet"
                        value={newWalletNickname}
                        onChange={(e) => setNewWalletNickname(e.target.value)}
                        className="bg-[#f2f2f7] border-0 rounded-[12px] h-10 text-[12px] placeholder:text-[#999999] focus:ring-0"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>
                    <Button 
                      onClick={addWallet} 
                      className="w-full bg-[#007aff] hover:bg-[#0056b3] text-white rounded-[12px] h-10 text-[12px] font-normal"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Track Wallet
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Wallet List */}
          <div className="space-y-4">
            <h2 className="text-[18px] font-semibold text-[#0000ee] flex items-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              <Wallet className="w-5 h-5 mr-2 text-[#0000ee]" />
              Tracked Wallets
            </h2>

            <div className="space-y-3">
              {filteredWallets.length === 0 ? (
                <div className="text-center py-8">
                  <Wallet className="w-12 h-12 text-[rgba(0,0,0,0.3)] mx-auto mb-4" />
                  <p className="text-[14px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {searchQuery ? 'No wallets found' : 'No wallets tracked'}
                  </p>
                  <p className="text-[12px] text-[rgba(0,0,0,0.3)] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {searchQuery ? 'Try a different search' : 'Add a wallet to get started'}
                  </p>
                </div>
              ) : (
                filteredWallets.map((wallet, index) => (
                  <motion.div
                    key={wallet.address}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#f2f2f7] rounded-[16px] p-3 hover:bg-[#e5e5ea] transition-colors"
                  >
                    {/* Wallet Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#007aff] rounded-full flex items-center justify-center">
                          <Wallet className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-[14px] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {wallet.nickname}
                          </div>
                          <div className="text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {showAddresses ? wallet.address : `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-[14px] font-bold ${wallet.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                          {wallet.totalPnl >= 0 ? '+' : ''}${wallet.totalPnl.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {wallet.lastActive}
                        </div>
                      </div>
                    </div>

                    {/* Wallet Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-[10px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <span>{wallet.transactions.length} transactions</span>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          onClick={() => copyAddress(wallet.address)}
                          className="h-6 px-2 text-[10px] rounded-[8px] bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[rgba(0,0,0,0.7)]"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          <Copy className="w-2.5 h-2.5 mr-1" />
                          Copy
                        </Button>
                        <Button
                          onClick={() => handleSellToken(wallet, { token: 'ALL', amount: 'all' })}
                          className="h-6 px-2 text-[10px] rounded-[8px] bg-red-500 hover:bg-red-600 text-white"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          <TrendingDown className="w-2.5 h-2.5 mr-1" />
                          Sell
                        </Button>
                        <Button
                          className="h-6 px-2 text-[10px] rounded-[8px] bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[rgba(0,0,0,0.7)]"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          <ExternalLink className="w-2.5 h-2.5 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
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
    </div>
  );
};

export default WalletTrackerPage;