"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap,
  FileText,
  Bell,
  X,
  Calendar,
  Star,
  Users,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Award,
  AlertCircle,
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
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

// New interface for semester data
interface SemesterSummaryItem {
  id: number;
  semester: number;
  sgpa: number | null;
  year1: number;
  year2: number | null;
  result: string;
  remarks: string;
  failedSubjects: any[];
}

export default function HomeContent() {
  const router = useRouter();
  const { student, loading, batches, error, refetch } = useStudent();
  const [notificationSheetOpen, setNotificationSheetOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");
  const [isContentReady, setIsContentReady] = useState(false);
  const [semesterSummary, setSemesterSummary] = useState<SemesterSummaryItem[]>(
    []
  );
  const [selectedBacklogs, setSelectedBacklogs] = useState<any[] | null>(null);
  const [backlogsDialogOpen, setBacklogsDialogOpen] = useState(false);

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

  // Fetch semester summary data - this is a placeholder, you'll need to implement
  // the actual API call in your StudentContext or a dedicated function
  useEffect(() => {
    // Mock data for demonstration - replace with actual API call
    if (!loading && student) {
      const mockSemesterData = [
        {
          id: 2249,
          cgpa: null,
          classification: null,
          semester: 1,
          sgpa: null,
          remarks: "Semester not cleared.",
          uid: "0102232311",
          year1: 2023,
          year2: null,
          credits: 21,
          totalCredits: 21,
          percentage: 0,
          result: "PASSED",
          failedSubjects: [
            {
              id: 4,
              semester: 1,
              category: null,
              irpName: "MICROECONOMICS",
              name: "MICROECONOMICS",
              irpCode: "MICD",
              marksheetCode: "MICD-IDC/MDC-1",
              isOptional: false,
              credit: 3,
              theoryCredit: 2,
              fullMarksTheory: 50,
              practicalCredit: 1,
              fullMarksPractical: null,
              internalCredit: 0,
              fullMarksInternal: null,
              projectCredit: 0,
              fullMarksProject: null,
              vivalCredit: 0,
              fullMarksViva: null,
              fullMarks: 75,
              createdAt: "2025-05-16T09:00:07.846Z",
              updatedAt: "2025-05-16T09:00:07.846Z",
              specialization: null,
              stream: {
                id: 1,
                framework: "CCF",
                degreeProgramme: "HONOURS",
                duration: null,
                numberOfSemesters: null,
                createdAt: "2025-05-16T08:36:31.744Z",
                updatedAt: "2025-05-16T08:36:31.744Z",
                degree: {
                  id: 1,
                  name: "BCOM",
                  level: "UNDER_GRADUATE",
                  sequence: null,
                  createdAt: "2025-05-16T08:36:31.736Z",
                  updatedAt: "2025-05-16T08:36:31.736Z",
                },
              },
              subjectType: {
                id: 1,
                irpName: "MAJOR",
                irpShortName: null,
                marksheetName: "DISCIPLINE SPECIFIC CORE COURSE",
                marksheetShortName: null,
                createdAt: "2025-05-16T08:36:31.750Z",
                updatedAt: "2025-05-16T08:36:31.750Z",
              },
            },
          ],
        },
        {
          id: 2249,
          cgpa: null,
          classification: null,
          semester: 1,
          sgpa: null,
          remarks: "Semester not cleared.",
          uid: "0102232311",
          year1: 2023,
          year2: null,
          credits: 21,
          totalCredits: 21,
          percentage: 0,
          result: "PASSED",
          failedSubjects: [
            {
              id: 4,
              semester: 1,
              category: null,
              irpName: "MICROECONOMICS",
              name: "MICROECONOMICS",
              irpCode: "MICD",
              marksheetCode: "MICD-IDC/MDC-1",
              isOptional: false,
              credit: 3,
              theoryCredit: 2,
              fullMarksTheory: 50,
              practicalCredit: 1,
              fullMarksPractical: null,
              internalCredit: 0,
              fullMarksInternal: null,
              projectCredit: 0,
              fullMarksProject: null,
              vivalCredit: 0,
              fullMarksViva: null,
              fullMarks: 75,
              createdAt: "2025-05-16T09:00:07.846Z",
              updatedAt: "2025-05-16T09:00:07.846Z",
              specialization: null,
              stream: {
                id: 1,
                framework: "CCF",
                degreeProgramme: "HONOURS",
                duration: null,
                numberOfSemesters: null,
                createdAt: "2025-05-16T08:36:31.744Z",
                updatedAt: "2025-05-16T08:36:31.744Z",
                degree: {
                  id: 1,
                  name: "BCOM",
                  level: "UNDER_GRADUATE",
                  sequence: null,
                  createdAt: "2025-05-16T08:36:31.736Z",
                  updatedAt: "2025-05-16T08:36:31.736Z",
                },
              },
              subjectType: {
                id: 1,
                irpName: "MAJOR",
                irpShortName: null,
                marksheetName: "DISCIPLINE SPECIFIC CORE COURSE",
                marksheetShortName: null,
                createdAt: "2025-05-16T08:36:31.750Z",
                updatedAt: "2025-05-16T08:36:31.750Z",
              },
            },
          ],
        },
      ];

      setSemesterSummary(mockSemesterData);
    }
  }, [loading, student]);

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
      <LoadingIndicator
        message="Loading your dashboard..."
        subMessage="Please wait while we retrieve your latest information"
      />
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
    // {
    //   id: 1,
    //   title: "Prelim payment due",
    //   description:
    //     "Next semester fee payment is due by May 15. Please visit the fees section to complete your payment and avoid late fees.",
    //   link: "/dashboard/enrollment-fees",
    // },
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
      link: "https://www.thebges.edu.in/category/noticeboard/",
      external: true,
    },
  ];

  //   const enrolledCourses = [
  //     {
  //       id: 1,
  //       title: "Object oriented programming",
  //       icon: "/placeholders/oop-icon.svg",
  //     },
  //     {
  //       id: 2,
  //       title: "Fundamentals of database systems",
  //       icon: "/placeholders/dbms-icon.svg",
  //     },
  //     {
  //       id: 3,
  //       title: "Computer Networks",
  //       icon: "/placeholders/network-icon.svg",
  //     },
  //     {
  //       id: 4,
  //       title: "Web Development",
  //       icon: "/placeholders/web-icon.svg",
  //     },
  //   ];

  const enrolledCourses: {
    id: number;
    title: string;
    icon: string;
  }[] = [];

  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // New component for Semester Summary
  const SemesterSummaryTable = ({ data }: { data: SemesterSummaryItem[] }) => {
    const handleBacklogsClick = (failedSubjects: any[]) => {
      if (failedSubjects && failedSubjects.length > 0) {
        setSelectedBacklogs(failedSubjects);
        setBacklogsDialogOpen(true);
      }
    };

    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-3 py-2 text-sm font-medium text-gray-600">
                Semester
              </th>
              <th className="px-3 py-2 text-sm font-medium text-gray-600">
                Year
              </th>
              <th className="px-3 py-2 text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="px-3 py-2 text-sm font-medium text-gray-600">
                Backlogs
              </th>
              <th className="px-3 py-2 text-sm font-medium text-gray-600">
                SGPA
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((semester) => (
              <tr
                key={semester.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-3 py-3 text-sm font-medium">
                  {semester.semester}
                </td>
                <td className="px-3 py-3 text-sm text-gray-600">
                  {semester.year1}
                </td>
                <td className="px-3 py-3 text-sm">
                  <div className="flex items-center gap-1.5">
                    {semester.result === "PASSED" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="text-emerald-600 font-medium">
                          PASSED
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-600 font-medium">FAILED</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 text-sm">
                  {semester.failedSubjects &&
                  semester.failedSubjects.length > 0 ? (
                    <button
                      onClick={() =>
                        handleBacklogsClick(semester.failedSubjects)
                      }
                      className="flex items-center gap-1.5 bg-red-100 text-red-700 rounded-md px-2 py-1 text-xs font-medium hover:bg-red-200 transition-colors"
                    >
                      <AlertCircle className="h-3.5 w-3.5" />
                      {semester.failedSubjects.length}{" "}
                      {semester.failedSubjects.length === 1
                        ? "subject"
                        : "subjects"}
                    </button>
                  ) : (
                    <span className="text-emerald-600 font-medium text-xs">
                      None
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 text-sm">
                  {semester.result === "PASSED" && semester.sgpa !== null ? (
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span className="font-medium">{semester.sgpa}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-8 min-h-screen">
      {/* Welcome Banner with Notification Button */}
      <div className="relative bg-[#a674fe] text-white rounded-2xl shadow-lg overflow-hidden p-6 md:p-8 flex items-center justify-between min-h-[180px]">
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
            src={
              student?.sexId === 1
                ? "/illustrations/welcome-illustration-male.png"
                : "/illustrations/welcome-illustration-female.png"
            }
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
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
        {/* Left Column - Basic Info and Enrolled Courses */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-white">
            <CardHeader className="pb-2 pt-3 px-5">
              <CardTitle className="text-base font-semibold text-black">
                Basic Info
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-3 pt-0 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Course</span>
                <span className="font-semibold text-gray-800 text-base">
                  {batches[0].coursename}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">
                  Semester
                  <span className="text-red-500">
                    {student.active ? "*" : ""}
                  </span>
                </span>
                <span className="font-semibold text-gray-800 text-base">
                  {batches[batches.length - 1].classname}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Section</span>
                <span className="font-semibold text-gray-800 text-base">
                  {batches[batches.length - 1].sectionName || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">
                  CU Registration Number
                </span>
                <span className="font-semibold text-gray-800 text-base">
                  {student?.univregno}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">CU Roll Number</span>
                <span className="font-semibold text-gray-800 text-base">
                  {student?.univlstexmrollno}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Shift & Session</span>
                <span className="font-semibold text-gray-800 text-base">
                  {batches[batches.length - 1].shiftName || "N/A"} |{" "}
                  {batches[batches.length - 1].sessionName || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Section</span>
                <span className="font-semibold text-gray-800 text-base">
                  {batches[batches.length - 1].sectionName || "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Semester Summary - New Card */}
          <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-white">
            <CardHeader className="pb-2 pt-3 px-5">
              <CardTitle className="text-base font-semibold text-black flex items-center">
                <GraduationCap className="w-4 h-4 mr-2 text-[#925FE2]" />
                Semester Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-3 pt-0">
              {semesterSummary.length > 0 ? (
                <SemesterSummaryTable data={semesterSummary} />
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No semester data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enrolled Courses */}
          {/* <div>
            <div className="flex justify-between items-center mb-3">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {enrolledCourses.slice(0, 4).map((course) => (
                <Card
                  key={course.id}
                  className="border-0 shadow-md rounded-2xl overflow-hidden bg-white hover:bg-[#F9F7FF] hover:shadow-lg transition-all group p-4"
                >
                  <CardContent className="flex flex-col items-start text-left relative min-h-[140px] p-0">
                    <div className="w-10 h-10 mb-2 rounded-lg flex items-center justify-center bg-[#F3F0FF]">
                      <div className="w-5 h-5 text-[#925FE2]">
                        {course.id % 3 === 0 ? (
                          <BookOpen className="w-5 h-5" />
                        ) : course.id % 3 === 1 ? (
                          <Code className="w-5 h-5" />
                        ) : (
                          <Database className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                      Course Code: CS{course.id + 100}
                    </span>
                    <h3 className="text-sm font-medium text-gray-800 mb-2 leading-tight mt-1">
                      {course.title}
                    </h3>
                    <Button
                      size="sm"
                      className="w-auto mt-auto z-10 bg-[#925FE2] hover:bg-purple-700 text-white px-4 py-1.5 rounded-lg text-xs font-medium shadow-sm"
                    >
                      View
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div> */}
        </div>

        {/* Right Column - Daily Notice */}
        <div>
          <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-white">
            <CardHeader className="pt-3 pb-2 px-5 flex flex-row items-center justify-between">
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
            <CardContent className="px-5 pt-1 pb-3 space-y-3">
              {dailyNotices.slice(0, 4).map((notice) => (
                <div
                  key={notice.id}
                  className="border-b border-gray-100 pb-3 last:border-0 last:pb-0 group hover:bg-gray-50 rounded-lg transition-all cursor-pointer -mx-2 px-2"
                  onClick={() => {
                    if (notice.external) {
                      window.open(notice.link, "_blank", "noopener,noreferrer");
                    } else if (notice.link) {
                      router.push(notice.link);
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
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => {
                const colorClasses = colorMap[notification.color] || {
                  bg: "bg-gray-100",
                  text: "text-gray-700",
                };

                return (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-xl bg-white border hover:border-purple-200 shadow-sm hover:shadow transition-all duration-200 relative group cursor-pointer ${
                      !notification.isRead
                        ? "border-l-4 border-l-purple-500"
                        : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClasses.bg}`}
                      >
                        {notification.type === "assignment" && (
                          <FileText
                            className={`w-5 h-5 ${colorClasses.text}`}
                          />
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
              })
            ) : (
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
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Backlogs Dialog */}
      <Dialog open={backlogsDialogOpen} onOpenChange={setBacklogsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Failed Subjects
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedBacklogs && selectedBacklogs.length > 0 ? (
              <div className="space-y-3">
                {selectedBacklogs.map((subject, index) => (
                  <div
                    key={subject.id || index}
                    className="flex items-start gap-3 p-3 bg-red-50 rounded-lg"
                  >
                    <div className="rounded-full bg-red-100 p-2 flex-shrink-0">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {subject.name}
                      </h4>
                      {subject.marksheetCode && (
                        <p className="text-sm text-gray-600">
                          Code:{" "}
                          {subject.marksheetCode || subject.irpCode || "N/A"}
                        </p>
                      )}
                      {subject.fullMarks && (
                        <p className="text-sm text-gray-600">
                          Full Marks: {subject.fullMarks}
                        </p>
                      )}
                      {subject.credit && (
                        <p className="text-sm text-gray-600">
                          Credits: {subject.credit}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No backlog details available
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
