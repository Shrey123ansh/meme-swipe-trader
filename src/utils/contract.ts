import { ethers } from 'ethers';

// Factory contract ABI - includes token data functions
export const FACTORY_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "_fee", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_name", "type": "string"},
      {"internalType": "string", "name": "_symbol", "type": "string"}
    ],
    "name": "create",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fee",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllTokenDetails",
    "outputs": [{
      "components": [
        {"internalType": "address", "name": "tokenAddress", "type": "address"},
        {"internalType": "string", "name": "name", "type": "string"},
        {"internalType": "string", "name": "symbol", "type": "string"},
        {"internalType": "address", "name": "creator", "type": "address"},
        {"internalType": "uint256", "name": "sold", "type": "uint256"},
        {"internalType": "uint256", "name": "raised", "type": "uint256"},
        {"internalType": "bool", "name": "isOpen", "type": "bool"},
        {"internalType": "uint256", "name": "totalSupply", "type": "uint256"},
        {"internalType": "uint256", "name": "remainingTokens", "type": "uint256"}
      ],
      "internalType": "struct Factory.TokenDetails[]",
      "name": "",
      "type": "tuple[]"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_token", "type": "address"}],
    "name": "getTokenDetails",
    "outputs": [{
      "components": [
        {"internalType": "address", "name": "tokenAddress", "type": "address"},
        {"internalType": "string", "name": "name", "type": "string"},
        {"internalType": "string", "name": "symbol", "type": "string"},
        {"internalType": "address", "name": "creator", "type": "address"},
        {"internalType": "uint256", "name": "sold", "type": "uint256"},
        {"internalType": "uint256", "name": "raised", "type": "uint256"},
        {"internalType": "bool", "name": "isOpen", "type": "bool"},
        {"internalType": "uint256", "name": "totalSupply", "type": "uint256"},
        {"internalType": "uint256", "name": "remainingTokens", "type": "uint256"}
      ],
      "internalType": "struct Factory.TokenDetails",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllBasicTokenInfo",
    "outputs": [
      {"internalType": "address[]", "name": "tokenAddresses", "type": "address[]"},
      {"internalType": "string[]", "name": "names", "type": "string[]"},
      {"internalType": "string[]", "name": "symbols", "type": "string[]"},
      {"internalType": "address[]", "name": "creators", "type": "address[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_token", "type": "address"},
      {"internalType": "uint256", "name": "_amount", "type": "uint256"}
    ],
    "name": "buy",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_token", "type": "address"},
      {"internalType": "uint256", "name": "_amount", "type": "uint256"}
    ],
    "name": "sell",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_amount", "type": "uint256"}],
    "name": "calculateCost",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCost",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "token", "type": "address"}
    ],
    "name": "Created",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "token", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "cost", "type": "uint256"}
    ],
    "name": "Buy",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "token", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "refund", "type": "uint256"}
    ],
    "name": "Sell",
    "type": "event"
  }
];

// Replace with your deployed factory contract address
export const FACTORY_ADDRESS = "0x67fEeccfD6BF5199137A2513d953173f8518E937"; // You need to deploy and add the address here

export class ContractService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private factoryContract: ethers.Contract | null = null;

  async connect() {
    if (!window.ethereum) {
      throw new Error('MetaMask not found');
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();
    this.factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, this.signer);

    // Get network info for debugging
    const network = await this.provider.getNetwork();
    console.log('Connected to network:', {
      name: network.name,
      chainId: network.chainId,
      contractAddress: FACTORY_ADDRESS
    });

    // Verify the contract exists and is deployed
    const code = await this.provider.getCode(FACTORY_ADDRESS);
    if (code === '0x') {
      throw new Error(`No contract found at address ${FACTORY_ADDRESS} on network ${network.name} (chainId: ${network.chainId}). Please check the contract address and network.`);
    }

    return this.signer.getAddress();
  }

  async getCreationFee(): Promise<string> {
    if (!this.factoryContract) {
      throw new Error('Contract not initialized');
    }

    try {
      const fee = await this.factoryContract.fee();
      return ethers.formatEther(fee);
    } catch (error: any) {
      console.error('Error getting creation fee:', error);
      if (error.message?.includes('could not decode result data')) {
        throw new Error('Contract not found or wrong network. Please check your wallet network and contract address.');
      }
      throw error;
    }
  }

  async createToken(name: string, symbol: string): Promise<{
    hash: string;
    tokenAddress?: string;
  }> {
    if (!this.factoryContract) {
      throw new Error('Contract not initialized');
    }

    let fee: bigint;
    try {
      fee = await this.factoryContract.fee();
    } catch (error: any) {
      console.error('Error getting fee for transaction:', error);
      if (error.message?.includes('could not decode result data')) {
        throw new Error('Contract not found or wrong network. Please check your wallet network and contract address.');
      }
      throw error;
    }

    const tx = await this.factoryContract.create(name, symbol, {
      value: fee,
      gasLimit: 2000000 // Adjust as needed
    });

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    // Parse the Created event to get the token address
    let tokenAddress: string | undefined;
    if (receipt.logs) {
      for (const log of receipt.logs) {
        try {
          const parsedLog = this.factoryContract.interface.parseLog(log);
          if (parsedLog?.name === 'Created') {
            tokenAddress = parsedLog.args.token as string;
            break;
          }
        } catch (e) {
          // Not our event, continue
        }
      }
    }

    return {
      hash: tx.hash,
      tokenAddress
    };
  }

  async waitForTransaction(hash: string) {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    return await this.provider.waitForTransaction(hash);
  }

  async getAllTokenDetails() {
    if (!this.factoryContract) {
      throw new Error('Contract not initialized');
    }

    try {
      const tokenDetails = await this.factoryContract.getAllTokenDetails();
      return tokenDetails.map((token: any) => ({
        tokenAddress: token.tokenAddress,
        name: token.name,
        symbol: token.symbol,
        creator: token.creator,
        sold: ethers.formatEther(token.sold),
        raised: ethers.formatEther(token.raised),
        isOpen: token.isOpen,
        totalSupply: ethers.formatEther(token.totalSupply),
        remainingTokens: ethers.formatEther(token.remainingTokens)
      }));
    } catch (error: any) {
      console.error('Error getting token details:', error);
      throw error;
    }
  }

  async getTokenDetails(tokenAddress: string) {
    if (!this.factoryContract) {
      throw new Error('Contract not initialized');
    }

    try {
      const token = await this.factoryContract.getTokenDetails(tokenAddress);
      return {
        tokenAddress: token.tokenAddress,
        name: token.name,
        symbol: token.symbol,
        creator: token.creator,
        sold: ethers.formatEther(token.sold),
        raised: ethers.formatEther(token.raised),
        isOpen: token.isOpen,
        totalSupply: ethers.formatEther(token.totalSupply),
        remainingTokens: ethers.formatEther(token.remainingTokens)
      };
    } catch (error: any) {
      console.error('Error getting token details:', error);
      throw error;
    }
  }

  async getAllBasicTokenInfo() {
    if (!this.factoryContract) {
      throw new Error('Contract not initialized');
    }

    try {
      const result = await this.factoryContract.getAllBasicTokenInfo();
      const [tokenAddresses, names, symbols, creators] = result;

      return tokenAddresses.map((address: string, index: number) => ({
        tokenAddress: address,
        name: names[index],
        symbol: symbols[index],
        creator: creators[index]
      }));
    } catch (error: any) {
      console.error('Error getting basic token info:', error);
      throw error;
    }
  }

  async buyToken(tokenAddress: string, amount: string, ethAmount: string): Promise<{
    hash: string;
    receipt?: any;
  }> {
    if (!this.factoryContract) {
      throw new Error('Contract not initialized');
    }

    try {
      // Convert amount to Wei (18 decimals)
      const amountWei = ethers.parseEther(amount);
      // Convert ETH amount to Wei
      const ethAmountWei = ethers.parseEther(ethAmount);

      console.log('Buying token:', {
        tokenAddress,
        amount,
        amountWei: amountWei.toString(),
        ethAmount,
        ethAmountWei: ethAmountWei.toString()
      });

      const tx = await this.factoryContract.buy(tokenAddress, amountWei, {
        value: ethAmountWei,
        gasLimit: 500000 // Adjust as needed
      });

      console.log('Transaction sent:', tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      return {
        hash: tx.hash,
        receipt
      };
    } catch (error: any) {
      console.error('Error buying token:', error);

      // Handle specific error cases
      if (error.message?.includes('insufficient funds')) {
        throw new Error('Insufficient ETH balance for this purchase');
      } else if (error.message?.includes('Buying closed')) {
        throw new Error('Token sale is closed');
      } else if (error.message?.includes('user rejected')) {
        throw new Error('Transaction was rejected by user');
      }

      throw error;
    }
  }

  async calculateTokenCost(amount: string): Promise<string> {
    if (!this.factoryContract) {
      throw new Error('Contract not initialized');
    }

    try {
      const amountWei = ethers.parseEther(amount);
      const cost = await this.factoryContract.calculateCost(amountWei);
      return ethers.formatEther(cost);
    } catch (error: any) {
      console.error('Error calculating cost:', error);
      throw error;
    }
  }

  async getFixedPrice(): Promise<string> {
    if (!this.factoryContract) {
      throw new Error('Contract not initialized');
    }

    try {
      const price = await this.factoryContract.getCost();
      return ethers.formatEther(price);
    } catch (error: any) {
      console.error('Error getting fixed price:', error);
      throw error;
    }
  }
}

export const contractService = new ContractService();