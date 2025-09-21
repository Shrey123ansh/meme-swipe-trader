import { useState, useEffect, useCallback } from 'react';
import { WalletApiService, ApiError } from '@/services/walletApi';
import { DashboardStats, Wallet, CreateWalletRequest, UpdateWalletRequest, SearchWalletsParams } from '@/types/api';
import { toast } from '@/hooks/use-toast';

export interface UseWalletsReturn {
  // Data
  wallets: Wallet[];
  dashboardStats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  refreshWallets: () => Promise<void>;
  addWallet: (wallet: CreateWalletRequest) => Promise<Wallet | null>;
  updateWallet: (id: string, updates: UpdateWalletRequest) => Promise<Wallet | null>;
  deleteWallet: (id: string) => Promise<boolean>;
  searchWallets: (params: SearchWalletsParams) => Promise<Wallet[]>;
  exportWallets: (format: 'json' | 'csv') => Promise<void>;
}

export function useWallets(): UseWalletsReturn {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: unknown, action: string) => {
    console.error(`Error ${action}:`, error);
    const message = error instanceof ApiError 
      ? error.message 
      : `Failed to ${action.toLowerCase()}`;
    
    setError(message);
    toast({
      title: "Error",
      description: message,
      variant: "destructive"
    });
  };

  const refreshWallets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [walletsData, statsData] = await Promise.all([
        WalletApiService.getWallets(true),
        WalletApiService.getDashboardStats()
      ]);
      
      setWallets(walletsData);
      setDashboardStats(statsData);
    } catch (error) {
      handleError(error, 'loading wallets');
    } finally {
      setLoading(false);
    }
  }, []);

  const addWallet = useCallback(async (wallet: CreateWalletRequest): Promise<Wallet | null> => {
    try {
      setError(null);
      const newWallet = await WalletApiService.createWallet(wallet);
      
      setWallets(prev => [...prev, newWallet]);
      
      toast({
        title: "🎉 Wallet Added!",
        description: `Now tracking ${newWallet.name}`,
        className: "bg-success text-success-foreground border-success"
      });
      
      // Refresh dashboard stats
      const stats = await WalletApiService.getDashboardStats();
      setDashboardStats(stats);
      
      return newWallet;
    } catch (error) {
      handleError(error, 'adding wallet');
      return null;
    }
  }, []);

  const updateWallet = useCallback(async (id: string, updates: UpdateWalletRequest): Promise<Wallet | null> => {
    try {
      setError(null);
      const updatedWallet = await WalletApiService.updateWallet(id, updates);
      
      setWallets(prev => prev.map(wallet => 
        wallet.id === id ? updatedWallet : wallet
      ));
      
      toast({
        title: "Wallet Updated",
        description: "Wallet information has been updated successfully",
        className: "bg-success text-success-foreground border-success"
      });
      
      return updatedWallet;
    } catch (error) {
      handleError(error, 'updating wallet');
      return null;
    }
  }, []);

  const deleteWallet = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await WalletApiService.deleteWallet(id);
      
      setWallets(prev => prev.filter(wallet => wallet.id !== id));
      
      toast({
        title: "Wallet Removed",
        description: "Wallet has been removed from tracking",
        className: "bg-success text-success-foreground border-success"
      });
      
      // Refresh dashboard stats
      const stats = await WalletApiService.getDashboardStats();
      setDashboardStats(stats);
      
      return true;
    } catch (error) {
      handleError(error, 'deleting wallet');
      return false;
    }
  }, []);

  const searchWallets = useCallback(async (params: SearchWalletsParams): Promise<Wallet[]> => {
    try {
      setError(null);
      const response = await WalletApiService.searchWallets(params);
      return response.wallets;
    } catch (error) {
      handleError(error, 'searching wallets');
      return [];
    }
  }, []);

  const exportWallets = useCallback(async (format: 'json' | 'csv'): Promise<void> => {
    try {
      setError(null);
      const blob = await WalletApiService.exportWallets(format);
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `wallet-tracker-data.${format}`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "📁 Export Complete",
        description: `Wallet data exported as ${format.toUpperCase()}`,
        className: "bg-success text-success-foreground"
      });
    } catch (error) {
      handleError(error, 'exporting wallets');
    }
  }, []);

  // Load wallets on mount
  useEffect(() => {
    refreshWallets();
  }, [refreshWallets]);

  return {
    wallets,
    dashboardStats,
    loading,
    error,
    refreshWallets,
    addWallet,
    updateWallet,
    deleteWallet,
    searchWallets,
    exportWallets
  };
}
