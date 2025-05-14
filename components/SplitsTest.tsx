'use client';

import React, { useState } from 'react';
import { SplitV2Client } from '@0xsplits/splits-sdk';
import { createWalletClient, custom, createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

interface SplitRecipient {
  address: string;
  percent: number;
}

export default function SplitsTest() {
  const [recipients, setRecipients] = useState<SplitRecipient[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [newPercent, setNewPercent] = useState('');
  const [splitAddress, setSplitAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addRecipient = () => {
    if (!newAddress || !newPercent) return;
    
    setRecipients([
      ...recipients,
      {
        address: newAddress,
        percent: parseFloat(newPercent),
      },
    ]);
    
    setNewAddress('');
    setNewPercent('');
  };

  const createSplit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Initialize viem clients
      const publicClient = createPublicClient({
        chain: base,
        transport: http(),
      });

      // Get the connected account first
      const [account] = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
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

      // Format recipients
      const formattedRecipients = recipients.map(recipient => ({
        address: recipient.address as `0x${string}`,
        percentAllocation: recipient.percent,
      }));

      // Create split
      const tx = await splitsClient.createSplit({
        recipients: formattedRecipients,
        distributorFeePercent: 0,
        ownerAddress: account as `0x${string}`,
        totalAllocationPercent: 100,
      });

      // Get the split address from the response
      setSplitAddress(tx.splitAddress);
      console.log('Split created:', tx);
    } catch (error: any) {
      console.error('Error creating split:', error);
      
      // Handle different types of errors
      let errorMessage = 'Failed to create split';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.reason) {
        errorMessage = error.reason;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.details) {
        errorMessage = error.details;
      } else if (error?.error?.message) {
        errorMessage = error.error.message;
      }

      // Log the full error object for debugging
      console.error('Full error object:', JSON.stringify(error, null, 2));
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Splits Test</h2>
      
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Add Recipients</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Recipient Address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Percentage (0-100)"
            value={newPercent}
            onChange={(e) => setNewPercent(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={addRecipient}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Current Recipients</h3>
        <ul className="list-disc pl-5">
          {recipients.map((recipient, index) => (
            <li key={index}>
              {recipient.address} - {recipient.percent}%
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <button
        onClick={createSplit}
        disabled={recipients.length === 0 || isLoading}
        className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
      >
        {isLoading ? 'Creating Split...' : 'Create Split'}
      </button>

      {splitAddress && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Split Created!</h3>
          <p>Split Address: {splitAddress}</p>
        </div>
      )}
    </div>
  );
} 