import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, MessageSquare, BarChart3, Upload, User, Menu, X, Users, Video, FileText, Newspaper, Settings, MessageCircle } from "lucide-react";
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

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

          {/* Right side: Theme Toggle, Profile Menu */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
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

