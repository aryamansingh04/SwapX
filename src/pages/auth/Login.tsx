import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { generateUserIdFromEmail, isValidEmail } from "@/lib/auth";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { getProfile, setProfile } = useProfileStore();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    
    // Mock authentication - replace with actual API call
    setTimeout(() => {
      // Generate unique user ID from email
      const userId = generateUserIdFromEmail(email);
      
      // Check if profile already exists
      const existingProfile = getProfile(userId);
      
      if (existingProfile) {
        // User exists - restore their profile data
        setUser({
          id: existingProfile.id,
          email: existingProfile.email,
          name: existingProfile.name,
          avatar: existingProfile.avatar,
        });
        setIsLoading(false);
        toast.success(`Welcome back, ${existingProfile.name}!`);
        navigate("/home");
      } else {
        // New user - create basic profile and redirect to setup
        const newUser = {
          id: userId,
          email: email.toLowerCase().trim(),
          name: email.split("@")[0],
        };
        
        // Create initial profile entry
        setProfile({
          id: userId,
          email: email.toLowerCase().trim(),
          name: email.split("@")[0],
          skills: [],
          skillsToLearn: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        
        setUser(newUser);
        setIsLoading(false);
        toast.success("Login successful! Please complete your profile.");
        navigate("/profile/setup");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[image:var(--gradient-soft)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/swapx-logo.svg" alt="SwapX" className="h-12 mx-auto mb-4" />
          <p className="text-muted-foreground">Learn together, grow together</p>
        </div>

        <Card className="backdrop-blur-sm bg-card/95 shadow-2xl border-2">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-required="true"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-required="true"
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

