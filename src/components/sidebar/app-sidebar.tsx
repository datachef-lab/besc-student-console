"use client";

import * as React from "react";
import {
  BookOpen,
  //   Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "BESC",
      logo: GalleryVerticalEnd,
      plan: "#student-console",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: SquareTerminal, // Or use HomeIcon if available
      isActive: true,
    },
    // {
    //   title: "Attendance",
    //   url: "/dashboard/attendance",
    //   icon: Frame, // Represents a structured view (calendar-style)
    // },
    {
      title: "Exams",
      url: "/dashboard/exams",
      icon: PieChart, // Represents stats or progress
    },
    // {
    //   title: "Assignments",
    //   url: "/dashboard/assignments",
    //   icon: BookOpen, // Represents coursework
    // },
    {
      title: "Documents",
      url: "/dashboard/documents",
      icon: Map, // Represents academic navigation
    },
    {
      title: "Admission & Fees",
      url: "/dashboard/admission-fees",
      icon: GalleryVerticalEnd, // Represents forms or structured data
    },
    {
      title: "Library",
      url: "/dashboard/library",
      icon: BookOpen, // Represents books
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: Settings2, // Represents settings
    },
  ],
  projects: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // Define navigation items
  const navMainItems = [
    {
      title: "Home",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: pathname === "/dashboard",
    },
    // {
    //   title: "Attendance",
    //   url: "/dashboard/attendance",
    //   icon: Frame,
    //   isActive: pathname === "/dashboard/attendance",
    // },
    {
      title: "Exams",
      url: "/dashboard/exams",
      icon: PieChart,
      isActive: pathname === "/dashboard/exams",
    },
    {
      title: "Course Catalogue",
      url: "/dashboard/academics",
      icon: BookOpen,
      isActive: pathname === "/dashboard/academics",
    },
    {
      title: "Documents",
      url: "/dashboard/documents",
      icon: Map,
      isActive: pathname === "/dashboard/documents",
    },
    {
      title: "Admission & Fees",
      url: "/dashboard/admission-fees",
      icon: GalleryVerticalEnd,
      isActive: pathname === "/dashboard/admission-fees",
    },
    {
      title: "Library",
      url: "/dashboard/library",
      icon: BookOpen,
      isActive: pathname === "/dashboard/library",
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: Settings2,
      isActive: pathname === "/dashboard/profile",
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="cursor-default hover:bg-transparent"
            >
              <div className="flex aspect-square w-8 h-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Image
                  width={32}
                  height={32}
                  src={"/logo.png"}
                  alt={"The Bhawanipur Education Society College Logo"}
                  className="w-8 h-8 rounded-lg object-cover"
                />
              </div>
              <div className="grid flex-1 text-left text-sm">
                <span className="truncate font-semibold text-wrap">
                  The Bhawanipur Education Society College
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
        {data.projects.length > 0 && <NavProjects projects={data.projects} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
