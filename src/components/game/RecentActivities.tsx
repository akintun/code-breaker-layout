import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Clock, Target } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Activity {
  id: string;
  player: string;
  difficulty: string;
  attempts: number;
  time: number;
  won: boolean;
  timestamp: Date;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const RecentActivities = ({ activities }: RecentActivitiesProps) => {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No recent activities</p>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        activity.won
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-semibold">
                        {formatAddress(activity.player)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.difficulty} • {activity.won ? "Won" : "Lost"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatTime(activity.time)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {activity.attempts} attempts
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
