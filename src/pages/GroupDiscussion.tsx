import Layout from "@/components/Layout";
import { MessageSquare, Users, Plus, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  role: "admin" | "member";
}

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  lastMessage: string;
  lastMessageTime: Date;
  avatar?: string;
  tags: string[];
  members?: GroupMember[];
  messages?: any[];
  createdAt?: Date;
}

const GroupDiscussion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupTags, setNewGroupTags] = useState("");

  useEffect(() => {
    loadGroups();
    
    window.addEventListener("groupsUpdated", loadGroups);
    return () => {
      window.removeEventListener("groupsUpdated", loadGroups);
    };
  }, []);

  
  useEffect(() => {
    if (location.pathname === "/groups") {
      loadGroups();
    }
  }, [location.pathname]);

  const loadGroups = () => {
    const savedGroups = JSON.parse(localStorage.getItem("groups") || "[]");
    
    if (savedGroups.length === 0) {
      
      const defaultGroups = createDefaultGroups();
      saveGroups(defaultGroups);
      setGroups(formatGroupsForDisplay(defaultGroups));
    } else {
      setGroups(formatGroupsForDisplay(savedGroups));
    }
  };

  const createDefaultGroups = () => {
    const now = new Date();
    return [
      {
        id: "1",
        name: "React Developers",
        description: "Share knowledge and discuss React best practices",
        members: [
          { id: user?.id || "1", name: user?.name || "You", role: "member" as const },
          { id: "2", name: "Alex Johnson", role: "admin" as const },
          { id: "3", name: "Sarah Chen", role: "member" as const },
          { id: "4", name: "Mike Davis", role: "member" as const },
        ],
        messages: [
          {
            id: "m1",
            senderId: "2",
            senderName: "Alex Johnson",
            text: "Welcome to React Developers! Feel free to share your projects and ask questions.",
            timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            isOwn: false,
          },
          {
            id: "m2",
            senderId: "3",
            senderName: "Sarah Chen",
            text: "Has anyone tried React 19 yet? The new features look amazing!",
            timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
            isOwn: false,
          },
        ],
        tags: ["React", "JavaScript", "Frontend"],
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        name: "Python Learning",
        description: "Learn Python together and solve coding challenges",
        members: [
          { id: user?.id || "1", name: user?.name || "You", role: "member" as const },
          { id: "5", name: "David Lee", role: "admin" as const },
          { id: "6", name: "Emma Wilson", role: "member" as const },
        ],
        messages: [
          {
            id: "m3",
            senderId: "5",
            senderName: "David Lee",
            text: "Great tutorial on data structures! Check it out: https://example.com",
            timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
            isOwn: false,
          },
        ],
        tags: ["Python", "Programming"],
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "3",
        name: "UI/UX Designers",
        description: "Discuss design trends and share portfolio feedback",
        members: [
          { id: user?.id || "1", name: user?.name || "You", role: "member" as const },
          { id: "7", name: "Lisa Park", role: "admin" as const },
          { id: "8", name: "Tom Brown", role: "member" as const },
        ],
        messages: [
          {
            id: "m4",
            senderId: "7",
            senderName: "Lisa Park",
            text: "New design system looks amazing! Who's working on it?",
            timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
            isOwn: false,
          },
        ],
        tags: ["Design", "UI/UX"],
        createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "4",
        name: "Machine Learning",
        description: "Deep dive into ML algorithms and projects",
        members: [
          { id: user?.id || "1", name: user?.name || "You", role: "member" as const },
          { id: "9", name: "Ryan Kim", role: "admin" as const },
          { id: "10", name: "Sophia Martinez", role: "member" as const },
        ],
        messages: [
          {
            id: "m5",
            senderId: "9",
            senderName: "Ryan Kim",
            text: "Check out this new transformer model - it's groundbreaking!",
            timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            isOwn: false,
          },
        ],
        tags: ["ML", "AI", "Data Science"],
        createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "5",
        name: "Web Development",
        description: "General web development discussions",
        members: [
          { id: user?.id || "1", name: user?.name || "You", role: "member" as const },
          { id: "11", name: "Chris Taylor", role: "admin" as const },
          { id: "12", name: "Anna White", role: "member" as const },
        ],
        messages: [
          {
            id: "m6",
            senderId: "11",
            senderName: "Chris Taylor",
            text: "Best practices for API design - let's discuss!",
            timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            isOwn: false,
          },
        ],
        tags: ["Web Dev", "Backend", "Frontend"],
        createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "6",
        name: "Startup Founders",
        description: "Connect with fellow entrepreneurs",
        members: [
          { id: user?.id || "1", name: user?.name || "You", role: "member" as const },
          { id: "13", name: "Jordan Smith", role: "admin" as const },
          { id: "14", name: "Casey Jones", role: "member" as const },
        ],
        messages: [
          {
            id: "m7",
            senderId: "13",
            senderName: "Jordan Smith",
            text: "Looking for a co-founder with technical background. Anyone interested?",
            timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            isOwn: false,
          },
        ],
        tags: ["Entrepreneurship", "Startup"],
        createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
  };

  const formatGroupsForDisplay = (savedGroups: any[]): Group[] => {
    return savedGroups.map((group) => {
      const lastMessage = group.messages && group.messages.length > 0
        ? group.messages[group.messages.length - 1]
        : null;

      return {
        id: group.id,
        name: group.name,
        description: group.description,
        memberCount: group.members?.length || 0,
        lastMessage: lastMessage?.text || "No messages yet",
        lastMessageTime: lastMessage
          ? new Date(lastMessage.timestamp)
          : new Date(group.createdAt || Date.now()),
        tags: group.tags || [],
        members: group.members,
        messages: group.messages,
        createdAt: group.createdAt ? new Date(group.createdAt) : new Date(),
      };
    }).sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
  };

  const saveGroups = (groupsToSave: any[]) => {
    localStorage.setItem("groups", JSON.stringify(groupsToSave));
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to create a group");
      return;
    }

    const tags = newGroupTags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const newGroup = {
      id: `group-${Date.now()}`,
      name: newGroupName.trim(),
      description: newGroupDescription.trim() || "No description",
      members: [
        { id: user.id || "1", name: user.name || "You", role: "admin" as const },
      ],
      messages: [],
      tags: tags,
      createdAt: new Date().toISOString(),
    };

    const existingGroups = JSON.parse(localStorage.getItem("groups") || "[]");
    const updatedGroups = [...existingGroups, newGroup];
    saveGroups(updatedGroups);
    setGroups(formatGroupsForDisplay(updatedGroups));

    
    setNewGroupName("");
    setNewGroupDescription("");
    setNewGroupTags("");
    setIsCreateDialogOpen(false);

    toast.success("Group created successfully!");
    
    
    navigate(`/groups/${newGroup.id}`);
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Group Discussions</h1>
            <p className="text-muted-foreground">Join communities and discuss topics you're passionate about</p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredGroups.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                No Groups Found
              </CardTitle>
              <CardDescription>
                No groups match your search criteria.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Try adjusting your search or create a new group!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map((group) => (
              <Card
                key={group.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/groups/${group.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {group.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-1">{group.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{group.memberCount} members</span>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">{group.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {group.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {group.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{group.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-1">{group.lastMessage}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(group.lastMessageTime, "MMM d, h:mm a")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
              <DialogDescription>
                Create a new group discussion for your community
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="group-name">Group Name *</Label>
                <Input
                  id="group-name"
                  placeholder="Enter group name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group-description">Description</Label>
                <Textarea
                  id="group-description"
                  placeholder="Enter group description"
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group-tags">Tags (comma-separated)</Label>
                <Input
                  id="group-tags"
                  placeholder="e.g., React, JavaScript, Frontend"
                  value={newGroupTags}
                  onChange={(e) => setNewGroupTags(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateGroup}>Create Group</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default GroupDiscussion;

