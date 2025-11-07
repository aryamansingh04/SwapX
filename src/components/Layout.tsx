import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, MessageSquare, BarChart3, Upload, User, Menu, X, Users, Video, FileText, Newspaper, Settings, MessageCircle, Bookmark, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
import { useAuthStore } from "@/stores/useAuthStore";

interface LayoutProps {
  children: React.ReactNode;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "connection" | "message" | "meeting" | "like" | "comment";
  isRead: boolean;
  timestamp: Date;
  link?: string;
  userId?: string; // For connection requests
  chatId?: string; // For messages
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage
  useEffect(() => {
    const loadNotifications = () => {
      const saved = localStorage.getItem("notifications");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setNotifications(
            parsed.map((n: any) => ({
              ...n,
              timestamp: new Date(n.timestamp),
            }))
          );
        } catch {
          // Initialize with default notifications if none exist
          const defaultNotifications: Notification[] = [
            {
              id: "1",
              title: "New Connection Request",
              message: "Sarah Johnson wants to connect with you",
              type: "connection",
              isRead: false,
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
              link: "/dashboard",
            },
            {
              id: "2",
              title: "New Message",
              message: "You have a new message from Alex Chen",
              type: "message",
              isRead: false,
              timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
              link: "/chat",
            },
            {
              id: "3",
              title: "Meeting Reminder",
              message: "Your meeting with Morgan Lee starts in 30 minutes",
              type: "meeting",
              isRead: true,
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
              link: "/dashboard",
            },
          ];
          setNotifications(defaultNotifications);
          localStorage.setItem("notifications", JSON.stringify(defaultNotifications));
        }
      } else {
        // Initialize with default notifications
        const defaultNotifications: Notification[] = [
          {
            id: "1",
            title: "New Connection Request",
            message: "Sarah Johnson wants to connect with you",
            type: "connection",
            isRead: false,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            link: "/dashboard",
          },
          {
            id: "2",
            title: "New Message",
            message: "You have a new message from Alex Chen",
            type: "message",
            isRead: false,
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            link: "/chat",
          },
          {
            id: "3",
            title: "Meeting Reminder",
            message: "Your meeting with Morgan Lee starts in 30 minutes",
            type: "meeting",
            isRead: true,
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            link: "/dashboard",
          },
        ];
        setNotifications(defaultNotifications);
        localStorage.setItem("notifications", JSON.stringify(defaultNotifications));
      }
    };

    loadNotifications();

    // Listen for notification updates and connection request updates
    const handleNotificationUpdate = () => {
      loadNotifications();
    };
    const handleConnectionUpdate = () => {
      // When connection requests change, check for new received requests and create notifications
      const connectionRequestsReceived = JSON.parse(
        localStorage.getItem("connectionRequestsReceived") || "[]"
      );
      const savedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
      const existingRequestIds = new Set(
        savedNotifications
          .filter((n: any) => n.type === "connection" && n.userId)
          .map((n: any) => n.userId)
      );

      // Create notifications for new received connection requests
      connectionRequestsReceived.forEach((request: any) => {
        const userId = request.userId || request.id;
        if (!existingRequestIds.has(userId)) {
          const newNotification = {
            id: Date.now().toString() + "-" + userId,
            title: "New Connection Request",
            message: `${request.name || "Someone"} wants to connect with you`,
            type: "connection",
            isRead: false,
            timestamp: new Date().toISOString(),
            link: "/dashboard",
            userId: userId,
          };
          savedNotifications.unshift(newNotification);
          existingRequestIds.add(userId);
        }
      });

      // Keep only last 50 notifications
      const limitedNotifications = savedNotifications.slice(0, 50);
      localStorage.setItem("notifications", JSON.stringify(limitedNotifications));
      loadNotifications();
    };
    const handleChatsUpdate = () => {
      // When chats are updated, check for new messages and create notifications
      const savedChats = JSON.parse(localStorage.getItem("chats") || "[]");
      const savedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
      const currentPath = window.location.pathname;
      const isOnChatPage = currentPath.startsWith("/chat/");
      const currentChatId = isOnChatPage ? currentPath.split("/chat/")[1] : null;

      // Check each chat for new messages
      savedChats.forEach((chat: any) => {
        if (chat.messages && chat.messages.length > 0) {
          const lastMessage = chat.messages[chat.messages.length - 1];
          // Only create notification if:
          // 1. Message is not from current user
          // 2. Chat is not currently open
          // 3. Chat is not muted
          // 4. Chat is not archived
          if (
            !lastMessage.isOwn &&
            chat.id !== currentChatId &&
            !chat.isMuted &&
            !chat.isArchived &&
            chat.connectionStatus === "connected"
          ) {
            // Check if we already have a recent notification for this chat
            const recentNotification = savedNotifications.find(
              (n: any) =>
                n.type === "message" &&
                n.chatId === chat.id &&
                new Date(n.timestamp).getTime() >
                  new Date(lastMessage.timestamp).getTime() - 60000 // Within last minute
            );

            if (!recentNotification) {
              const messageText = typeof lastMessage.text === "string" ? lastMessage.text : "";
              const messagePreview = messageText.length > 50 
                ? messageText.substring(0, 50) + "..." 
                : messageText;
              const newNotification = {
                id: Date.now().toString() + "-msg-" + chat.id + "-" + (lastMessage.id || Date.now()),
                title: "New Message",
                message: `${chat.name}: ${messagePreview}`,
                type: "message",
                isRead: false,
                timestamp: new Date(lastMessage.timestamp).toISOString(),
                link: `/chat/${chat.id}`,
                chatId: chat.id,
              };
              savedNotifications.unshift(newNotification);
            }
          }
        }
      });

      // Keep only last 50 notifications
      const limitedNotifications = savedNotifications.slice(0, 50);
      localStorage.setItem("notifications", JSON.stringify(limitedNotifications));
      loadNotifications();
    };
    window.addEventListener("notificationsUpdated", handleNotificationUpdate);
    window.addEventListener("connectionRequestsUpdated", handleConnectionUpdate);
    window.addEventListener("chatsUpdated", handleChatsUpdate);

    return () => {
      window.removeEventListener("notificationsUpdated", handleNotificationUpdate);
      window.removeEventListener("connectionRequestsUpdated", handleConnectionUpdate);
      window.removeEventListener("chatsUpdated", handleChatsUpdate);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    const updated = notifications.map((n) =>
      n.id === notification.id ? { ...n, isRead: true } : n
    );
    
    // If it's a message notification, mark all message notifications from that chat as read
    if (notification.type === "message" && notification.chatId) {
      const fullyUpdated = updated.map((n) =>
        n.type === "message" && n.chatId === notification.chatId
          ? { ...n, isRead: true }
          : n
      );
      setNotifications(fullyUpdated);
      localStorage.setItem("notifications", JSON.stringify(fullyUpdated));
    } else if (notification.type === "connection" && notification.userId) {
      // If it's a connection request notification, mark all connection notifications for that user as read
      const fullyUpdated = updated.map((n) =>
        n.type === "connection" && n.userId === notification.userId
          ? { ...n, isRead: true }
          : n
      );
      setNotifications(fullyUpdated);
      localStorage.setItem("notifications", JSON.stringify(fullyUpdated));
    } else {
      setNotifications(updated);
      localStorage.setItem("notifications", JSON.stringify(updated));
    }
    
    window.dispatchEvent(new Event("notificationsUpdated"));

    // Navigate if link exists
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
    window.dispatchEvent(new Event("notificationsUpdated"));
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: Users, label: "People", path: "/home" },
    { icon: MessageSquare, label: "Chats", path: "/chat" },
    { icon: Video, label: "Reels", path: "/reels" },
    { icon: FileText, label: "Notes", path: "/notes" },
    { icon: Newspaper, label: "News & Blogs", path: "/news" },
    { icon: MessageCircle, label: "Group Discussion", path: "/groups" },
    { icon: Upload, label: "Upload", path: "/proofs/upload" },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
              aria-label="Go to home"
            >
              <img src="/swapx-logo.svg" alt="SwapX" className="h-8" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleNavigate(item.path)}
                  aria-label={item.label}
                  aria-current={isActive(item.path) ? "page" : undefined}
                >
                  <Icon className="h-4 w-4 mr-2" aria-hidden="true" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Right side: Theme Toggle, Notifications, Profile Menu */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto" role="menu">
                <div className="flex items-center justify-between p-2 border-b">
                  <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </Button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="py-1">
                    {notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={`cursor-pointer ${!notification.isRead ? "bg-muted/50" : ""}`}
                        onClick={() => handleNotificationClick(notification)}
                        role="menuitem"
                      >
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{notification.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Desktop Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                  aria-label="User menu"
                >
                  <Avatar>
                    <AvatarImage
                      src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "User"}`}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" role="menu">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleNavigate(`/profile/${user?.id || "setup"}`)}
                  role="menuitem"
                >
                  <User className="h-4 w-4 mr-2" aria-hidden="true" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/my-notes")} role="menuitem">
                  <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
                  Your Notes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/saved-notes")} role="menuitem">
                  <Bookmark className="h-4 w-4 mr-2" aria-hidden="true" />
                  Saved Notes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavigate("/connection-settings")} role="menuitem">
                  <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
                  Connection Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} role="menuitem">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open mobile menu"
                  aria-expanded={mobileMenuOpen}
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8" role="navigation" aria-label="Mobile navigation">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.path}
                        variant={isActive(item.path) ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleNavigate(item.path)}
                        aria-label={item.label}
                        aria-current={isActive(item.path) ? "page" : undefined}
                      >
                        <Icon className="h-4 w-4 mr-2" aria-hidden="true" />
                        {item.label}
                      </Button>
                    );
                  })}
                  <div className="border-t pt-4 mt-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start relative"
                      onClick={() => {
                        // Toggle notifications dropdown in mobile would require different approach
                        // For now, just navigate to dashboard where notifications can be viewed
                        handleNavigate("/dashboard");
                      }}
                    >
                      <Bell className="h-4 w-4 mr-2" aria-hidden="true" />
                      Notifications
                      {unreadCount > 0 && (
                        <span className="ml-auto h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigate(`/profile/${user?.id || "setup"}`)}
                    >
                      <User className="h-4 w-4 mr-2" aria-hidden="true" />
                      Profile
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigate("/my-notes")}
                    >
                      <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
                      Your Notes
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigate("/saved-notes")}
                    >
                      <Bookmark className="h-4 w-4 mr-2" aria-hidden="true" />
                      Saved Notes
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleNavigate("/connection-settings")}
                    >
                      <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
                      Connection Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive"
                      onClick={handleLogout}
                    >
                      Sign out
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main role="main">{children}</main>
    </div>
  );
};

export default Layout;

