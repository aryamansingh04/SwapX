import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar as CalendarIcon, Video, MapPin, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Layout from "@/components/Layout";
import { toast } from "sonner";

const MeetingScheduler = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [mode, setMode] = useState<"online" | "offline">("online");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("10:00");

  // Get user info if called from a specific chat
  const getChatUserInfo = () => {
    // In a real app, you'd fetch this from the API
    if (id && id !== "new") {
      // Mock chat users - in real app, fetch from API
      const chatUsers: Record<string, { id: string; name: string; avatar: string }> = {
        "1": { id: "1", name: "Sarah Johnson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
        "2": { id: "2", name: "Alex Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
        "3": { id: "3", name: "Maya Patel", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya" },
        "4": { id: "4", name: "Jordan Taylor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan" },
      };
      return chatUsers[id] || { id, name: "User", avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}` };
    }
    return null;
  };

  const chatUser = getChatUserInfo();
  const [isMeetingActive, setIsMeetingActive] = useState(false);
  const [meetingLink, setMeetingLink] = useState<string | null>(null);

  const handleSchedule = () => {
    const jitsiLink = `https://meet.jit.si/swapx-${Date.now()}`;
    toast.success(mode === "online" 
      ? `Meeting scheduled! Link: ${jitsiLink}` 
      : "Meeting scheduled successfully!"
    );
    
    // Store meeting info for later (in real app, save to database)
    // For now, just show success and navigate back
    setTimeout(() => {
      if (chatUser) {
        navigate(`/chat/${id}`);
      } else {
        navigate("/dashboard");
      }
    }, 1500);
  };

  // Handle ending a scheduled meeting (for future scheduled meetings)
  const handleEndScheduledMeeting = () => {
    if (!chatUser) {
      toast.error("Cannot end meeting: No attendee information");
      return;
    }
    
    const sessionId = `session-${Date.now()}`;
    const params = new URLSearchParams({
      attendeeId: chatUser.id,
      attendeeName: chatUser.name,
      attendeeAvatar: chatUser.avatar,
    });
    
    navigate(`/rate/${sessionId}?${params.toString()}`);
    toast.info("Meeting ended. Please rate your session partner.");
  };

  const handleStartNow = () => {
    // Start an immediate video call
    const jitsiLink = `https://meet.jit.si/swapx-${Date.now()}`;
    setMeetingLink(jitsiLink);
    setIsMeetingActive(true);
    window.open(jitsiLink, "_blank");
    toast.success("Opening video call...");
  };

  const handleEndMeeting = () => {
    if (!chatUser) {
      toast.error("Cannot end meeting: No attendee information");
      return;
    }
    
    // Generate session ID for the meeting
    const sessionId = `session-${Date.now()}`;
    
    // Navigate to rating page with attendee information
    const params = new URLSearchParams({
      attendeeId: chatUser.id,
      attendeeName: chatUser.name,
      attendeeAvatar: chatUser.avatar,
    });
    
    navigate(`/rate/${sessionId}?${params.toString()}`);
    toast.info("Meeting ended. Please rate your session partner.");
  };

  // If meeting is active, show meeting controls
  if (isMeetingActive && chatUser) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Meeting in Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-green-500 flex items-center justify-center">
                    <Video className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-6 w-6 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">Meeting with {chatUser.name}</h3>
                  <p className="text-sm text-muted-foreground">Click the link below to join</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <p className="text-sm font-medium">Meeting Link</p>
                <div className="flex items-center gap-2">
                  <Input 
                    value={meetingLink || ""} 
                    readOnly 
                    className="flex-1 font-mono text-xs"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (meetingLink) {
                        navigator.clipboard.writeText(meetingLink);
                        toast.success("Link copied!");
                      }
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    if (meetingLink) {
                      window.open(meetingLink, "_blank");
                    }
                  }}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Open Meeting in New Tab
                </Button>
              </div>

              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleEndMeeting}
                >
                  End Meeting & Rate Session
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  After ending the meeting, you'll be asked to rate {chatUser.name}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {chatUser ? `Schedule Meeting with ${chatUser.name}` : "Schedule a Meeting"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Meeting Mode</Label>
              <RadioGroup value={mode} onValueChange={(v) => setMode(v as "online" | "offline")}>
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="flex-1 cursor-pointer flex items-center gap-2">
                    <Video className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">Online Meeting</p>
                      <p className="text-sm text-muted-foreground">Video call via Jitsi</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="offline" id="offline" />
                  <Label htmlFor="offline" className="flex-1 cursor-pointer flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-secondary" />
                    <div>
                      <p className="font-medium">Offline Meeting</p>
                      <p className="text-sm text-muted-foreground">Meet in person</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    modifiersClassNames={{
                      selected: "rounded-full"
                    }}
                    classNames={{
                      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-full",
                      day_today: "",
                    }}
                  />
                </PopoverContent>
              </Popover>
              {date && (
                <div className="text-sm text-muted-foreground">
                  Selected: <span className="font-medium text-foreground">{format(date, "EEEE, MMMM d, yyyy")}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="time">Select Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            {mode === "offline" && (
              <div className="space-y-3">
                <Label htmlFor="location">Meeting Location</Label>
                <Input
                  id="location"
                  placeholder="Enter address or place..."
                />
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleStartNow}
                className="flex-1"
              >
                <Video className="h-4 w-4 mr-2" />
                Start Now
              </Button>
              <Button onClick={handleSchedule} className="flex-1">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MeetingScheduler;
