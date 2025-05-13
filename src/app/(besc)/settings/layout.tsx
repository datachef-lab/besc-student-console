"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Loader2,
  House,
  Settings,
  FileText,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Only keep links to pages that exist
  const settingLinks = [
    { name: "General", href: "/settings", icon: Settings },
    { name: "Materials", href: "/settings/materials", icon: FileText },
    {
      name: "Access Control",
      href: "/settings/access-control",
      icon: ShieldAlert,
    },
  ];

  // Get the current active link
  const currentPage =
    settingLinks.find((link) => pathname === link.href) || settingLinks[0];

  useEffect(() => {
    // Only redirect if auth is finished loading and user is not an admin
    if (!isLoading && user === null) {
      setIsRedirecting(true);
      router.push("/");
    } else if (!isLoading && user !== null && !user.isAdmin) {
      setIsRedirecting(true);
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Show loading state while auth is checking
  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // If user is not admin, dont render children until redirect happens
  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Settings Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r bg-card px-4 py-6">
        <div className="flex items-center gap-2 px-2 mb-8">
          <Settings size={20} className="text-primary" />
          <h2 className="text-xl font-semibold">BESC Student Console</h2>
        </div>

        <nav className="space-y-1 flex-1">
          {settingLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full justify-start gap-2 px-2 py-1.5",
                pathname === link.href && "bg-accent text-accent-foreground"
              )}
            >
              <link.icon size={18} />
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Logout button at the bottom of sidebar */}
        <div className="mt-auto pt-4 border-t">
          <button
            onClick={handleLogout}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full justify-start gap-2 px-2 py-1.5 text-red-500 hover:text-red-600 hover:bg-red-100/20"
            )}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <Link href="/dashboard" className="flex items-center">
                  <House size={16} />
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <Link href="/settings" className="flex items-center">
                  <Settings size={16} />
                  <span className="ml-1">Settings</span>
                </Link>
              </BreadcrumbItem>
              {pathname !== "/settings" && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="flex items-center gap-1">
                      <currentPage.icon size={16} />
                      <span className="ml-1">{currentPage.name}</span>
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>

          {/* Add logout to header for smaller screens */}
          <button
            onClick={handleLogout}
            className="ml-auto flex items-center gap-1 text-red-500 hover:text-red-600"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </header>

        {/* Mobile navigation bar */}
        <div className="lg:hidden flex overflow-x-auto p-2 border-b">
          {settingLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 whitespace-nowrap rounded-md text-sm font-medium",
                pathname === link.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <link.icon size={14} />
              {link.name}
            </Link>
          ))}
        </div>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
