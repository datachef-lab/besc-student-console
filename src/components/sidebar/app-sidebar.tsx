"use client";

import * as React from "react";
import {
  BookOpen,
  House,
  IndianRupee,
  Library,
  NotebookPen,
  ScrollText,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  console.log("pathname:", pathname);

  // Define navigation items
  const navMainItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: House,
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
      icon: NotebookPen,
      isActive: pathname === "/dashboard/exams",
    },
    {
      title: "Course Catalogue",
      url: "/dashboard/course-catalogue",
      icon: BookOpen,
      isActive: pathname === "/dashboard/course-catalogue",
    },
    {
      title: "Documents",
      url: "/dashboard/documents",
      icon: ScrollText,
      isActive: pathname === "/dashboard/documents",
    },
    {
      title: "Enrollment & Fees",
      url: "/dashboard/enrollment-fees",
      icon: IndianRupee,
      isActive: pathname === "/dashboard/enrollment-fees",
    },
    {
      title: "Library",
      url: "/dashboard/library",
      icon: Library,
      isActive: pathname === "/dashboard/library",
    },
  ];

  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="xl"
              className="cursor-default hover:bg-transparent"
            >
              <div className="flex aspect-square w-8 h-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Image
                  width={32}
                  height={32}
                  src={"/besc-logo.jpeg"}
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
        <NavMain items={navMainItems} className="p-0" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
