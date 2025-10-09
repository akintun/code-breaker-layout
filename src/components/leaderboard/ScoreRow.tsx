import { Trophy, Medal, Award, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreRowProps {
  rank: number;
  address: string;
  attempts: number;
  time: number;
}

export const ScoreRow = ({ rank, address, attempts, time }: ScoreRowProps) => {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-warning" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-muted-foreground" />;
    if (rank === 3) return <Award className="h-5 w-5 text-accent" />;
    return null;
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-4 gap-y-3 p-3 sm:p-4 rounded-lg border transition-smooth hover:bg-card/50",
        rank === 1 && "border-warning bg-warning/5",
        rank === 2 && "border-muted-foreground bg-muted/5",
        rank === 3 && "border-accent bg-accent/5",
        rank > 3 && "border-border bg-card"
      )}
    >
      {/* Left side: Rank and Address */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted font-bold">
          {getRankIcon(rank) || `#${rank}`}
        </div>
        <div className="font-mono text-sm">{formatAddress(address)}</div>
      </div>

      {/* Right side: Stats */}
      <div className="flex w-full sm:w-auto justify-end border-t border-border pt-3 sm:border-none sm:pt-0 gap-4">
        <div className="text-right flex-1 sm:flex-initial">
          <div className="text-xs text-muted-foreground">Attempts</div>
          <div className="text-sm font-bold text-primary">{attempts}</div>
        </div>
        <div className="text-right flex-1 sm:flex-initial">
          <div className="text-xs text-muted-foreground flex items-center justify-end sm:justify-start gap-1">
            <Clock className="h-3 w-3" />
            Time
          </div>
          <div className="text-sm font-bold text-secondary font-mono">{formatTime(time)}</div>
        </div>
      </div>
    </div>
  );
};
