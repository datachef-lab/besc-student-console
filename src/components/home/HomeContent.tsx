"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  GraduationCap,
  User,
  CalendarHeart,
  NotebookPen,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useStudent } from "@/context/StudentContext";

export default function HomeContent() {
  const { student, batches, loading } = useStudent();

  if (loading) return <p>Loading...</p>;
  if (!student) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Student Details Card */}
      {/* <Card className="border rounded-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">
                Welcome Back, {student?.name}
              </h1>
              <div className="space-y-1 text-gray-600 pt-3">
                <div className="flex gap-20">
                  <div>
                    <div className="flex gap-2 items-center">
                      <p className="w-[150px] font-semibold">Roll No</p>
                      <p>:</p>
                      <p>{student?.univlstexmrollno}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <p className="w-[150px] font-semibold">
                        Registration No
                      </p>
                      <p>:</p>
                      <p>{student?.univregno}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <p className="w-[150px] font-semibold">Class Roll No</p>
                      <p>:</p>
                      <p>{student?.rollNumber}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex gap-2 items-center">
                      <p className="w-[150px] font-semibold">Framework</p>
                      <p>:</p>
                      <p>
                        {!student?.coursetype || student?.coursetype === "NA"
                          ? ""
                          : student?.coursetype}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <p className="w-[150px] font-semibold">Course</p>
                      <p>:</p>
                      <p>{batch && batch.course?.courseName}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <p className="w-[150px] font-semibold">Section</p>
                      <p>:</p>
                      <p>{batch && batch.section?.sectionName}</p>
                    </div>
                  </div>
                </div>
                {!student?.alumni && (
                  <div className="flex gap-2 items-center">
                    <p className="w-[150px] font-semibold">Current Semester:</p>{" "}
                    <p>{student?.alumni ? "" : "-"}</p>
                  </div>
                )}
                {student.alumni && <Badge>Graduated</Badge>}
              </div>
            </div>
            <div className="h-24 w-24 rounded-full border-2 border-gray-300 flex items-center justify-center">
              {student?.imgFile ? (
                <Image
                  src={`https://74.207.233.48:8443/hrclIRP/studentimages/${student?.imgFile}`}
                  alt={student?.name || "student-profile-image"}
                  className="h-full w-full rounded-full object-cover"
                  width={100}
                  height={100}
                />
              ) : (
                <User className="h-12 w-12 text-gray-400" />
              )}
            </div>
          </div>
        </CardContent>
      </Card> */}
      {/* {JSON.stringify(batches   , null, 2)} */}
      <Card className="border rounded-lg overflow-hidden">
        <CardContent className="py-6 px-3">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="space-y-2 w-full">
              <h1 className="text-2xl font-bold">
                Welcome Back, {student?.name}
              </h1>
              <div className="space-y-3 text-gray-600 pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <p className="w-[120px] font-semibold min-w-0">Roll No</p>
                      <p>:</p>
                      <p className="truncate">{student?.univlstexmrollno}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <p className="w-[120px] font-semibold min-w-0">
                        Registration No
                      </p>
                      <p>:</p>
                      <p className="truncate">{student?.univregno}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <p className="w-[120px] font-semibold min-w-0">
                        Class Roll No
                      </p>
                      <p>:</p>
                      <p className="truncate">{student?.rollNumber}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <p className="w-[120px] font-semibold min-w-0">
                        Framework
                      </p>
                      <p>:</p>
                      <p className="truncate">
                        {!student?.coursetype || student?.coursetype === "NA"
                          ? "-"
                          : student?.coursetype}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <p className="w-[120px] font-semibold min-w-0">Course</p>
                      <p>:</p>
                      <p className="truncate">
                        {batches
                          ? batches[batches.length - 1]?.coursename
                          : ""}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <p className="w-[120px] font-semibold min-w-0">Section</p>
                      <p>:</p>
                      <p className="truncate">
                        {batches && batches[batches.length - 1]?.sectionName}
                      </p>
                    </div>
                  </div>
                </div>
                {!student?.alumni && (
                  <div className="flex gap-2 items-center">
                    <p className="w-[120px] font-semibold min-w-0">
                      Current Semester:
                    </p>
                    <p>-</p>
                  </div>
                )}
                {student.alumni && <Badge>Graduated</Badge>}
              </div>
            </div>
            <div className="h-24 w-24 rounded-full border-2 border-gray-300 flex items-center justify-center mt-4 md:mt-0">
              {student?.imgFile ? (
                <Image
                  src={`https://74.207.233.48:8443/hrclIRP/studentimages/${student?.imgFile}`}
                  alt={student?.name || "student-profile-image"}
                  className="h-full w-full rounded-full object-cover"
                  width={100}
                  height={100}
                />
              ) : (
                <User className="h-12 w-12 text-gray-400" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Clock className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-gray-500">Current Semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Classes
            </CardTitle>
            <Calendar className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-500">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Assignments Due
            </CardTitle>
            <FileText className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-gray-500">This Week</p>
          </CardContent>
        </Card>
      </div> */}

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Assignment Submitted",
                  subject: "Data Structures",
                  time: "2 hours ago",
                },
                {
                  title: "Quiz Completed",
                  subject: "Database Management",
                  time: "Yesterday",
                },
                {
                  title: "Class Attended",
                  subject: "Software Engineering",
                  time: "Yesterday",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-500">
                      {activity.subject} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Course Material", icon: BookOpen },
                {
                  title: "University Results",
                  icon: GraduationCap,
                },
                { title: "College Events", icon: CalendarHeart },
                { title: "University Exams", icon: NotebookPen },
              ].map((link, index) => (
                <button
                  key={index}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center gap-2"
                >
                  <link.icon className="w-6 h-6 text-gray-600" />
                  <span className="text-sm font-medium">{link.title}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
