import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Calendar, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { toast } from "sonner";

interface TimeSlot {
  start: string;
  end: string;
}

interface DayAvailability {
  enabled: boolean;
  slots: TimeSlot[];
}

interface WeeklyAvailability {
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
  timezone: string;
}

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
] as const;

const TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'EST (Eastern Time)' },
  { value: 'America/Chicago', label: 'CST (Central Time)' },
  { value: 'America/Denver', label: 'MST (Mountain Time)' },
  { value: 'America/Los_Angeles', label: 'PST (Pacific Time)' },
  { value: 'Europe/London', label: 'GMT (London)' },
  { value: 'Europe/Paris', label: 'CET (Paris)' },
  { value: 'Asia/Dubai', label: 'GST (Dubai)' },
  { value: 'Asia/Kolkata', label: 'IST (India)' },
  { value: 'Asia/Tokyo', label: 'JST (Tokyo)' },
  { value: 'Australia/Sydney', label: 'AEST (Sydney)' },
];

const DEFAULT_TIME_SLOT: TimeSlot = { start: '09:00', end: '17:00' };

const AvailabilitySettings = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getProfile, updateProfile, setProfile } = useProfileStore();

  
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  const existingProfile = user ? getProfile(user.id) : null;
  const existingAvailability = (existingProfile as any)?.availability as WeeklyAvailability | undefined;

  const [availability, setAvailability] = useState<WeeklyAvailability>(() => {
    if (existingAvailability) {
      return existingAvailability;
    }
    
    const defaultAvailability: WeeklyAvailability = {
      monday: { enabled: true, slots: [DEFAULT_TIME_SLOT] },
      tuesday: { enabled: true, slots: [DEFAULT_TIME_SLOT] },
      wednesday: { enabled: true, slots: [DEFAULT_TIME_SLOT] },
      thursday: { enabled: true, slots: [DEFAULT_TIME_SLOT] },
      friday: { enabled: true, slots: [DEFAULT_TIME_SLOT] },
      saturday: { enabled: false, slots: [DEFAULT_TIME_SLOT] },
      sunday: { enabled: false, slots: [DEFAULT_TIME_SLOT] },
      timezone: browserTimezone,
    };
    return defaultAvailability;
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
  }, [user, navigate]);

  const toggleDay = (day: keyof WeeklyAvailability) => {
    if (day === 'timezone') return;
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }));
  };

  const addTimeSlot = (day: keyof WeeklyAvailability) => {
    if (day === 'timezone') return;
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { ...DEFAULT_TIME_SLOT }],
      },
    }));
  };

  const removeTimeSlot = (day: keyof WeeklyAvailability, index: number) => {
    if (day === 'timezone') return;
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, i) => i !== index),
      },
    }));
  };

  const updateTimeSlot = (
    day: keyof WeeklyAvailability,
    index: number,
    field: 'start' | 'end',
    value: string
  ) => {
    if (day === 'timezone') return;
    setAvailability((prev) => {
      const newSlots = [...prev[day].slots];
      newSlots[index] = { ...newSlots[index], [field]: value };
      return {
        ...prev,
        [day]: {
          ...prev[day],
          slots: newSlots,
        },
      };
    });
  };

  const handleSave = () => {
    if (!user) {
      toast.error("You must be logged in to save availability");
      return;
    }

    
    for (const day of DAYS) {
      const dayAvailability = availability[day.key as keyof WeeklyAvailability] as DayAvailability;
      if (dayAvailability.enabled) {
        for (const slot of dayAvailability.slots) {
          if (slot.start >= slot.end) {
            toast.error(`${day.label}: Start time must be before end time`);
            return;
          }
        }
      }
    }

    
    if (existingProfile) {
      updateProfile(user.id, {
        availability: availability as any,
      });
    } else {
      
      setProfile({
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        skills: [],
        skillsToLearn: [],
        availability: availability as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    toast.success("Availability saved successfully!");
    navigate("/profile");
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Availability Settings
            </CardTitle>
            <CardDescription>
              Set your weekly availability so others can schedule meetings with you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {}
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={availability.timezone}
                onValueChange={(value) =>
                  setAvailability((prev) => ({ ...prev, timezone: value }))
                }
              >
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Weekly Schedule</Label>
              {DAYS.map((day) => {
                const dayKey = day.key as keyof WeeklyAvailability;
                const dayAvailability = availability[dayKey] as DayAvailability;

                return (
                  <Card key={day.key} className="border">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={dayAvailability.enabled}
                            onCheckedChange={() => toggleDay(dayKey)}
                          />
                          <Label className="text-base font-medium cursor-pointer">
                            {day.label}
                          </Label>
                        </div>
                        {dayAvailability.enabled && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addTimeSlot(dayKey)}
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            Add Time Slot
                          </Button>
                        )}
                      </div>

                      {dayAvailability.enabled && (
                        <div className="space-y-3 pl-8">
                          {dayAvailability.slots.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              No time slots added. Click "Add Time Slot" to add availability.
                            </p>
                          ) : (
                            dayAvailability.slots.map((slot, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                              >
                                <div className="flex items-center gap-2 flex-1">
                                  <Label className="text-sm w-12">From:</Label>
                                  <Input
                                    type="time"
                                    value={slot.start}
                                    onChange={(e) =>
                                      updateTimeSlot(dayKey, index, 'start', e.target.value)
                                    }
                                    className="w-32"
                                  />
                                </div>
                                <div className="flex items-center gap-2 flex-1">
                                  <Label className="text-sm w-12">To:</Label>
                                  <Input
                                    type="time"
                                    value={slot.end}
                                    onChange={(e) =>
                                      updateTimeSlot(dayKey, index, 'end', e.target.value)
                                    }
                                    className="w-32"
                                  />
                                </div>
                                {dayAvailability.slots.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeTimeSlot(dayKey, index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => navigate("/profile")} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Availability
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AvailabilitySettings;

