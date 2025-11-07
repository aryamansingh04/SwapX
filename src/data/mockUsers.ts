export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  skillsKnown: string[];
  skillsToLearn: string[];
  trustScore: number;
  totalSessions: number;
  github?: string;
  linkedin?: string;
  proofs: Array<{ type: string; url: string; skill: string }>;
}

export const mockUsers: User[] = [
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
    github: "https://github.com/sarahjohnson",
    linkedin: "https://linkedin.com/in/sarahjohnson",
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
    github: "https://github.com/alexchen",
    linkedin: "https://linkedin.com/in/alexchen",
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
    github: "https://github.com/mayapatel",
    linkedin: "https://linkedin.com/in/mayapatel",
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
    github: "https://github.com/jordantaylor",
    linkedin: "https://linkedin.com/in/jordantaylor",
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
    github: "https://github.com/morganlee",
    linkedin: "https://linkedin.com/in/morganlee",
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
    github: "https://github.com/caseybrown",
    linkedin: "https://linkedin.com/in/caseybrown",
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
    github: "https://github.com/rileymartinez",
    linkedin: "https://linkedin.com/in/rileymartinez",
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
    github: "https://github.com/averywilson",
    linkedin: "https://linkedin.com/in/averywilson",
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
    github: "https://github.com/quinnanderson",
    linkedin: "https://linkedin.com/in/quinnanderson",
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
    github: "https://github.com/sagethompson",
    linkedin: "https://linkedin.com/in/sagethompson",
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
    github: "https://github.com/rivergarcia",
    linkedin: "https://linkedin.com/in/rivergarcia",
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
    github: "https://github.com/phoenixrodriguez",
    linkedin: "https://linkedin.com/in/phoenixrodriguez",
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
    github: "https://github.com/skylarwhite",
    linkedin: "https://linkedin.com/in/skylarwhite",
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
    github: "https://github.com/rowandavis",
    linkedin: "https://linkedin.com/in/rowandavis",
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
    github: "https://github.com/blakemiller",
    linkedin: "https://linkedin.com/in/blakemiller",
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
    github: "https://github.com/cameronmoore",
    linkedin: "https://linkedin.com/in/cameronmoore",
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
    github: "https://github.com/drewjackson",
    linkedin: "https://linkedin.com/in/drewjackson",
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
    github: "https://github.com/emerytaylor",
    linkedin: "https://linkedin.com/in/emerytaylor",
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
    github: "https://github.com/finleyharris",
    linkedin: "https://linkedin.com/in/finleyharris",
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
    github: "https://github.com/haydenclark",
    linkedin: "https://linkedin.com/in/haydenclark",
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
    github: "https://github.com/jamielewis",
    linkedin: "https://linkedin.com/in/jamielewis",
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
    github: "https://github.com/kaiwalker",
    linkedin: "https://linkedin.com/in/kaiwalker",
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
    github: "https://github.com/loganhall",
    linkedin: "https://linkedin.com/in/loganhall",
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
    github: "https://github.com/noahallen",
    linkedin: "https://linkedin.com/in/noahallen",
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
    github: "https://github.com/reessyoung",
    linkedin: "https://linkedin.com/in/reessyoung",
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
    github: "https://github.com/samking",
    linkedin: "https://linkedin.com/in/samking",
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
    github: "https://github.com/taylorwright",
    linkedin: "https://linkedin.com/in/taylorwright",
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
    github: "https://github.com/zoelopez",
    linkedin: "https://linkedin.com/in/zoelopez",
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
    github: "https://github.com/blakehill",
    linkedin: "https://linkedin.com/in/blakehill",
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
    github: "https://github.com/jordanscott",
    linkedin: "https://linkedin.com/in/jordanscott",
    proofs: [
      { type: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", skill: "Laravel" }
    ]
  }
];

