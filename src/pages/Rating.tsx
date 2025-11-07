import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Star, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";

interface OtherAttendee {
  id: string;
  name: string;
  avatar: string;
  occupation?: string;
  currentTrustScore: number;
  totalSessions: number;
}

const Rating = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  
  // Get attendee info from URL params or mock data
  const attendeeId = searchParams.get("attendeeId") || "1";
  const attendeeName = searchParams.get("attendeeName") || "Sarah Johnson";
  const attendeeAvatar = searchParams.get("attendeeAvatar") || "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah";
  
  // Mock attendee data - in real app, fetch from API using sessionId and attendeeId
  const [otherAttendee] = useState<OtherAttendee>({
    id: attendeeId,
    name: attendeeName,
    avatar: attendeeAvatar,
    occupation: "React Developer",
    currentTrustScore: 4.8,
    totalSessions: 24,
  });

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // In a real app, check if user has already submitted rating for this session
    // const hasRated = checkIfRated(sessionId);
    // if (hasRated) {
    //   setIsSubmitted(true);
    // }
  }, [sessionId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    // In a real app, submit rating to API
    // await submitRating({
    //   sessionId,
    //   attendeeId: otherAttendee.id,
    //   rating,
    //   feedback,
    // });

    setIsSubmitted(true);
    toast.success("Rating submitted! Your feedback helps build trust in the community.");
    
    // In a real app, the other attendee will also rate you independently
    // This is just your rating of them
    setTimeout(() => {
      navigate("/dashboard");
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-6 text-center py-8">
                <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Rating Submitted!</h2>
                  <p className="text-muted-foreground mb-4">
                    Thank you for rating <strong>{otherAttendee.name}</strong>. 
                    Your feedback helps build trust in the SwapX community.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {otherAttendee.name} will also be able to rate you. Both ratings will update your trust scores.
                  </p>
                </div>
                <Button onClick={() => navigate("/dashboard")}>
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Rate Your Meeting</h1>
          <p className="text-muted-foreground">
            Help build trust in the community by rating your session partner
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Your Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarImage 
                    src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "User"}`} 
                    alt={user?.name || "You"} 
                  />
                  <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-semibold">{user?.name || "You"}</h3>
                  <p className="text-sm text-muted-foreground">Rating {otherAttendee.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Other Attendee Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Session Partner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarImage src={otherAttendee.avatar} alt={otherAttendee.name} />
                  <AvatarFallback>{otherAttendee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-semibold">{otherAttendee.name}</h3>
                  <p className="text-sm text-muted-foreground">{otherAttendee.occupation}</p>
                </div>
                <Separator className="my-2" />
                <div className="w-full space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Trust Score</span>
                    <span className="font-medium">{otherAttendee.currentTrustScore} ⭐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Sessions</span>
                    <span className="font-medium">{otherAttendee.totalSessions}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Rate {otherAttendee.name}</CardTitle>
            <CardDescription>
              How was your session with {otherAttendee.name}? Your honest feedback helps everyone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center gap-4 py-4">
                <p className="font-medium text-lg">How would you rate this session?</p>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-125 active:scale-95"
                    >
                      <Star
                        className={`h-12 w-12 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? 'fill-primary text-primary'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent"}
                  </p>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Additional Feedback (Optional)
                </label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your experience... What went well? What could be improved?"
                  rows={5}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Your feedback will be shared with {otherAttendee.name} to help them improve.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                <p className="text-sm font-medium">About Mutual Ratings</p>
                <p className="text-xs text-muted-foreground">
                  After you submit your rating, {otherAttendee.name} will also be able to rate you. 
                  Both ratings will be used to update your trust scores, helping build a trusted community.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1"
                >
                  Skip for Now
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={rating === 0}
                >
                  Submit Rating
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Rating;
