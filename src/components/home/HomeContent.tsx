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
  MapPin,
  X,
  LineChart,
  ArrowRight,
  Calendar,
  PieChart,
  Star,
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

type NotificationFilter = "all" | "unread" | "important";

export default function HomeContent() {
  const { student, batches, loading } = useStudent();
  const [notificationSheetOpen, setNotificationSheetOpen] = useState(false);
  const [notifications, setNotifications] = useState(allNotifications);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");

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

  if (loading)
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-purple-300 border-t-purple-600"></div>
      </div>
    );

  if (!student) return null;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br">
      {/* Welcome Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border shadow-lg overflow-hidden bg-purple-50 text-purple-900 h-full border-purple-200">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="flex flex-col md:flex-row gap-5 items-center md:items-start flex-grow">
                <div className="flex-shrink-0 relative z-10">
                  <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-purple-200 shadow-xl flex items-center justify-center backdrop-blur-sm">
                    {student?.imgFile ? (
                      <Image
                        src={`https://74.207.233.48:8443/hrclIRP/studentimages/${student?.imgFile}`}
                        alt={student?.name || "student-profile-image"}
                        className="h-full w-full object-cover [filter:none]"
                        width={96}
                        height={96}
                      />
                    ) : (
                      <User className="h-12 w-12 text-white" />
                    )}
                  </div>
                </div>

                <div className="flex-grow text-center md:text-left">
                  <div className="space-y-1">
                    <h1 className="text-3xl font-bold">
                      Hello, {student?.name?.split(" ")[0]}
                    </h1>
                    <p className="text-purple-600">
                      Welcome to your student dashboard
                    </p>

                    <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                      <Badge className="bg-purple-200 text-purple-800 hover:bg-purple-300 border border-purple-300 px-3 py-1.5">
                        {!student?.alumni ? "Current Student" : "Alumni"}
                      </Badge>
                      {!student?.alumni && (
                        <Badge className="bg-purple-300 text-purple-800 hover:bg-purple-400 border border-purple-400 px-3 py-1.5">
                          Semester 4
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto pt-6 border-t border-purple-100">
                <div className="text-center">
                  <div className="text-2xl font-bold">85%</div>
                  <div className="text-xs text-purple-600">Attendance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">8.2</div>
                  <div className="text-xs text-purple-600">Current SGPA</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">4</div>
                  <div className="text-xs text-purple-600">Pending Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">76</div>
                  <div className="text-xs text-purple-600">Credits Earned</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Card */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-lg h-full bg-white flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-800">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 flex-grow flex flex-col justify-between">
              <a
                href="/dashboard/course-catalogue"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-purple-50 hover:border-purple-200 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-800">
                    Course Material
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </a>

              <a
                href="/dashboard/exams"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-purple-50 hover:border-purple-200 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-800">
                    Exam Results
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </a>

              <a
                href="/academics"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-purple-50 hover:border-purple-200 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-800">
                    Class Schedule
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </a>

              <a
                href="/academics"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-purple-50 hover:border-purple-200 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-800">Assignments</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Student Information & Academic Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Information */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b pb-3">
            <CardTitle className="text-base text-gray-800 flex items-center">
              <User className="h-4 w-4 mr-2 text-purple-600" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Registration Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Roll No</span>
                  <span className="text-sm font-medium text-gray-900 bg-purple-50 px-3 py-1 rounded-full">
                    {student?.univlstexmrollno || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Registration No</span>
                  <span className="text-sm font-medium text-gray-900 bg-purple-50 px-3 py-1 rounded-full">
                    {student?.univregno || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Class Roll No</span>
                  <span className="text-sm font-medium text-gray-900 bg-purple-50 px-3 py-1 rounded-full">
                    {student?.rollNumber || "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Course Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Framework</span>
                  <span className="text-sm font-medium text-gray-900 bg-purple-50 px-3 py-1 rounded-full">
                    {!student?.coursetype || student?.coursetype === "NA"
                      ? "-"
                      : student?.coursetype}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Course</span>
                  <span className="text-sm font-medium text-gray-900 bg-purple-50 px-3 py-1 rounded-full">
                    {batches ? batches[batches.length - 1]?.coursename : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Section</span>
                  <span className="text-sm font-medium text-gray-900 bg-purple-50 px-3 py-1 rounded-full">
                    {(batches && batches[batches.length - 1]?.sectionName) ||
                      "-"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Performance */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border-0 shadow-lg overflow-hidden bg-white hover:shadow-xl transition-all">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Attendance
                    </h3>
                    <p className="text-sm text-gray-500">Current Semester</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      85%
                    </span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">
                      Good Standing
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Min Required: 75%</span>
                    <span>Your Attendance: 85%</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-3 border-t border-purple-100">
                <a
                  href="#"
                  className="text-sm text-purple-700 font-medium hover:text-purple-900 flex items-center justify-center"
                >
                  View Detailed Attendance{" "}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg overflow-hidden bg-white hover:shadow-xl transition-all">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Current SGPA
                    </h3>
                    <p className="text-sm text-gray-500">
                      Last Semester Results
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <LineChart className="h-5 w-5 text-purple-600" />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      8.2
                    </span>
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-0">
                      First Division
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full"
                      style={{ width: "82%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Class Average: 7.5</span>
                    <span>Your SGPA: 8.2</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-3 border-t border-purple-100">
                <a
                  href="#"
                  className="text-sm text-purple-700 font-medium hover:text-purple-900 flex items-center justify-center"
                >
                  View Academic History <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg overflow-hidden bg-white hover:shadow-xl transition-all">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Assignments
                    </h3>
                    <p className="text-sm text-gray-500">Pending Tasks</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold text-gray-900">4</span>
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0">
                      Due Soon
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Data Structures</span>
                      <span className="text-gray-500">Due in 2 days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Web Development</span>
                      <span className="text-gray-500">Due in 3 days</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-3 border-t border-purple-100">
                <a
                  href="#"
                  className="text-sm text-purple-700 font-medium hover:text-purple-900 flex items-center justify-center"
                >
                  View All Assignments <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg overflow-hidden bg-white hover:shadow-xl transition-all">
            <CardContent className="p-0 flex flex-col h-full">
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Credits
                    </h3>
                    <p className="text-sm text-gray-500">Course Progress</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold text-gray-900">76</span>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0">
                      63% Complete
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full"
                      style={{ width: "63%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Credits Earned: 76</span>
                    <span>Total Required: 120</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-3 border-t border-purple-100">
                <a
                  href="#"
                  className="text-sm text-purple-700 font-medium hover:text-purple-900 flex items-center justify-center"
                >
                  View Credit Details <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Notifications and Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Notifications */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg overflow-hidden h-full">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base text-gray-800 flex items-center">
                  <Bell className="h-4 w-4 mr-2 text-purple-600" />
                  Recent Notifications
                </CardTitle>
                <button
                  onClick={() => setNotificationSheetOpen(true)}
                  className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full hover:bg-purple-200 transition-colors flex items-center gap-1"
                >
                  View all
                  {notifications.filter((n) => !n.isRead).length > 0 && (
                    <span className="bg-purple-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {notifications.filter((n) => !n.isRead).length}
                    </span>
                  )}
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3 flex flex-col h-full">
              <div className="space-y-3 flex-grow">
                {notifications
                  .filter((n) => !n.isRead)
                  .slice(0, 4)
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div
                        className={`w-10 h-10 rounded-full bg-${notification.color}-100 flex items-center justify-center flex-shrink-0`}
                      >
                        {notification.type === "assignment" && (
                          <FileText
                            className={`h-5 w-5 text-${notification.color}-600`}
                          />
                        )}
                        {notification.type === "quiz" && (
                          <BookOpen
                            className={`h-5 w-5 text-${notification.color}-600`}
                          />
                        )}
                        {notification.type === "class" && (
                          <GraduationCap
                            className={`h-5 w-5 text-${notification.color}-600`}
                          />
                        )}
                        {notification.type === "exam" && (
                          <PieChart
                            className={`h-5 w-5 text-${notification.color}-600`}
                          />
                        )}
                        {notification.type === "feedback" && (
                          <Star
                            className={`h-5 w-5 text-${notification.color}-600`}
                          />
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <span
                            className={`text-xs bg-${notification.color}-50 text-${notification.color}-700 px-2 py-0.5 rounded-full`}
                          >
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.course}
                        </p>
                      </div>
                    </div>
                  ))}

                {notifications.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Bell className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-700 font-medium">All caught up!</p>
                    <p className="text-gray-500 text-sm mt-1">
                      You don't have any notifications right now.
                    </p>
                    <button
                      onClick={() => setNotifications(allNotifications)}
                      className="mt-4 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                    >
                      Restore notifications
                    </button>
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="pt-3 mt-2 border-t border-gray-100 text-center">
                  <button
                    onClick={() => setNotificationSheetOpen(true)}
                    className="inline-flex items-center gap-2 text-sm text-purple-700 font-medium hover:text-purple-900 bg-purple-50 px-4 py-2 rounded-lg transition-colors"
                  >
                    View all notifications
                    {notifications.filter((n) => !n.isRead).length > 0 && (
                      <span className="bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {notifications.filter((n) => !n.isRead).length}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-lg overflow-hidden h-full">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b pb-3">
              <CardTitle className="text-base text-gray-800 flex items-center">
                <CalendarCheck className="h-4 w-4 mr-2 text-purple-600" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex flex-col h-full">
              <div className="space-y-3 flex-grow">
                <div className="flex gap-3 items-start">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex flex-col items-center justify-center flex-shrink-0 border border-purple-200">
                    <span className="text-xs font-bold text-purple-700">
                      MAY
                    </span>
                    <span className="text-base font-bold text-purple-700">
                      15
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Mid-semester Examination
                    </h4>
                    <p className="text-xs text-gray-600 flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                      Computer Science Department
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex flex-col items-center justify-center flex-shrink-0 border border-purple-200">
                    <span className="text-xs font-bold text-purple-700">
                      MAY
                    </span>
                    <span className="text-base font-bold text-purple-700">
                      20
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Guest Lecture Series
                    </h4>
                    <p className="text-xs text-gray-600 flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                      Main Auditorium, 10:00 AM
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex flex-col items-center justify-center flex-shrink-0 border border-purple-200">
                    <span className="text-xs font-bold text-purple-700">
                      JUN
                    </span>
                    <span className="text-base font-bold text-purple-700">
                      05
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Project Submission Deadline
                    </h4>
                    <p className="text-xs text-gray-600 flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                      All departments
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-2 border-t border-gray-100 text-center">
                <a
                  href="#"
                  className="inline-block text-sm text-purple-700 font-medium hover:text-purple-900 bg-purple-50 px-4 py-2 rounded-lg transition-colors"
                >
                  View full calendar
                </a>
              </div>
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
                  className={`p-4 rounded-xl bg-white border hover:border-purple-200 shadow-sm hover:shadow transition-all duration-200 relative group cursor-pointer ${
                    !notification.isRead ? "border-l-4 border-l-purple-500" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-${notification.color}-100`}
                    >
                      <Image
                        src={getNotificationIconSrc(notification.type)}
                        alt={notification.type}
                        width={24}
                        height={24}
                      />
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
                            className={`text-xs whitespace-nowrap bg-${notification.color}-50 text-${notification.color}-700 px-2 py-0.5 rounded-full`}
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

            {notifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-lg">
                <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                  <Image
                    src="/illustrations/notifications/empty.svg"
                    alt="No notifications"
                    width={40}
                    height={40}
                  />
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
