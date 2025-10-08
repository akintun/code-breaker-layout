import { cn } from "@/lib/utils";

interface GuessRowProps {
  guess?: number[];
  feedback?: { correct: number; partial: number };
  isActive?: boolean;
}

export const GuessRow = ({ guess, feedback, isActive }: GuessRowProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-smooth",
        isActive
          ? "border-primary bg-primary/10 glow-primary"
          : "border-border bg-card"
      )}
    >
      {/* Guess Numbers */}
      <div className="flex gap-2 flex-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold border-2 transition-smooth",
              guess?.[i] !== undefined
                ? "bg-muted border-primary text-foreground"
                : "bg-background border-border text-muted-foreground"
            )}
          >
            {guess?.[i] ?? "?"}
          </div>
        ))}
      </div>

      {/* Feedback Pegs */}
      {feedback && (
        <div className="flex gap-1">
          {/* Green pegs (correct position) */}
          {Array.from({ length: feedback.correct }).map((_, i) => (
            <div
              key={`correct-${i}`}
              className="w-3 h-3 rounded-full bg-success glow-success"
            />
          ))}
          {/* Yellow pegs (correct number, wrong position) */}
          {Array.from({ length: feedback.partial }).map((_, i) => (
            <div
              key={`partial-${i}`}
              className="w-3 h-3 rounded-full bg-warning"
            />
          ))}
          {/* Empty pegs */}
          {Array.from({
            length: 4 - feedback.correct - feedback.partial,
          }).map((_, i) => (
            <div key={`empty-${i}`} className="w-3 h-3 rounded-full bg-border" />
          ))}
        </div>
      )}
    </div>
  );
};
