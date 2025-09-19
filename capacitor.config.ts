import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b9ae0f02be184264a24d64d6db896154',
  appName: 'meme-swipe-trader',
  webDir: 'dist',
  server: {
    url: 'https://b9ae0f02-be18-4264-a24d64d6db896154.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: '#1e1b2e'
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1e1b2e'
    }
  }
};

export default config;