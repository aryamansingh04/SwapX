import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import ProfileCard from "@/components/ProfileCard";
import ProfileModal from "@/components/ProfileModal";
import Layout from "@/components/Layout";

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
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "React" },
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "TypeScript" }
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
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "Python" }
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
  },
  {
    id: "4",
    name: "Jordan Taylor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
    bio: "Mobile app developer specializing in iOS and Android",
    location: "Seattle, WA",
    skillsKnown: ["React Native", "Swift", "Kotlin"],
    skillsToLearn: ["Flutter", "UI Design"],
    trustScore: 4.6,
    totalSessions: 22,
    proofs: [
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "React Native" }
    ]
  },
  {
    id: "5",
    name: "Morgan Lee",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan",
    bio: "DevOps engineer passionate about automation",
    location: "Boston, MA",
    skillsKnown: ["Docker", "Kubernetes", "AWS"],
    skillsToLearn: ["Terraform", "Python"],
    trustScore: 4.9,
    totalSessions: 35,
    proofs: [
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "Kubernetes" },
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "AWS" }
    ]
  },
  {
    id: "6",
    name: "Casey Brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Casey",
    bio: "UI/UX designer with 5 years of experience",
    location: "Los Angeles, CA",
    skillsKnown: ["Figma", "Adobe XD", "UI Design"],
    skillsToLearn: ["React", "Frontend Development"],
    trustScore: 4.8,
    totalSessions: 28,
    proofs: [
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "Figma" }
    ]
  },
  {
    id: "7",
    name: "Riley Martinez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Riley",
    bio: "Backend developer specializing in microservices",
    location: "Chicago, IL",
    skillsKnown: ["Node.js", "GraphQL", "MongoDB"],
    skillsToLearn: ["Go", "System Design"],
    trustScore: 4.7,
    totalSessions: 19,
    proofs: []
  },
  {
    id: "8",
    name: "Avery Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Avery",
    bio: "Full-stack developer with expertise in Vue.js",
    location: "Denver, CO",
    skillsKnown: ["Vue.js", "Nuxt.js", "TypeScript"],
    skillsToLearn: ["Python", "Machine Learning"],
    trustScore: 4.6,
    totalSessions: 26,
    proofs: [
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "Vue.js" }
    ]
  },
  {
    id: "9",
    name: "Quinn Anderson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Quinn",
    bio: "Cybersecurity expert and ethical hacker",
    location: "Washington, DC",
    skillsKnown: ["Penetration Testing", "Network Security", "Linux"],
    skillsToLearn: ["Cloud Security", "Python"],
    trustScore: 4.9,
    totalSessions: 32,
    proofs: [
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "Network Security" }
    ]
  },
  {
    id: "10",
    name: "Sage Thompson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sage",
    bio: "Game developer specializing in Unity and C#",
    location: "Portland, OR",
    skillsKnown: ["Unity", "C#", "Game Design"],
    skillsToLearn: ["Unreal Engine", "3D Modeling"],
    trustScore: 4.5,
    totalSessions: 15,
    proofs: []
  },
  {
    id: "11",
    name: "River Garcia",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=River",
    bio: "Frontend developer passionate about animations",
    location: "Miami, FL",
    skillsKnown: ["CSS", "JavaScript", "Framer Motion"],
    skillsToLearn: ["React", "TypeScript"],
    trustScore: 4.7,
    totalSessions: 21,
    proofs: [
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "CSS" }
    ]
  },
  {
    id: "12",
    name: "Phoenix Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Phoenix",
    bio: "Blockchain developer and crypto enthusiast",
    location: "San Diego, CA",
    skillsKnown: ["Solidity", "Web3", "Ethereum"],
    skillsToLearn: ["Rust", "Smart Contracts"],
    trustScore: 4.8,
    totalSessions: 29,
    proofs: [
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "Solidity" },
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "Web3" }
    ]
  },
  {
    id: "13",
    name: "Skylar White",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Skylar",
    bio: "QA engineer with expertise in automation testing",
    location: "Atlanta, GA",
    skillsKnown: ["Selenium", "Cypress", "Jest"],
    skillsToLearn: ["Playwright", "Python"],
    trustScore: 4.6,
    totalSessions: 17,
    proofs: []
  },
  {
    id: "14",
    name: "Rowan Davis",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rowan",
    bio: "Database administrator and SQL expert",
    location: "Phoenix, AZ",
    skillsKnown: ["PostgreSQL", "MySQL", "MongoDB"],
    skillsToLearn: ["Redis", "Data Warehousing"],
    trustScore: 4.9,
    totalSessions: 33,
    proofs: [
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "PostgreSQL" }
    ]
  },
  {
    id: "15",
    name: "Blake Miller",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Blake",
    bio: "Cloud architect specializing in multi-cloud solutions",
    location: "Dallas, TX",
    skillsKnown: ["AWS", "Azure", "GCP"],
    skillsToLearn: ["Terraform", "Kubernetes"],
    trustScore: 4.8,
    totalSessions: 27,
    proofs: [
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "AWS" }
    ]
  },
  {
    id: "16",
    name: "Cameron Moore",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cameron",
    bio: "Full-stack developer with expertise in Java",
    location: "Houston, TX",
    skillsKnown: ["Java", "Spring Boot", "Hibernate"],
    skillsToLearn: ["Kotlin", "Microservices"],
    trustScore: 4.7,
    totalSessions: 23,
    proofs: []
  },
  {
    id: "17",
    name: "Drew Jackson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Drew",
    bio: "Data engineer building scalable data pipelines",
    location: "Nashville, TN",
    skillsKnown: ["Apache Spark", "Kafka", "Python"],
    skillsToLearn: ["Snowflake", "Airflow"],
    trustScore: 4.6,
    totalSessions: 20,
    proofs: [
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "Apache Spark" }
    ]
  },
  {
    id: "18",
    name: "Emery Taylor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emery",
    bio: "iOS developer passionate about SwiftUI",
    location: "San Jose, CA",
    skillsKnown: ["Swift", "SwiftUI", "Core Data"],
    skillsToLearn: ["Combine", "UIKit"],
    trustScore: 4.8,
    totalSessions: 25,
    proofs: [
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "Swift" }
    ]
  },
  {
    id: "19",
    name: "Finley Harris",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Finley",
    bio: "Android developer with Kotlin expertise",
    location: "Minneapolis, MN",
    skillsKnown: ["Kotlin", "Android SDK", "Jetpack Compose"],
    skillsToLearn: ["Flutter", "iOS Development"],
    trustScore: 4.7,
    totalSessions: 22,
    proofs: []
  },
  {
    id: "20",
    name: "Hayden Clark",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hayden",
    bio: "Machine learning engineer focused on NLP",
    location: "Raleigh, NC",
    skillsKnown: ["TensorFlow", "PyTorch", "Python"],
    skillsToLearn: ["LLMs", "Computer Vision"],
    trustScore: 4.9,
    totalSessions: 30,
    proofs: [
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "TensorFlow" },
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "PyTorch" }
    ]
  },
  {
    id: "21",
    name: "Jamie Lewis",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie",
    bio: "DevOps engineer automating infrastructure",
    location: "Columbus, OH",
    skillsKnown: ["Terraform", "Ansible", "Jenkins"],
    skillsToLearn: ["GitLab CI", "ArgoCD"],
    trustScore: 4.6,
    totalSessions: 18,
    proofs: []
  },
  {
    id: "22",
    name: "Kai Walker",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kai",
    bio: "Full-stack developer specializing in Next.js",
    location: "Charlotte, NC",
    skillsKnown: ["Next.js", "React", "Prisma"],
    skillsToLearn: ["GraphQL", "tRPC"],
    trustScore: 4.8,
    totalSessions: 24,
    proofs: [
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "Next.js" }
    ]
  },
  {
    id: "23",
    name: "Logan Hall",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Logan",
    bio: "Backend developer with Go expertise",
    location: "Indianapolis, IN",
    skillsKnown: ["Go", "Gin", "PostgreSQL"],
    skillsToLearn: ["Rust", "Microservices"],
    trustScore: 4.7,
    totalSessions: 19,
    proofs: []
  },
  {
    id: "24",
    name: "Noah Allen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah",
    bio: "Full-stack developer with Ruby on Rails",
    location: "Portland, ME",
    skillsKnown: ["Ruby", "Rails", "PostgreSQL"],
    skillsToLearn: ["Elixir", "Phoenix"],
    trustScore: 4.5,
    totalSessions: 16,
    proofs: [
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "Ruby" }
    ]
  },
  {
    id: "25",
    name: "Reese Young",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Reese",
    bio: "Frontend developer passionate about accessibility",
    location: "Baltimore, MD",
    skillsKnown: ["React", "Accessibility", "WCAG"],
    skillsToLearn: ["TypeScript", "Testing"],
    trustScore: 4.8,
    totalSessions: 26,
    proofs: [
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "React" }
    ]
  },
  {
    id: "26",
    name: "Sam King",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
    bio: "System architect designing scalable systems",
    location: "Milwaukee, WI",
    skillsKnown: ["System Design", "Architecture", "AWS"],
    skillsToLearn: ["Kubernetes", "Microservices"],
    trustScore: 4.9,
    totalSessions: 34,
    proofs: [
      { type: "pdf", url: "#", skill: "System Design" }
    ]
  },
  {
    id: "27",
    name: "Taylor Wright",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
    bio: "Product manager with technical background",
    location: "Detroit, MI",
    skillsKnown: ["Product Management", "Agile", "Scrum"],
    skillsToLearn: ["Data Analysis", "SQL"],
    trustScore: 4.6,
    totalSessions: 21,
    proofs: []
  },
  {
    id: "28",
    name: "Zoe Lopez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
    bio: "Frontend developer with Angular expertise",
    location: "Memphis, TN",
    skillsKnown: ["Angular", "TypeScript", "RxJS"],
    skillsToLearn: ["React", "Vue.js"],
    trustScore: 4.7,
    totalSessions: 23,
    proofs: [
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "Angular" }
    ]
  },
  {
    id: "29",
    name: "Blake Hill",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Blake2",
    bio: "Backend developer specializing in Elixir",
    location: "Louisville, KY",
    skillsKnown: ["Elixir", "Phoenix", "PostgreSQL"],
    skillsToLearn: ["Erlang", "Distributed Systems"],
    trustScore: 4.8,
    totalSessions: 28,
    proofs: []
  },
  {
    id: "30",
    name: "Jordan Scott",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan2",
    bio: "Full-stack developer with PHP and Laravel",
    location: "Oklahoma City, OK",
    skillsKnown: ["PHP", "Laravel", "MySQL"],
    skillsToLearn: ["Vue.js", "Redis"],
    trustScore: 4.6,
    totalSessions: 20,
    proofs: [
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "Laravel" }
    ]
  }
];

const Home = () => {
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [minTrustScore, setMinTrustScore] = useState<number>(0);

  // Get all unique skills from users
  const allSkills = Array.from(
    new Set(mockUsers.flatMap(user => user.skillsKnown))
  ).sort();

  const filteredUsers = mockUsers.filter(user => {
    // Search filter
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.skillsKnown.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      user.skillsToLearn.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    // Skills filter
    const matchesSkills = selectedSkills.length === 0 || 
      selectedSkills.some(skill => user.skillsKnown.includes(skill));

    // Trust score filter
    const matchesTrustScore = user.trustScore >= minTrustScore;

    return matchesSearch && matchesSkills && matchesTrustScore;
  });

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSelectedSkills([]);
    setMinTrustScore(0);
  };

  const activeFilterCount = selectedSkills.length + (minTrustScore > 0 ? 1 : 0);

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4 py-6 flex-shrink-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-4">People</h1>
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
              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className={`relative ${activeFilterCount > 0 ? 'border-primary' : ''}`}
                  >
                    <Filter className="h-4 w-4" />
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Filters</h3>
                      {activeFilterCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="h-8 text-xs"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Clear
                        </Button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Skills</Label>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {allSkills.map(skill => (
                            <div key={skill} className="flex items-center space-x-2">
                              <Checkbox
                                id={`skill-${skill}`}
                                checked={selectedSkills.includes(skill)}
                                onCheckedChange={() => handleSkillToggle(skill)}
                              />
                              <label
                                htmlFor={`skill-${skill}`}
                                className="text-sm font-normal cursor-pointer flex-1"
                              >
                                {skill}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          Minimum Trust Score: {minTrustScore.toFixed(1)}
                        </Label>
                        <input
                          type="range"
                          min="0"
                          max="5"
                          step="0.1"
                          value={minTrustScore}
                          onChange={(e) => setMinTrustScore(parseFloat(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>0</span>
                          <span>5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <ProfileCard
                    key={user.id}
                    user={user}
                    onViewProfile={() => setSelectedUser(user)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <p className="text-lg">No users found matching your criteria.</p>
                  <p className="text-sm mt-2">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <ProfileModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      </div>
    </Layout>
  );
};

export default Home;
