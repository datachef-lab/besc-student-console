"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  GraduationCap,
  FileText,
  Bell,
  X,
  Calendar,
  Star,
  Users,
  ClipboardList,
  Code,
  Database,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useStudent } from "@/context/StudentContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

type NotificationType = "assignment" | "quiz" | "class" | "exam" | "feedback";
type NotificationColor =
  | "blue"
  | "emerald"
  | "amber"
  | "rose"
  | "indigo"
  | "violet"
  | "red";

interface Notification {
  id: number;
  title: string;
  course: string;
  time: string;
  type: NotificationType;
  color: NotificationColor;
  isRead?: boolean;
  isImportant?: boolean;
}

// Notification data with read/important status
const allNotifications: Notification[] = [
  {
    id: 1,
    title: "Assignment Submitted",
    course: "Data Structures",
    time: "2 hours ago",
    type: "assignment",
    color: "blue",
    isRead: false,
    isImportant: true,
  },
  {
    id: 2,
    title: "Quiz Completed",
    course: "Database Management",
    time: "Yesterday",
    type: "quiz",
    color: "emerald",
    isRead: true,
    isImportant: false,
  },
  {
    id: 3,
    title: "Class Attended",
    course: "Software Engineering",
    time: "Yesterday",
    type: "class",
    color: "amber",
    isRead: true,
    isImportant: false,
  },
  {
    id: 4,
    title: "Assignment Due",
    course: "Web Development",
    time: "Tomorrow",
    type: "assignment",
    color: "rose",
    isRead: false,
    isImportant: true,
  },
  {
    id: 5,
    title: "Exam Scheduled",
    course: "Computer Networks",
    time: "Next Week",
    type: "exam",
    color: "indigo",
    isRead: false,
    isImportant: true,
  },
  {
    id: 6,
    title: "Project Feedback",
    course: "Software Engineering",
    time: "3 days ago",
    type: "feedback",
    color: "violet",
    isRead: true,
    isImportant: false,
  },
  {
    id: 7,
    title: "Class Canceled",
    course: "Operating Systems",
    time: "Today",
    type: "class",
    color: "red",
    isRead: false,
    isImportant: true,
  },
];

// Map Tailwind color classes for notifications
const colorMap = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-700",
  },
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
  },
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-700",
  },
  rose: {
    bg: "bg-rose-100",
    text: "text-rose-700",
  },
  indigo: {
    bg: "bg-indigo-100",
    text: "text-indigo-700",
  },
  violet: {
    bg: "bg-violet-100",
    text: "text-violet-700",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-700",
  },
};

type NotificationFilter = "all" | "unread" | "important";

export default function HomeContent() {
  const { student, loading, batches, error, refetch } = useStudent();
  const [notificationSheetOpen, setNotificationSheetOpen] = useState(false);
  const [notifications, setNotifications] = useState(allNotifications);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");
  const [isContentReady, setIsContentReady] = useState(false);

  // Stream determination logic
//   let stream;
//   if (batches && batches.length > 0) {
//     switch (batches[0].coursename.trim().toUpperCase()) {
//       case "BBA":
//         stream = "BBA";
//         break;
//       case "B.COM":
//         stream = "BCOM";
//         break;
//       case "B.A.":
//         stream = "BA";
//         break;
//       case "B.SC":
//         stream = "BSC";
//         break;
//       case "B.SC.":
//         stream = "BSC";
//         break;
//       case "B.ED":
//         stream = "BED";
//         break;
//       case "M.COM":
//         stream = "MCOM";
//         break;
//       case "M.A.":
//         stream = "MA";
//         break;
//       default:
//         stream = "BCOM";
//         break;
//     }
//   }

  // Prevent flickering by holding the loading state until content is ready
  useEffect(() => {
    if (!loading && student && batches && batches.length > 0) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsContentReady(true);
      }, 300);
      return () => clearTimeout(timer);
    } else if (loading) {
      setIsContentReady(false);
    }
  }, [loading, student, batches]);

  const dismissNotification = (id: number) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  // Mark a notification as read
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // Toggle important status of a notification
  const toggleImportant = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isImportant: !notification.isImportant }
          : notification
      )
    );
  };

  // Filter notifications based on active filter
  const getFilteredNotifications = () => {
    switch (activeFilter) {
      case "unread":
        return notifications.filter((notification) => !notification.isRead);
      case "important":
        return notifications.filter((notification) => notification.isImportant);
      default:
        return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();

  // Show loading UI until content is fully ready
  if (loading || !isContentReady) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] bg-white/95 rounded-xl p-8 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-pulse w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
          </div>
          <p className="text-purple-800 font-medium animate-pulse">
            Loading your dashboard...
          </p>
          <p className="text-gray-500 text-sm text-center max-w-md">
            Please wait while we retrieve your latest information
          </p>
        </div>
      </div>
    );
  }

  // Various error states (these will only show after loading is complete)

  // Error handling for API errors
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] bg-white rounded-xl p-8 shadow-sm">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <X className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            Something went wrong
          </h3>
          <p className="text-gray-600">{error}</p>
          <Button
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Error handling for missing data
  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] bg-white rounded-xl p-8 shadow-sm">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <X className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            Unable to load student data
          </h3>
          <p className="text-gray-600">
            We couldn&apos;t retrieve your student information. Please try
            refreshing the page or contact support if the problem persists.
          </p>
          <Button
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => refetch()}
          >
            Refresh Data
          </Button>
        </div>
      </div>
    );
  }

  // Error handling for missing batches
  if (!batches || batches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] bg-white rounded-xl p-8 shadow-sm">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
            <Users className="h-10 w-10 text-amber-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            No course enrollment found
          </h3>
          <p className="text-gray-600">
            We couldn&apos;t find any course enrollment information for your
            account. If you believe this is an error, please contact the
            administration.
          </p>
          <Button
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => refetch()}
          >
            Refresh Data
          </Button>
        </div>
      </div>
    );
  }

  const dailyNotices = [
    {
      id: 1,
      title: "Prelim payment due",
      description:
        "Next semester fee payment is due by May 15. Please visit the fees section to complete your payment and avoid late fees.",
      link: "/dashboard/fees",
    },
    {
      id: 2,
      title: "Exam schedule",
      description:
        "Check the exams section for your personal schedule and room assignments.",
      link: "/dashboard/exams",
    },
    {
      id: 3,
      title: "Course Catalogue",
      description:
        "Registration for next semester courses opens on May 20. Review available courses and plan your schedule in advance.",
      link: "/dashboard/course-catalogue",
    },
    {
      id: 4,
      title: "College Website",
      description:
        "The college website has been updated with the latest academic calendar and campus news. Visit for more details.",
      link: "https://www.bhawanipurcollege.edu.in",
      external: true,
    },
  ];

  const enrolledCourses = [
    {
      id: 1,
      title: "Object oriented programming",
      icon: "/placeholders/oop-icon.svg",
    },
    {
      id: 2,
      title: "Fundamentals of database systems",
      icon: "/placeholders/dbms-icon.svg",
    },
    {
      id: 3,
      title: "Computer Networks",
      icon: "/placeholders/network-icon.svg",
    },
    {
      id: 4,
      title: "Web Development",
      icon: "/placeholders/web-icon.svg",
    },
  ];

  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8 min-h-screen">
      {/* Welcome Banner with Notification Button */}
      <div className="relative bg-[#925FE2] text-white rounded-2xl shadow-lg overflow-hidden p-6 md:p-8 flex items-center justify-between min-h-[180px]">
        <div className="z-10 relative">
          <div className="flex items-center gap-2 text-sm font-medium opacity-90 mb-2">
            <Calendar className="w-4 h-4" />
            <span>{dateString}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-1">
            Welcome back, {student?.name?.split(" ")[0] || "Student"}!
          </h1>
          <p className="text-base opacity-90 max-w-md">
            Always stay updated in your student portal
          </p>

          {/* Notification button - Moved to be part of the welcome text section */}
          <button
            onClick={() => setNotificationSheetOpen(true)}
            className="mt-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors inline-flex items-center gap-2"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5 text-white" />
            <span className="text-white text-sm">Notifications</span>
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <span className="bg-red-500 text-white text-xs min-w-5 h-5 rounded-full flex items-center justify-center px-1">
                {notifications.filter((n) => !n.isRead).length}
              </span>
            )}
          </button>
        </div>

        <div className="absolute right-0 bottom-0 top-0 -mr-10 md:mr-0 z-0 hidden sm:flex items-center justify-center">
          <Image
            src="/illustrations/welcome-illustration.png"
            alt="Welcome Illustration"
            width={320}
            height={220}
            className="object-contain h-full w-auto"
            priority
            style={{ filter: "none" }}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.1fr] gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="mb-6">
            <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-white">
              <CardHeader className="pb-3 pt-5 px-6">
                <CardTitle className="text-base font-semibold text-black">
                  Basic Info
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-2 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-base">
                    CU Registration Number
                  </span>
                  <span className="font-semibold text-gray-800 text-xl">
                    {student?.univregno}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-base">
                    CU Roll Number
                  </span>
                  <span className="font-semibold text-gray-800 text-xl">
                    {student?.univlstexmrollno}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-base">Course</span>
                  <span className="font-semibold text-gray-800 text-xl">
                    {batches[0].coursename}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-base">
                    Semester
                    <span className="text-red-500">
                      {student.active ? "*" : ""}
                    </span>
                  </span>
                  <span className="font-semibold text-gray-800 text-xl">
                    {batches[batches.length - 1].classname}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-base">
                    Shift & Session
                  </span>
                  <span className="font-semibold text-gray-800 text-xl">
                    {batches[batches.length - 1].shiftName || "N/A"} |{" "}
                    {batches[batches.length - 1].sessionName || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-base">Section</span>
                  <span className="font-semibold text-gray-800 text-xl">
                    {batches[batches.length - 1].sectionName || "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enrolled Courses */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Enrolled Courses
              </h2>
              <Button
                variant="link"
                size="sm"
                className="text-[#925FE2] hover:text-purple-800 text-sm font-medium"
              >
                See all
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {enrolledCourses.slice(0, 4).map((course) => (
                <Card
                  key={course.id}
                  className="border-0 shadow-md rounded-2xl overflow-hidden bg-white hover:bg-[#F9F7FF] hover:shadow-lg transition-all group p-5"
                >
                  <CardContent className="flex flex-col items-start text-left relative min-h-[160px] p-0">
                    <div className="w-12 h-12 mb-3 rounded-lg flex items-center justify-center bg-[#F3F0FF]">
                      <div className="w-6 h-6 text-[#925FE2]">
                        {course.id % 3 === 0 ? (
                          <BookOpen className="w-6 h-6" />
                        ) : course.id % 3 === 1 ? (
                          <Code className="w-6 h-6" />
                        ) : (
                          <Database className="w-6 h-6" />
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-500 mb-1">
                      Course Code: CS{course.id + 100}
                    </span>
                    <h3 className="text-base font-medium text-gray-800 mb-2 leading-tight">
                      {course.title}
                    </h3>
                    <Button
                      size="sm"
                      className="w-auto mt-auto z-10 bg-[#925FE2] hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-sm"
                    >
                      View
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {enrolledCourses.length === 0 && (
                <p className="text-sm text-gray-500 col-span-full text-center py-6">
                  No courses enrolled.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Daily Notice Card */}
          <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-white">
            <CardHeader className="pt-5 pb-2 px-6 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold text-black">
                Daily Notice
              </CardTitle>
              <Button
                variant="link"
                size="sm"
                className="text-[#925FE2] hover:text-purple-800 h-auto p-0 text-sm font-medium"
              >
                See all
              </Button>
            </CardHeader>
            <CardContent className="px-6 pt-2 pb-5 space-y-4">
              {dailyNotices.slice(0, 4).map((notice) => (
                <div
                  key={notice.id}
                  className="border-b border-gray-100 pb-3 last:border-0 last:pb-0 group hover:bg-gray-50 rounded-lg transition-all cursor-pointer -mx-2 px-2"
                  onClick={() => {
                    if (notice.external) {
                      window.open(notice.link, "_blank", "noopener,noreferrer");
                    } else if (notice.link) {
                      window.location.href = notice.link;
                    }
                  }}
                >
                  <h4 className="font-semibold text-sm text-black mb-1 group-hover:text-purple-700 transition-colors">
                    {notice.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {notice.description}
                  </p>
                  {notice.external && (
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-purple-600">
                      <FileText className="h-3 w-3" />
                      <span>External link</span>
                    </div>
                  )}
                </div>
              ))}
              {dailyNotices.length === 0 && (
                <p className="text-sm text-gray-500">No notices today.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notifications Sheet */}
      <Sheet
        open={notificationSheetOpen}
        onOpenChange={setNotificationSheetOpen}
      >
        <SheetContent className="sm:max-w-md overflow-y-auto bg-white p-0">
          <div className="sticky top-0 bg-white z-10 px-6 py-5 border-b">
            <SheetHeader className="text-left">
              <SheetTitle className="flex items-center text-xl text-gray-900">
                <Bell className="h-5 w-5 mr-2 text-purple-600" />
                All Notifications
              </SheetTitle>
              <SheetDescription className="text-gray-500">
                View all your activity and notifications
              </SheetDescription>
            </SheetHeader>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors flex items-center gap-1.5 ${
                  activeFilter === "all"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
                <span className="bg-gray-200 text-gray-700 text-xs min-w-5 h-5 rounded-full flex items-center justify-center px-1">
                  {notifications.length}
                </span>
              </button>
              <button
                onClick={() => setActiveFilter("unread")}
                className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors flex items-center gap-1.5 ${
                  activeFilter === "unread"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Unread
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <span
                    className={`${
                      activeFilter === "unread"
                        ? "bg-purple-200 text-purple-700"
                        : "bg-gray-200 text-gray-700"
                    } text-xs min-w-5 h-5 rounded-full flex items-center justify-center px-1`}
                  >
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveFilter("important")}
                className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors flex items-center gap-1.5 ${
                  activeFilter === "important"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Important
                {notifications.filter((n) => n.isImportant).length > 0 && (
                  <span
                    className={`${
                      activeFilter === "important"
                        ? "bg-purple-200 text-purple-700"
                        : "bg-gray-200 text-gray-700"
                    } text-xs min-w-5 h-5 rounded-full flex items-center justify-center px-1`}
                  >
                    {notifications.filter((n) => n.isImportant).length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {filteredNotifications.map((notification) => {
              // Get color classes based on notification color
              const colorClasses = colorMap[notification.color] || {
                bg: "bg-gray-100",
                text: "text-gray-700",
              };

              return (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl bg-white border hover:border-purple-200 shadow-sm hover:shadow transition-all duration-200 relative group cursor-pointer ${
                    !notification.isRead ? "border-l-4 border-l-purple-500" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClasses.bg}`}
                    >
                      {notification.type === "assignment" && (
                        <FileText className={`w-5 h-5 ${colorClasses.text}`} />
                      )}
                      {notification.type === "quiz" && (
                        <ClipboardList
                          className={`w-5 h-5 ${colorClasses.text}`}
                        />
                      )}
                      {notification.type === "class" && (
                        <Users className={`w-5 h-5 ${colorClasses.text}`} />
                      )}
                      {notification.type === "exam" && (
                        <GraduationCap
                          className={`w-5 h-5 ${colorClasses.text}`}
                        />
                      )}
                      {notification.type === "feedback" && (
                        <Star className={`w-5 h-5 ${colorClasses.text}`} />
                      )}
                    </div>

                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4
                            className={`text-sm font-medium ${
                              !notification.isRead
                                ? "text-gray-900 font-semibold"
                                : "text-gray-700"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <p
                            className={`text-sm ${
                              !notification.isRead
                                ? "text-gray-600"
                                : "text-gray-500"
                            } mt-1`}
                          >
                            {notification.course}
                          </p>
                        </div>

                        <div className="flex items-start gap-2">
                          <span
                            className={`text-xs whitespace-nowrap ${colorClasses.bg} ${colorClasses.text} px-2 py-0.5 rounded-full`}
                          >
                            {notification.time}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleImportant(notification.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-100"
                              aria-label={
                                notification.isImportant
                                  ? "Remove from important"
                                  : "Mark as important"
                              }
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  notification.isImportant
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-400"
                                }`}
                              />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dismissNotification(notification.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-100"
                              aria-label="Dismiss notification"
                            >
                              <X className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredNotifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-lg">
                <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-800 font-medium text-lg mb-2">
                  All caught up!
                </p>
                <p className="text-gray-500 text-sm max-w-xs px-4">
                  You don&apos;t have any notifications at the moment.
                  We&apos;ll notify you when something new arrives.
                </p>
                <button
                  onClick={() => setNotifications(allNotifications)}
                  className="mt-6 px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  Restore notifications
                </button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
