import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Heart, Zap, Shield, Globe } from "lucide-react";

const AboutUs = () => {
  const features = [
    {
      icon: Users,
      title: "Community-Driven",
      description:
        "SwapX is built by learners, for learners. Our platform thrives on the active participation and collaboration of our community members.",
    },
    {
      icon: Target,
      title: "Skill Verification",
      description:
        "Upload proof of your skills and receive ratings from peers. Build a trusted profile that showcases your expertise and credibility.",
    },
    {
      icon: Heart,
      title: "Peer Learning",
      description:
        "Connect with others who want to teach what they know and learn what they need. Experience authentic, personalized learning through peer connections.",
    },
    {
      icon: Zap,
      title: "Real-Time Collaboration",
      description:
        "Chat, schedule sessions, and collaborate in real-time. Join group discussions, share notes, and learn together with your peers.",
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description:
        "Our trust score system and connection request process ensure a safe, respectful environment for all members of the SwapX community.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Connect with learners from around the world. Share knowledge, learn new skills, and build meaningful relationships across borders.",
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">About SwapX</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transforming how people share, acquire, and validate skills within a connected community
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              SwapX is an innovative peer learning platform designed to transform how people share, acquire, and validate
              skills within a connected community. We believe that learning is most effective when it happens through
              authentic connections, mutual respect, and shared experiences.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Our mission is to create a platform where individuals can teach what they know and learn what they need,
              powered by trust, collaboration, and proof of skill. Whether you're looking to learn a new programming
              language, master a design tool, or explore any other skill, SwapX connects you with the right people at
              the right time.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What We Offer</CardTitle>
            <CardDescription>Key features that make SwapX unique</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Technology</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              SwapX is built with cutting-edge technologies to deliver a smooth, modern learning experience. We use React
              18, TypeScript, Vite, and TailwindCSS to ensure performance, scalability, and aesthetics. Our platform is
              mobile-first, accessible, and designed to work seamlessly across all devices.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We leverage real-time communication, secure authentication, and intelligent matching to connect you with
              the right learning partners. Our WhatsApp-style chat interface, integrated meeting scheduler, and
              comprehensive notification system ensure you never miss an opportunity to learn or teach.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Join Our Community</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              SwapX is more than just a platform — it's a community-driven ecosystem for lifelong learners. We connect
              individuals who want to exchange knowledge, gain new skills, and build authentic relationships based on
              trust and contribution.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Whether you want to learn, teach, collaborate, or share notes, SwapX provides the tools and environment to
              make peer learning meaningful and verifiable. Join us today and become part of a global community of
              learners and teachers.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AboutUs;

