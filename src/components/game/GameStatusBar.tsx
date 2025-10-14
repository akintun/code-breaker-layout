import { Clock } from "lucide-react";

interface GameStatusBarProps {
  attempts: number;
  maxAttempts: number;
  remainingTime: number;
  difficulty: string;
  formatTime: (seconds: number) => string;
}

export const GameStatusBar = ({ 
  attempts, 
  maxAttempts, 
  remainingTime, 
  difficulty, 
  formatTime 
}: GameStatusBarProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 p-3 sm:p-4 rounded-lg bg-card border border-border">
      <div className="text-sm">
        <span className="text-muted-foreground">Tries: </span>
        <span className="font-bold text-primary">
          {attempts}/{maxAttempts}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Clock className="h-4 w-4 text-secondary" />
        <span className={`font-bold font-mono ${remainingTime < 60 ? 'text-destructive' : 'text-secondary'}`}>
          {formatTime(remainingTime)}
        </span>
      </div>
      <div className="text-sm">
        <span className="text-muted-foreground">Mode: </span>
        <span className="font-bold text-accent capitalize">
          {difficulty}
        </span>
      </div>
    </div>
  );
};