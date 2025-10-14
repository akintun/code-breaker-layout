import { GuessRow } from "./GuessRow";
import { GameGuess } from "@/types/game";

interface GuessHistoryProps {
  guesses: GameGuess[];
  currentGuess: number[];
  isGameOver: boolean;
}

export const GuessHistory = ({ guesses, currentGuess, isGameOver }: GuessHistoryProps) => {
  return (
    <div className="space-y-4">
      {/* Guess History */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground">History</h2>
        <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto pr-2">
          {guesses.map((item, index) => (
            <GuessRow
              key={index}
              guess={item.guess}
              feedback={item.feedback}
            />
          ))}
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
};