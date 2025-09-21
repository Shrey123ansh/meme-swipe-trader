import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, Wallet, Copy, Users, MessageSquare, Home, Plus, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

// Base Mini App navigation - mobile-first with 5 main tabs
const navItems = [
  { name: 'Home', path: '/', icon: Home, shortName: 'Home' },
  { name: 'Trade', path: '/trading', icon: TrendingUp, shortName: 'Trade' },
  { name: 'Copy', path: '/copy-trading', icon: Copy, shortName: 'Copy' },
  { name: 'Wallet', path: '/wallet-tracker', icon: Wallet, shortName: 'Wallet' },
  { name: 'Profile', path: '/profile', icon: User, shortName: 'Profile' },
];

export default function Layout({ children }: LayoutProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask to use this feature!');
    }
  };

  const handleCreateCoin = () => {
    navigate('/create-coin');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Centered Container - Felix Haas Style */}
      <div className="centered-container">
        {/* Base Mini App Header - Clean & Minimal */}
    <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95">
      <div className="narrow-navbar mx-auto border-b border-border">
        <div className="px-6 h-14 flex items-center justify-between">
            {/* Logo - Inspired by Felix Haas minimalism */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">B</span>
              </div>
              <span className="font-semibold text-lg gradient-text">Blaze-Trade</span>
            </motion.div>

            {/* Action Buttons - Create Coin + Wallet Status */}
            <div className="flex items-center space-x-3">
              {/* Create Coin Button */}
              <Button 
                onClick={handleCreateCoin}
                size="sm"
                variant="outline"
                className="mini-app-button border-primary/20 text-primary hover:bg-primary/10"
              >
                <Plus className="w-4 h-4 mr-1" />
                Create
              </Button>

              {/* Wallet Status */}
              {isConnected ? (
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-success/10 rounded-lg border border-success/20">
                  <div className="status-indicator status-online"></div>
                  <span className="text-sm font-medium text-success">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                </div>
              ) : (
                <Button 
                  onClick={connectWallet}
                  size="sm"
                  className="mini-app-button bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

        {/* Main Content - Centered Container */}
        <main className="pb-20 px-6">
          {children}
        </main>

        {/* Base Mini App Bottom Navigation - Mobile-first design */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur">
          <div className="narrow-navbar mx-auto border-t border-border">
            <div className="tab-nav mx-4 my-2">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} className="tab-item">
                    <motion.div
                      className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 ${
                        isActive ? 'tab-item active' : ''
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconComponent className={`w-5 h-5 mb-1 ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                      <span className={`text-xs font-medium ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                        {item.shortName}
                      </span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}