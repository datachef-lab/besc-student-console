// import { mysqlConnection } from "@/db";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Clock,
  FileText,
  User,
} from "lucide-react";
import { findStudentByEmail } from "@/lib/services/student";
import Image from "next/image";

export default async function HomePage() {
  const student = await findStudentByEmail("0103123014@thebges.edu.in");

  return (
    <div className="p-6 space-y-6">
      {/* Student Details Card */}
      <Card className="border rounded-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">
                Welcome Back, {student?.name}
              </h1>
              <div className="space-y-1 text-gray-600">
                <p>
                  <b>UID:</b> {student?.name}
                </p>
                <p>
                  <b>Section:</b> {student?.name}
                </p>
                <p>
                  <b>Course</b>: {student?.name}
                </p>
                <p>
                  <b>Current Semester:</b> {student?.name}
                </p>
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
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </div>

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
                { title: "Attendance", icon: Clock },
                { title: "Assignments", icon: FileText },
                { title: "Course Material", icon: BookOpen },
                { title: "Results", icon: GraduationCap },
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
