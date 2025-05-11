import { SplitV2Client } from '@0xsplits/splits-sdk';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

// Initialize viem client
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

// Initialize Splits client
export const splitsClient = new SplitV2Client({
  chainId: base.id,
  publicClient,
});

// Types for our splits configuration
export interface SplitRecipient {
  address: string;
  percent: number;
}

export interface CreateSplitConfig {
  recipients: SplitRecipient[];
  controller?: string;
  distributorFee?: number;
}

// Function to create a new split
export async function createSplit(config: CreateSplitConfig) {
  try {
    const { recipients, controller, distributorFee } = config;
    
    // Format recipients for the SDK
    const formattedRecipients = recipients.map(recipient => ({
      address: recipient.address as `0x${string}`,
      percentAllocation: recipient.percent,
    }));

    // Create the split
    const tx = await splitsClient.createSplit({
      recipients: formattedRecipients,
      distributorFeePercent: distributorFee || 0,
      ownerAddress: (controller || '0x0000000000000000000000000000000000000000') as `0x${string}`,
      totalAllocationPercent: 100,
    });

    return tx;
  } catch (error) {
    console.error('Error creating split:', error);
    throw error;
  }
}

// Function to distribute funds from a split
export async function distributeFunds(splitAddress: string, tokenAddress: string) {
  try {
    const tx = await splitsClient.distribute({
      splitAddress: splitAddress as `0x${string}`,
      tokenAddress: tokenAddress as `0x${string}`,
    });
    return tx;
  } catch (error) {
    console.error('Error distributing funds:', error);
    throw error;
  }
}

// Function to get split details
export async function getSplitDetails(splitAddress: string) {
  try {
    const split = await splitsClient.getSplitBalance({
      splitAddress: splitAddress as `0x${string}`,
      tokenAddress: '0x0000000000000000000000000000000000000000' as `0x${string}`, // For ETH balance
    });
    return split;
  } catch (error) {
    console.error('Error getting split details:', error);
    throw error;
  }
} 