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
import { Calendar, BarChart, Clock, ListChecks } from "lucide-react";

// Mock data - replace with actual data from your backend
const mockData = {
  semesters: [1, 2, 3, 4, 5, 6, 7, 8],
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

export default function AttendancePage() {
  const [selectedSemester, setSelectedSemester] = useState<string>("1");
  const [selectedView, setSelectedView] = useState<string>("cards");

  const calculateAttendancePercentage = (attended: number, total: number) => {
    return ((attended / total) * 100).toFixed(1);
  };

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 90)
      return {
        status: "Excellent",
        color: "bg-green-600",
        textColor: "text-green-600",
      };
    if (percentage >= 75)
      return {
        status: "Good",
        color: "bg-emerald-500",
        textColor: "text-emerald-500",
      };
    if (percentage >= 60)
      return {
        status: "Average",
        color: "bg-yellow-500",
        textColor: "text-yellow-500",
      };
    return { status: "Poor", color: "bg-red-600", textColor: "text-red-600" };
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
        {/* Mobile Semester Selector */}
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

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                calculateAttendancePercentage(subject.attended, subject.total)
              );
              const { status, color, textColor } =
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
                                ? "bg-gradient-to-r from-amber-400 to-orange-500"
                                : "bg-gradient-to-r from-red-400 to-rose-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                          {getClassesRequired(subject.attended, subject.total)}
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
      </main>
    </div>
  );
}
