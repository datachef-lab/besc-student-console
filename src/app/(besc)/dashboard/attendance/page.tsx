"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  BarChart,
  Clock,
  ListChecks,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data - replace with actual data from your backend
const mockData = {
  semesters: [1, 2, 3, 4, 5, 6, 7, 8],
  holidays: [
    { date: "2024-03-15", name: "Spring Break", type: "academic" },
    { date: "2024-03-20", name: "Holi", type: "public" },
    { date: "2024-04-01", name: "Easter Monday", type: "public" },
  ],
  collegeEvents: [
    {
      id: 1,
      title: "Tech Symposium 2024",
      date: "2024-03-25",
      time: "09:00 AM",
      location: "Main Auditorium",
      type: "academic",
      description:
        "Annual technical symposium featuring workshops and competitions",
      registrationDeadline: "2024-03-20",
    },
    {
      id: 2,
      title: "Cultural Fest",
      date: "2024-04-05",
      time: "02:00 PM",
      location: "College Grounds",
      type: "cultural",
      description:
        "Annual cultural festival with music, dance, and drama performances",
      registrationDeadline: "2024-03-30",
    },
    {
      id: 3,
      title: "Career Fair",
      date: "2024-04-15",
      time: "10:00 AM",
      location: "Sports Complex",
      type: "career",
      description:
        "Connect with top companies and explore internship opportunities",
      registrationDeadline: "2024-04-10",
    },
  ],
  timetable: {
    Monday: [
      { time: "09:00 - 10:30", subject: "CS101", room: "101", floor: "1st" },
      { time: "11:00 - 12:30", subject: "MA101", room: "202", floor: "2nd" },
      {
        time: "14:00 - 15:30",
        subject: "PH101",
        room: "Lab 1",
        floor: "Ground",
      },
    ],
    Tuesday: [
      { time: "10:00 - 11:30", subject: "CS101", room: "101", floor: "1st" },
      { time: "13:00 - 14:30", subject: "MA101", room: "202", floor: "2nd" },
    ],
    Wednesday: [
      { time: "09:00 - 10:30", subject: "CS101", room: "101", floor: "1st" },
      {
        time: "11:00 - 12:30",
        subject: "PH101",
        room: "Lab 1",
        floor: "Ground",
      },
    ],
    Thursday: [
      { time: "10:00 - 11:30", subject: "MA101", room: "202", floor: "2nd" },
      {
        time: "14:00 - 15:30",
        subject: "PH101",
        room: "Lab 1",
        floor: "Ground",
      },
    ],
    Friday: [
      { time: "09:00 - 10:30", subject: "CS101", room: "101", floor: "1st" },
      { time: "11:00 - 12:30", subject: "MA101", room: "202", floor: "2nd" },
    ],
  } as const,
  subjects: {
    1: [
      {
        code: "CS101",
        name: "Introduction to Programming",
        attended: 2,
        total: 15,
        schedule: "Mon, Wed, Fri - 10:00 AM",
        instructor: "Dr. Smith",
        recentClasses: [
          { date: "Feb 28, 2025", status: "present" },
          { date: "Feb 26, 2025", status: "present" },
          { date: "Feb 24, 2025", status: "absent" },
        ],
      },
      {
        code: "MA101",
        name: "Mathematics I",
        attended: 14,
        total: 15,
        schedule: "Tue, Thu - 11:30 AM",
        instructor: "Dr. Johnson",
        recentClasses: [
          { date: "Feb 27, 2025", status: "present" },
          { date: "Feb 25, 2025", status: "present" },
          { date: "Feb 20, 2025", status: "present" },
        ],
      },
      {
        code: "PH101",
        name: "Physics",
        attended: 10,
        total: 12,
        schedule: "Mon, Wed - 2:00 PM",
        instructor: "Dr. Garcia",
        recentClasses: [
          { date: "Feb 28, 2025", status: "present" },
          { date: "Feb 26, 2025", status: "absent" },
          { date: "Feb 24, 2025", status: "present" },
        ],
      },
    ],
    2: [
      {
        code: "CS201",
        name: "Data Structures",
        attended: 8,
        total: 12,
        schedule: "Mon, Wed, Fri - 9:00 AM",
        instructor: "Dr. Williams",
        recentClasses: [
          { date: "Feb 28, 2025", status: "present" },
          { date: "Feb 26, 2025", status: "absent" },
          { date: "Feb 24, 2025", status: "absent" },
        ],
      },
      {
        code: "MA201",
        name: "Mathematics II",
        attended: 10,
        total: 10,
        schedule: "Tue, Thu - 1:30 PM",
        instructor: "Dr. Brown",
        recentClasses: [
          { date: "Feb 27, 2025", status: "present" },
          { date: "Feb 25, 2025", status: "present" },
          { date: "Feb 20, 2025", status: "present" },
        ],
      },
    ],
  },
};

type TimetableDay = keyof typeof mockData.timetable;
type ClassSchedule = {
  readonly time: string;
  readonly subject: "CS101" | "MA101" | "PH101" | "ONGOING301";
  readonly room: string;
  readonly floor: string;
};

const getCurrentDaySchedule = (): readonly ClassSchedule[] => {
  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  }) as TimetableDay;
  return mockData.timetable[currentDay] || [];
};

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

// Helper to get all unique time slots
const getAllTimeSlots = () => {
  const slots = new Set<string>();
  weekDays.forEach((day) => {
    (mockData.timetable[day] || []).forEach((cls) => {
      slots.add(cls.time);
    });
  });
  return Array.from(slots).sort();
};

// Helper to determine class status based on time
const getClassStatus = (timeRange: string): "Ongoing" | "Upcoming" | "Past" => {
  const now = new Date();
  const [startTimeStr, endTimeStr] = timeRange.split(" - ");

  const parseTime = (timeStr: string): Date => {
    const date = new Date(now);
    date.setSeconds(0, 0); // Reset seconds and milliseconds

    const parts = timeStr.match(/(\d+):(\d+)( )?(AM|PM)?/);
    if (!parts) throw new Error("Invalid time format: " + timeStr);

    let hour = parseInt(parts[1], 10);
    const minute = parseInt(parts[2], 10);
    const period = parts[4]; // AM/PM or undefined

    if (period) {
      if (period === "PM" && hour !== 12) {
        hour += 12;
      } else if (period === "AM" && hour === 12) {
        hour = 0; // 12 AM is 00:00
      }
    }

    date.setHours(hour, minute, 0, 0);
    return date;
  };

  try {
    const startTime = parseTime(startTimeStr);
    const endTime = parseTime(endTimeStr);

    // If the end time is before the start time, assume it spans midnight
    // This is unlikely for class times but good for general robustness
    if (endTime < startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }

    if (now >= startTime && now <= endTime) {
      return "Ongoing";
    } else if (now < startTime) {
      return "Upcoming";
    } else {
      return "Past";
    }
  } catch (error) {
    console.error("Error parsing time range: ", timeRange, error);
    // Return 'Past' or 'Upcoming' as a fallback, as 'Unknown' is not in the type definition.
    // 'Past' seems safer if parsing fails, assuming we missed the time.
    return "Past";
  }
};

// Helper to get class for a day and time
const getClassForDayAndTime = (
  day: (typeof weekDays)[number],
  time: string
) => {
  return (mockData.timetable[day] || []).find((cls) => cls.time === time);
};

// Helper to get the current or next class based on time
interface Subject {
  code: string;
  name: string;
  attended: number;
  total: number;
  schedule: string;
  instructor: string;
  recentClasses: { date: string; status: string }[];
}
interface UpcomingClass extends Subject {
  classDate: Date;
  room: string;
  floor: string;
}
const getCurrentOrNextClass = (
  subjects: Subject[]
): UpcomingClass | undefined => {
  const now = new Date();
  const upcoming: UpcomingClass[] = [];

  // Helper to parse time string (e.g., "10:00 AM" or "10:00 - 11:30") and return a comparable time value (e.g., "10:00")
  const parseComparableTime = (timeStr: string): string => {
    const parts = timeStr.split(" - ")[0].match(/(\d+):(\d+)/); // Get the start time part (e.g., "10:00")
    if (!parts) return "";
    return `${parts[1].padStart(2, "0")}:${parts[2].padStart(2, "0")}`;
  };

  subjects.forEach((subject) => {
    // Parse schedule string, e.g., 'Mon, Wed, Fri - 10:00 AM'
    const [daysStr, timeStr] = subject.schedule.split(" - ");
    const days = daysStr.split(",").map((d: string) => d.trim());
    const timeMatch = timeStr.match(/(\d+):(\d+)( )?(AM|PM)?/);
    if (!timeMatch) return;
    const hour = timeMatch[1];
    const min = timeMatch[2];
    const period = timeMatch[4];

    const comparableScheduleTime = parseComparableTime(timeStr);

    days.forEach((day: string) => {
      // Get next date for this day
      const dayIndex = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
      ].indexOf(day.slice(0, 3));
      if (dayIndex === -1) return;
      const classDate = new Date(now);
      classDate.setHours(
        period === "PM" && hour !== "12"
          ? +hour + 12
          : +hour === 12 && period === "AM"
          ? 0
          : +hour,
        +min,
        0,
        0
      );
      let diff = (dayIndex + 7 - now.getDay()) % 7;
      if (diff === 0 && classDate < now) diff = 7; // if today but already passed, go to next week
      classDate.setDate(now.getDate() + diff);

      // Find corresponding class in timetable to get room and floor using parsed time
      let classInTimetable = undefined;
      const fullTimetableDays = Object.keys(
        mockData.timetable
      ) as (keyof typeof mockData.timetable)[];
      for (const tableDay of fullTimetableDays) {
        classInTimetable = mockData.timetable[tableDay].find(
          (cls) =>
            cls.subject === subject.code &&
            parseComparableTime(cls.time) === comparableScheduleTime
        );
        if (classInTimetable) break; // Found a match, no need to check other days
      }

      if (classInTimetable) {
        upcoming.push({
          ...subject,
          classDate,
          room: classInTimetable.room,
          floor: classInTimetable.floor,
        });
      } else {
        // Fallback if class not found in full timetable (shouldn't happen with current mock data)
        upcoming.push({ ...subject, classDate, room: "N/A", floor: "N/A" });
      }
    });
  });
  // Sort by soonest
  upcoming.sort((a, b) => a.classDate.getTime() - b.classDate.getTime());

  // Filter for classes today that are ongoing or upcoming
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayUpcomingOrOngoing = upcoming.filter((item) => {
    const itemDate = new Date(item.classDate);
    itemDate.setHours(0, 0, 0, 0);
    // Check if the class is today and its time hasn't passed yet
    const itemTimeStr = item.schedule.split(" - ")[1];
    return (
      itemDate.getTime() === today.getTime() &&
      getClassStatus(itemTimeStr) !== "Past"
    );
  });

  // Return the soonest one from today, or the overall soonest if none today are upcoming/ongoing
  return todayUpcomingOrOngoing.length > 0
    ? todayUpcomingOrOngoing[0]
    : upcoming[0];
};

export default function AttendancePage() {
  const [selectedSemester, setSelectedSemester] = useState<string>("1");
  const [selectedView, setSelectedView] = useState<string>("today");
  const [isTimetableOpen, setIsTimetableOpen] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState<number | null>(null);

  const calculateAttendancePercentage = (attended: number, total: number) => {
    return ((attended / total) * 100).toFixed(1);
  };

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 90)
      return {
        status: "Excellent",
        textColor: "text-green-600",
      };
    if (percentage >= 75)
      return {
        status: "Good",
        textColor: "text-emerald-500",
      };
    if (percentage >= 60)
      return {
        status: "Average",
        textColor: "text-yellow-500",
      };
    return { status: "Poor", textColor: "text-red-600" };
  };

  const getClassesRequired = (attended: number, total: number) => {
    const current = (attended / total) * 100;
    if (current >= 75) return "Attendance threshold met";

    // Calculate classes needed to reach 75%
    const totalProjected = Math.ceil((attended * 100) / 75);
    const required = totalProjected - total;

    return `Need to attend ${required} more consecutive classes to reach 75%`;
  };

  const currentSubjects =
    mockData.subjects[
      selectedSemester as unknown as keyof typeof mockData.subjects
    ] || [];
  const currentOrNextClass = getCurrentOrNextClass(currentSubjects);
  const allTimeSlots = getAllTimeSlots();

  // Determine status of the current/next class
  const currentOrNextClassStatus = currentOrNextClass
    ? getClassStatus(currentOrNextClass.schedule.split(" - ")[1])
    : null;
  const statusBadgeColor =
    currentOrNextClassStatus === "Ongoing"
      ? "bg-green-100 text-green-800"
      : currentOrNextClassStatus === "Upcoming"
      ? "bg-blue-100 text-blue-800"
      : "bg-gray-100 text-gray-800";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white py-10 px-6 mb-8 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-400 mix-blend-overlay blur-2xl"></div>
          <div className="absolute right-40 top-20 w-32 h-32 rounded-full bg-purple-400 mix-blend-overlay blur-xl"></div>
          <div className="absolute left-20 bottom-10 w-48 h-48 rounded-full bg-indigo-300 mix-blend-overlay blur-2xl"></div>
          <div className="absolute inset-0 bg-[url('/illustrations/dots-pattern.svg')] opacity-5"></div>
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-5 bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-white/10">
                <ListChecks size={36} className="text-white drop-shadow-md" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-md">
                  Attendance Tracker
                </h1>
                <p className="text-blue-50 text-lg drop-shadow max-w-2xl">
                  Monitor your class attendance and stay on top of your academic
                  requirements
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <Select
                value={selectedSemester}
                onValueChange={setSelectedSemester}
              >
                <SelectTrigger className="w-[180px] border-white/20 bg-white/10 text-white backdrop-blur-sm">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {mockData.semesters.map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        <div className="block md:hidden mb-6">
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-full border-indigo-100">
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {mockData.semesters.map((sem) => (
                <SelectItem key={sem} value={sem.toString()}>
                  Semester {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs
          value={selectedView}
          onValueChange={setSelectedView}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:grid-cols-auto mb-6">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="today">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {currentOrNextClass && (
                  <div className="bg-white/90 border border-indigo-100 rounded-xl shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg text-indigo-800">
                          {currentOrNextClass.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="ml-2 text-xs bg-indigo-100 text-indigo-800 border-indigo-300 shadow-sm"
                        >
                          {currentOrNextClass.code}
                        </Badge>
                        {currentOrNextClassStatus && (
                          <Badge
                            className={`ml-2 text-xs font-semibold ${statusBadgeColor}`}
                          >
                            {currentOrNextClassStatus}
                          </Badge>
                        )}
                      </div>
                      <div className="text-gray-600 text-sm mb-1">
                        {currentOrNextClass.instructor}
                      </div>
                      <div className="text-gray-500 text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        {currentOrNextClass.schedule}
                        <MapPin className="w-4 h-4 ml-4 text-indigo-500" />
                        <span className="font-medium text-gray-600">
                          {currentOrNextClass.room}
                        </span>
                        ,{" "}
                        <span className="text-gray-600">
                          {currentOrNextClass.floor}
                        </span>
                      </div>
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-base font-semibold w-full md:w-auto mt-4 md:mt-0">
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Mark Attendance
                    </Button>
                  </div>
                )}

                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-indigo-100 shadow-md">
                  <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-indigo-600" />
                    Today&apos;s Schedule
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg text-left shadow-sm">
                      <thead>
                        <tr>
                          <th className="p-3 text-left border-b bg-gray-100 text-gray-700">
                            Time
                          </th>
                          <th className="p-3 text-left border-b bg-gray-100 text-gray-700">
                            Subject
                          </th>
                          <th className="p-3 text-left border-b bg-gray-100 text-gray-700">
                            Room
                          </th>
                          <th className="p-3 text-left border-b bg-gray-100 text-gray-700">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Generate today's schedule including dummy data */}
                        {(() => {
                          // Get original schedule for today
                          const todaySchedule = [
                            ...(mockData.timetable[
                              new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                              }) as keyof typeof mockData.timetable
                            ] || []),
                          ];

                          // Add dummy classes for demonstration
                          const now = new Date();
                          const currentHour = now.getHours();
                          const currentMinute = now.getMinutes();

                          // Add an ongoing class (e.g., started 5 mins ago, lasts 30 mins)
                          const ongoingTimeStart = new Date(
                            now.getTime() - 5 * 60000
                          ); // 5 minutes ago
                          const ongoingTimeEnd = new Date(
                            ongoingTimeStart.getTime() + 30 * 60000
                          ); // 30 minutes duration
                          const ongoingTime = `${ongoingTimeStart
                            .getHours()
                            .toString()
                            .padStart(2, "0")}:${ongoingTimeStart
                            .getMinutes()
                            .toString()
                            .padStart(2, "0")} - ${ongoingTimeEnd
                            .getHours()
                            .toString()
                            .padStart(2, "0")}:${ongoingTimeEnd
                            .getMinutes()
                            .toString()
                            .padStart(2, "0")}`;

                          todaySchedule.push({
                            time: ongoingTime,
                            subject: "ONGOING301",
                            room: "301",
                            floor: "3rd",
                          });

                          // Add an upcoming class (e.g., 15 mins from now, lasts 60 mins)
                          const upcomingTime1Start = new Date(
                            now.getTime() + 15 * 60000
                          ); // 15 minutes from now
                          const upcomingTime1End = new Date(
                            upcomingTime1Start.getTime() + 60 * 60000
                          ); // 60 minutes duration
                          const upcomingTime1 = `${upcomingTime1Start
                            .getHours()
                            .toString()
                            .padStart(2, "0")}:${upcomingTime1Start
                            .getMinutes()
                            .toString()
                            .padStart(2, "0")} - ${upcomingTime1End
                            .getHours()
                            .toString()
                            .padStart(2, "0")}:${upcomingTime1End
                            .getMinutes()
                            .toString()
                            .padStart(2, "0")}`;

                          todaySchedule.push({
                            time: upcomingTime1,
                            subject: "UPCOMING401",
                            room: "401",
                            floor: "4th",
                          });

                          // Add another upcoming class (e.g., 45 mins from now, lasts 60 mins)
                          const upcomingTime2Start = new Date(
                            now.getTime() + 45 * 60000
                          ); // 45 minutes from now
                          const upcomingTime2End = new Date(
                            upcomingTime2Start.getTime() + 60 * 60000
                          ); // 60 minutes duration
                          const upcomingTime2 = `${upcomingTime2Start
                            .getHours()
                            .toString()
                            .padStart(2, "0")}:${upcomingTime2Start
                            .getMinutes()
                            .toString()
                            .padStart(2, "0")} - ${upcomingTime2End
                            .getHours()
                            .toString()
                            .padStart(2, "0")}:${upcomingTime2End
                            .getMinutes()
                            .toString()
                            .padStart(2, "0")}`;

                          todaySchedule.push({
                            time: upcomingTime2,
                            subject: "UPCOMING501",
                            room: "502",
                            floor: "5th",
                          });

                          // Sort the schedule by time for display
                          todaySchedule.sort((a, b) => {
                            const timeA = new Date(
                              `2000-01-01 ${a.time.split(" - ")[0]}`
                            );
                            const timeB = new Date(
                              `2000-01-01 ${b.time.split(" - ")[0]}`
                            );
                            return timeA.getTime() - timeB.getTime();
                          });

                          return todaySchedule.map(
                            (class_: ClassSchedule, index: number) => {
                              const status = getClassStatus(class_.time);
                              const badgeColor =
                                status === "Ongoing"
                                  ? "bg-green-500 text-white border-green-600" // More colorful green
                                  : status === "Upcoming"
                                  ? "bg-blue-500 text-white border-blue-600" // More colorful blue
                                  : "bg-gray-500 text-white border-gray-600"; // Darker gray
                              return (
                                <tr
                                  key={index}
                                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 odd:bg-white even:bg-gray-50" // Added hover and alternating row colors
                                >
                                  <td className="p-3">{class_.time}</td>{" "}
                                  {/* Increased padding */}
                                  <td className="p-3">{class_.subject}</td>
                                  <td className={`p-3`}>
                                    {" "}
                                    {/* Increased padding */}
                                    <div>{class_.room}</div>{" "}
                                    {/* Display room on a separate line */}
                                    <div className="text-xs text-gray-600">
                                      Floor: {class_.floor}
                                    </div>{" "}
                                    {/* Explicit label for floor, slightly darker text */}
                                  </td>
                                  <td className="p-3">
                                    {" "}
                                    {/* Increased padding */}
                                    <Badge className={badgeColor}>
                                      {status}
                                    </Badge>
                                  </td>
                                </tr>
                              );
                            }
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                  {/* Example: Total classes today: 3, Attended: 2, Breaks: 1 */}
                  <div className="mt-6 text-sm text-gray-600 italic">
                    * This section displays your schedule for today. Dummy
                    entries with dynamic times are included for demonstration
                    purposes.
                  </div>

                  <Button
                    className="mt-4 w-full"
                    variant="outline"
                    onClick={() => setIsTimetableOpen(true)}
                  >
                    View Full Timetable
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-indigo-100 shadow-md">
                  <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-indigo-600" />
                    Upcoming Holidays
                  </h2>
                  <div className="space-y-3">
                    {mockData.holidays.map((holiday, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar size={20} className="text-indigo-500" />
                          <div>
                            <p className="font-medium">{holiday.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(holiday.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            holiday.type === "academic"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-purple-50 text-purple-700"
                          }
                        >
                          {holiday.type === "academic" ? "Academic" : "Public"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="statistics">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-blue-100 overflow-hidden">
                  <CardContent className="p-5 flex flex-col justify-between h-full">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-blue-700 font-medium mb-1">
                          Average Attendance
                        </p>
                        <p className="text-2xl font-bold text-blue-700">
                          {currentSubjects.length > 0
                            ? (
                                currentSubjects.reduce(
                                  (sum, subject) =>
                                    sum +
                                    Number(
                                      calculateAttendancePercentage(
                                        subject.attended,
                                        subject.total
                                      )
                                    ),
                                  0
                                ) / currentSubjects.length
                              ).toFixed(1)
                            : 0}
                          %
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-blue-200 text-blue-700">
                        <BarChart className="w-6 h-6" />
                      </div>
                    </div>
                    <p className="text-sm mt-2 text-blue-600">
                      Across {currentSubjects.length} subjects
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-200 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-green-100 overflow-hidden">
                  <CardContent className="p-5 flex flex-col justify-between h-full">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-green-700 font-medium mb-1">
                          Classes This Week
                        </p>
                        <p className="text-2xl font-bold text-green-700">12</p>
                      </div>
                      <div className="p-3 rounded-xl bg-green-200 text-green-700">
                        <Calendar className="w-6 h-6" />
                      </div>
                    </div>
                    <p className="text-sm mt-2 text-green-600">3 remaining</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-purple-100 overflow-hidden">
                  <CardContent className="p-5 flex flex-col justify-between h-full">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-purple-700 font-medium mb-1">
                          Subjects Below Threshold
                        </p>
                        <p className="text-2xl font-bold text-purple-700">
                          {
                            currentSubjects.filter(
                              (subject) =>
                                Number(
                                  calculateAttendancePercentage(
                                    subject.attended,
                                    subject.total
                                  )
                                ) < 75
                            ).length
                          }
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-purple-200 text-purple-700">
                        <Clock className="w-6 h-6" />
                      </div>
                    </div>
                    <p className="text-sm mt-2 text-purple-600">
                      75% attendance required
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-indigo-100 shadow-md">
                <h2 className="text-xl font-bold text-indigo-800 mb-6 flex items-center">
                  <ListChecks className="mr-2 h-5 w-5 text-indigo-600" />
                  Subject Attendance
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentSubjects.map((subject) => {
                    const percentage = Number(
                      calculateAttendancePercentage(
                        subject.attended,
                        subject.total
                      )
                    );
                    const { status, textColor } =
                      getAttendanceStatus(percentage);

                    // Determine color theme based on attendance percentage
                    const cardTheme =
                      percentage >= 90
                        ? "border-green-200 bg-gradient-to-br from-white to-green-50"
                        : percentage >= 75
                        ? "border-blue-200 bg-gradient-to-br from-white to-blue-50"
                        : percentage >= 60
                        ? "border-amber-200 bg-gradient-to-br from-white to-amber-50"
                        : "border-red-200 bg-gradient-to-br from-white to-red-50";

                    return (
                      <Card
                        key={subject.code}
                        className={`border-2 shadow-md hover:shadow-lg transition-all rounded-xl overflow-hidden ${cardTheme}`}
                      >
                        <CardHeader className="pb-2 border-b border-indigo-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="flex items-center text-gray-800">
                                {subject.name}
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-xs bg-indigo-50 text-indigo-700 border-indigo-200"
                                >
                                  {subject.code}
                                </Badge>
                              </CardTitle>
                              <p className="text-sm text-gray-500 mt-1">
                                {subject.instructor} • {subject.schedule}
                              </p>
                            </div>
                            <Badge
                              className={`${
                                percentage >= 75
                                  ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0"
                                  : "bg-gradient-to-r from-red-400 to-rose-500 text-white border-0"
                              }`}
                            >
                              {percentage >= 75
                                ? "Above Threshold"
                                : "Below Threshold"}
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-4">
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <div className="flex items-baseline">
                                  <span className="text-3xl font-bold mr-2 text-gray-800">
                                    {percentage}%
                                  </span>
                                  <span
                                    className={`text-sm font-medium ${textColor}`}
                                  >
                                    {status}
                                  </span>
                                </div>
                                <span className="text-sm bg-white px-2 py-1 rounded-full text-gray-700 shadow-sm border border-gray-100">
                                  {subject.attended}/{subject.total} classes
                                </span>
                              </div>

                              <div className="w-full bg-gray-100 rounded-full h-4 mt-2 overflow-hidden shadow-inner">
                                <div
                                  className={`h-4 rounded-full ${
                                    percentage >= 90
                                      ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                      : percentage >= 75
                                      ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                                      : percentage >= 60
                                      ? "bg-amber-400 to-orange-500"
                                      : "bg-red-400 to-rose-500"
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>

                              <p className="text-xs text-gray-500 mt-2">
                                {getClassesRequired(
                                  subject.attended,
                                  subject.total
                                )}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-gray-200">
                              <p className="text-sm font-medium mb-2 text-gray-700 flex items-center">
                                <Calendar className="w-4 h-4 mr-1 text-indigo-500" />
                                Recent Classes
                              </p>
                              <div className="flex space-x-3">
                                {subject.recentClasses.map((cls, idx) => (
                                  <div
                                    key={idx}
                                    className={`text-xs px-2 py-1 rounded-md shadow-sm border ${
                                      cls.status === "present"
                                        ? "bg-green-50 border-green-200 text-green-700"
                                        : "bg-red-50 border-red-200 text-red-700"
                                    }`}
                                  >
                                    <span
                                      className={`inline-block w-2 h-2 rounded-full mr-1 ${
                                        cls.status === "present"
                                          ? "bg-green-500"
                                          : "bg-red-500"
                                      }`}
                                    ></span>
                                    {cls.date.split(",")[0]}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-indigo-100 shadow-md">
                  <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-indigo-600" />
                    Upcoming College Events
                  </h2>
                  <div className="space-y-4">
                    {mockData.collegeEvents.map((event) => (
                      <div
                        key={event.id}
                        className="bg-white border border-indigo-100 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer flex items-start gap-4"
                        onClick={() => setShowEventDetails(event.id)}
                      >
                        <div className="flex-shrink-0 p-3 bg-indigo-50 rounded-lg text-indigo-600 shadow-sm">
                          <Calendar size={20} />
                        </div>
                        <div className="flex-grow flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-indigo-800 mb-1">
                              {event.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {event.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3">
                              <Badge
                                variant="outline"
                                className="bg-indigo-100 text-indigo-800 border-indigo-300"
                              >
                                {event.type}
                              </Badge>
                              <span className="text-sm text-gray-500 flex items-center">
                                <Calendar className="w-4 h-4 mr-1 text-indigo-500" />
                                {new Date(event.date).toLocaleDateString()}
                              </span>
                              <span className="text-sm text-gray-500 flex items-center">
                                <Clock className="w-4 h-4 mr-1 text-indigo-500" />
                                {event.time}
                              </span>
                              <span className="text-sm text-gray-500 flex items-center">
                                <MapPin className="w-4 h-4 mr-1 text-indigo-500" />
                                {event.location}
                              </span>
                            </div>
                          </div>
                          {/* Keeping registration status badge as it is relevant */}
                          <Badge
                            className={`${
                              new Date(event.registrationDeadline) > new Date()
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {new Date(event.registrationDeadline) > new Date()
                              ? "Registration Open"
                              : "Registration Closed"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-indigo-100 shadow-md">
                  <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-indigo-600" />
                    Upcoming Holidays
                  </h2>
                  <div className="space-y-3">
                    {mockData.holidays.map((holiday, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar size={20} className="text-indigo-500" />
                          <div>
                            <p className="font-medium">{holiday.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(holiday.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            holiday.type === "academic"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-purple-50 text-purple-700"
                          }
                        >
                          {holiday.type === "academic" ? "Academic" : "Public"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Event Details Dialog */}
        <Dialog
          open={showEventDetails !== null}
          onOpenChange={() => setShowEventDetails(null)}
        >
          <DialogContent className="max-w-2xl">
            {showEventDetails && (
              <>
                <DialogHeader>
                  <DialogTitle>
                    {
                      mockData.collegeEvents.find(
                        (e) => e.id === showEventDetails
                      )?.title
                    }
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(
                        mockData.collegeEvents.find(
                          (e) => e.id === showEventDetails
                        )?.date || ""
                      ).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {
                        mockData.collegeEvents.find(
                          (e) => e.id === showEventDetails
                        )?.time
                      }
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {
                        mockData.collegeEvents.find(
                          (e) => e.id === showEventDetails
                        )?.location
                      }
                    </div>
                  </div>
                  <p className="text-gray-700">
                    {
                      mockData.collegeEvents.find(
                        (e) => e.id === showEventDetails
                      )?.description
                    }
                  </p>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500">
                      Registration Deadline:{" "}
                      {new Date(
                        mockData.collegeEvents.find(
                          (e) => e.id === showEventDetails
                        )?.registrationDeadline || ""
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <Button className="w-full mt-4">Register Now</Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isTimetableOpen} onOpenChange={setIsTimetableOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Weekly Timetable</DialogTitle>
            </DialogHeader>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg text-center shadow-sm">
                <thead>
                  <tr>
                    <th className="p-3 text-left border-b bg-gray-100 text-gray-700">
                      Time
                    </th>
                    {weekDays.map((day) => (
                      <th
                        key={day}
                        className="p-3 border-b bg-gray-100 text-gray-700"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allTimeSlots.map((time) => (
                    <tr
                      key={time}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 odd:bg-white even:bg-gray-50"
                    >
                      <td className="p-3 border-b font-medium text-left bg-gray-50">
                        {time}
                      </td>
                      {weekDays.map((day) => {
                        const cls = getClassForDayAndTime(day, time);
                        return (
                          <td
                            key={day}
                            className="p-3 border-b align-top min-w-[120px] text-sm space-y-1"
                          >
                            {cls ? (
                              <div>
                                <div className="font-semibold text-indigo-800 text-base">
                                  {cls.subject}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  <span className="block">
                                    Room: {cls.room}
                                  </span>
                                  <span className="block">
                                    Floor: {cls.floor}
                                  </span>
                                </div>
                              </div>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

// Dynamically add some dummy upcoming and ongoing classes for the current day
const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
}) as keyof typeof mockData.timetable;

// Add dummy classes with times relative to now
const now = new Date();
const currentHour = now.getHours();
const currentMinute = now.getMinutes();

// Add an upcoming class (e.g., 1 hour from now)
const upcomingTimeHour = (currentHour + 1) % 24;
const upcomingTime = `${upcomingTimeHour
  .toString()
  .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")} - ${(
  (upcomingTimeHour + 1) %
  24
)
  .toString()
  .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

mockData.timetable[today] = [
  ...(mockData.timetable[today] || []),
  {
    time: upcomingTime,
    subject: "DUMMY101",
    room: "301",
    floor: "3rd",
  },
];

// Add another upcoming class (e.g., 2 hours from now)
const upcomingTime2Hour = (currentHour + 2) % 24;
const upcomingTime2 = `${upcomingTime2Hour
  .toString()
  .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")} - ${(
  (upcomingTime2Hour + 1) %
  24
)
  .toString()
  .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

mockData.timetable[today] = [
  ...(mockData.timetable[today] || []),
  {
    time: upcomingTime2,
    subject: "DUMMY201",
    room: "402",
    floor: "4th",
  },
];

// Optionally, add an ongoing class if within a specific window (e.g., start time within the last 15 mins)
// This is a bit trickier with just mock data and depends heavily on when the user loads the page.
// For reliable demo, adding upcoming is easier.

// Note: In a real application, you would fetch the actual today's schedule from an API.
