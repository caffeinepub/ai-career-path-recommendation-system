import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Sparkles,
  User,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useLocalAuth } from "../hooks/useLocalAuth";
import { useGetCallerUserProfile } from "../hooks/useQueries";

interface LayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { href: "/career-kickstart", label: "Home", icon: Sparkles },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/job-search", label: "Job Search", icon: Search },
  { href: "/skill-assessment", label: "Assessments", icon: User },
];

export default function Layout({ children }: LayoutProps) {
  const { clear, currentUsername } = useLocalAuth();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPath = window.location.pathname;

  const handleLogout = async () => {
    clear();
    queryClient.clear();
    window.location.href = "/login";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = userProfile?.name || currentUsername || "User";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header
        className="sticky top-0 z-50 backdrop-blur-sm border-b border-border shadow-xs"
        style={{ background: "oklch(99% 0.01 280 / 0.95)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a
              href="/career-kickstart"
              className="flex items-center gap-2.5 group"
              data-ocid="nav.link"
            >
              <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center shadow-purple">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-primary group-hover:text-primary/80 transition-colors">
                Kick-Start Career's
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentPath === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    data-ocid="nav.link"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors"
                    data-ocid="nav.dropdown_menu"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {getInitials(displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-sm font-medium text-foreground max-w-[120px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <a
                      href="/profile"
                      className="flex items-center gap-2 cursor-pointer"
                      data-ocid="nav.link"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                    data-ocid="nav.button"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                type="button"
                className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className="md:hidden border-t border-border px-4 py-3 space-y-1"
            style={{ background: "oklch(99% 0.01 280)" }}
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPath === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  data-ocid="nav.link"
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </a>
              );
            })}
            <div className="pt-2 border-t border-border">
              <button
                type="button"
                onClick={handleLogout}
                data-ocid="nav.button"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 w-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
