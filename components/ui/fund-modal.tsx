import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DepositContent } from "@/components/ui/deposit-modal";
import { Button } from "@/components/ui/button";
import { useWallets } from "@privy-io/react-auth";
import { getOnrampBuyUrl } from '@coinbase/onchainkit/fund';

interface FundModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
}

export function FundModal({ isOpen, onClose, walletAddress }: FundModalProps) {
  const [tab, setTab] = useState<"deposit" | "card">("deposit");
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");
  const privyWalletAddress = embeddedWallet?.address || walletAddress;
  const [loadingUrl, setLoadingUrl] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasOpenedOnramp = useRef(false);

  useEffect(() => {
    if (tab === "card" && !loadingUrl && !hasOpenedOnramp.current) {
      hasOpenedOnramp.current = true;
      (async () => {
        setLoadingUrl(true);
        setError(null);
        try {
          const projectId = '039a77b6-c32c-43e2-9061-aef81b379dd9';
          if (!projectId) throw new Error("Missing Coinbase projectId");
          if (!privyWalletAddress || !/^0x[a-fA-F0-9]{40}$/.test(privyWalletAddress)) throw new Error("Invalid wallet address");
          console.log('Coinbase Onramp privyWalletAddress:', privyWalletAddress);
          // Minimal config for debugging
          const url = getOnrampBuyUrl({
            projectId,
            addresses: { [privyWalletAddress]: ['base'] },
            assets: ['USDC'],
            presetFiatAmount: 20,
            fiatCurrency: 'USD',
          });
          if (!url) throw new Error("Failed to generate onramp URL");
          window.open(url, "_blank");
        } catch (err: any) {
          setError(err.message || "Failed to generate onramp URL");
        } finally {
          setLoadingUrl(false);
        }
      })();
    }
    if (tab !== "card") {
      hasOpenedOnramp.current = false;
    }
  }, [tab, privyWalletAddress, loadingUrl]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-md mx-auto rounded-2xl p-0 overflow-auto max-h-[90vh] flex flex-col justify-center items-center">
        <DialogHeader className="relative px-6 pt-4 pb-0 w-full">
          <DialogTitle className="text-2xl font-bold">Fund Wallet</DialogTitle>
          <div className="flex gap-2 mt-4">
            <Button
              variant={tab === "deposit" ? "default" : "outline"}
              onClick={() => setTab("deposit")}
              className="flex-1"
            >
              Deposit to Wallet
            </Button>
            <Button
              variant={tab === "card" ? "default" : "outline"}
              onClick={() => setTab("card")}
              className="flex-1"
            >
              Fund with Card
            </Button>
          </div>
        </DialogHeader>
        <div className="w-full px-6 pb-6">
          {tab === "deposit" && (
            <DepositContent walletAddress={privyWalletAddress} />
          )}
          {tab === "card" && (
            <div className="w-full flex flex-col items-center justify-center gap-4">
              <p className="mb-2 text-gray-600">Use your card to fund your wallet instantly via Coinbase Onramp.</p>
              {loadingUrl && <Button className="w-full" disabled>Generating link...</Button>}
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 