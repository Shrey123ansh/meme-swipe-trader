import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Wallet, TrendingUp, TrendingDown, Search, Download, Copy, ExternalLink } from 'lucide-react';
import { mockWallets, WalletData } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const WalletTrackerPage = () => {
  const [trackedWallets, setTrackedWallets] = useState<WalletData[]>(mockWallets);
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [newWalletNickname, setNewWalletNickname] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Wallet Tracker
          </h1>
          <p className="text-xl text-muted-foreground">
            Monitor and analyze wallet performance in real-time
          </p>
        </div>
        
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button onClick={exportData} variant="outline" className="border-primary text-primary">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Add Wallet
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Add New Wallet</DialogTitle>
                <DialogDescription>
                  Track a new wallet by entering its address and a nickname
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Wallet Address</Label>
                  <Input
                    id="address"
                    placeholder="0x..."
                    value={newWalletAddress}
                    onChange={(e) => setNewWalletAddress(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input
                    id="nickname"
                    placeholder="e.g., Main Trading Wallet"
                    value={newWalletNickname}
                    onChange={(e) => setNewWalletNickname(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button onClick={addWallet} className="w-full bg-gradient-primary hover:opacity-90">
                  Track Wallet
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search wallets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <Card className="bg-gradient-card border-0 shadow-card-custom">
          <CardContent className="p-6 text-center">
            <Wallet className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{trackedWallets.length}</div>
            <div className="text-sm text-muted-foreground">Tracked Wallets</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-0 shadow-card-custom">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-success" />
            <div className="text-2xl font-bold text-success">
              +${trackedWallets.reduce((acc, wallet) => acc + Math.max(0, wallet.totalPnl), 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Profits</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-0 shadow-card-custom">
          <CardContent className="p-6 text-center">
            <TrendingDown className="w-8 h-8 mx-auto mb-2 text-destructive" />
            <div className="text-2xl font-bold text-destructive">
              ${Math.abs(trackedWallets.reduce((acc, wallet) => acc + Math.min(0, wallet.totalPnl), 0)).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Losses</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Wallet List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {filteredWallets.length === 0 ? (
          <Card className="bg-gradient-card border-0 shadow-card-custom">
            <CardContent className="p-12 text-center">
              <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No wallets found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'No wallets match your search.' : 'Start by adding a wallet to track.'}
              </p>
              {!searchQuery && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-primary hover:opacity-90">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Wallet
                    </Button>
                  </DialogTrigger>
                </Dialog>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredWallets.map((wallet, index) => (
            <motion.div key={wallet.address} variants={cardVariants}>
              <Card className="bg-gradient-card border-0 shadow-card-custom overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{wallet.nickname}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm text-muted-foreground bg-muted/20 px-2 py-1 rounded">
                            {wallet.address}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyAddress(wallet.address)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${wallet.totalPnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {wallet.totalPnl >= 0 ? '+' : ''}${wallet.totalPnl.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last active: {wallet.lastActive}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Recent Transactions</h4>
                      <Badge variant="outline">
                        {wallet.transactions.length} transactions
                      </Badge>
                    </div>

                    {wallet.transactions.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No transactions found
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {wallet.transactions.slice(0, 5).map((tx) => (
                          <div key={tx.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Badge variant={tx.type === 'buy' ? 'default' : 'secondary'} className={tx.type === 'buy' ? 'bg-success text-success-foreground' : ''}>
                                {tx.type.toUpperCase()}
                              </Badge>
                              <div>
                                <div className="font-medium">{tx.token}</div>
                                <div className="text-sm text-muted-foreground">
                                  {tx.amount} @ ${tx.price.toFixed(6)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-bold ${tx.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                                {tx.pnl >= 0 ? '+' : ''}${tx.pnl}
                              </div>
                              <div className="text-sm text-muted-foreground">{tx.timestamp}</div>
                            </div>
                          </div>
                        ))}
                        {wallet.transactions.length > 5 && (
                          <Button variant="ghost" className="w-full">
                            View All {wallet.transactions.length} Transactions
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default WalletTrackerPage;