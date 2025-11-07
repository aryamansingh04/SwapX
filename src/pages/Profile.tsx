import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Star, Github, Linkedin } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { mockUsers } from "@/data/mockUsers";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();

  // Find the profile from mockUsers based on id
  const foundProfile = mockUsers.find(p => p.id === id);

  // If profile not found, use current user or default
  const profile = foundProfile ? {
    id: foundProfile.id,
    name: foundProfile.name,
    email: user?.email || `${foundProfile.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
    avatar: foundProfile.avatar,
    bio: foundProfile.bio,
    skillsKnown: foundProfile.skillsKnown,
    skillsLearning: foundProfile.skillsToLearn,
    rating: foundProfile.trustScore,
    totalSessions: foundProfile.totalSessions,
    connections: Math.floor(foundProfile.totalSessions * 0.7), // Estimate connections
    github: foundProfile.github,
    linkedin: foundProfile.linkedin,
  } : {
    id: id || "1",
    name: user?.name || "John Doe",
    email: user?.email || "john@example.com",
    avatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "User"}`,
    bio: "Passionate learner and teacher. Love sharing knowledge with the community!",
    skillsKnown: ["JavaScript", "React", "TypeScript", "Node.js"],
    skillsLearning: ["Python", "Machine Learning"],
    rating: 4.8,
    totalSessions: 42,
    connections: 18,
    github: user?.github || undefined,
    linkedin: user?.linkedin || undefined,
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="text-2xl">{profile.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-3xl">{profile.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {profile.github && (
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="GitHub Profile"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {profile.linkedin && (
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label="LinkedIn Profile"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{profile.bio}</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{profile.rating}</span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{profile.totalSessions} sessions</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{profile.connections} connections</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Skills I Can Teach
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skillsKnown.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Skills I'm Learning</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skillsLearning.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;

