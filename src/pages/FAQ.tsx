import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What is SwapX?",
      answer:
        "SwapX is a peer learning platform that connects individuals who want to exchange knowledge, gain new skills, and build authentic relationships based on trust and contribution. Whether you want to learn, teach, collaborate, or share notes, SwapX provides the tools and environment to make peer learning meaningful and verifiable.",
    },
    {
      question: "How do I get started?",
      answer:
        "To get started, simply sign up for an account, complete your profile setup with your skills and occupation, and start exploring. You can browse other users' profiles, send connection requests, and begin your learning journey.",
    },
    {
      question: "How does the trust score work?",
      answer:
        "Your trust score is a dynamic metric that reflects your credibility and reliability within the SwapX community. It's influenced by ratings you receive after learning sessions, your activity on the platform, and interactions with other members. Higher trust scores indicate more reliable and experienced learners.",
    },
    {
      question: "How do connection requests work?",
      answer:
        "Before you can chat with someone, you need to send them a connection request. Once they accept your request, you can start messaging and schedule learning sessions. Connection requests help maintain a respectful and engaged community.",
    },
    {
      question: "Can I upload proof of my skills?",
      answer:
        "Yes! You can upload PDF proofs of your skills to verify your abilities. These proofs are visible to other users when they view your profile, helping build trust and credibility in your expertise.",
    },
    {
      question: "How do learning sessions work?",
      answer:
        "Learning sessions can be scheduled through the meeting scheduler. You can choose to have sessions online or offline. After each session, both participants can rate each other, which helps maintain accountability and encourages quality learning experiences.",
    },
    {
      question: "What are Group Discussions?",
      answer:
        "Group Discussions allow you to join or create topic-based groups where you can participate in group chats with file attachments. It's a great way to collaborate with multiple learners on similar interests or projects.",
    },
    {
      question: "How do Notes work?",
      answer:
        "You can share educational materials through Community Notes, which other users can like and bookmark. You also have Personal Notes to store and organize your own learning resources. Saved Notes lets you access all the notes you've bookmarked from others.",
    },
    {
      question: "Can I write blogs on SwapX?",
      answer:
        "Yes! The News & Blogs section allows you to read tech-related articles and write your own blogs. This is a great way to share knowledge and insights with the SwapX community.",
    },
    {
      question: "How do I manage my privacy settings?",
      answer:
        "You can manage your privacy, notifications, and communication preferences in the Connection Settings page, accessible from your profile menu. Here you can control who can see your profile, send you messages, and more.",
    },
    {
      question: "What if I have a problem or need help?",
      answer:
        "If you encounter any issues or need assistance, you can reach out through the support options available in your profile settings. We're here to help make your learning journey smooth and enjoyable.",
    },
    {
      question: "Is SwapX free to use?",
      answer:
        "SwapX offers a free tier with access to most features. Some advanced features may require a subscription. Check the pricing page or contact support for more information about premium features.",
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">
            Find answers to common questions about SwapX and how to get the most out of the platform.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Common Questions</CardTitle>
            <CardDescription>Everything you need to know about SwapX</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Still have questions? Feel free to reach out to our support team through your profile settings or contact us
            directly. We're here to help!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;

