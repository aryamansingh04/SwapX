import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProfileCard from "@/components/ProfileCard";
import ProfileModal from "@/components/ProfileModal";
import AppHeader from "@/components/AppHeader";

const mockUsers = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    bio: "Passionate web developer and UI/UX enthusiast",
    location: "San Francisco, CA",
    skillsKnown: ["React", "TypeScript", "UI Design"],
    skillsToLearn: ["Python", "Data Science"],
    trustScore: 4.8,
    totalSessions: 24,
    proofs: [
      { type: "video", url: "#", skill: "React" },
      { type: "pdf", url: "#", skill: "TypeScript" }
    ]
  },
  {
    id: "2",
    name: "Alex Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    bio: "Full-stack engineer with a love for teaching",
    location: "New York, NY",
    skillsKnown: ["Python", "Django", "PostgreSQL"],
    skillsToLearn: ["React Native", "Mobile Dev"],
    trustScore: 4.9,
    totalSessions: 31,
    proofs: [
      { type: "video", url: "#", skill: "Python" }
    ]
  },
  {
    id: "3",
    name: "Maya Patel",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
    bio: "Data scientist who loves visualization",
    location: "Austin, TX",
    skillsKnown: ["Data Science", "Machine Learning", "Python"],
    skillsToLearn: ["DevOps", "Kubernetes"],
    trustScore: 4.7,
    totalSessions: 18,
    proofs: []
  }
];

const Home = () => {
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.skillsKnown.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[image:var(--gradient-soft)]">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Discover Skills</h1>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or skill..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <ProfileCard
              key={user.id}
              user={user}
              onViewProfile={() => setSelectedUser(user)}
            />
          ))}
        </div>
      </main>

      <ProfileModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
};

export default Home;
