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

const Signup = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { getProfile, setProfile } = useProfileStore();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    // Generate unique user ID from email
    const userId = generateUserIdFromEmail(email);
    
    // Check if user already exists
    const existingProfile = getProfile(userId);
    if (existingProfile) {
      toast.error("An account with this email already exists. Please login instead.");
      return;
    }
    
    setIsLoading(true);
    
    // Mock authentication - replace with actual API call
    setTimeout(() => {
      // Create initial profile entry
      const normalizedEmail = email.toLowerCase().trim();
      setProfile({
        id: userId,
        email: normalizedEmail,
        name: name.trim(),
        skills: [],
        skillsToLearn: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      setUser({
        id: userId,
        email: normalizedEmail,
        name: name.trim(),
      });
      
      setIsLoading(false);
      toast.success("Account created successfully! Please complete your profile.");
      navigate("/profile/setup");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[image:var(--gradient-soft)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/swapx-logo.svg" alt="SwapX" className="h-12 mx-auto mb-4" />
          <p className="text-muted-foreground">Create your account to get started</p>
        </div>

        <Card className="backdrop-blur-sm bg-card/95 shadow-2xl border-2">
          <CardHeader>
            <CardTitle>Create account</CardTitle>
            <CardDescription>Sign up to start learning and teaching</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  aria-required="true"
                  autoComplete="name"
                />
              </div>
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
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  aria-required="true"
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;

