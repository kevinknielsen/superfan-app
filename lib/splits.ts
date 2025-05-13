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

    const allRecipients = [
      { address: PLATFORM_WALLET as `0x${string}`, percentAllocation: PLATFORM_FEE_PERCENT },
      ...collaborators.map((collab) => ({
        address: collab.address as `0x${string}`,
        percentAllocation: collab.percent,
      })),
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
