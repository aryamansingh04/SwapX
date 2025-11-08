import { useState, useEffect, useCallback } from "react";
import { requestConnection } from "@/lib/connections";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus, Search, Star, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import SimpleHeader from "@/components/SimpleHeader";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useRankedProfiles } from "@/hooks/useRankedProfiles";
import { Profile } from "@/types/db";
import { getMyProfile, updateDesiredSkills } from "@/lib/profile";

const Explore = () => {
  const { user } = useAuthUser();
  const [requestingConnections, setRequestingConnections] = useState<Set<string>>(new Set());
  const [myProfile, setMyProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingDesiredSkills, setSavingDesiredSkills] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  
  
  const [desiredSkillsInput, setDesiredSkillsInput] = useState("");
  
  
  const [debouncedDesiredSkills, setDebouncedDesiredSkills] = useState(desiredSkillsInput);
  
  
  const { ranked, loading, error } = useRankedProfiles(debouncedDesiredSkills);
  
  
  const filteredRanked = ranked.filter(
    (item) => !user || item.profile.id !== user.id
  );

  
  useEffect(() => {
    const loadMyProfile = async () => {
      if (!user) {
        setLoadingProfile(false);
        
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("swapx.desired_skills") || "";
          setDesiredSkillsInput(stored);
          setDebouncedDesiredSkills(stored);
        }
        return;
      }

      try {
        setLoadingProfile(true);
        const profile = await getMyProfile();
        if (profile) {
          setMyProfile(profile);
          
          
          let desiredSkills = "";
          if (profile.desired_skills && profile.desired_skills.length > 0) {
            desiredSkills = profile.desired_skills.join(", ");
          } else if (profile.skills_to_learn && profile.skills_to_learn.length > 0) {
            
            desiredSkills = profile.skills_to_learn.join(", ");
            
            try {
              await updateDesiredSkills(profile.skills_to_learn);
              console.log("Synced desired_skills with skills_to_learn");
            } catch (syncError) {
              console.warn("Could not sync desired_skills:", syncError);
            }
          } else if (typeof window !== "undefined") {
            desiredSkills = localStorage.getItem("swapx.desired_skills") || "";
          }
          
          setDesiredSkillsInput(desiredSkills);
          setDebouncedDesiredSkills(desiredSkills);
          
          
          if ((!profile.desired_skills || profile.desired_skills.length === 0) &&
              (!profile.skills_to_learn || profile.skills_to_learn.length === 0)) {
            setShowBanner(true);
          }
        } else {
          
          if (typeof window !== "undefined") {
            const stored = localStorage.getItem("swapx.desired_skills") || "";
            setDesiredSkillsInput(stored);
            setDebouncedDesiredSkills(stored);
          }
          setShowBanner(true);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("swapx.desired_skills") || "";
          setDesiredSkillsInput(stored);
          setDebouncedDesiredSkills(stored);
        }
        setShowBanner(true);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadMyProfile();
  }, [user]);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDesiredSkills(desiredSkillsInput);
    }, 250);

    return () => clearTimeout(timer);
  }, [desiredSkillsInput]);

  
  useEffect(() => {
    if (typeof window !== "undefined" && !user) {
      localStorage.setItem("swapx.desired_skills", desiredSkillsInput);
    }
  }, [desiredSkillsInput, user]);

  
  const loadSampleSkills = useCallback(() => {
    setDesiredSkillsInput("python, react, dsa");
  }, []);

  
  const handleSaveDesiredSkills = useCallback(async () => {
    if (!user || !desiredSkillsInput.trim()) {
      toast.error("Please enter skills you want to learn");
      return;
    }

    const skillsArray = desiredSkillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      setSavingDesiredSkills(true);
      
      await updateDesiredSkills(skillsArray);
      
      
      const { updateMyProfile } = await import("@/lib/profile");
      try {
        await updateMyProfile({
          skills_to_learn: skillsArray,
        });
        console.log("Synced skills_to_learn with desired_skills");
      } catch (syncError) {
        console.warn("Could not sync skills_to_learn:", syncError);
        
      }
      
      setShowBanner(false);
      
      
      const updatedProfile = await getMyProfile();
      if (updatedProfile) {
        setMyProfile(updatedProfile);
      }
      
      toast.success("Skills to learn saved successfully!");
      
      
      setDebouncedDesiredSkills(desiredSkillsInput);
    } catch (error) {
      console.error("Error saving desired skills:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save skills to learn. Please try again."
      );
    } finally {
      setSavingDesiredSkills(false);
    }
  }, [user, desiredSkillsInput]);

  const handleConnect = async (profileId: string) => {
    try {
      setRequestingConnections((prev) => new Set(prev).add(profileId));
      await requestConnection(profileId);
      toast.success("Connection request sent successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send connection request";
      toast.error(errorMessage);
      console.error("Error requesting connection:", error);
    } finally {
      setRequestingConnections((prev) => {
        const newSet = new Set(prev);
        newSet.delete(profileId);
        return newSet;
      });
    }
  };

  
  const renderRating = (rating: number | null | undefined) => {
    const ratingValue = rating ?? 0;
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground" />
        ))}
        <span className="text-sm text-muted-foreground ml-1">
          {ratingValue.toFixed(1)}
        </span>
      </div>
    );
  };

  if (loading || loadingProfile) {
    return (
      <>
        <SimpleHeader />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <SimpleHeader />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Explore Users</h1>
          <p className="text-muted-foreground">
            Discover and connect with other learners
          </p>
        </div>

        {}
        {showBanner && user && !loadingProfile && (
          <Card className="mb-4 border-primary/50 bg-primary/5">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-sm font-medium">Set your desired skills</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tell us what skills you want to learn to get better matches.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="e.g., python, react, dsa"
                      value={desiredSkillsInput}
                      onChange={(e) => setDesiredSkillsInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSaveDesiredSkills();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSaveDesiredSkills}
                      disabled={savingDesiredSkills}
                      size="sm"
                    >
                      {savingDesiredSkills ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 mb-6 border-b">
          <div className="space-y-2">
            <Label htmlFor="desired-skills">Skills you want to learn</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="desired-skills"
                  type="text"
                  placeholder="e.g., python, react, dsa"
                  value={desiredSkillsInput}
                  onChange={(e) => {
                    setDesiredSkillsInput(e.target.value);
                    setShowBanner(false); 
                  }}
                  className="pl-10"
                />
              </div>
              {user && desiredSkillsInput && (
                <Button
                  onClick={handleSaveDesiredSkills}
                  disabled={savingDesiredSkills}
                  type="button"
                >
                  {savingDesiredSkills ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              )}
              {import.meta.env.DEV && (
                <Button
                  variant="outline"
                  onClick={loadSampleSkills}
                  type="button"
                >
                  Load Sample
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Enter skills separated by commas. Profiles are ranked by skill match and rating.
              {user && " Your desired skills are saved to your profile."}
            </p>
          </div>
        </div>

        {error && (
          <Card className="mb-4 border-destructive">
            <CardContent className="py-4">
              <p className="text-destructive text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {}
        {filteredRanked.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredRanked.length} {filteredRanked.length === 1 ? "person" : "people"} — ranked by skill match + rating
            </p>
          </div>
        )}

        {filteredRanked.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {debouncedDesiredSkills.trim()
                  ? "No profiles found matching your criteria."
                  : "Enter skills you want to learn to see ranked matches."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRanked.map(({ profile, score }) => (
              <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username || profile.id}`}
                        alt={profile.full_name || profile.username || "User"}
                      />
                      <AvatarFallback>
                        {(profile.full_name || profile.username || "U")?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {profile.full_name || profile.username || "Anonymous"}
                      </CardTitle>
                      {profile.username && (
                        <p className="text-sm text-muted-foreground truncate">
                          @{profile.username}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {}
                  <div className="flex items-center justify-between">
                    {renderRating(profile.rating)}
                    <Badge variant="outline" className="text-xs">
                      Match: {score.toFixed(2)}
                    </Badge>
                  </div>

                  {profile.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {profile.bio}
                    </p>
                  )}
                  {profile.skills && profile.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {profile.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{profile.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                  <Button
                    className="w-full"
                    onClick={() => handleConnect(profile.id)}
                    disabled={requestingConnections.has(profile.id)}
                  >
                    {requestingConnections.has(profile.id) ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Explore;

