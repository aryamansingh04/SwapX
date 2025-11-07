import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Settings, Bell, Shield, Users, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const ConnectionSettings = () => {
  const defaultSettings = {
    // Privacy Settings
    showOnlineStatus: true,
    showLastSeen: true,
    allowConnectionRequests: true,
    allowDirectMessages: true,
    shareProfileWithConnections: true,
    showTrustScore: true,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    connectionRequestNotifications: true,
    messageNotifications: true,
    meetingReminderNotifications: true,
    ratingNotifications: true,
    
    // Communication Preferences
    allowVideoCalls: true,
    allowVoiceCalls: true,
    autoAcceptMeetings: false,
    meetingReminderTime: "15", // minutes before meeting
    
    // Connection Settings
    autoApproveConnections: false,
    requireVerification: false,
    maxConnections: "100",
    allowPublicProfile: true,
    
    // Blocked Users
    blockedUsers: [] as string[],
  };

  const [settings, setSettings] = useState(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem("connectionSettings");
    if (savedSettings) {
      try {
        return { ...defaultSettings, ...JSON.parse(savedSettings) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("connectionSettings", JSON.stringify(settings));
  }, [settings]);

  const handleToggle = (key: keyof typeof settings) => {
    if (typeof settings[key] === "boolean") {
      setSettings((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    }
  };

  const handleInputChange = (key: keyof typeof settings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    // Settings are auto-saved via useEffect, but show confirmation
    toast.success("Settings saved successfully!");
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    toast.success("Settings reset to defaults");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Connection Settings</h1>
          <p className="text-muted-foreground">Manage your connection preferences and privacy settings</p>
        </div>

        <div className="space-y-6">
          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control who can see your information and connect with you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showOnlineStatus">Show Online Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Let others see when you're online
                  </p>
                </div>
                <Switch
                  id="showOnlineStatus"
                  checked={settings.showOnlineStatus}
                  onCheckedChange={() => handleToggle("showOnlineStatus")}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showLastSeen">Show Last Seen</Label>
                  <p className="text-sm text-muted-foreground">
                    Display when you were last active
                  </p>
                </div>
                <Switch
                  id="showLastSeen"
                  checked={settings.showLastSeen}
                  onCheckedChange={() => handleToggle("showLastSeen")}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowConnectionRequests">Allow Connection Requests</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow others to send you connection requests
                  </p>
                </div>
                <Switch
                  id="allowConnectionRequests"
                  checked={settings.allowConnectionRequests}
                  onCheckedChange={() => handleToggle("allowConnectionRequests")}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowDirectMessages">Allow Direct Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow people to send you direct messages
                  </p>
                </div>
                <Switch
                  id="allowDirectMessages"
                  checked={settings.allowDirectMessages}
                  onCheckedChange={() => handleToggle("allowDirectMessages")}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="shareProfileWithConnections">Share Profile with Connections</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow connections to view your full profile
                  </p>
                </div>
                <Switch
                  id="shareProfileWithConnections"
                  checked={settings.shareProfileWithConnections}
                  onCheckedChange={() => handleToggle("shareProfileWithConnections")}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showTrustScore">Show Trust Score</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your trust score on your profile
                  </p>
                </div>
                <Switch
                  id="showTrustScore"
                  checked={settings.showTrustScore}
                  onCheckedChange={() => handleToggle("showTrustScore")}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowPublicProfile">Public Profile</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your profile visible to everyone
                  </p>
                </div>
                <Switch
                  id="allowPublicProfile"
                  checked={settings.allowPublicProfile}
                  onCheckedChange={() => handleToggle("allowPublicProfile")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={() => handleToggle("emailNotifications")}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications in your browser
                  </p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={() => handleToggle("pushNotifications")}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="connectionRequestNotifications">Connection Request Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone sends a connection request
                  </p>
                </div>
                <Switch
                  id="connectionRequestNotifications"
                  checked={settings.connectionRequestNotifications}
                  onCheckedChange={() => handleToggle("connectionRequestNotifications")}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="messageNotifications">Message Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when you receive new messages
                  </p>
                </div>
                <Switch
                  id="messageNotifications"
                  checked={settings.messageNotifications}
                  onCheckedChange={() => handleToggle("messageNotifications")}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="meetingReminderNotifications">Meeting Reminder Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded before scheduled meetings
                  </p>
                </div>
                <Switch
                  id="meetingReminderNotifications"
                  checked={settings.meetingReminderNotifications}
                  onCheckedChange={() => handleToggle("meetingReminderNotifications")}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ratingNotifications">Rating Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone rates you
                  </p>
                </div>
                <Switch
                  id="ratingNotifications"
                  checked={settings.ratingNotifications}
                  onCheckedChange={() => handleToggle("ratingNotifications")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Communication Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Communication Preferences
              </CardTitle>
              <CardDescription>
                Control how others can communicate with you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowVideoCalls">Allow Video Calls</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow others to initiate video calls with you
                  </p>
                </div>
                <Switch
                  id="allowVideoCalls"
                  checked={settings.allowVideoCalls}
                  onCheckedChange={() => handleToggle("allowVideoCalls")}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowVoiceCalls">Allow Voice Calls</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow others to initiate voice calls with you
                  </p>
                </div>
                <Switch
                  id="allowVoiceCalls"
                  checked={settings.allowVoiceCalls}
                  onCheckedChange={() => handleToggle("allowVoiceCalls")}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoAcceptMeetings">Auto-Accept Meetings</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically accept meeting requests from connections
                  </p>
                </div>
                <Switch
                  id="autoAcceptMeetings"
                  checked={settings.autoAcceptMeetings}
                  onCheckedChange={() => handleToggle("autoAcceptMeetings")}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="meetingReminderTime">Meeting Reminder Time (minutes)</Label>
                <Input
                  id="meetingReminderTime"
                  type="number"
                  min="5"
                  max="60"
                  value={settings.meetingReminderTime}
                  onChange={(e) => handleInputChange("meetingReminderTime", e.target.value)}
                  className="max-w-[200px]"
                />
                <p className="text-sm text-muted-foreground">
                  Get reminded this many minutes before a meeting starts
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Connection Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Connection Management
              </CardTitle>
              <CardDescription>
                Manage how connections are handled
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoApproveConnections">Auto-Approve Connections</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve connection requests
                  </p>
                </div>
                <Switch
                  id="autoApproveConnections"
                  checked={settings.autoApproveConnections}
                  onCheckedChange={() => handleToggle("autoApproveConnections")}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="requireVerification">Require Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Require email verification for new connections
                  </p>
                </div>
                <Switch
                  id="requireVerification"
                  checked={settings.requireVerification}
                  onCheckedChange={() => handleToggle("requireVerification")}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="maxConnections">Maximum Connections</Label>
                <Input
                  id="maxConnections"
                  type="number"
                  min="10"
                  max="1000"
                  value={settings.maxConnections}
                  onChange={(e) => handleInputChange("maxConnections", e.target.value)}
                  className="max-w-[200px]"
                />
                <p className="text-sm text-muted-foreground">
                  Maximum number of connections allowed (10-1000)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={handleReset}>
              Reset to Defaults
            </Button>
            <Button onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConnectionSettings;

