import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Trophy, TrendingUp, TrendingDown, Users, UserPlus, Star, Crown, Medal, Award } from 'lucide-react';
import { mockTraders, Trader } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const CopyTradingPage = () => {
  const [followedTraders, setFollowedTraders] = useState<Set<string>>(new Set());
  const [investmentAmount, setInvestmentAmount] = useState([1000]);
  const [profitShare, setProfitShare] = useState([10]);
  const [riskTolerance, setRiskTolerance] = useState('medium');
  
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-4">
          Copy Top Traders
        </h1>
        <p className="text-xl text-muted-foreground">
          Follow and copy the strategies of successful memecoin traders
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <Card className="bg-gradient-card border-0 shadow-card-custom">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{mockTraders.length}</div>
            <div className="text-sm text-muted-foreground">Pro Traders</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-0 shadow-card-custom">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-success" />
            <div className="text-2xl font-bold">87%</div>
            <div className="text-sm text-muted-foreground">Avg Win Rate</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-0 shadow-card-custom">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-warning" />
            <div className="text-2xl font-bold">245%</div>
            <div className="text-sm text-muted-foreground">Avg Returns</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-0 shadow-card-custom">
          <CardContent className="p-4 text-center">
            <UserPlus className="w-8 h-8 mx-auto mb-2 text-secondary" />
            <div className="text-2xl font-bold">{followedTraders.size}</div>
            <div className="text-sm text-muted-foreground">Following</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Traders Leaderboard */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-warning" />
          Top Performers
        </h2>

        <div className="grid gap-6">
          {sortedTraders.map((trader, index) => (
            <motion.div key={trader.id} variants={cardVariants}>
              <Card className="bg-gradient-card border-0 shadow-card-custom overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(index)}
                        <span className="text-sm font-medium">#{index + 1}</span>
                      </div>
                      <div className="text-4xl">{trader.avatar}</div>
                      <div>
                        <CardTitle className="text-xl">{trader.username}</CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{trader.followers.toLocaleString()} followers</span>
                          <span>{trader.totalTrades} trades</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-success">
                        +${trader.pnl.toLocaleString()}
                      </div>
                      <div className="text-success font-medium">
                        +{trader.pnlPercentage}%
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-success">{trader.winRate}%</div>
                      <div className="text-sm text-muted-foreground">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{trader.profitShareRate}%</div>
                      <div className="text-sm text-muted-foreground">Profit Share</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{trader.totalTrades}</div>
                      <div className="text-sm text-muted-foreground">Total Trades</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{trader.followers.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Followers</div>
                    </div>
                  </div>

                  {/* Recent Trades */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Recent Trades</h4>
                    <div className="space-y-2">
                      {trader.recentTrades.map((trade, tradeIndex) => (
                        <div key={tradeIndex} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'}>
                              {trade.type.toUpperCase()}
                            </Badge>
                            <span className="font-medium">{trade.token}</span>
                            <span className="text-sm text-muted-foreground">{trade.amount}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`font-bold ${trade.profit > 0 ? 'text-success' : 'text-destructive'}`}>
                              {trade.profit > 0 ? '+' : ''}${trade.profit}
                            </span>
                            <span className="text-sm text-muted-foreground">{trade.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleFollow(trader.id, trader.username)}
                      variant={followedTraders.has(trader.id) ? "outline" : "default"}
                      className={followedTraders.has(trader.id) ? 
                        "border-success text-success hover:bg-success/10" : 
                        "bg-gradient-secondary hover:opacity-90"
                      }
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {followedTraders.has(trader.id) ? 'Following' : 'Follow'}
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-primary hover:opacity-90">
                          Start Copy Trading
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-card">
                        <DialogHeader>
                          <DialogTitle>Copy {trader.username}</DialogTitle>
                          <DialogDescription>
                            Set up automatic copy trading with customizable parameters
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          {/* Investment Amount */}
                          <div>
                            <Label className="text-base font-medium mb-3 block">
                              Investment Amount: ${investmentAmount[0]}
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
                            <Label className="text-base font-medium mb-3 block">
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
                            <Label className="text-base font-medium mb-3 block">Risk Tolerance</Label>
                            <RadioGroup value={riskTolerance} onValueChange={setRiskTolerance}>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="low" id="low" />
                                <Label htmlFor="low">Conservative (Low Risk)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="medium" id="medium" />
                                <Label htmlFor="medium">Balanced (Medium Risk)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="high" id="high" />
                                <Label htmlFor="high">Aggressive (High Risk)</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <Button 
                            onClick={() => startCopyTrading(trader)}
                            className="w-full bg-gradient-primary hover:opacity-90"
                          >
                            Start Copy Trading
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CopyTradingPage;