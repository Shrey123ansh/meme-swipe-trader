import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Settings, 
  Shield, 
  History, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Edit3, 
  LogOut,
  Bell,
  Key,
  Smartphone,
  HelpCircle,
  ChevronRight,
  X,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    bio: 'Crypto enthusiast and memecoin trader',
    joinDate: '2024-01-15',
    profileImage: null as File | null
  });

  const [stats] = useState({
    totalTrades: 127,
    totalVolume: 45600,
    winRate: 73.2,
    totalPnl: 12340
  });

  const [recentTransactions] = useState([
    { id: 1, type: 'Buy', coin: 'PEPE', amount: 1000, price: 0.000001, date: '2024-01-20', status: 'Completed' },
    { id: 2, type: 'Sell', coin: 'DOGE', amount: 500, price: 0.08, date: '2024-01-19', status: 'Completed' },
    { id: 3, type: 'Buy', coin: 'SHIB', amount: 2000, price: 0.00001, date: '2024-01-18', status: 'Pending' },
  ]);

  const [waitlistTrades] = useState([
    { id: 1, coin: 'FLOKI', amount: 500, price: 0.00002, date: '2024-01-21', position: 3, estimatedTime: '2-3 hours' },
    { id: 2, coin: 'BONK', amount: 800, price: 0.000015, date: '2024-01-21', position: 7, estimatedTime: '4-6 hours' },
    { id: 3, coin: 'WIF', amount: 300, price: 0.12, date: '2024-01-20', position: 12, estimatedTime: '8-12 hours' },
  ]);

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUserData(prev => ({
        ...prev,
        profileImage: file
      }));
    }
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
      className: "bg-success text-success-foreground"
    });
    navigate('/');
  };

  const sections = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'trading', label: 'Trading', icon: TrendingUp },
    { id: 'waitlist', label: 'Waitlist', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-[#f2f2f7] rounded-full flex items-center justify-center mx-auto">
            {userData.profileImage ? (
              <img 
                src={URL.createObjectURL(userData.profileImage)} 
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-[rgba(0,0,0,0.3)]" />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
          />
        </div>
        <div>
          <h2 className="text-[24px] font-normal text-[#0000ee] leading-[36px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {userData.name}
          </h2>
          <p className="text-[rgba(0,0,0,0.5)] text-[16px]" style={{ fontFamily: 'Inter, sans-serif' }}>
            @{userData.username}
          </p>
          <p className="text-[rgba(0,0,0,0.3)] text-[14px] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Member since {new Date(userData.joinDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#f2f2f7] rounded-[16px] p-4 text-center">
          <div className="text-[20px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {waitlistTrades.length}
          </div>
          <div className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Waitlist Trades
          </div>
        </div>
        <div className="bg-[#f2f2f7] rounded-[16px] p-4 text-center">
          <div className="text-[20px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {stats.totalTrades}
          </div>
          <div className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Total Trades
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-[16px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => setActiveSection('trading')}
            className="bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[rgba(0,0,0,0.7)] rounded-[16px] h-12 text-[12px] font-normal"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View Trading
          </Button>
          <Button 
            onClick={() => setActiveSection('waitlist')}
            className="bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[rgba(0,0,0,0.7)] rounded-[16px] h-12 text-[12px] font-normal"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <Clock className="w-4 h-4 mr-2" />
            Check Waitlist
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTrading = () => (
    <div className="space-y-6">
      <h3 className="text-[18px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
        Trading Activity
      </h3>
      
      {/* Trading Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#f2f2f7] rounded-[16px] p-4 text-center">
          <div className="text-[20px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {stats.totalTrades}
          </div>
          <div className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Total Trades
          </div>
        </div>
        <div className="bg-[#f2f2f7] rounded-[16px] p-4 text-center">
          <div className="text-[20px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {stats.winRate}%
          </div>
          <div className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Win Rate
          </div>
        </div>
        <div className="bg-[#f2f2f7] rounded-[16px] p-4 text-center">
          <div className="text-[20px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
            ${stats.totalVolume.toLocaleString()}
          </div>
          <div className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Total Volume
          </div>
        </div>
        <div className="bg-[#f2f2f7] rounded-[16px] p-4 text-center">
          <div className="text-[20px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
            ${stats.totalPnl.toLocaleString()}
          </div>
          <div className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Total P&L
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-4">
        <h4 className="text-[16px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Recent Transactions
        </h4>
        <div className="space-y-3">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="bg-[#f2f2f7] rounded-[16px] p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  tx.type === 'Buy' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <TrendingUp className={`w-4 h-4 ${
                    tx.type === 'Buy' ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <div className="text-[14px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {tx.type} {tx.coin}
                  </div>
                  <div className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {tx.amount} @ ${tx.price}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {tx.date}
                </div>
                <Badge variant={tx.status === 'Completed' ? 'default' : 'secondary'} className="text-[10px]">
                  {tx.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWaitlist = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Waitlist Trades
        </h3>
        <Badge variant="secondary" className="text-[12px]">
          {waitlistTrades.length} Active
        </Badge>
      </div>
      
      <div className="space-y-4">
        {waitlistTrades.length > 0 ? (
          waitlistTrades.map((trade) => (
            <div key={trade.id} className="bg-[#f2f2f7] rounded-[16px] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-[14px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {trade.coin}
                    </div>
                    <div className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {trade.amount} @ ${trade.price}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Position #{trade.position}
                  </div>
                  <div className="text-[10px] text-orange-600 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {trade.estimatedTime}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                <span>Queued: {trade.date}</span>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-3 h-3" />
                  <span>Processing...</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-[rgba(0,0,0,0.3)] mx-auto mb-4" />
            <p className="text-[14px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
              No waitlist trades
            </p>
            <p className="text-[12px] text-[rgba(0,0,0,0.3)] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Your queued trades will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-[18px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
        Account Settings
      </h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[14px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Full Name
          </label>
          <Input
            value={userData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="bg-[#f2f2f7] border-0 rounded-[16px] h-12 text-[16px] placeholder:text-[#999999] focus:ring-0"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[14px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Email
          </label>
          <Input
            value={userData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="bg-[#f2f2f7] border-0 rounded-[16px] h-12 text-[16px] placeholder:text-[#999999] focus:ring-0"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[14px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Username
          </label>
          <Input
            value={userData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className="bg-[#f2f2f7] border-0 rounded-[16px] h-12 text-[16px] placeholder:text-[#999999] focus:ring-0"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[14px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Bio
          </label>
          <Input
            value={userData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Tell us about yourself..."
            className="bg-[#f2f2f7] border-0 rounded-[16px] h-12 text-[16px] placeholder:text-[#999999] focus:ring-0"
          />
        </div>
      </div>
      
      <Button className="w-full bg-[#007aff] hover:bg-[#0056b3] text-white rounded-[16px] h-12 text-[14px] font-normal">
        Save Changes
      </Button>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <h3 className="text-[18px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
        Security Settings
      </h3>
      
      <div className="space-y-4">
        <div className="bg-[#f2f2f7] rounded-[16px] p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Key className="w-5 h-5 text-[rgba(0,0,0,0.5)]" />
            <div>
              <div className="text-[14px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                Change Password
              </div>
              <div className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Last changed 30 days ago
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
        </div>
        
        <div className="bg-[#f2f2f7] rounded-[16px] p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Smartphone className="w-5 h-5 text-[rgba(0,0,0,0.5)]" />
            <div>
              <div className="text-[14px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                Two-Factor Authentication
              </div>
              <div className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Enabled
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
        </div>
        
        <div className="bg-[#f2f2f7] rounded-[16px] p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-[rgba(0,0,0,0.5)]" />
            <div>
              <div className="text-[14px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                Privacy Settings
              </div>
              <div className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Manage your privacy preferences
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <h3 className="text-[18px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
        Transaction History
      </h3>
      
      <div className="space-y-3">
        {recentTransactions.map((tx) => (
          <div key={tx.id} className="bg-[#f2f2f7] rounded-[16px] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  tx.type === 'Buy' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <TrendingUp className={`w-4 h-4 ${
                    tx.type === 'Buy' ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <div className="text-[14px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {tx.type} {tx.coin}
                  </div>
                  <div className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {tx.date}
                  </div>
                </div>
              </div>
              <Badge variant={tx.status === 'Completed' ? 'default' : 'secondary'} className="text-[10px]">
                {tx.status}
              </Badge>
            </div>
            <div className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Amount: {tx.amount} | Price: ${tx.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6">
      <h3 className="text-[18px] font-semibold text-[#0000ee]" style={{ fontFamily: 'Inter, sans-serif' }}>
        Support & Help
      </h3>
      
      <div className="space-y-4">
        <div className="bg-[#f2f2f7] rounded-[16px] p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <HelpCircle className="w-5 h-5 text-[rgba(0,0,0,0.5)]" />
            <div>
              <div className="text-[14px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                Help Center
              </div>
              <div className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Find answers to common questions
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
        </div>
        
        <div className="bg-[#f2f2f7] rounded-[16px] p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-[rgba(0,0,0,0.5)]" />
            <div>
              <div className="text-[14px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                Contact Support
              </div>
              <div className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Get help from our support team
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
        </div>
        
        <div className="bg-[#f2f2f7] rounded-[16px] p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-[rgba(0,0,0,0.5)]" />
            <div>
              <div className="text-[14px] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                Notification Settings
              </div>
              <div className="text-[12px] text-[rgba(0,0,0,0.5)]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Manage your notification preferences
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'trading': return renderTrading();
      case 'waitlist': return renderWaitlist();
      case 'settings': return renderSettings();
      case 'security': return renderSecurity();
      case 'support': return renderSupport();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f7] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Main Card - Clean White Design */}
        <div className="bg-white rounded-[30px] shadow-lg p-8 space-y-7">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-[30px] font-normal text-[#0000ee] leading-[45px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Profile
            </h1>
            <p className="text-[rgba(0,0,0,0.3)] text-[30px] leading-[36px]" style={{ fontFamily: 'Inter, sans-serif' }}>
              Manage your account
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-2 overflow-x-auto">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-[16px] text-[12px] font-medium whitespace-nowrap transition-colors ${
                    activeSection === section.id
                      ? 'bg-[#007aff] text-white'
                      : 'bg-[#f2f2f7] text-[rgba(0,0,0,0.5)]'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="min-h-[400px]">
            {renderContent()}
          </div>

          {/* Logout Button */}
          <div className="pt-4">
            <Button
              onClick={handleLogout}
              className="w-full bg-[#f2f2f7] hover:bg-[#e5e5ea] text-[rgba(0,0,0,0.5)] rounded-[30px] h-12 text-[14px] font-normal transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
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

export default ProfilePage;
