"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  GraduationCap,
  User,
  CalendarCheck,
  FileText,
  Clock,
  Award,
  Bell,
  ExternalLink,
  BookMarked,
  BarChart,
  MapPin,
  Zap,
  X,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useStudent } from "@/context/StudentContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
}

// Example notification data
const allNotifications: Notification[] = [
  {
    id: 1,
    title: "Assignment Submitted",
    course: "Data Structures",
    time: "2 hours ago",
    type: "assignment",
    color: "blue",
  },
  {
    id: 2,
    title: "Quiz Completed",
    course: "Database Management",
    time: "Yesterday",
    type: "quiz",
    color: "emerald",
  },
  {
    id: 3,
    title: "Class Attended",
    course: "Software Engineering",
    time: "Yesterday",
    type: "class",
    color: "amber",
  },
  {
    id: 4,
    title: "Assignment Due",
    course: "Web Development",
    time: "Tomorrow",
    type: "assignment",
    color: "rose",
  },
  {
    id: 5,
    title: "Exam Scheduled",
    course: "Computer Networks",
    time: "Next Week",
    type: "exam",
    color: "indigo",
  },
  {
    id: 6,
    title: "Project Feedback",
    course: "Software Engineering",
    time: "3 days ago",
    type: "feedback",
    color: "violet",
  },
  {
    id: 7,
    title: "Class Canceled",
    course: "Operating Systems",
    time: "Today",
    type: "class",
    color: "red",
  },
];

export default function HomeContent() {
  const { student, batches, loading } = useStudent();
  const [notificationSheetOpen, setNotificationSheetOpen] = useState(false);
  const [notifications, setNotifications] = useState(allNotifications);

  const dismissNotification = (id: number) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-300 border-t-indigo-600"></div>
      </div>
    );

  if (!student) return null;

  // Function to get CSS classes for notification backgrounds
  const getBgGradientClass = (color: NotificationColor): string => {
    const colorMap: Record<NotificationColor, string> = {
      blue: "from-blue-50 to-white",
      emerald: "from-emerald-50 to-white",
      amber: "from-amber-50 to-white",
      rose: "from-rose-50 to-white",
      indigo: "from-indigo-50 to-white",
      violet: "from-violet-50 to-white",
      red: "from-red-50 to-white",
    };
    return colorMap[color];
  };

  // Function to get CSS classes for notification borders
  const getBorderGradientClass = (color: NotificationColor): string => {
    const colorMap: Record<NotificationColor, string> = {
      blue: "from-blue-500 to-blue-600",
      emerald: "from-emerald-500 to-emerald-600",
      amber: "from-amber-500 to-amber-600",
      rose: "from-rose-500 to-rose-600",
      indigo: "from-indigo-500 to-indigo-600",
      violet: "from-violet-500 to-violet-600",
      red: "from-red-500 to-red-600",
    };
    return colorMap[color];
  };

  const getTextColorClass = (color: NotificationColor): string => {
    const colorMap: Record<NotificationColor, string> = {
      blue: "text-blue-800",
      emerald: "text-emerald-800",
      amber: "text-amber-800",
      rose: "text-rose-800",
      indigo: "text-indigo-800",
      violet: "text-violet-800",
      red: "text-red-800",
    };

    return colorMap[color];
  };

  const getTimeColorClass = (color: NotificationColor): string => {
    const colorMap: Record<NotificationColor, string> = {
      blue: "bg-blue-100 text-blue-700",
      emerald: "bg-emerald-100 text-emerald-700",
      amber: "bg-amber-100 text-amber-700",
      rose: "bg-rose-100 text-rose-700",
      indigo: "bg-indigo-100 text-indigo-700",
      violet: "bg-violet-100 text-violet-700",
      red: "bg-red-100 text-red-700",
    };

    return colorMap[color];
  };

  const getDescColorClass = (color: NotificationColor): string => {
    const colorMap: Record<NotificationColor, string> = {
      blue: "text-blue-600",
      emerald: "text-emerald-600",
      amber: "text-amber-600",
      rose: "text-rose-600",
      indigo: "text-indigo-600",
      violet: "text-violet-600",
      red: "text-red-600",
    };

    return colorMap[color];
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50/10 to-indigo-50/10">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md rounded-lg overflow-hidden border border-blue-500/20">
        <div className="flex flex-col md:flex-row p-5 items-center md:items-start gap-5 relative">
          {/* Decorative elements - more subtle */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/10 rounded-full blur-xl"></div>

          <div className="flex-shrink-0 relative z-10">
            <div className="h-28 w-28 rounded-md overflow-hidden border-2 border-blue-300 bg-blue-100/30 flex items-center justify-center backdrop-blur-sm shadow-md">
              {student?.imgFile ? (
                <Image
                  src={`https://74.207.233.48:8443/hrclIRP/studentimages/${student?.imgFile}`}
                  alt={student?.name || "student-profile-image"}
                  className="h-full w-full object-cover"
                  width={112}
                  height={112}
                />
              ) : (
                <User className="h-14 w-14 text-white" />
              )}
            </div>
          </div>

          <div className="flex-grow text-center md:text-left relative z-10">
            <h1 className="text-2xl font-bold text-white">
              Welcome, {student?.name}
              </h1>
            <p className="text-blue-100 mt-1">BESC | Student Portal</p>

            <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
              <Badge className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30">
                {!student?.alumni ? "Current Student" : "Alumni"}
              </Badge>

              {!student?.alumni && (
                <Badge className="bg-blue-500 text-white hover:bg-blue-600 border border-blue-400">
                  Semester 4
                </Badge>
              )}

              {/* <Badge className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30">
                Computer Science
              </Badge> */}
            </div>
          </div>
        </div>
      </div>

      {/* Student Information */}
      <Card className="border border-blue-200 shadow-md bg-white overflow-hidden relative rounded-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 pb-3">
          <CardTitle className="text-base text-blue-800 flex items-center">
            <User className="h-4 w-4 mr-2 text-blue-600" />
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-blue-700 mb-3 flex items-center">
                <BookMarked className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                Registration Details
              </h3>
                  <div className="space-y-2">
                <div className="flex justify-between border-b border-blue-50 pb-1">
                  <span className="text-gray-600">Roll No:</span>
                  <span className="text-blue-900 font-medium">
                    {student?.univlstexmrollno || "-"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-blue-50 pb-1">
                  <span className="text-gray-600">Registration No:</span>
                  <span className="text-blue-900 font-medium">
                    {student?.univregno || "-"}
                  </span>
                    </div>
                <div className="flex justify-between border-b border-blue-50 pb-1">
                  <span className="text-gray-600">Class Roll No:</span>
                  <span className="text-blue-900 font-medium">
                    {student?.rollNumber || "-"}
                  </span>
                    </div>
                    </div>
                  </div>

            <div>
              <h3 className="text-sm font-medium text-blue-700 mb-3 flex items-center">
                <BookOpen className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                Course Information
              </h3>
                  <div className="space-y-2">
                <div className="flex justify-between border-b border-blue-50 pb-1">
                  <span className="text-gray-600">Framework:</span>
                  <span className="text-blue-900 font-medium">
                        {!student?.coursetype || student?.coursetype === "NA"
                          ? "-"
                          : student?.coursetype}
                  </span>
                    </div>
                <div className="flex justify-between border-b border-blue-50 pb-1">
                  <span className="text-gray-600">Course:</span>
                  <span className="text-blue-900 font-medium">
                    {batches ? batches[batches.length - 1]?.coursename : "-"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-blue-50 pb-1">
                  <span className="text-gray-600">Section:</span>
                  <span className="text-blue-900 font-medium">
                    {(batches && batches[batches.length - 1]?.sectionName) ||
                      "-"}
                  </span>
                  </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Performance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-sky-300 shadow-sm bg-sky-100 hover:shadow transition-all rounded-lg overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-sm font-medium text-sky-800">Attendance</h3>
              <div className="w-8 h-8 rounded-full bg-sky-200 flex items-center justify-center">
                <Clock className="h-4 w-4 text-sky-700" />
              </div>
            </div>
            <div className="flex items-end">
              <span className="text-2xl font-bold text-sky-800">85%</span>
              <span className="text-xs text-sky-600 ml-2 mb-1">
                Current Semester
              </span>
            </div>
            <div className="mt-3 w-full bg-white h-2 rounded-full border border-sky-200">
              <div
                className="bg-sky-600 h-full rounded-full shadow-inner"
                style={{ width: "85%" }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-teal-300 shadow-sm bg-teal-100 hover:shadow transition-all rounded-lg overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-sm font-medium text-teal-800">
                Current SGPA
              </h3>
              <div className="w-8 h-8 rounded-full bg-teal-200 flex items-center justify-center">
                <BarChart className="h-4 w-4 text-teal-700" />
              </div>
            </div>
            <div className="flex items-end">
              <span className="text-2xl font-bold text-teal-800">8.2</span>
              <span className="text-xs text-teal-600 ml-2 mb-1">Out of 10</span>
            </div>
            <div className="mt-3 w-full bg-white h-2 rounded-full border border-teal-200">
              <div
                className="bg-teal-600 h-full rounded-full shadow-inner"
                style={{ width: "82%" }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-rose-300 shadow-sm bg-rose-100 hover:shadow transition-all rounded-lg overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-sm font-medium text-rose-800">Assignments</h3>
              <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center">
                <FileText className="h-4 w-4 text-rose-700" />
              </div>
            </div>
            <div className="flex items-end">
              <span className="text-2xl font-bold text-rose-800">4</span>
              <span className="text-xs text-rose-600 ml-2 mb-1">Pending</span>
            </div>
            <div className="mt-3 w-full bg-white h-2 rounded-full border border-rose-200">
              <div
                className="bg-rose-600 h-full rounded-full shadow-inner"
                style={{ width: "40%" }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-violet-300 shadow-sm bg-violet-100 hover:shadow transition-all rounded-lg overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-sm font-medium text-violet-800">Credits</h3>
              <div className="w-8 h-8 rounded-full bg-violet-200 flex items-center justify-center">
                <Award className="h-4 w-4 text-violet-700" />
              </div>
            </div>
            <div className="flex items-end">
              <span className="text-2xl font-bold text-violet-800">76</span>
              <span className="text-xs text-violet-600 ml-2 mb-1">
                Out of 120
              </span>
            </div>
            <div className="mt-3 w-full bg-white h-2 rounded-full border border-violet-200">
              <div
                className="bg-violet-600 h-full rounded-full shadow-inner"
                style={{ width: "63%" }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Access */}
        <Card className="border border-blue-200 shadow-md bg-white lg:col-span-2 overflow-hidden relative rounded-lg">
          <div className="absolute right-0 bottom-0 w-40 h-40 opacity-10">
            <Image
              src="/illustrations/quick-links.svg"
              alt="Quick Access"
              width={160}
              height={160}
            />
          </div>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 pb-3">
            <CardTitle className="text-base text-blue-800 flex items-center">
              <Zap className="h-4 w-4 mr-2 text-blue-600" />
              Quick Access
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <a
                href="/dashboard/academics"
                className="flex flex-col p-4 border border-blue-200 bg-gradient-to-br from-white to-blue-50 rounded-lg hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                  <ExternalLink className="h-3 w-3 text-blue-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="text-sm font-medium text-blue-900">
                  Course Material
                </h3>
                <p className="text-xs text-blue-600 mt-1">
                  Access course notes and resources
                </p>
              </a>

              <a
                href="/dashboard/exams"
                className="flex flex-col p-4 border border-emerald-200 bg-gradient-to-br from-white to-emerald-50 rounded-lg hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-emerald-600" />
                  </div>
                  <ExternalLink className="h-3 w-3 text-emerald-400 group-hover:text-emerald-600 transition-colors" />
                </div>
                <h3 className="text-sm font-medium text-emerald-900">
                  Exam Results
                </h3>
                <p className="text-xs text-emerald-600 mt-1">
                  View your examination scores
                </p>
              </a>

              <a
                href="/academics"
                className="flex flex-col p-4 border border-indigo-200 bg-gradient-to-br from-white to-indigo-50 rounded-lg hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                    <CalendarCheck className="h-4 w-4 text-indigo-600" />
                  </div>
                  <ExternalLink className="h-3 w-3 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <h3 className="text-sm font-medium text-indigo-900">
                  Class Schedule
                </h3>
                <p className="text-xs text-indigo-600 mt-1">
                  Check your weekly classes
                </p>
              </a>

              <a
                href="/academics"
                className="flex flex-col p-4 border border-amber-200 bg-gradient-to-br from-white to-amber-50 rounded-lg hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-amber-600" />
                  </div>
                  <ExternalLink className="h-3 w-3 text-amber-400 group-hover:text-amber-600 transition-colors" />
                </div>
                <h3 className="text-sm font-medium text-amber-900">
                  Assignments
                </h3>
                <p className="text-xs text-amber-600 mt-1">
                  Track your coursework
                </p>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="border border-purple-200 shadow-md bg-white overflow-hidden relative rounded-lg">
          <div className="absolute right-0 top-0 w-36 h-36 opacity-10">
            <Image
              src="/illustrations/notifications-bell.svg"
              alt="Notifications"
              width={144}
              height={144}
            />
          </div>
          <CardHeader className="bg-gradient-to-r from-purple-50 to-fuchsia-50 border-b border-purple-200 pb-3">
            <CardTitle className="text-base text-purple-800 flex items-center">
              <Bell className="h-4 w-4 mr-2 text-purple-600" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 relative z-10">
            <div className="space-y-3">
              <div
                className={`p-3 border rounded-lg shadow-sm bg-gradient-to-br from-blue-50 to-white relative group overflow-hidden hover:shadow transition-all cursor-pointer`}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-600"></div>
                <div className="ml-2.5 relative">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-2 bg-white shadow-sm border border-blue-100 notification-blue">
                        <Image
                          src="/illustrations/notifications/assignment.svg"
                          alt="assignment"
                          width={18}
                          height={18}
                        />
                      </div>
                      <p className="text-sm font-medium text-blue-800">
                        Assignment Submitted
                      </p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                      2 hours ago
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1 ml-10">
                    Data Structures
                  </p>
                </div>
              </div>

              <div
                className={`p-3 border rounded-lg shadow-sm bg-gradient-to-br from-emerald-50 to-white relative group overflow-hidden hover:shadow transition-all cursor-pointer`}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-emerald-600"></div>
                <div className="ml-2.5 relative">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-2 bg-white shadow-sm border border-emerald-100 notification-emerald">
                        <Image
                          src="/illustrations/notifications/quiz.svg"
                          alt="quiz"
                          width={18}
                          height={18}
                        />
                      </div>
                      <p className="text-sm font-medium text-emerald-800">
                        Quiz Completed
                      </p>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                      Yesterday
                    </span>
                  </div>
                  <p className="text-xs text-emerald-600 mt-1 ml-10">
                    Database Management
                  </p>
                </div>
              </div>

              <div
                className={`p-3 border rounded-lg shadow-sm bg-gradient-to-br from-amber-50 to-white relative group overflow-hidden hover:shadow transition-all cursor-pointer`}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-amber-600"></div>
                <div className="ml-2.5 relative">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-2 bg-white shadow-sm border border-amber-100 notification-amber">
                        <Image
                          src="/illustrations/notifications/class.svg"
                          alt="class"
                          width={18}
                          height={18}
                        />
                      </div>
                      <p className="text-sm font-medium text-amber-800">
                        Class Attended
                      </p>
                    </div>
                    <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                      Yesterday
                    </span>
                  </div>
                  <p className="text-xs text-amber-600 mt-1 ml-10">
                    Software Engineering
                  </p>
                </div>
              </div>

                <button
                onClick={() => setNotificationSheetOpen(true)}
                className="block w-full text-center text-sm text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 mt-2 p-2 rounded-md shadow-sm hover:shadow transition-all"
                >
                View all notifications
                </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card className="border border-teal-200 shadow-md bg-white overflow-hidden relative rounded-lg">
        <div className="absolute right-0 bottom-0 w-36 h-36 opacity-10">
          <Image
            src="/illustrations/calendar-events.svg"
            alt="Events Calendar"
            width={144}
            height={144}
          />
        </div>
        <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-200 pb-3">
          <CardTitle className="text-base text-teal-800 flex items-center">
            <CalendarCheck className="h-4 w-4 mr-2 text-teal-600" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-blue-200 bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center">
                  <CalendarCheck className="h-3 w-3 mr-1.5" />
                  May 15, 2024
                </span>
              </div>
              <h3 className="text-sm font-medium text-blue-900 mb-1">
                Mid-semester Examination
              </h3>
              <p className="text-xs text-blue-600 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                Computer Science Department
              </p>
            </div>

            <div className="p-4 border border-emerald-200 bg-gradient-to-br from-white to-emerald-50 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full flex items-center">
                  <CalendarCheck className="h-3 w-3 mr-1.5" />
                  May 20, 2024
                </span>
              </div>
              <h3 className="text-sm font-medium text-emerald-900 mb-1">
                Guest Lecture Series
              </h3>
              <p className="text-xs text-emerald-600 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                Main Auditorium, 10:00 AM
              </p>
            </div>

            <div className="p-4 border border-amber-200 bg-gradient-to-br from-white to-amber-50 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-1 rounded-full flex items-center">
                  <CalendarCheck className="h-3 w-3 mr-1.5" />
                  June 5, 2024
                </span>
              </div>
              <h3 className="text-sm font-medium text-amber-900 mb-1">
                Project Submission Deadline
              </h3>
              <p className="text-xs text-amber-600 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                All departments
              </p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <a
              href="#"
              className="inline-block text-sm text-teal-600 hover:text-teal-800 bg-gradient-to-r from-teal-50 to-white p-2 px-4 rounded-md border border-teal-200 hover:shadow-md transition-all"
            >
              View full calendar
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Sheet */}
      <Sheet
        open={notificationSheetOpen}
        onOpenChange={setNotificationSheetOpen}
      >
        <SheetContent className="sm:max-w-md overflow-y-auto [--blue-100:theme(colors.blue.100)] [--blue-500:theme(colors.blue.500)] [--blue-600:theme(colors.blue.600)] [--emerald-100:theme(colors.emerald.100)] [--emerald-500:theme(colors.emerald.500)] [--emerald-600:theme(colors.emerald.600)] [--amber-100:theme(colors.amber.100)] [--amber-500:theme(colors.amber.500)] [--amber-600:theme(colors.amber.600)] [--rose-100:theme(colors.rose.100)] [--rose-500:theme(colors.rose.500)] [--rose-600:theme(colors.rose.600)] [--indigo-100:theme(colors.indigo.100)] [--indigo-500:theme(colors.indigo.500)] [--indigo-600:theme(colors.indigo.600)] [--violet-100:theme(colors.violet.100)] [--violet-500:theme(colors.violet.500)] [--violet-600:theme(colors.violet.600)] [--red-100:theme(colors.red.100)] [--red-500:theme(colors.red.500)] [--red-600:theme(colors.red.600)]">
          <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "url(/illustrations/notifications/pattern.svg)",
                backgroundSize: "80px 80px",
                backgroundRepeat: "repeat",
              }}
            ></div>
          </div>
          <div className="absolute right-0 top-0 w-40 h-40 opacity-5 pointer-events-none">
            <Image
              src="/illustrations/notifications/decoration.svg"
              alt="Decoration"
              width={160}
              height={160}
            />
          </div>
          <div className="absolute bottom-0 left-0 w-40 h-40 opacity-5 pointer-events-none">
            <Image
              src="/illustrations/notifications/wave.svg"
              alt="Wave"
              width={160}
              height={160}
            />
          </div>
          <div className="absolute top-4 right-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {/* <SheetClose
                    className="rounded-full w-9 h-9 flex items-center justify-center bg-white shadow-md text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-200"
                    aria-label="Close notifications panel"
                  >
                    <X className="h-5 w-5" />
                  </SheetClose> */}
                </TooltipTrigger>
                <TooltipContent>
                  {/* <p>Close</p> */}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <SheetHeader className="pb-4 border-b relative z-10">
            <div className="flex justify-between items-center">
              <SheetTitle className="flex items-center text-xl">
                <Bell className="h-5 w-5 mr-2 text-purple-600" />
                All Notifications
              </SheetTitle>
            </div>
            <SheetDescription>
              View all your activity and notifications
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-5 pr-2 relative z-10">
            {notifications.map((notification) => {
              const getNotificationIconSrc = (type: NotificationType) => {
                switch (type) {
                  case "assignment":
                    return "/illustrations/notifications/assignment.svg";
                  case "quiz":
                    return "/illustrations/notifications/quiz.svg";
                  case "class":
                    return "/illustrations/notifications/class.svg";
                  case "exam":
                    return "/illustrations/notifications/exam.svg";
                  case "feedback":
                    return "/illustrations/notifications/feedback.svg";
                  default:
                    return "/illustrations/notifications/assignment.svg";
                }
              };

              return (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all duration-200 relative group overflow-hidden bg-gradient-to-br ${getBgGradientClass(
                    notification.color
                  )} cursor-pointer`}
                >
                  <div
                    className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${getBorderGradientClass(
                      notification.color
                    )}`}
                  ></div>
                  <div className="ml-3 relative">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 bg-white shadow-sm border border-${notification.color}-100 notification-${notification.color}`}
                        >
                          <Image
                            src={getNotificationIconSrc(notification.type)}
                            alt={notification.type}
                            width={24}
                            height={24}
                          />
                        </div>
                        <div>
                          <p
                            className={`text-base font-medium ${getTextColorClass(
                              notification.color
                            )}`}
                          >
                            {notification.title}
                          </p>
                          <p
                            className={`text-sm mt-0.5 ${getDescColorClass(
                              notification.color
                            )}`}
                          >
                            {notification.course}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span
                          className={`ml-2 text-xs font-medium ${getTimeColorClass(
                            notification.color
                          )} px-2 py-1 rounded-full whitespace-nowrap`}
                        >
                          {notification.time}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissNotification(notification.id);
                      }}
                      className="absolute top-9 border -right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm"
                      aria-label="Dismiss notification"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              );
            })}
            {notifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100 shadow-sm">
                <div className="w-24 h-24 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 notification-empty">
                  <Image
                    src="/illustrations/notifications/empty.svg"
                    alt="No notifications"
                    width={40}
                    height={40}
                  />
                </div>
                <p className="text-gray-700 font-medium text-xl mb-2">
                  All caught up!
                </p>
                <p className="text-gray-500 text-sm max-w-xs px-4">
                  You don&apos;t have any notifications at the moment.
                  We&apos;ll notify you when something new arrives.
                </p>
                <button
                  onClick={() => setNotifications(allNotifications)}
                  className="mt-6 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-lg shadow-sm hover:shadow transition-all"
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
