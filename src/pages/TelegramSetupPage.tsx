import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  MessageSquare, 
  Bell, 
  CheckCircle2, 
  Settings, 
  Smartphone,
  TrendingUp,
  Wallet,
  Users,
  Clock,
  Volume2,
  DollarSign,
  Target
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from '@/hooks/use-toast';

const TelegramSetupPage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [telegramUsername, setTelegramUsername] = useState('');
  const [botToken, setBotToken] = useState('');
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();

  // Notification preferences
  const [preferences, setPreferences] = useState({
    pnlAlerts: true,
    walletAlerts: true,
    priceAlerts: true,
    copyTraderAlerts: true,
    portfolioMilestones: true,
    quietHoursEnabled: true,
    quietStart: '22:00',
    quietEnd: '08:00',
    frequency: 'immediate', // immediate, hourly, daily
    priceThreshold: [10], // percentage change threshold
    portfolioThreshold: [1000], // dollar amount
  });

  const connectTelegram = () => {
    if (!telegramUsername.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter your Telegram username",
        variant: "destructive",
      });
      return;
    }

    // Simulate connection
    setTimeout(() => {
      setIsConnected(true);
      toast({
        title: "🎉 Telegram Connected!",
        description: `Successfully connected to @${telegramUsername}`,
        className: "bg-gradient-success border-0",
      });
    }, 1500);
  };

  const sendTestNotification = () => {
    toast({
      title: "📱 Test Notification Sent",
      description: "Check your Telegram for the test message!",
    });
  };

  const botDeepLink = `https://t.me/MemeTraderBot?start=${telegramUsername}`;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">Telegram Notifications</h1>
        <p className="text-muted-foreground">Stay connected with real-time trading alerts</p>
      </motion.div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Telegram Connection</span>
            {isConnected && <Badge className="bg-gradient-success border-0">Connected</Badge>}
          </CardTitle>
          <CardDescription>
            Connect your Telegram account to receive trading notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Manual Setup */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Manual Setup</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="username">Telegram Username</Label>
                      <Input
                        id="username"
                        placeholder="@yourusername"
                        value={telegramUsername}
                        onChange={(e) => setTelegramUsername(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <Button 
                      onClick={connectTelegram}
                      className="w-full bg-gradient-primary"
                      disabled={!telegramUsername.trim()}
                    >
                      Connect Telegram
                    </Button>
                  </div>
                </div>

                {/* QR Code Setup */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center space-x-2">
                    <Smartphone className="w-4 h-4" />
                    <span>Quick Setup</span>
                  </h3>
                  
                  <div className="text-center space-y-3">
                    <div className="bg-white p-4 rounded-lg inline-block">
                      <QRCodeSVG
                        value={botDeepLink}
                        size={128}
                        level="M"
                        includeMargin
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Scan with Telegram to connect instantly
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between p-4 bg-gradient-success/10 rounded-lg border border-success/20">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-8 h-8 text-success" />
                <div>
                  <p className="font-semibold">Connected to Telegram</p>
                  <p className="text-sm text-muted-foreground">@{telegramUsername}</p>
                </div>
              </div>
              <Button onClick={sendTestNotification} variant="outline">
                Send Test
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notification Preferences</span>
          </CardTitle>
          <CardDescription>
            Customize what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Alert Types */}
          <div className="space-y-4">
            <h3 className="font-semibold">Alert Types</h3>
            
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">P&L Updates</p>
                    <p className="text-sm text-muted-foreground">Daily profit/loss summaries</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.pnlAlerts}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, pnlAlerts: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Wallet className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Wallet Tracker</p>
                    <p className="text-sm text-muted-foreground">Buy/sell notifications from tracked wallets</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.walletAlerts}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, walletAlerts: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Price Alerts</p>
                    <p className="text-sm text-muted-foreground">Significant price movements</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.priceAlerts}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, priceAlerts: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Copy Trading</p>
                    <p className="text-sm text-muted-foreground">Activity from followed traders</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.copyTraderAlerts}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, copyTraderAlerts: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Portfolio Milestones</p>
                    <p className="text-sm text-muted-foreground">Achievement notifications</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.portfolioMilestones}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, portfolioMilestones: checked }))
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Timing Preferences */}
          <div className="space-y-4">
            <h3 className="font-semibold">Timing & Thresholds</h3>
            
            {/* Quiet Hours */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <Label>Quiet Hours</Label>
                </div>
                <Switch
                  checked={preferences.quietHoursEnabled}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, quietHoursEnabled: checked }))
                  }
                />
              </div>
              
              {preferences.quietHoursEnabled && (
                <div className="grid grid-cols-2 gap-3 pl-6">
                  <div>
                    <Label className="text-sm text-muted-foreground">From</Label>
                    <Input
                      type="time"
                      value={preferences.quietStart}
                      onChange={(e) => 
                        setPreferences(prev => ({ ...prev, quietStart: e.target.value }))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">To</Label>
                    <Input
                      type="time"
                      value={preferences.quietEnd}
                      onChange={(e) => 
                        setPreferences(prev => ({ ...prev, quietEnd: e.target.value }))
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Price Alert Threshold */}
            <div className="space-y-3">
              <Label>Price Alert Threshold: {preferences.priceThreshold[0]}%</Label>
              <Slider
                value={preferences.priceThreshold}
                onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, priceThreshold: value }))
                }
                max={50}
                min={1}
                step={1}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground">
                Get alerts when prices change by more than this percentage
              </p>
            </div>

            {/* Portfolio Threshold */}
            <div className="space-y-3">
              <Label>Portfolio Alert Threshold: ${preferences.portfolioThreshold[0]}</Label>
              <Slider
                value={preferences.portfolioThreshold}
                onValueChange={(value) => 
                  setPreferences(prev => ({ ...prev, portfolioThreshold: value }))
                }
                max={10000}
                min={100}
                step={100}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground">
                Get milestone alerts for portfolio changes above this amount
              </p>
            </div>
          </div>

          <Separator />

          {/* Frequency Settings */}
          <div className="space-y-3">
            <Label>Notification Frequency</Label>
            <div className="grid grid-cols-3 gap-2">
              {['immediate', 'hourly', 'daily'].map((freq) => (
                <Button
                  key={freq}
                  variant={preferences.frequency === freq ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreferences(prev => ({ ...prev, frequency: freq }))}
                  className={preferences.frequency === freq ? "bg-gradient-primary" : ""}
                >
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Volume2 className="w-5 h-5" />
            <span>Sample Notifications</span>
          </CardTitle>
          <CardDescription>
            Preview of the notifications you'll receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-muted rounded-lg border-l-4 border-l-success">
            <p className="font-medium">🚀 PnL Alert</p>
            <p className="text-sm text-muted-foreground">Your portfolio is up 15.2% today! (+$1,247)</p>
          </div>
          
          <div className="p-3 bg-muted rounded-lg border-l-4 border-l-primary">
            <p className="font-medium">💰 Wallet Alert</p>
            <p className="text-sm text-muted-foreground">Tracked wallet "WhaleWatch1" just bought 50K PEPE for $2,400</p>
          </div>
          
          <div className="p-3 bg-muted rounded-lg border-l-4 border-l-accent">
            <p className="font-medium">📈 Price Alert</p>
            <p className="text-sm text-muted-foreground">DOGE just hit your target of $0.15! (+8.5%)</p>
          </div>
          
          <div className="p-3 bg-muted rounded-lg border-l-4 border-l-secondary">
            <p className="font-medium">👥 Copy Trading</p>
            <p className="text-sm text-muted-foreground">Your followed trader "MemeKing" just opened a new position in SHIB</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramSetupPage;