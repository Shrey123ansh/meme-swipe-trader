import { ethers } from 'ethers';
// import { FACTORY_ABI } from './abi';
// import { COPY_TRADING_ABI } from './abi';

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

export const COPY_TRADING_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_factoryAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "investor",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "trader",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "InvestmentMade",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "trader",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "ProfitsAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "trader",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "token",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ethSpent",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tradeNumber",
				"type": "uint256"
			}
		],
		"name": "TokenPurchased",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "trader",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "minimumInvestment",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "profitSharingPercentage",
				"type": "uint256"
			}
		],
		"name": "TraderRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "investor",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "trader",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "profitShare",
				"type": "uint256"
			}
		],
		"name": "Withdrawal",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_trader",
				"type": "address"
			}
		],
		"name": "addProfits",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "allTraders",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_token",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "buyToken",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deactivateTrader",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "factory",
		"outputs": [
			{
				"internalType": "contract IFactory",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllTraderDetails",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "addresses",
				"type": "address[]"
			},
			{
				"internalType": "string[]",
				"name": "names",
				"type": "string[]"
			},
			{
				"internalType": "uint256[]",
				"name": "minimumInvestments",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "profitSharingPercentages",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "totalPoolValues",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "totalInvestorsCounts",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "totalTradesCounts",
				"type": "uint256[]"
			},
			{
				"internalType": "bool[]",
				"name": "isActiveList",
				"type": "bool[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllTraders",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_investor",
				"type": "address"
			}
		],
		"name": "getInvestorTraders",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_limit",
				"type": "uint256"
			}
		],
		"name": "getTopTradersByTrades",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "addresses",
				"type": "address[]"
			},
			{
				"internalType": "string[]",
				"name": "names",
				"type": "string[]"
			},
			{
				"internalType": "uint256[]",
				"name": "tradeCounts",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_trader",
				"type": "address"
			}
		],
		"name": "getTotalOriginalInvestments",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalTraders",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_trader",
				"type": "address"
			}
		],
		"name": "getTraderInfo",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "minimumInvestment",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "profitSharingPercentage",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalPoolValue",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalInvestors",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalTrades",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_trader",
				"type": "address"
			}
		],
		"name": "getTraderInvestors",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_trader",
				"type": "address"
			}
		],
		"name": "getTraderName",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_trader",
				"type": "address"
			}
		],
		"name": "getTraderTotalTrades",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_investor",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_trader",
				"type": "address"
			}
		],
		"name": "getUserInvestment",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_investor",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_trader",
				"type": "address"
			}
		],
		"name": "getUserPortfolioValue",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_trader",
				"type": "address"
			}
		],
		"name": "invest",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "investments",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "investorToTraders",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "isNameTaken",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "nameExists",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "reactivateTrader",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_minimumInvestment",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_profitSharingPercentage",
				"type": "uint256"
			}
		],
		"name": "registerTrader",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalTraders",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "traderToInvestors",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "traders",
		"outputs": [
			{
				"internalType": "address",
				"name": "trader",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "minimumInvestment",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "profitSharingPercentage",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalPoolValue",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalInvestors",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalTrades",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_trader",
				"type": "address"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
];

// Replace with your deployed factory contract address
export const FACTORY_ADDRESS = "0x4973a610a881bc331f8a730CA955d88aCb576eEd"; // You need to deploy and add the address here
export const COPY_TRADING_ADDRESS = "0x5DF977D6EEa9efE7E42d272f0fE697C5a3A0acf3"; // You need to deploy and add the address here

export class ContractService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private factoryContract: ethers.Contract | null = null;
  private copyTradingContract: ethers.Contract | null = null;

  async connect() {
    if (!window.ethereum) {
      throw new Error('MetaMask not found');
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();
    this.factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, this.signer);
    this.copyTradingContract = new ethers.Contract(COPY_TRADING_ADDRESS, COPY_TRADING_ABI, this.signer);

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

  // Copy Trading Functions
  async getAllTraders() {
    if (!this.copyTradingContract) {
      throw new Error('Copy trading contract not initialized');
    }

    try {
      const result = await this.copyTradingContract.getAllTraderDetails();
      const [addresses, names, minimumInvestments, profitSharingPercentages, totalPoolValues, totalInvestorsCounts, totalTradesCounts, isActiveList] = result;

      return addresses.map((address: string, index: number) => ({
        id: address,
        address: address,
        username: names[index],
        name: names[index],
        minimumInvestment: ethers.formatEther(minimumInvestments[index]),
        profitSharingPercentage: Number(profitSharingPercentages[index]) / 100, // Convert from basis points
        totalPoolValue: ethers.formatEther(totalPoolValues[index]),
        totalInvestors: Number(totalInvestorsCounts[index]),
        totalTrades: Number(totalTradesCounts[index]),
        isActive: isActiveList[index],
        // Mock data for UI compatibility
        avatar: '🚀',
        pnl: Math.floor(Math.random() * 50000) + 10000,
        pnlPercentage: Math.floor(Math.random() * 300) + 50,
        followers: Number(totalInvestorsCounts[index]),
        winRate: Math.floor(Math.random() * 30) + 70
      }));
    } catch (error: any) {
      console.error('Error getting all traders:', error);
      throw error;
    }
  }

  async getTraderInfo(traderAddress: string) {
    if (!this.copyTradingContract) {
      throw new Error('Copy trading contract not initialized');
    }

    try {
      const result = await this.copyTradingContract.getTraderInfo(traderAddress);
      return {
        name: result[0],
        minimumInvestment: ethers.formatEther(result[1]),
        profitSharingPercentage: Number(result[2]) / 100,
        totalPoolValue: ethers.formatEther(result[3]),
        totalInvestors: Number(result[4]),
        totalTrades: Number(result[5]),
        isActive: result[6]
      };
    } catch (error: any) {
      console.error('Error getting trader info:', error);
      throw error;
    }
  }

  async registerTrader(name: string, minimumInvestment: string, profitSharingPercentage: number) {
    if (!this.copyTradingContract) {
      throw new Error('Copy trading contract not initialized');
    }

    try {
      const minimumInvestmentWei = ethers.parseEther(minimumInvestment);
      const profitSharingBasisPoints = profitSharingPercentage * 100; // Convert to basis points

      const tx = await this.copyTradingContract.registerTrader(
        name,
        minimumInvestmentWei,
        profitSharingBasisPoints,
        {
          gasLimit: 300000
        }
      );

      const receipt = await tx.wait();
      return {
        hash: tx.hash,
        receipt
      };
    } catch (error: any) {
      console.error('Error registering trader:', error);
      throw error;
    }
  }

  async investInTrader(traderAddress: string, amount: string) {
    if (!this.copyTradingContract) {
      throw new Error('Copy trading contract not initialized');
    }

    try {
      const amountWei = ethers.parseEther(amount);

      const tx = await this.copyTradingContract.invest(traderAddress, {
        value: amountWei,
        gasLimit: 300000
      });

      const receipt = await tx.wait();
      return {
        hash: tx.hash,
        receipt
      };
    } catch (error: any) {
      console.error('Error investing in trader:', error);
      if (error.message?.includes('Investment below minimum')) {
        throw new Error('Investment amount is below the minimum required');
      } else if (error.message?.includes('Trader not active')) {
        throw new Error('This trader is not currently active');
      }
      throw error;
    }
  }

  async copyTraderBuyToken(tokenAddress: string, amount: string, ethAmount: string) {
    if (!this.copyTradingContract) {
      throw new Error('Copy trading contract not initialized');
    }

    try {
      const amountWei = ethers.parseEther(amount);
      const ethAmountWei = ethers.parseEther(ethAmount);

      const tx = await this.copyTradingContract.buyToken(tokenAddress, amountWei, {
        value: ethAmountWei,
        gasLimit: 500000
      });

      const receipt = await tx.wait();
      return {
        hash: tx.hash,
        receipt
      };
    } catch (error: any) {
      console.error('Error buying token through copy trading:', error);
      throw error;
    }
  }

  async getUserInvestment(investorAddress: string, traderAddress: string) {
    if (!this.copyTradingContract) {
      throw new Error('Copy trading contract not initialized');
    }

    try {
      const investment = await this.copyTradingContract.getUserInvestment(investorAddress, traderAddress);
      return ethers.formatEther(investment);
    } catch (error: any) {
      console.error('Error getting user investment:', error);
      throw error;
    }
  }

  async getUserPortfolioValue(investorAddress: string, traderAddress: string) {
    if (!this.copyTradingContract) {
      throw new Error('Copy trading contract not initialized');
    }

    try {
      const portfolioValue = await this.copyTradingContract.getUserPortfolioValue(investorAddress, traderAddress);
      return ethers.formatEther(portfolioValue);
    } catch (error: any) {
      console.error('Error getting user portfolio value:', error);
      throw error;
    }
  }

  async withdrawFromTrader(traderAddress: string) {
    if (!this.copyTradingContract) {
      throw new Error('Copy trading contract not initialized');
    }

    try {
      const tx = await this.copyTradingContract.withdraw(traderAddress, {
        gasLimit: 400000
      });

      const receipt = await tx.wait();
      return {
        hash: tx.hash,
        receipt
      };
    } catch (error: any) {
      console.error('Error withdrawing from trader:', error);
      throw error;
    }
  }
}

export const contractService = new ContractService();