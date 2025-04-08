"use client";

import React from "react";
import { Calendar, Clock, FileText, BarChart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

// Mock data for demonstration
const mockData = {
  semesters: [1, 2, 3, 4, 5, 6, 7, 8],
  exams: [
    {
      id: 1,
      name: "Mid-Term Examination",
      subject: "Financial Accounting",
      date: "2024-04-15",
      time: "09:00 AM",
      duration: "3 hours",
      venue: "Hall A",
      status: "Upcoming",
    },
    {
      id: 2,
      name: "Internal Assessment",
      subject: "Business Economics",
      date: "2024-04-18",
      time: "02:00 PM",
      duration: "1.5 hours",
      venue: "Room 201",
      status: "Upcoming",
    },
    {
      id: 3,
      name: "Practical Examination",
      subject: "Computer Applications",
      date: "2024-04-20",
      time: "10:00 AM",
      duration: "2 hours",
      venue: "Computer Lab",
      status: "Upcoming",
    },
  ],
};

export default function ExamsContent() {
  const [selectedSemester, setSelectedSemester] = React.useState("1");

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold">Exams Dashboard</h1>

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Upcoming Exams</p>
              <p className="text-2xl font-bold">3</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Next Exam</p>
              <p className="text-2xl font-bold">2 days</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Clock size={20} className="text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Subjects</p>
              <p className="text-2xl font-bold">6</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FileText size={20} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Score</p>
              <p className="text-2xl font-bold">78%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <BarChart size={20} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Exams Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold mb-4">Upcoming Examinations</h2>
        <div className="space-y-4">
          {mockData.exams.map((exam) => (
            <Card key={exam.id} className="border-gray-100">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium text-lg">{exam.name}</h3>
                    <p className="text-gray-600">{exam.subject}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Date: {exam.date}</span>
                      <span>Time: {exam.time}</span>
                      <span>Duration: {exam.duration}</span>
                    </div>
                    <p className="text-sm text-gray-500">Venue: {exam.venue}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
