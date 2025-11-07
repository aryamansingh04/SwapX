import { MapPin, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileCardProps {
  user: {
    id: string;
    name: string;
    avatar: string;
    location: string;
    skillsKnown: string[];
    trustScore: number;
  };
  onViewProfile: () => void;
}

const ProfileCard = ({ user, onViewProfile }: ProfileCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{user.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <MapPin className="h-3 w-3" />
              {user.location}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-medium">{user.trustScore}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Teaching:</p>
          <div className="flex flex-wrap gap-2">
            {user.skillsKnown.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button onClick={onViewProfile} className="w-full">View Profile</Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
