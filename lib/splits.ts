import { SplitV2Client } from "@0xsplits/splits-sdk";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { base } from "viem/chains";
import { ConnectedWallet } from "@privy-io/react-auth";

// Platform wallet address
const PLATFORM_WALLET = "0x8e1f13A08012F34dc8750eE34B78e90B5616f194";
const PLATFORM_FEE_PERCENT = 2.5;

interface Collaborator {
  address: string;
  percent: number;
}

interface CreateProjectSplitParams {
  collaborators: Collaborator[];
  ownerAddress: string;
  wallet: ConnectedWallet;
}

// Warehouse contract ABI for withdraw(address _owner, address _token)
const WAREHOUSE_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_owner", "type": "address" },
      { "internalType": "address", "name": "_token", "type": "address" }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// Warehouse contract address on Base
const WAREHOUSE_ADDRESS = "0x8fb66F38cF86A3d5e8768f8F1754A24A6c661Fb8";

interface WithdrawFromWarehouseParams {
  wallet: any;
  tokenAddress: string;
}

// Utility function to initialize viem clients
const initializeClients = async (provider: any, walletAddress: string) => {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  const walletClient = createWalletClient({
    chain: base,
    transport: custom(provider),
    account: walletAddress as `0x${string}`,
  });

  return { publicClient, walletClient };
};

// Enhanced error handling for createProjectSplit
export async function createProjectSplit({ collaborators, ownerAddress, wallet }: CreateProjectSplitParams) {
  try {
    if (!wallet) {
      throw new Error("No wallet provided. Please connect your wallet first.");
    }

    const provider = await wallet.getEthereumProvider();
    const currentChainId = await provider.request({ method: "eth_chainId" });

    if (currentChainId !== `0x${base.id.toString(16)}`) {
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${base.id.toString(16)}` }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${base.id.toString(16)}`,
                  chainName: "Base",
                  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
                  rpcUrls: ["https://mainnet.base.org"],
                  blockExplorerUrls: ["https://basescan.org"],
                },
              ],
            });
          } catch (addError) {
            throw new Error("Failed to add Base network to wallet");
          }
        } else {
          throw new Error("Failed to switch to Base network");
        }
      }
    }

    const { publicClient, walletClient } = await initializeClients(provider, wallet.address);

    const splitsClient = new SplitV2Client({
      chainId: base.id,
      publicClient,
      walletClient,
    });

    if (collaborators.length === 0) {
      throw new Error("Collaborators list is empty. Please provide at least one collaborator.");
    }

    // Calculate the adjusted percentages for collaborators
    const remainingPercentage = 100 - PLATFORM_FEE_PERCENT;
    const adjustedCollaborators = collaborators.map(collab => {
      // Calculate the percentage of the remaining amount
      const adjustedPercent = (collab.percent / 100) * remainingPercentage;
      return {
        address: collab.address as `0x${string}`,
        percentAllocation: adjustedPercent,
      };
    });

    const allRecipients = [
      { address: PLATFORM_WALLET as `0x${string}`, percentAllocation: PLATFORM_FEE_PERCENT },
      ...adjustedCollaborators,
    ];

    const totalAllocationPercent = allRecipients.reduce((sum, r) => sum + r.percentAllocation, 0);

    const tx = await splitsClient.createSplit({
      recipients: allRecipients,
      distributorFeePercent: 0,
      ownerAddress: wallet.address as `0x${string}`,
      totalAllocationPercent,
    });

    return {
      splitAddress: tx.splitAddress,
      txHash: tx.event.transactionHash,
    };
  } catch (error: any) {
    console.error("Error creating project split:", error);
    throw new Error(error?.message || "Failed to create project split");
  }
}

// Enhanced error handling for distributeFunds
export async function distributeFunds(splitAddress: string, tokenAddress: string) {
  try {
    if (!splitAddress || !tokenAddress) {
      throw new Error("Split address and token address are required.");
    }

    const publicClient = createPublicClient({
      chain: base,
      transport: http(),
    });

    const walletClient = createWalletClient({
      chain: base,
      transport: custom(window.ethereum),
    });

    const splitsClient = new SplitV2Client({
      chainId: base.id,
      publicClient,
      walletClient,
    });

    const tx = await splitsClient.distribute({
      splitAddress: splitAddress as `0x${string}`,
      tokenAddress: tokenAddress as `0x${string}`,
      distributorAddress: PLATFORM_WALLET as `0x${string}`,
    });

    return tx;
  } catch (error: any) {
    console.error("Error distributing funds:", error);
    throw new Error(error?.message || "Failed to distribute funds");
  }
}

export async function getSplitDetails(splitAddress: string) {
  try {
    const publicClient = createPublicClient({
      chain: base,
      transport: http(),
    });

    const splitsClient = new SplitV2Client({
      chainId: base.id,
      publicClient,
    });

    const owner = await splitsClient.owner({ splitAddress: splitAddress as `0x${string}` });
    const paused = await splitsClient.paused({ splitAddress: splitAddress as `0x${string}` });

    return {
      owner: owner.ownerAddress,
      paused,
    };
  } catch (error: any) {
    console.error("Error getting split details:", error);
    throw new Error(error?.message || "Failed to get split details");
  }
}

export async function withdrawFromWarehouse({ wallet, tokenAddress }: WithdrawFromWarehouseParams) {
  try {
    if (!wallet) {
      throw new Error("No wallet provided");
    }

    const provider = await wallet.getEthereumProvider();
    const currentChainId = await provider.request({ method: "eth_chainId" });

    if (currentChainId !== `0x${base.id.toString(16)}`) {
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${base.id.toString(16)}` }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${base.id.toString(16)}`,
                  chainName: "Base",
                  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
                  rpcUrls: ["https://mainnet.base.org"],
                  blockExplorerUrls: ["https://basescan.org"],
                },
              ],
            });
          } catch (addError) {
            throw new Error("Failed to add Base network to wallet");
          }
        } else {
          throw new Error("Failed to switch to Base network");
        }
      }
    }

    const { publicClient, walletClient } = await initializeClients(provider, wallet.address);

    // Prepare the contract write for withdraw(address _owner, address _token)
    const { request } = await publicClient.simulateContract({
      address: WAREHOUSE_ADDRESS as `0x${string}`,
      abi: WAREHOUSE_ABI,
      functionName: 'withdraw',
      args: [wallet.address as `0x${string}`, tokenAddress as `0x${string}`],
      account: wallet.address as `0x${string}`,
    });

    // Send the transaction
    const tx = await walletClient.writeContract(request);

    return {
      success: true,
      tx,
    };
  } catch (error: any) {
    console.error("Error withdrawing from warehouse:", error);
    return {
      success: false,
      error: error?.message || "Failed to withdraw from warehouse",
    };
  }
}
