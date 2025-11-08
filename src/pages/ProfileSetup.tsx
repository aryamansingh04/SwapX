import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Plus, X, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { createMyProfile, updateMyProfile, getMyProfile } from "@/lib/profile";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const OCCUPATIONS = [
  "Student",
  "Software Engineer",
  "Designer",
  "Data Scientist",
  "Product Manager",
  "Marketing",
  "Sales",
  "Consultant",
  "Entrepreneur",
  "Teacher",
  "Researcher",
  "Other",
];

// 25 diverse avatars - using very varied seeds to ensure different characters
// Using diverse seed combinations (names, numbers, unique strings) for maximum variety
// Note: DiceBear expressions are random per seed. These seeds are optimized for diversity.
// To ensure all smiling: test seeds, update list, or use pre-generated verified avatars.
const AVATAR_PRESETS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Casey",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Riley",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Avery",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Quinn",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sage",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=River",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Phoenix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Skylar",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Rowan",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Blake",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Cameron",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Drew",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Emery",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Finley",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Hayden",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Kai",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Logan",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Reese",
];

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const { getProfile, updateProfile, setProfile } = useProfileStore();
  const { user: supabaseUser, loading: authLoading } = useAuthUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [existingSupabaseProfile, setExistingSupabaseProfile] = useState<any>(null);
  
  // Load existing profile data if available (from localStorage)
  const existingProfile = user ? getProfile(user.id) : null;
  
  // Initialize state
  const [name, setName] = useState(existingProfile?.name || user?.name || supabaseUser?.user_metadata?.full_name || "");
  const [occupation, setOccupation] = useState(existingProfile?.occupation || "");
  const [avatar, setAvatar] = useState(existingProfile?.avatar || user?.avatar || supabaseUser?.user_metadata?.avatar_url || AVATAR_PRESETS[0]);
  const [avatarMode, setAvatarMode] = useState<"upload" | "preset">("preset");
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(existingProfile?.skills || []);
  const [skillToLearnInput, setSkillToLearnInput] = useState("");
  const [skillsToLearn, setSkillsToLearn] = useState<string[]>(existingProfile?.skillsToLearn || []);
  
  // Check if profile exists in Supabase and load it
  useEffect(() => {
    const checkSupabaseProfile = async () => {
      if (supabaseUser) {
        try {
          const profile = await getMyProfile();
          if (profile) {
            setExistingSupabaseProfile(profile);
            console.log("Loaded existing profile from Supabase for editing:", {
              full_name: profile.full_name,
              bio: profile.bio,
              skills: profile.skills,
              skills_to_learn: profile.skills_to_learn,
              avatar_url: profile.avatar_url,
            });
            
            // Profile exists in Supabase, pre-fill form (prioritize Supabase data)
            if (profile.full_name || profile.username) {
              setName(profile.full_name || profile.username || "");
            }
            if (profile.bio) {
              setOccupation(profile.bio);
            }
            if (profile.avatar_url) {
              setAvatar(profile.avatar_url);
            }
            if (profile.skills && profile.skills.length > 0) {
              setSkills(profile.skills);
            } else {
              setSkills([]); // Clear skills if not in Supabase
            }
            if (profile.skills_to_learn && profile.skills_to_learn.length > 0) {
              setSkillsToLearn(profile.skills_to_learn);
            } else {
              setSkillsToLearn([]); // Clear skills to learn if not in Supabase
            }
          } else {
            console.log("No existing profile found in Supabase, using localStorage/default values");
          }
        } catch (error) {
          // Profile doesn't exist yet - that's fine for new users
          if (error instanceof Error && 
              !error.message.includes("PGRST116") && 
              !error.message.includes("No rows") &&
              !error.message.includes("not authenticated")) {
            console.error("Error loading profile:", error);
          }
        }
      }
    };
    checkSupabaseProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabaseUser]);
  
  // Listen for auth state changes after successful sign-in
  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user && mounted) {
        // User just signed in, reload profile data
        try {
          const profile = await getMyProfile();
          if (profile && mounted) {
            setName(profile.full_name || profile.username || "");
            if (profile.avatar_url) setAvatar(profile.avatar_url);
            if (profile.skills && profile.skills.length > 0) setSkills(profile.skills);
            if (profile.skills_to_learn && profile.skills_to_learn.length > 0) setSkillsToLearn(profile.skills_to_learn);
          }
        } catch (error) {
          // Profile doesn't exist yet - that's fine
          if (error instanceof Error && 
              !error.message.includes("PGRST116") && 
              !error.message.includes("No rows") &&
              !error.message.includes("not authenticated")) {
            console.error("Error loading profile after sign-in:", error);
          }
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        setAvatarMode("upload");
      };
      reader.readAsDataURL(file);
    }
  };

  const selectAvatar = (avatarUrl: string) => {
    setAvatar(avatarUrl);
    setAvatarMode("preset");
    setAvatarDropdownOpen(false);
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const addSkillToLearn = () => {
    if (skillToLearnInput.trim() && !skillsToLearn.includes(skillToLearnInput.trim())) {
      setSkillsToLearn([...skillsToLearn, skillToLearnInput.trim()]);
      setSkillToLearnInput("");
    }
  };

  const removeSkillToLearn = (skill: string) => {
    setSkillsToLearn(skillsToLearn.filter(s => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabaseUser) {
      toast.error("You must be logged in to save your profile");
      navigate("/");
      return;
    }
    
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!occupation) {
      toast.error("Please select your occupation");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if profile exists in Supabase
      let existingSupabaseProfile = null;
      try {
        existingSupabaseProfile = await getMyProfile();
      } catch (error) {
        // Profile doesn't exist yet, which is fine for new users
        // PGRST116 = no rows returned, "No rows" = alternative message
        if (error instanceof Error && (error.message.includes("PGRST116") || error.message.includes("No rows"))) {
          existingSupabaseProfile = null;
        } else if (error instanceof Error && error.message.includes("not authenticated")) {
          // User not authenticated - should have been caught earlier but handle gracefully
          toast.error("You must be logged in to save your profile");
          navigate("/");
          return;
        } else {
          // Re-throw other errors
          throw error;
        }
      }
      
      let skillsToLearnSaved = true;
      if (existingSupabaseProfile) {
        // Update existing profile in Supabase
        try {
          const updatedProfile = await updateMyProfile({
            full_name: name.trim(),
            username: name.trim().toLowerCase().replace(/\s+/g, '_'),
            avatar_url: avatar,
            bio: occupation,
            skills: skills,
            skills_to_learn: skillsToLearn,
            desired_skills: skillsToLearn, // Sync desired_skills with skills_to_learn
          });
          console.log("Profile updated successfully in Supabase:", updatedProfile);
          setExistingSupabaseProfile(updatedProfile);
        } catch (updateError) {
          console.error("Error updating profile in Supabase:", updateError);
          // If update fails due to missing column, try without skills_to_learn
          if (updateError instanceof Error && 
              (updateError.message.includes("skills_to_learn") || 
               updateError.message.includes("42703") ||
               updateError.message.includes("column") && updateError.message.includes("does not exist"))) {
            console.warn("skills_to_learn column may not exist. Updating without it...");
            const updatedProfileWithoutSkills = await updateMyProfile({
              full_name: name.trim(),
              username: name.trim().toLowerCase().replace(/\s+/g, '_'),
              avatar_url: avatar,
              bio: occupation,
              skills: skills,
            });
            console.log("Profile updated (without skills_to_learn):", updatedProfileWithoutSkills);
            setExistingSupabaseProfile(updatedProfileWithoutSkills);
            skillsToLearnSaved = false;
            toast.warning("Profile saved! Note: 'Skills to learn' column doesn't exist in database. Other fields saved successfully.");
          } else {
            throw updateError;
          }
        }
      } else {
        // Create new profile in Supabase
        try {
          const createdProfile = await createMyProfile({
            username: name.trim().toLowerCase().replace(/\s+/g, '_'),
            full_name: name.trim(),
            avatar_url: avatar,
            bio: occupation,
            skills: skills,
            skills_to_learn: skillsToLearn,
            desired_skills: skillsToLearn, // Sync desired_skills with skills_to_learn
          });
          console.log("Profile created successfully in Supabase:", createdProfile);
          setExistingSupabaseProfile(createdProfile);
        } catch (createError) {
          console.error("Error creating profile in Supabase:", createError);
          // If create fails due to missing column, try without skills_to_learn
          if (createError instanceof Error && 
              (createError.message.includes("skills_to_learn") || 
               createError.message.includes("42703") ||
               createError.message.includes("column") && createError.message.includes("does not exist"))) {
            console.warn("skills_to_learn column may not exist. Creating without it...");
            const createdProfileWithoutSkills = await createMyProfile({
              username: name.trim().toLowerCase().replace(/\s+/g, '_'),
              full_name: name.trim(),
              avatar_url: avatar,
              bio: occupation,
              skills: skills,
            });
            console.log("Profile created (without skills_to_learn):", createdProfileWithoutSkills);
            setExistingSupabaseProfile(createdProfileWithoutSkills);
            skillsToLearnSaved = false;
            toast.warning("Profile saved! Note: 'Skills to learn' column doesn't exist in database. Other fields saved successfully.");
          } else {
            throw createError;
          }
        }
      }
      
      // Also update local profile store for offline access
      const userId = supabaseUser.id;
      if (existingProfile) {
        updateProfile(userId, {
          name: name.trim(),
          avatar,
          occupation,
          skills,
          skillsToLearn,
        });
      } else {
        setProfile({
          id: userId,
          email: supabaseUser.email || "",
          name: name.trim(),
          avatar,
          occupation,
          skills,
          skillsToLearn,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      
      // Update auth store with basic user info
      if (user) {
    setUser({
          ...user,
      name: name.trim(),
      avatar,
    });
      }
    
      toast.success("Profile saved successfully!");
      setIsLoading(false);
      
      // Log what was saved for debugging
      console.log("Profile saved successfully with data:", {
        name: name.trim(),
        occupation,
        skills: skills,
        skillsToLearn: skillsToLearn,
        skillsToLearnSaved: skillsToLearnSaved,
        avatar,
      });
      
      // Verify the save by reloading from Supabase
      try {
        const verifyProfile = await getMyProfile();
        if (verifyProfile) {
          console.log("Verified saved profile from Supabase:", {
            full_name: verifyProfile.full_name,
            bio: verifyProfile.bio,
            skills: verifyProfile.skills,
            skills_to_learn: verifyProfile.skills_to_learn,
            avatar_url: verifyProfile.avatar_url,
          });
        }
      } catch (verifyError) {
        console.warn("Could not verify saved profile:", verifyError);
      }
      
      // Ensure navigation happens even if there are issues
      try {
        // Small delay to ensure UI updates and toast is visible, and Supabase has time to sync
        setTimeout(() => {
          console.log("Navigating to /profile after profile save to show updated data");
          // Navigate to profile page to show the updated data immediately
          navigate("/profile", { replace: true, state: { refresh: true, timestamp: Date.now() } });
        }, 800);
      } catch (navError) {
        console.error("Navigation error:", navError);
        // Fallback: use window.location as last resort
        setTimeout(() => {
          window.location.href = "/profile";
        }, 800);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save profile. Please try again.");
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[image:var(--gradient-soft)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show authentication UI if not authenticated
  if (!supabaseUser && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[image:var(--gradient-soft)]">
        <div className="w-full max-w-md">
          <Card className="backdrop-blur-sm bg-card/95 shadow-2xl border-2">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <img src="/swapx-logo.svg" alt="SwapX" className="h-10" />
              </div>
              <CardTitle className="text-2xl font-bold text-center">Get Started</CardTitle>
              <CardDescription className="text-center">
                Sign in to create your profile and start learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  style: {
                    button: {
                      borderRadius: "0.5rem",
                    },
                    input: {
                      borderRadius: "0.5rem",
                    },
                  },
                }}
                view="sign_up"
                providers={["google", "github"]}
                redirectTo={`${window.location.origin}/home`}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[image:var(--gradient-soft)]">
      <div className="w-full max-w-2xl">
        <Card className="backdrop-blur-sm bg-card/95 shadow-2xl border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-display">Complete Your Profile</CardTitle>
            <CardDescription className="text-lg">
              Let's set up your profile to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 text-base"
                />
              </div>

              {/* Occupation Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="occupation" className="text-base font-semibold">
                  Current Occupation <span className="text-destructive">*</span>
                </Label>
                <Select value={occupation} onValueChange={setOccupation} required>
                  <SelectTrigger id="occupation" className="h-12 text-base">
                    <SelectValue placeholder="Select your occupation" />
                  </SelectTrigger>
                  <SelectContent>
                    {OCCUPATIONS.map((occ) => (
                      <SelectItem key={occ} value={occ}>
                        {occ}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Photo/Avatar Section */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Profile Picture</Label>
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-32 w-32 border-4 border-primary/30">
                    <AvatarImage src={avatar} alt="Profile" />
                    <AvatarFallback className="text-2xl">
                      {name.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex gap-3 w-full max-w-md">
                    <Button
                      type="button"
                      variant={avatarMode === "upload" ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        fileInputRef.current?.click();
                        setAvatarMode("upload");
                      }}
                      className="gap-2 flex-1"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </Button>
                    <Popover open={avatarDropdownOpen} onOpenChange={setAvatarDropdownOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant={avatarMode === "preset" ? "default" : "outline"}
                          size="sm"
                          className="gap-2 flex-1"
                          onClick={() => setAvatarMode("preset")}
                        >
                          <User className="h-4 w-4" />
                          Choose Avatar
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-4" align="center">
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold">Select an avatar</Label>
                          <div className="grid grid-cols-5 gap-3 max-h-[350px] overflow-y-auto">
                            {AVATAR_PRESETS.map((preset, index) => (
                              <button
                                key={`avatar-${index}`}
                                type="button"
                                onClick={() => selectAvatar(preset)}
                                className={`relative h-14 w-14 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
                                  avatar === preset
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-muted hover:border-primary/50"
                                }`}
                              >
                                <img
                                  src={preset}
                                  alt={`Avatar ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Skills I Can Teach Section */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Skills I Can Teach</Label>
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill (e.g., React, Python, Design)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="h-12 text-base"
                  />
                  <Button type="button" size="icon" onClick={addSkill} className="h-12 w-12">
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg min-h-[3rem]">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-primary/10 text-primary text-sm py-1.5 px-3"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 hover:text-destructive transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Skills I Want to Learn Section */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Skills I Want to Learn</Label>
                <div className="flex gap-2">
                  <Input
                    value={skillToLearnInput}
                    onChange={(e) => setSkillToLearnInput(e.target.value)}
                    placeholder="Add a skill you want to learn (e.g., Machine Learning, UI/UX, DevOps)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillToLearn())}
                    className="h-12 text-base"
                  />
                  <Button type="button" size="icon" onClick={addSkillToLearn} className="h-12 w-12">
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
                {skillsToLearn.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg min-h-[3rem]">
                    {skillsToLearn.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="bg-accent/10 text-accent border-accent/20 text-sm py-1.5 px-3"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkillToLearn(skill)}
                          className="ml-2 hover:text-destructive transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full h-12 text-base" size="lg" disabled={isLoading}>
                {isLoading ? "Saving..." : "Complete Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;
