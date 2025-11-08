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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load existing profile data if available
  const existingProfile = user ? getProfile(user.id) : null;
  
  const [name, setName] = useState(existingProfile?.name || user?.name || "");
  const [occupation, setOccupation] = useState(existingProfile?.occupation || "");
  const [avatar, setAvatar] = useState(existingProfile?.avatar || user?.avatar || AVATAR_PRESETS[0]);
  const [avatarMode, setAvatarMode] = useState<"upload" | "preset">("preset");
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(existingProfile?.skills || []);
  const [skillToLearnInput, setSkillToLearnInput] = useState("");
  const [skillsToLearn, setSkillsToLearn] = useState<string[]>(existingProfile?.skillsToLearn || []);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [user, navigate]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to save your profile");
      navigate("/auth/login");
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
    
    // Update profile in profile store (this is the user's isolated profile data)
    if (existingProfile) {
      // Update existing profile
      updateProfile(user.id, {
        name: name.trim(),
        avatar,
        occupation,
        skills,
        skillsToLearn,
      });
    } else {
      // Create new profile
      setProfile({
        id: user.id,
        email: user.email,
        name: name.trim(),
        avatar,
        occupation,
        skills,
        skillsToLearn,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    
    // Also update auth store with basic user info
    setUser({
      ...user,
      name: name.trim(),
      avatar,
    });
    
    toast.success("Profile saved successfully! Your data is stored securely in your profile.");
    setTimeout(() => navigate("/home"), 1000);
  };

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

              <Button type="submit" className="w-full h-12 text-base" size="lg">
                Complete Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;
