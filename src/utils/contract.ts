import { ethers } from 'ethers';

// Factory contract ABI - only the functions we need
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
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "token", "type": "address"}
    ],
    "name": "Created",
    "type": "event"
  }
];

// Replace with your deployed factory contract address
export const FACTORY_ADDRESS = "0x0D61F9a532793db7860Da564BD4Bb15D6b73f61F"; // You need to deploy and add the address here

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
}

export const contractService = new ContractService();