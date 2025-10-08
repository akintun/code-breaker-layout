import { useState } from "react";
import { ScoreRow } from "@/components/leaderboard/ScoreRow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Difficulty = "easy" | "normal" | "hard" | "expert";

// Mock leaderboard data
const mockLeaderboard: Record<Difficulty, { address: string; attempts: number }[]> = {
  easy: [
    { address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", attempts: 4 },
    { address: "0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", attempts: 5 },
    { address: "0x8f0B8C8dF9e1E8c6A5B4D3C2B1A0a9b8c7d6e5f4", attempts: 6 },
    { address: "0x1234567890123456789012345678901234567890", attempts: 7 },
    { address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd", attempts: 8 },
  ],
  normal: [
    { address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", attempts: 5 },
    { address: "0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", attempts: 6 },
    { address: "0x8f0B8C8dF9e1E8c6A5B4D3C2B1A0a9b8c7d6e5f4", attempts: 7 },
  ],
  hard: [
    { address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", attempts: 6 },
    { address: "0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c", attempts: 7 },
  ],
  expert: [
    { address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", attempts: 4 },
  ],
};

export default function LeaderboardView() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("normal");

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Leaderboard
        </h1>
        <p className="text-muted-foreground">Top scores from the blockchain</p>
      </div>

      <Tabs
        value={selectedDifficulty}
        onValueChange={(value) => setSelectedDifficulty(value as Difficulty)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="easy">Easy</TabsTrigger>
          <TabsTrigger value="normal">Normal</TabsTrigger>
          <TabsTrigger value="hard">Hard</TabsTrigger>
          <TabsTrigger value="expert">Expert</TabsTrigger>
        </TabsList>

        {(["easy", "normal", "hard", "expert"] as Difficulty[]).map((difficulty) => (
          <TabsContent key={difficulty} value={difficulty} className="space-y-3 mt-6">
            {mockLeaderboard[difficulty].length > 0 ? (
              mockLeaderboard[difficulty].map((score, index) => (
                <ScoreRow
                  key={score.address}
                  rank={index + 1}
                  address={score.address}
                  attempts={score.attempts}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No scores yet. Be the first!
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
