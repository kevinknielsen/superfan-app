import { SplitV2Client } from '@0xsplits/splits-sdk';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { base } from 'viem/chains';

// Platform wallet address
const PLATFORM_WALLET = '0x8e1f13A08012F34dc8750eE34B78e90B5616f194';
const PLATFORM_FEE_PERCENT = 2.5;

interface Collaborator {
  address: string;
  percent: number;
}

interface CreateProjectSplitParams {
  collaborators: Collaborator[];
  ownerAddress: string;
}

export async function createProjectSplit({ collaborators, ownerAddress }: CreateProjectSplitParams) {
  try {
    // Request account access from the wallet
    let account = ownerAddress;
    if (typeof window !== 'undefined' && window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      account = accounts[0];
    }

    // Initialize viem clients
    const publicClient = createPublicClient({
      chain: base,
      transport: http(),
    });

    const walletClient = createWalletClient({
      chain: base,
      transport: custom(window.ethereum),
      account: account as `0x${string}`,
    });

    const splitsClient = new SplitV2Client({
      chainId: base.id,
      publicClient,
      walletClient,
    });

    // Add platform fee recipient
    const allRecipients = [
      {
        address: PLATFORM_WALLET as `0x${string}`,
        percentAllocation: PLATFORM_FEE_PERCENT,
      },
      ...collaborators.map(collab => ({
        address: collab.address as `0x${string}`,
        percentAllocation: collab.percent,
      })),
    ];

    // Calculate the total allocation percent
    const totalAllocationPercent = allRecipients.reduce((sum, r) => sum + r.percentAllocation, 0);

    // Create split
    const tx = await splitsClient.createSplit({
      recipients: allRecipients,
      distributorFeePercent: 0,
      ownerAddress: account as `0x${string}`,
      totalAllocationPercent,
    });

    return {
      splitAddress: tx.splitAddress,
      txHash: tx.event.transactionHash,
    };
  } catch (error: any) {
    console.error('Error creating project split:', error);
    throw new Error(error?.message || 'Failed to create project split');
  }
}

export async function distributeFunds(splitAddress: string, tokenAddress: string) {
  try {
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
    console.error('Error distributing funds:', error);
    throw new Error(error?.message || 'Failed to distribute funds');
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
    console.error('Error getting split details:', error);
    throw new Error(error?.message || 'Failed to get split details');
  }
} 