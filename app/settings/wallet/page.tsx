"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LinkIcon, ExternalLink, Copy } from "lucide-react";
import { NetworkSelector } from "@/components/ui/network-selector";
import { DepositModal } from "@/components/ui/deposit-modal";
import { useWallets, useFundWallet } from "@privy-io/react-auth";
import { base } from "viem/chains";
import { useToast } from "@/components/ui/use-toast";
import { useWalletBalance } from "@/hooks/use-wallet-balance";
import { FundModal } from "@/components/ui/fund-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { withdrawFromWarehouse } from "@/lib/splits";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// USDC contract address on Base mainnet
const USDC_CONTRACT_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export default function WalletPage() {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");
  const { balance, loading, refetch: fetchOnChainBalance } = useWalletBalance();
  const { wallets } = useWallets();
  const { toast } = useToast();
  const { fundWallet } = useFundWallet();

  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");
  const walletAddress = embeddedWallet?.address || "";

  const handleWithdraw = async () => {
    if (!embeddedWallet) {
      toast({
        title: "Error",
        description: "No wallet connected",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsWithdrawing(true);
      setWithdrawError("");
      console.log("Calling withdrawFromWarehouse...");
      const result = await withdrawFromWarehouse({
        wallet: embeddedWallet,
        tokenAddress: USDC_CONTRACT_ADDRESS,
      });
      console.log("withdrawFromWarehouse result:", result);

      if (!result.success) {
        console.log("Withdrawal unsuccessful, error:", result.error);
        setWithdrawError(result.error || "Withdrawal failed");
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      console.log("Withdrawal successful, tx:", result.tx);
      toast({
        title: "Success",
        description: "Funds withdrawn successfully",
      });
      setIsWithdrawModalOpen(false);
      // Refresh balance after withdrawal
      setTimeout(() => {
        fetchOnChainBalance();
      }, 2000);
    } catch (error: any) {
      console.error("Error withdrawing:", error);
      setWithdrawError(error?.message || "Failed to initiate withdrawal");
      toast({
        title: "Error",
        description: error?.message || "Failed to initiate withdrawal",
        variant: "destructive",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleFund = () => {
    if (walletAddress) {
      fundWallet(walletAddress, {
        chain: base,
        // You can specify asset and amount if needed
        // asset: 'USDC',
        // amount: '25',
      });
    } else {
      toast({
        title: "Error",
        description: "No wallet address found",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    if (!walletAddress) return;

    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopySuccess(true);
      toast({
        title: "Success",
        description: "Address copied to clipboard",
      });
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy address",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Wallet Settings</h1>

      {/* Wallet Balance Card */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Balance</CardTitle>
            <NetworkSelector />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            {loading ? (
              <Skeleton className="h-10 w-32" />
            ) : (
              <p className="text-3xl font-bold" aria-live="polite">
                {Number(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => setIsFundModalOpen(true)}
              disabled={loading || !embeddedWallet}
              aria-label="Fund your wallet"
            >
              Fund
            </Button>
            <Button
              onClick={() => {}}
              disabled={true}
              variant="outline"
              aria-label="Withdraw funds"
            >
              Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Address Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Wallet Address</CardTitle>
        </CardHeader>
        <CardContent>
          {!walletAddress ? (
            <p className="text-gray-500">No wallet connected</p>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2 p-3 bg-gray-50 rounded-md mb-3">
                <p className="font-mono text-sm break-all">{walletAddress}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full p-1"
                    aria-label="Copy wallet address to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <a
                    href={`https://basescan.org/address/${walletAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full p-1"
                    aria-label="View wallet on Basescan"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                This is your Base network wallet address. Use it to receive USDC and other tokens.
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Claims Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Claims</CardTitle>
          <CardDescription>Claim your funds from revenue splits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center py-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <LinkIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Claim your funds</h3>
            <p className="text-gray-600 max-w-md mb-4">
              If you have claimable USDC from music projects, you can withdraw it to your wallet here.
            </p>
            <Button 
              className="w-full max-w-xs"
              onClick={() => {
                console.log('Withdraw button clicked');
                console.log('Current modal state:', isWithdrawModalOpen);
                setIsWithdrawModalOpen(true);
                console.log('New modal state:', true);
              }}
              disabled={!embeddedWallet}
            >
              Withdraw from Splits
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Withdraw Modal */}
      <Dialog 
        open={isWithdrawModalOpen} 
        onOpenChange={(open) => {
          console.log('Dialog onOpenChange:', open);
          setIsWithdrawModalOpen(open);
          if (!open) setWithdrawError("");
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw from Splits</DialogTitle>
            <DialogDescription>
              Withdraw your claimable USDC from revenue splits to your wallet.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button
              onClick={() => {
                console.log('Confirm withdrawal clicked');
                handleWithdraw();
              }}
              disabled={isWithdrawing}
              className="w-full"
            >
              {isWithdrawing ? "Withdrawing..." : "Confirm Withdrawal"}
            </Button>
            {withdrawError && (
              <div className="text-red-500 text-sm text-center mt-2">{withdrawError}</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modals */}
      {embeddedWallet && (
        <>
          <DepositModal
            isOpen={isDepositModalOpen}
            onClose={() => setIsDepositModalOpen(false)}
            walletAddress={walletAddress}
          />
          <FundModal isOpen={isFundModalOpen} onClose={() => setIsFundModalOpen(false)} walletAddress={walletAddress} />
        </>
      )}
    </>
  );
}
