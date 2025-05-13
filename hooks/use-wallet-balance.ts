import { useState, useEffect, useCallback } from "react";
import { useWallets } from "@privy-io/react-auth";
import { ethers } from "ethers";

const USDC_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];
const USDC_CONTRACT_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export function useWalletBalance() {
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");
  const [balance, setBalance] = useState<string>("0");
  const [loading, setLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!embeddedWallet?.address) return;
    setLoading(true);
    try {
      const BASE_RPC_URL = `https://base-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`;
      const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
      const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, USDC_ABI, provider);
      const [rawBalance, tokenDecimals] = await Promise.all([
        usdcContract.balanceOf(embeddedWallet.address),
        usdcContract.decimals(),
      ]);
      const balanceInWei = rawBalance.toString();
      const decimals = Number(tokenDecimals);
      const formattedBalance = (Number(balanceInWei) / Math.pow(10, decimals)).toFixed(decimals);
      setBalance(formattedBalance);
    } catch (error) {
      setBalance("0");
    } finally {
      setLoading(false);
    }
  }, [embeddedWallet?.address]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, loading, refetch: fetchBalance };
} 