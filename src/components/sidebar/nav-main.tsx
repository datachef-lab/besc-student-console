"use client";

import { useEffect, useState } from "react";
import { type LucideIcon, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Collapsible } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
  className,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  className?: string;
}) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Initialize expanded items based on active state
  useEffect(() => {
    setExpandedItems(
      items.filter((item) => item.isActive).map((item) => item.title)
    );
  }, [items]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  return (
    <SidebarGroup className={cn("transition-all duration-300", className)}>
      <SidebarMenu className="space-y-1.5">
        {items.map((item) => {
          const isExpanded = expandedItems.includes(item.title);
          const isHovered = hoveredItem === item.title;

          return (
            <Collapsible
              key={item.title}
              open={isExpanded}
              onOpenChange={() => {
                if (!item.items?.length) return;
                toggleExpanded(item.title);
              }}
              className={cn(
                "group/collapsible overflow-hidden rounded-lg transition-all duration-200",
                isHovered && "bg-zinc-100/50 dark:bg-zinc-800/20",
                item.isActive && "bg-zinc-100 dark:bg-zinc-800/30"
              )}
            >
              <SidebarMenuItem>
                <Link href={item.url} passHref>
                  <SidebarMenuButton
                    size="lg"
                    data-active={item.isActive}
                    onMouseEnter={() => setHoveredItem(item.title)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={cn(
                      "relative group flex items-center px-3 py-2.5 rounded-md transition-all duration-200",
                      "hover:text-indigo-600 dark:hover:text-indigo-400",
                      item.isActive &&
                        "bg-gradient-to-r from-indigo-50 to-transparent dark:from-indigo-950/30 dark:to-transparent text-indigo-600 dark:text-indigo-400 font-medium"
                    )}
                  >
                    {item.icon && (
                      <motion.div
                        className={cn(
                          "mr-3 text-zinc-500 dark:text-zinc-400 transition-colors",
                          item.isActive &&
                            "text-indigo-500 dark:text-indigo-400"
                        )}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <item.icon className="h-5 w-5" />
                      </motion.div>
                    )}

                    <span className="flex-1 truncate font-medium">
                      {item.title}
                    </span>

                    {(item.items?.length ?? 0) > 0 && (
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-auto opacity-60"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </motion.div>
                    )}

                    {item.isActive && (
                      <motion.div
                        className="absolute left-0 top-0 w-1 h-full bg-indigo-500 dark:bg-indigo-400 rounded-full"
                        layoutId="activeIndicator"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </SidebarMenuButton>
                </Link>

                <AnimatePresence initial={false}>
                  {(item.items?.length ?? 0) > 0 && isExpanded && (
                    <SidebarMenuSub
                      as={motion.div}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
                      }}
                      className="pl-10 overflow-hidden"
                    >
                      <div className="relative pl-4 border-l border-zinc-200 dark:border-zinc-700 mt-1 mb-1 space-y-1">
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className="relative px-3 py-1.5 text-sm rounded-md transition-all duration-200 hover:text-indigo-600 dark:hover:text-indigo-400 group"
                            >
                              <Link href={subItem.url}>
                                <span className="relative z-10">
                                  {subItem.title}
                                </span>
                                <motion.span
                                  className="absolute inset-0 rounded-md bg-zinc-100 dark:bg-zinc-800/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                  initial={false}
                                  whileHover={{
                                    opacity: 1,
                                    transition: { duration: 0.2 },
                                  }}
                                  whileTap={{ scale: 0.98 }}
                                />
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </div>
                    </SidebarMenuSub>
                  )}
                </AnimatePresence>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
