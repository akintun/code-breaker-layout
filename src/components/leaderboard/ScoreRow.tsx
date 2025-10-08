import { Trophy, Medal, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreRowProps {
  rank: number;
  address: string;
  attempts: number;
}

export const ScoreRow = ({ rank, address, attempts }: ScoreRowProps) => {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
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
        "flex items-center gap-4 p-4 rounded-lg border transition-smooth hover:bg-card/50",
        rank === 1 && "border-warning bg-warning/5",
        rank === 2 && "border-muted-foreground bg-muted/5",
        rank === 3 && "border-accent bg-accent/5",
        rank > 3 && "border-border bg-card"
      )}
    >
      {/* Rank */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted font-bold">
        {getRankIcon(rank) || `#${rank}`}
      </div>

      {/* Address */}
      <div className="flex-1 font-mono text-sm">{formatAddress(address)}</div>

      {/* Attempts */}
      <div className="text-right">
        <div className="text-sm text-muted-foreground">Attempts</div>
        <div className="text-lg font-bold text-primary">{attempts}</div>
      </div>
    </div>
  );
};
