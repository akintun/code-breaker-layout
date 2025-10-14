import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { TreasuryPool } from "./TreasuryPool";

interface WelcomeScreenProps {
  treasuryAmount: number;
  onStartGame: () => void;
}

export const WelcomeScreen = ({ treasuryAmount, onStartGame }: WelcomeScreenProps) => {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Treasury Pool */}
      <div className="mb-6">
        <TreasuryPool amount={treasuryAmount} />
      </div>

      {/* Welcome Section */}
      <div className="max-w-md mx-auto text-center space-y-6 mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ChainBreaker
          </h1>
          <p className="text-muted-foreground">
            Crack the code and win the treasury! Guess the 4-digit secret code using logic and deduction.
          </p>
        </div>

        <Button
          onClick={onStartGame}
          size="lg"
          className="gradient-primary glow-primary w-full h-14"
        >
          <Play className="mr-2 h-5 w-5" />
          Start New Game
        </Button>
      </div>
    </div>
  );
};