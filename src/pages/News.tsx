import Layout from "@/components/Layout";
import { Newspaper, BookOpen, Plus, Search, Calendar, User, Tag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

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

const News = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"news" | "blogs">("news");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [newBlogTags, setNewBlogTags] = useState("");
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    const savedBlogs = JSON.parse(localStorage.getItem("userBlogs") || "[]");
    const allItems = [...getDefaultNews(), ...savedBlogs.map((blog: any) => ({
      ...blog,
      date: new Date(blog.date),
      type: "blog" as const,
    }))];
    setItems(allItems);
  };

  const getDefaultNews = (): NewsItem[] => {
    const now = new Date();
    return [
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
        date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
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
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
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
        date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
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
        date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
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
        date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
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
        date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        category: "Tools",
        tags: ["Git", "Version Control", "Development", "Best Practices"],
        type: "blog",
      },
    ];
  };

  const handleCreateBlog = () => {
    if (!newBlogTitle.trim()) {
      toast.error("Please enter a blog title");
      return;
    }

    if (!newBlogContent.trim()) {
      toast.error("Please enter blog content");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to create a blog");
      return;
    }

    const tags = newBlogTags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const newBlog: NewsItem = {
      id: `blog-${Date.now()}`,
      title: newBlogTitle.trim(),
      summary: newBlogContent.substring(0, 150) + "...",
      content: newBlogContent.trim(),
      author: user.name || "Anonymous",
      authorAvatar: user.avatar,
      date: new Date(),
      category: "Tech",
      tags: tags.length > 0 ? tags : ["Tech"],
      type: "blog",
    };

    const savedBlogs = JSON.parse(localStorage.getItem("userBlogs") || "[]");
    const updatedBlogs = [...savedBlogs, {
      ...newBlog,
      date: newBlog.date.toISOString(),
    }];
    localStorage.setItem("userBlogs", JSON.stringify(updatedBlogs));

    setItems([...items, newBlog]);
    setNewBlogTitle("");
    setNewBlogContent("");
    setNewBlogTags("");
    setIsCreateDialogOpen(false);

    toast.success("Blog created successfully!");
    setActiveTab("blogs");
  };

  const filteredItems = items.filter((item) => {
    const matchesType = item.type === activeTab;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const sortedItems = filteredItems.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">News & Blogs</h1>
            <p className="text-muted-foreground">Stay updated with the latest tech news and community blogs</p>
          </div>
          {activeTab === "blogs" && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Write Blog
            </Button>
          )}
        </div>

        {}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search news and blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "news" | "blogs")}>
          <TabsList>
            <TabsTrigger value="news">
              <Newspaper className="h-4 w-4 mr-2" />
              News
            </TabsTrigger>
            <TabsTrigger value="blogs">
              <BookOpen className="h-4 w-4 mr-2" />
              Blogs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="mt-6">
            {sortedItems.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Newspaper className="h-5 w-5 text-primary" />
                    No News Found
                  </CardTitle>
                  <CardDescription>
                    No news articles match your search criteria.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedItems.map((item) => (
                  <Card
                    key={item.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
                    onClick={() => navigate(`/news/${item.id}`)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary">{item.category}</Badge>
                        <Badge variant="outline">{item.type === "news" ? "News" : "Blog"}</Badge>
                      </div>
                      <CardTitle className="line-clamp-2 mb-2">{item.title}</CardTitle>
                      <CardDescription className="line-clamp-3">{item.summary}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1.5">
                          {item.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              <Tag className="h-2.5 w-2.5 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-3.5 w-3.5" />
                          <span className="truncate">{item.author}</span>
                          <span>•</span>
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{format(item.date, "MMM d, yyyy")}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="blogs" className="mt-6">
            {sortedItems.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    No Blogs Found
                  </CardTitle>
                  <CardDescription>
                    No blog posts match your search criteria. Be the first to write one!
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedItems.map((item) => (
                  <Card
                    key={item.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
                    onClick={() => navigate(`/news/${item.id}`)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary">{item.category}</Badge>
                        <Badge variant="outline">Blog</Badge>
                      </div>
                      <CardTitle className="line-clamp-2 mb-2">{item.title}</CardTitle>
                      <CardDescription className="line-clamp-3">{item.summary}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1.5">
                          {item.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              <Tag className="h-2.5 w-2.5 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-3.5 w-3.5" />
                          <span className="truncate">{item.author}</span>
                          <span>•</span>
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{format(item.date, "MMM d, yyyy")}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Write a New Blog</DialogTitle>
              <DialogDescription>
                Share your thoughts and insights with the community
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="blog-title">Blog Title *</Label>
                <Input
                  id="blog-title"
                  placeholder="Enter blog title"
                  value={newBlogTitle}
                  onChange={(e) => setNewBlogTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blog-content">Content *</Label>
                <Textarea
                  id="blog-content"
                  placeholder="Write your blog content here... (Supports Markdown)"
                  value={newBlogContent}
                  onChange={(e) => setNewBlogContent(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blog-tags">Tags (comma-separated)</Label>
                <Input
                  id="blog-tags"
                  placeholder="e.g., React, JavaScript, Web Development"
                  value={newBlogTags}
                  onChange={(e) => setNewBlogTags(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBlog}>Publish Blog</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default News;
