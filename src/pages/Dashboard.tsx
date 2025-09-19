import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, Rocket, Crown, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockMemecoins } from '@/data/mockData';
import { Link } from 'react-router-dom';

const Dashboard = () => {
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
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
          Trade Memecoins Like a Pro
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Discover, trade, and copy the best memecoin strategies in real-time
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/trading">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90">
              <Rocket className="w-5 h-5 mr-2" />
              Start Trading
            </Button>
          </Link>
          <Link to="/copy-trading">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <Crown className="w-5 h-5 mr-2" />
              Copy Pros
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Market Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        <Card className="bg-gradient-card border-0 shadow-glow">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-success mb-2">$2.4M</div>
            <div className="text-sm text-muted-foreground">Total Volume 24h</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-0 shadow-glow">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">15,429</div>
            <div className="text-sm text-muted-foreground">Active Traders</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-0 shadow-glow">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-warning mb-2">+127%</div>
            <div className="text-sm text-muted-foreground">Avg. Returns</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Trending Memecoins */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">🔥 Trending Memecoins</h2>
          <Link to="/trading">
            <Button variant="outline" className="border-primary text-primary">
              View All
              <BarChart3 className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockMemecoins.slice(0, 6).map((coin) => (
            <motion.div key={coin.id} variants={cardVariants} whileHover="hover">
              <Card className="bg-gradient-card border-0 shadow-card-custom overflow-hidden group cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/50">
                        <img 
                          src={coin.logo} 
                          alt={coin.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{coin.name}</CardTitle>
                        <CardDescription className="text-sm opacity-70">{coin.symbol}</CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={coin.change24h > 0 ? "default" : "destructive"}
                      className={`${coin.change24h > 0 ? 'bg-success text-success-foreground' : 'bg-destructive'} font-bold`}
                    >
                      {coin.change24h > 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(coin.change24h).toFixed(2)}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold price-pulse">
                        ${coin.price.toFixed(6)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Market Cap</div>
                        <div className="font-semibold">${coin.marketCap}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Volume 24h</div>
                        <div className="font-semibold">${coin.volume}</div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {coin.description}
                    </p>

                    <Link to={`/trading?coin=${coin.id}`}>
                      <Button className="w-full bg-gradient-primary hover:opacity-90 group-hover:shadow-glow transition-all">
                        <Target className="w-4 h-4 mr-2" />
                        Trade Now
                      </Button>
                    </Link>
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

export default Dashboard;