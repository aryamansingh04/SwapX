import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, Video, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import AppHeader from "@/components/AppHeader";
import { toast } from "sonner";

const MeetingScheduler = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"online" | "offline">("online");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("10:00");

  const handleSchedule = () => {
    const jitsiLink = `https://meet.jit.si/skillswap-${Date.now()}`;
    toast.success(mode === "online" 
      ? `Meeting scheduled! Link: ${jitsiLink}` 
      : "Meeting scheduled successfully!"
    );
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  return (
    <div className="min-h-screen bg-[image:var(--gradient-soft)]">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Schedule a Meeting</CardTitle>
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
              <div className="flex justify-center border rounded-lg p-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md"
                />
              </div>
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

            <Button onClick={handleSchedule} className="w-full">
              Schedule Meeting
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MeetingScheduler;
