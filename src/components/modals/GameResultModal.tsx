import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, XCircle } from "lucide-react";

interface GameResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  isWon: boolean;
  attempts: number;
  secretCode: number[];
  onPlayAgain: () => void;
}

export const GameResultModal = ({
  isOpen,
  onClose,
  isWon,
  attempts,
  secretCode,
  onPlayAgain,
}: GameResultModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            {isWon ? (
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
                <Trophy className="h-10 w-10 text-success" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
            )}
          </div>
          <DialogTitle className="text-2xl text-center">
            {isWon ? (
              <span className="bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">
                Code Cracked!
              </span>
            ) : (
              <span className="text-destructive">Game Over</span>
            )}
          </DialogTitle>
          <DialogDescription className="text-center space-y-4">
            {isWon ? (
              <p>Congratulations! You solved it in {attempts} tries!</p>
            ) : (
              <p>Better luck next time!</p>
            )}

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">The secret code was:</p>
              <div className="flex justify-center gap-2">
                {secretCode.map((num, i) => (
                  <div
                    key={i}
                    className="w-14 h-14 rounded-lg bg-primary/20 border-2 border-primary flex items-center justify-center text-2xl font-bold text-primary glow-primary"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
          <Button
            onClick={onPlayAgain}
            className="flex-1 gradient-primary glow-primary"
          >
            Play Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
