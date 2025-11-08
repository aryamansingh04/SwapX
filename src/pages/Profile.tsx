import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Star, Github, Linkedin, Clock, Calendar, Settings } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProfileStore, WeeklyAvailability } from "@/stores/useProfileStore";
import { mockUsers } from "@/data/mockUsers";
import { format } from "date-fns";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getProfile } = useProfileStore();
  
  // Check if viewing own profile or another user's profile
  const isOwnProfile = id === user?.id || !id;
  const profileId = id || user?.id;

  // Try to get profile from profile store first (for logged-in user's own profile)
  const storedProfile = profileId ? getProfile(profileId) : null;
  
  // Find the profile from mockUsers based on id (for other users)
  const foundProfile = id ? mockUsers.find(p => p.id === id) : null;

  // Determine which profile to use
  let profile;
  
  if (storedProfile && isOwnProfile) {
    // Use stored profile data for logged-in user (their isolated data)
    profile = {
      id: storedProfile.id,
      name: storedProfile.name,
      email: storedProfile.email,
      avatar: storedProfile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${storedProfile.name}`,
      bio: storedProfile.bio || "Passionate learner and teacher. Love sharing knowledge with the community!",
      skillsKnown: storedProfile.skills || [],
      skillsLearning: storedProfile.skillsToLearn || [],
      occupation: storedProfile.occupation,
      rating: 4.8, // Default, could be calculated from reviews
      totalSessions: 0, // Default, could be stored in profile
      connections: 0, // Default, could be stored in profile
      github: storedProfile.github,
      linkedin: storedProfile.linkedin,
      availability: storedProfile.availability,
    };
  } else if (foundProfile) {
    // Use mock data for other users
    profile = {
      id: foundProfile.id,
      name: foundProfile.name,
      email: user?.email || `${foundProfile.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      avatar: foundProfile.avatar,
      bio: foundProfile.bio,
      skillsKnown: foundProfile.skillsKnown,
      skillsLearning: foundProfile.skillsToLearn,
      rating: foundProfile.trustScore,
      totalSessions: foundProfile.totalSessions,
      connections: Math.floor(foundProfile.totalSessions * 0.7),
      github: foundProfile.github,
      linkedin: foundProfile.linkedin,
    };
  } else {
    // Fallback to current user or defaults
    profile = {
      id: profileId || "1",
      name: user?.name || "John Doe",
      email: user?.email || "john@example.com",
      avatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "User"}`,
      bio: "Passionate learner and teacher. Love sharing knowledge with the community!",
      skillsKnown: storedProfile?.skills || [],
      skillsLearning: storedProfile?.skillsToLearn || [],
      rating: 4.8,
      totalSessions: 0,
      connections: 0,
      github: storedProfile?.github || undefined,
      linkedin: storedProfile?.linkedin || undefined,
      availability: storedProfile?.availability,
    };
  }

  // Helper function to format time
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Helper function to display availability
  const renderAvailability = (availability?: WeeklyAvailability) => {
    if (!availability) {
      return (
        <p className="text-muted-foreground text-sm">
          {isOwnProfile ? "No availability set. Set your availability to let others know when you're free!" : "No availability information available."}
        </p>
      );
    }

    const DAYS_MAP = [
      { key: 'monday', label: 'Mon' },
      { key: 'tuesday', label: 'Tue' },
      { key: 'wednesday', label: 'Wed' },
      { key: 'thursday', label: 'Thu' },
      { key: 'friday', label: 'Fri' },
      { key: 'saturday', label: 'Sat' },
      { key: 'sunday', label: 'Sun' },
    ] as const;

    const availableDays = DAYS_MAP.filter((day) => {
      const dayAvailability = availability[day.key as keyof WeeklyAvailability] as any;
      return dayAvailability?.enabled && dayAvailability?.slots?.length > 0;
    });

    if (availableDays.length === 0) {
      return (
        <p className="text-muted-foreground text-sm">
          {isOwnProfile ? "No availability set. Set your availability to let others know when you're free!" : "No availability information available."}
        </p>
      );
    }

    return (
      <div className="space-y-3">
        <div className="text-sm text-muted-foreground mb-2">
          Timezone: <span className="font-medium text-foreground">{availability.timezone}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableDays.map((day) => {
            const dayAvailability = availability[day.key as keyof WeeklyAvailability] as any;
            return (
              <div key={day.key} className="p-3 bg-muted/50 rounded-lg">
                <div className="font-medium text-sm mb-2">{day.label}</div>
                <div className="space-y-1">
                  {dayAvailability.slots.map((slot: any, idx: number) => (
                    <div key={idx} className="text-sm text-muted-foreground">
                      {formatTime(slot.start)} - {formatTime(slot.end)}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
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
                {profile.occupation && (
                  <p className="text-sm text-muted-foreground mb-2">{profile.occupation}</p>
                )}
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
                Skills {isOwnProfile ? "I Can Teach" : "They Can Teach"}
              </h3>
              {profile.skillsKnown.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skillsKnown.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {isOwnProfile ? "No skills added yet. Update your profile to add skills!" : "No skills listed."}
                </p>
              )}
            </div>
            {profile.skillsLearning.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Skills {isOwnProfile ? "I'm Learning" : "They're Learning"}</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skillsLearning.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Availability Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Availability
                </h3>
                {isOwnProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/availability")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Availability
                  </Button>
                )}
              </div>
              {renderAvailability((profile as any).availability)}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;

