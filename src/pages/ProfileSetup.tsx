import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import AppHeader from "@/components/AppHeader";
import { toast } from "sonner";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=User");
  const [skillKnownInput, setSkillKnownInput] = useState("");
  const [skillLearnInput, setSkillLearnInput] = useState("");
  const [skillsKnown, setSkillsKnown] = useState<string[]>([]);
  const [skillsToLearn, setSkillsToLearn] = useState<string[]>([]);

  const addSkillKnown = () => {
    if (skillKnownInput.trim() && !skillsKnown.includes(skillKnownInput.trim())) {
      setSkillsKnown([...skillsKnown, skillKnownInput.trim()]);
      setSkillKnownInput("");
    }
  };

  const addSkillLearn = () => {
    if (skillLearnInput.trim() && !skillsToLearn.includes(skillLearnInput.trim())) {
      setSkillsToLearn([...skillsToLearn, skillLearnInput.trim()]);
      setSkillLearnInput("");
    }
  };

  const removeSkillKnown = (skill: string) => {
    setSkillsKnown(skillsKnown.filter(s => s !== skill));
  };

  const removeSkillLearn = (skill: string) => {
    setSkillsToLearn(skillsToLearn.filter(s => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile saved successfully!");
    setTimeout(() => navigate("/home"), 1000);
  };

  return (
    <div className="min-h-screen bg-[image:var(--gradient-soft)]">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24 border-2 border-primary/20">
                  <AvatarImage src={avatar} alt="Profile" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" placeholder="Tell us about yourself..." rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="+1 234 567 8900" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="City, State" />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Skills I Can Teach</Label>
                <div className="flex gap-2">
                  <Input
                    value={skillKnownInput}
                    onChange={(e) => setSkillKnownInput(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillKnown())}
                  />
                  <Button type="button" size="icon" onClick={addSkillKnown}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillsKnown.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkillKnown(skill)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Skills I Want to Learn</Label>
                <div className="flex gap-2">
                  <Input
                    value={skillLearnInput}
                    onChange={(e) => setSkillLearnInput(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillLearn())}
                  />
                  <Button type="button" size="icon" onClick={addSkillLearn}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillsToLearn.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkillLearn(skill)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">Save Profile</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfileSetup;
