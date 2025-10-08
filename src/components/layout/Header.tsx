import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";

export const Header = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  const handleWalletConnect = () => {
    // Mock wallet connection - will be replaced with actual Web3 integration
    if (walletAddress) {
      setWalletAddress(null);
    } else {
      setWalletAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 transition-smooth hover:opacity-80">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center font-bold text-xl glow-primary">
              CB
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ChainBreaker
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            variant="outline"
            size="icon"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            onClick={handleWalletConnect}
            variant={walletAddress ? "secondary" : "default"}
            className={walletAddress ? "" : "gradient-primary glow-primary"}
          >
            <Wallet className="mr-2 h-4 w-4" />
            {walletAddress ? formatAddress(walletAddress) : "Connect Wallet"}
          </Button>
        </div>
      </div>
    </header>
  );
};
