import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface GuessRowProps {
  guess?: readonly number[];
  feedback?: { correct: number; partial: number };
  isActive?: boolean;
  guessNumber?: number;
}

export const GuessRow = ({ guess, feedback, isActive, guessNumber }: GuessRowProps) => {
  const getFeedbackForPosition = (index: number): "correct" | "partial" | "none" => {
    if (!feedback || !guess) return "none";
    
    const totalFeedback = feedback.correct + feedback.partial;
    if (index < feedback.correct) return "correct";
    if (index < totalFeedback) return "partial";
    return "none";
  };

  // Generate accessible description
  const accessibleDescription = useMemo(() => {
    if (isActive) {
      const enteredCount = guess?.length || 0;
      return `Current guess: ${enteredCount} of 4 numbers entered. ${guess?.join(', ') || 'No numbers entered yet'}`;
    }
    
    if (!guess || !feedback) {
      return "Empty guess row";
    }

    const guessText = guess.join(', ');
    const feedbackText = `${feedback.correct} correct positions, ${feedback.partial} correct numbers in wrong positions`;
    return `Guess ${guessNumber || ''}: ${guessText}. Result: ${feedbackText}`;
  }, [guess, feedback, isActive, guessNumber]);

  const getFeedbackLabel = (position: number): string => {
    const number = guess?.[position];
    const feedbackType = getFeedbackForPosition(position);
    
    if (number === undefined) return "Empty position";
    
    switch (feedbackType) {
      case "correct":
        return `Number ${number}: Correct position`;
      case "partial":
        return `Number ${number}: Correct number, wrong position`;
      default:
        return `Number ${number}: Not in secret code`;
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border transition-smooth",
        isActive
          ? "border-primary bg-primary/10 glow-primary"
          : "border-border bg-card"
      )}
      role="group"
      aria-label={accessibleDescription}
      aria-live={isActive ? "polite" : undefined}
    >
      {/* Screen reader description */}
      <span className="sr-only">{accessibleDescription}</span>

      {/* Guess Numbers with Feedback Colors Below */}
      <div 
        className="flex gap-1.5 sm:gap-2 flex-1"
        role="group"
        aria-label="Guess numbers and feedback"
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-sm sm:text-base font-bold border-2 transition-smooth touch-target",
                guess?.[i] !== undefined
                  ? "bg-muted border-primary text-foreground"
                  : "bg-background border-border text-muted-foreground"
              )}
              role="img"
              aria-label={getFeedbackLabel(i)}
              tabIndex={feedback ? 0 : undefined}
            >
              {guess?.[i] ?? "?"}
            </div>
            {/* Feedback indicator below each number */}
            {feedback && (
              <div
                className={cn(
                  "w-2 h-2 rounded-full transition-smooth",
                  getFeedbackForPosition(i) === "correct" && "bg-success glow-success",
                  getFeedbackForPosition(i) === "partial" && "bg-warning",
                  getFeedbackForPosition(i) === "none" && "bg-border"
                )}
                role="img"
                aria-label={
                  getFeedbackForPosition(i) === "correct" ? "Correct position" :
                  getFeedbackForPosition(i) === "partial" ? "Wrong position" :
                  "Not in code"
                }
              />
            )}
          </div>
        ))}
      </div>

      {/* Feedback Pegs (kept for reference) */}
      {feedback && (
        <div 
          className="flex flex-col gap-1"
          role="group"
          aria-label={`Feedback summary: ${feedback.correct} correct, ${feedback.partial} wrong position`}
        >
          {/* Green pegs (correct position) */}
          {Array.from({ length: feedback.correct }).map((_, i) => (
            <div
              key={`correct-${i}`}
              className="w-3 h-3 rounded-full bg-success glow-success"
              role="img"
              aria-label="Correct position"
            />
          ))}
          {/* Yellow pegs (correct number, wrong position) */}
          {Array.from({ length: feedback.partial }).map((_, i) => (
            <div
              key={`partial-${i}`}
              className="w-3 h-3 rounded-full bg-warning"
              role="img"
              aria-label="Wrong position"
            />
          ))}
          {/* Empty pegs */}
          {Array.from({
            length: 4 - feedback.correct - feedback.partial,
          }).map((_, i) => (
            <div 
              key={`empty-${i}`} 
              className="w-3 h-3 rounded-full bg-border"
              role="img"
              aria-label="Not in code"
            />
          ))}
        </div>
      )}
    </div>
  );
};
