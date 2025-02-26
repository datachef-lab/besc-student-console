"use client";

import * as React from "react";
import {
  BookOpen,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

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
    {
      title: "Attendance",
      url: "/dashboard/attendance",
      icon: Frame, // Represents a structured view (calendar-style)
    },
    {
      title: "Exams",
      url: "/dashboard/exams",
      icon: PieChart, // Represents stats or progress
    },
    {
      title: "Assignments",
      url: "/dashboard/assignments",
      icon: BookOpen, // Represents coursework
    },
    {
      title: "Academics",
      url: "/dashboard/academics",
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
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2, // Represents settings
    },
  ],
  projects: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {data.projects.length > 0 && <NavProjects projects={data.projects} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
