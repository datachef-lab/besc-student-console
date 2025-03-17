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
import { Calendar, BarChart, Clock } from "lucide-react";

// Mock data - replace with actual data from your backend
const mockData = {
  semesters: [1, 2, 3, 4, 5, 6, 7, 8],
  subjects: {
    1: [
      {
        code: "CS101",
        name: "Introduction to Programming",
        attended: 12,
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

export default function AttendanceContent() {
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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold">Attendance Dashboard</h1>

        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-[180px]">
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

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Average Attendance</p>
                <p className="text-2xl font-bold">
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
              <BarChart className="text-gray-400" size={24} />
            </div>
            <p className="text-sm mt-2">
              Across {currentSubjects.length} subjects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Classes This Week</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Calendar className="text-gray-400" size={24} />
            </div>
            <p className="text-sm mt-2">3 remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Subjects Below Threshold
                </p>
                <p className="text-2xl font-bold">
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
              <Clock className="text-gray-400" size={24} />
            </div>
            <p className="text-sm mt-2">75% attendance required</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="mb-4">
          <TabsTrigger value="cards">Cards View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentSubjects.map((subject) => {
              const percentage = Number(
                calculateAttendancePercentage(subject.attended, subject.total)
              );
              const { status, color, textColor } =
                getAttendanceStatus(percentage);

              return (
                <Card key={subject.code} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {subject.name}
                          <Badge variant="outline" className="ml-2 text-xs">
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
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {percentage >= 75
                          ? "Above Threshold"
                          : "Below Threshold"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <div className="flex items-baseline">
                            <span className="text-3xl font-bold mr-2">
                              {percentage}%
                            </span>
                            <span className={`text-sm ${textColor}`}>
                              {status}
                            </span>
                          </div>
                          <span className="text-sm">
                            {subject.attended}/{subject.total} classes
                          </span>
                        </div>

                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${color}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>

                        <p className="text-xs text-gray-500 mt-1">
                          {getClassesRequired(subject.attended, subject.total)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">
                          Recent Classes
                        </p>
                        <div className="flex space-x-2">
                          {subject.recentClasses.map((cls, idx) => (
                            <div key={idx} className="text-xs">
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
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-gray-500">
                        Subject
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-gray-500">
                        Code
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-gray-500">
                        Instructor
                      </th>
                      <th className="text-center p-3 text-sm font-medium text-gray-500">
                        Schedule
                      </th>
                      <th className="text-center p-3 text-sm font-medium text-gray-500">
                        Attended
                      </th>
                      <th className="text-center p-3 text-sm font-medium text-gray-500">
                        Percentage
                      </th>
                      <th className="text-center p-3 text-sm font-medium text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {currentSubjects.map((subject) => {
                      const percentage = Number(
                        calculateAttendancePercentage(
                          subject.attended,
                          subject.total
                        )
                      );
                      const { status } = getAttendanceStatus(percentage);

                      return (
                        <tr key={subject.code}>
                          <td className="p-3 text-sm">{subject.name}</td>
                          <td className="p-3 text-sm">{subject.code}</td>
                          <td className="p-3 text-sm">{subject.instructor}</td>
                          <td className="p-3 text-sm text-center">
                            {subject.schedule}
                          </td>
                          <td className="p-3 text-sm text-center">
                            {subject.attended}/{subject.total}
                          </td>
                          <td className="p-3 text-sm text-center font-medium">
                            {percentage}%
                          </td>
                          <td className="p-3 text-sm text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                percentage >= 75
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
