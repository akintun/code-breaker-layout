import { GuessRow } from "./GuessRow";
import { GameGuess } from "@/types/game";
import { memo, useMemo } from "react";

interface GuessHistoryProps {
  guesses: GameGuess[];
  currentGuess: number[];
  isGameOver: boolean;
}

export const GuessHistory = memo<GuessHistoryProps>(({ guesses, currentGuess, isGameOver }) => {
  const memoizedGuesses = useMemo(() => {
    return guesses.map((item, index) => (
      <GuessRow
        key={`guess-${index}`}
        guess={item.guess}
        feedback={item.feedback}
      />
    ));
  }, [guesses]);

  return (
    <div className="space-y-4">
      {/* Guess History */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground">History</h2>
        <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto pr-2">
          {memoizedGuesses}
        </div>
      </div>

      {/* Active Guess Row */}
      {!isGameOver && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Current Guess
          </h2>
          <GuessRow guess={currentGuess} isActive />
        </div>
      )}
    </div>
  );
});