import { useState, useEffect } from 'react';
import { contractService } from '@/utils/contract';

export const useContract = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [creationFee, setCreationFee] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkWalletConnection();
    setupEventListeners();
  }, []);

  const checkWalletConnection = async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
        await loadCreationFee();
      }
    } catch (error) {
      console.error('Error checking wallet:', error);
    }
  };

  const setupEventListeners = () => {
    if (!window.ethereum) return;

    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        setWalletAddress('');
        setIsWalletConnected(false);
      } else {
        setWalletAddress(accounts[0]);
        setIsWalletConnected(true);
        loadCreationFee();
      }
    });

    window.ethereum.on('chainChanged', () => {
      // Reload the page when chain changes
      window.location.reload();
    });
  };

  const loadCreationFee = async () => {
    try {
      setIsLoading(true);
      await contractService.connect();
      const fee = await contractService.getCreationFee();
      setCreationFee(fee);
      setError(null);
    } catch (error: any) {
      console.error('Error loading creation fee:', error);
      setError(error.message || 'Failed to load creation fee');
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const address = await contractService.connect();
      setWalletAddress(address);
      setIsWalletConnected(true);
      await loadCreationFee();

      return address;
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createToken = async (name: string, symbol: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await contractService.createToken(name, symbol);
      return result;
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (error: any): string => {
    if (error.code === 4001) {
      return 'Transaction rejected by user';
    } else if (error.code === -32603) {
      return 'Transaction failed. Please check your balance and try again';
    } else if (error.message?.includes('insufficient funds')) {
      return 'Insufficient funds for transaction';
    } else if (error.message?.includes('user rejected')) {
      return 'Transaction rejected by user';
    } else if (error.message?.includes('network')) {
      return 'Network error. Please check your connection';
    }
    return error.message || 'An unexpected error occurred';
  };

  return {
    walletAddress,
    isWalletConnected,
    creationFee,
    isLoading,
    error,
    connectWallet,
    createToken,
    clearError: () => setError(null)
  };
};