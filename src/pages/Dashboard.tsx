import { Star, Users, Award, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const stats = [
    { label: "Total Sessions", value: "24", icon: Users, color: "text-primary" },
    { label: "Average Rating", value: "4.8", icon: Star, color: "text-accent" },
    { label: "Trust Score", value: "92", icon: TrendingUp, color: "text-secondary" },
    { label: "Badges Earned", value: "5", icon: Award, color: "text-primary" },
  ];

  const connections = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      skill: "React",
      lastMessage: "See you tomorrow!",
    },
    {
      id: "2",
      name: "Alex Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      skill: "Python",
      lastMessage: "Thanks for the session",
    },
  ];

  return (
    <div className="min-h-screen bg-[image:var(--gradient-soft)]">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Track your learning journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Connections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {connections.map((connection) => (
                <div key={connection.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={connection.avatar} alt={connection.name} />
                      <AvatarFallback>{connection.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{connection.name}</p>
                      <p className="text-sm text-muted-foreground">{connection.lastMessage}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/chat/${connection.id}`)}>
                      Chat
                    </Button>
                    <Button size="sm" onClick={() => navigate(`/meeting/${connection.id}`)}>
                      Schedule
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges & Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: "First Session", emoji: "🎉" },
                  { name: "10 Sessions", emoji: "🔥" },
                  { name: "Great Teacher", emoji: "⭐" },
                  { name: "Fast Learner", emoji: "🚀" },
                  { name: "Community Hero", emoji: "💪" },
                ].map((badge) => (
                  <div key={badge.name} className="flex flex-col items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="text-4xl mb-2">{badge.emoji}</div>
                    <p className="text-xs text-center font-medium">{badge.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
