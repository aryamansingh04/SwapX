import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag, Newspaper, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { format } from "date-fns";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  authorAvatar?: string;
  date: Date;
  category: string;
  tags: string[];
  imageUrl?: string;
  type: "news" | "blog";
}

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<NewsItem | null>(null);

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = () => {
    // Load from default news
    const defaultNews: NewsItem[] = [
      {
        id: "news-1",
        title: "React 19 Released with Groundbreaking Features",
        summary: "The latest version of React introduces revolutionary server components and improved performance optimizations.",
        content: `# React 19 Released with Groundbreaking Features

React 19 has finally been released, bringing with it a host of revolutionary features that promise to transform how developers build web applications.

## Server Components

One of the most significant additions is the introduction of Server Components, which allow developers to render components on the server, reducing the amount of JavaScript sent to clients and improving initial load times.

## Performance Improvements

React 19 includes significant performance optimizations, including:
- Automatic batching of state updates
- Improved concurrent rendering
- Better memory management

## Developer Experience

The new version also focuses on improving developer experience with:
- Better TypeScript support
- Enhanced error messages
- Improved debugging tools

These changes represent a major step forward for the React ecosystem and will undoubtedly influence how modern web applications are built.`,
        author: "Tech News Team",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        category: "Frontend",
        tags: ["React", "JavaScript", "Frontend", "Web Development"],
        type: "news",
      },
      {
        id: "news-2",
        title: "AI-Powered Code Generation Tools Revolutionize Development",
        summary: "New AI tools are helping developers write code faster and more efficiently than ever before.",
        content: `# AI-Powered Code Generation Tools Revolutionize Development

The integration of artificial intelligence into software development tools has reached new heights with the release of advanced code generation platforms.

## The Rise of AI Assistants

Tools like GitHub Copilot, ChatGPT, and other AI assistants are transforming how developers approach coding. These tools can:
- Generate boilerplate code instantly
- Suggest optimal solutions to complex problems
- Help with debugging and code review

## Impact on Productivity

Early adopters report significant improvements in:
- Code writing speed (up to 50% faster)
- Reduced time spent on repetitive tasks
- Better code quality through AI suggestions

## The Future of Development

As these tools continue to evolve, they're expected to become even more sophisticated, potentially changing the fundamental nature of software development.`,
        author: "AI Tech Review",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        category: "AI",
        tags: ["AI", "Machine Learning", "Development Tools", "Productivity"],
        type: "news",
      },
      {
        id: "news-3",
        title: "TypeScript 5.5 Introduces Performance Optimizations",
        summary: "The latest TypeScript release focuses on compilation speed and developer experience improvements.",
        content: `# TypeScript 5.5 Introduces Performance Optimizations

TypeScript 5.5 brings significant improvements to compilation speed and developer experience.

## Performance Improvements

- Faster type checking
- Reduced memory usage
- Optimized compilation pipeline

## New Features

- Improved type inference
- Better error messages
- Enhanced IDE support

## Developer Benefits

Developers can expect faster build times and a smoother development experience.`,
        author: "TypeScript Team",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        category: "Languages",
        tags: ["TypeScript", "JavaScript", "Programming", "Tools"],
        type: "news",
      },
      {
        id: "blog-1",
        title: "Building Scalable Web Applications: A Complete Guide",
        summary: "Learn how to architect and build web applications that can handle millions of users.",
        content: `# Building Scalable Web Applications: A Complete Guide

Scalability is one of the most critical aspects of modern web application development. In this comprehensive guide, we'll explore the key principles and practices for building applications that can grow with your user base.

## Architecture Patterns

### Microservices
Microservices architecture allows you to break down your application into smaller, independent services that can be scaled independently.

### Serverless
Serverless architectures eliminate the need to manage servers, allowing you to focus on building features rather than infrastructure.

## Database Strategies

### Horizontal Scaling
Learn how to scale your databases horizontally using techniques like:
- Database sharding
- Read replicas
- Caching strategies

## Performance Optimization

### Caching
Implement effective caching strategies to reduce database load and improve response times.

### CDN Integration
Use Content Delivery Networks to serve static assets closer to your users.

## Conclusion

Building scalable applications requires careful planning and implementation of proven patterns and practices.`,
        author: "Sarah Chen",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        category: "Backend",
        tags: ["Scalability", "Architecture", "Backend", "DevOps"],
        type: "blog",
      },
      {
        id: "blog-2",
        title: "The Future of Web Development: Trends to Watch in 2024",
        summary: "Explore the latest trends and technologies shaping the future of web development.",
        content: `# The Future of Web Development: Trends to Watch in 2024

Web development continues to evolve at a rapid pace. Here are the key trends that will shape the industry in 2024 and beyond.

## Emerging Technologies

### WebAssembly
WebAssembly is enabling high-performance web applications by allowing code written in languages like Rust and C++ to run in browsers.

### Edge Computing
Edge computing brings computation closer to users, reducing latency and improving performance.

## Framework Evolution

### React Server Components
React's server components represent a paradigm shift in how we think about rendering.

### Next.js App Router
The new App Router in Next.js provides better performance and developer experience.

## Developer Tools

### AI-Assisted Development
AI tools are becoming increasingly sophisticated, helping developers write better code faster.

### Improved Debugging
New debugging tools are making it easier to identify and fix issues in production.`,
        author: "Mike Davis",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        category: "Trends",
        tags: ["Web Development", "Trends", "Future", "Technology"],
        type: "blog",
      },
      {
        id: "blog-3",
        title: "Mastering Git: Advanced Techniques for Collaborative Development",
        summary: "Take your Git skills to the next level with these advanced techniques and best practices.",
        content: `# Mastering Git: Advanced Techniques for Collaborative Development

Git is an essential tool for modern software development. This guide covers advanced techniques that will make you a Git power user.

## Advanced Branching Strategies

### Git Flow
Learn how to implement Git Flow for managing feature development, releases, and hotfixes.

### Trunk-Based Development
Explore trunk-based development as an alternative approach to managing code changes.

## Rebasing vs Merging

Understanding when to rebase and when to merge is crucial for maintaining a clean git history.

## Conflict Resolution

Master the art of resolving merge conflicts efficiently and correctly.

## Git Hooks

Use Git hooks to automate tasks and enforce code quality standards.

## Best Practices

- Write meaningful commit messages
- Use feature branches
- Regularly sync with remote
- Review changes before committing`,
        author: "Alex Johnson",
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        category: "Tools",
        tags: ["Git", "Version Control", "Development", "Best Practices"],
        type: "blog",
      },
    ];

    // Load user blogs from localStorage
    const savedBlogs = JSON.parse(localStorage.getItem("userBlogs") || "[]");
    const allItems = [...defaultNews, ...savedBlogs.map((blog: any) => ({
      ...blog,
      date: new Date(blog.date),
    }))];

    const foundItem = allItems.find((item) => item.id === id);

    if (foundItem) {
      setItem(foundItem);
    } else {
      navigate("/news");
    }
  };

  if (!item) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Simple markdown-like formatting
  const formatContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, index) => {
      if (line.startsWith("# ")) {
        return <h1 key={index} className="text-3xl font-bold mt-6 mb-4">{line.slice(2)}</h1>;
      } else if (line.startsWith("## ")) {
        return <h2 key={index} className="text-2xl font-semibold mt-5 mb-3">{line.slice(3)}</h2>;
      } else if (line.startsWith("### ")) {
        return <h3 key={index} className="text-xl font-semibold mt-4 mb-2">{line.slice(4)}</h3>;
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        return <li key={index} className="ml-6 mb-1">{line.slice(2)}</li>;
      } else if (line.trim() === "") {
        return <br key={index} />;
      } else {
        return <p key={index} className="mb-4 leading-7">{line}</p>;
      }
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/news")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {item.type === "news" ? (
                <Newspaper className="h-5 w-5 text-primary" />
              ) : (
                <BookOpen className="h-5 w-5 text-primary" />
              )}
              <Badge variant="secondary">{item.category}</Badge>
              <Badge variant="outline">{item.type === "news" ? "News" : "Blog"}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{item.title}</h1>
          </div>
        </div>

        {/* Meta Information */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{item.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(item.date, "MMMM d, yyyy")}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4" />
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {formatContent(item.content)}
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="mt-6">
          <Button variant="outline" onClick={() => navigate("/news")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News & Blogs
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NewsDetail;

