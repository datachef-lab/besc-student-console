"use client";

import React from "react";
import {
  Calendar,
  Clock,
  FileText,
  BarChart,
  GraduationCap,
  History,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
  upcomingExams: [
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
  recentExams: [
    {
      id: 1,
      name: "Mid-Term Examination",
      subject: "Financial Accounting",
      date: "2024-04-15",
      time: "09:00 AM",
      duration: "3 hours",
      venue: "Hall A",
      status: "Completed",
      score: "85%",
    },
    {
      id: 2,
      name: "Internal Assessment",
      subject: "Business Economics",
      date: "2024-04-18",
      time: "02:00 PM",
      duration: "1.5 hours",
      venue: "Room 201",
      status: "Completed",
      score: "90%",
    },
    {
      id: 3,
      name: "Practical Examination",
      subject: "Computer Applications",
      date: "2024-04-20",
      time: "10:00 AM",
      duration: "2 hours",
      venue: "Computer Lab",
      status: "Completed",
      score: "95%",
    },
  ],
  previousExams: [
    {
      id: 1,
      name: "Mid-Term Examination",
      subject: "Financial Accounting",
      date: "2023-12-15",
      time: "09:00 AM",
      duration: "3 hours",
      venue: "Hall A",
      status: "Passed",
      score: "75%",
    },
    {
      id: 2,
      name: "Internal Assessment",
      subject: "Business Economics",
      date: "2023-12-18",
      time: "02:00 PM",
      duration: "1.5 hours",
      venue: "Room 201",
      status: "Passed",
      score: "80%",
    },
    {
      id: 3,
      name: "Practical Examination",
      subject: "Computer Applications",
      date: "2023-12-20",
      time: "10:00 AM",
      duration: "2 hours",
      venue: "Computer Lab",
      status: "Passed",
      score: "85%",
    },
  ],
};

export default function ExamsContent() {
  const [selectedSemester, setSelectedSemester] = React.useState("1");

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
                <GraduationCap
                  size={36}
                  className="text-white drop-shadow-md"
                />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-md">
                  Exams Dashboard
                </h1>
                <p className="text-blue-50 text-lg drop-shadow max-w-2xl">
                  Track your examinations and academic performance
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

      <div className="max-w-7xl mx-auto px-6 pb-12">
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">
                      Upcoming Exams
                    </p>
                    <p className="text-3xl font-bold text-blue-700">3</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                    <Calendar size={24} className="text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-amber-100">
              <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
                    <p className="text-sm text-amber-600 font-medium">
                      Next Exam
                    </p>
                    <p className="text-3xl font-bold text-amber-700">2 days</p>
            </div>
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                    <Clock size={24} className="text-amber-600" />
            </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">
                      Total Subjects
                    </p>
                    <p className="text-3xl font-bold text-purple-700">6</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                    <FileText size={24} className="text-purple-600" />
          </div>
        </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="border-2 border-emerald-200 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-emerald-100">
              <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
                    <p className="text-sm text-emerald-600 font-medium">
                      Average Score
                    </p>
                    <p className="text-3xl font-bold text-emerald-700">78%</p>
            </div>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <BarChart size={24} className="text-emerald-600" />
            </div>
          </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Exams Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-8"
        >
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-indigo-50/60 p-1 mb-8">
              <TabsTrigger
                value="upcoming"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Upcoming
              </TabsTrigger>
              <TabsTrigger
                value="recent"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
              >
                <Clock className="w-4 h-4 mr-2" />
                Recent
              </TabsTrigger>
              <TabsTrigger
                value="previous"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
              >
                <History className="w-4 h-4 mr-2" />
                Previous
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {mockData.upcomingExams.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="border border-indigo-100 shadow-md hover:shadow-lg transition-all overflow-hidden group">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-start gap-4 w-full md:w-auto">
                          <div className="bg-blue-50 p-3 rounded-lg flex-shrink-0">
                            <Calendar className="w-6 h-6 text-blue-600" />
                          </div>
            <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {exam.name}
                            </h3>
                            <p className="text-blue-600 font-medium mb-2">
                              {exam.subject}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                                {exam.date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                                {exam.time}
                              </div>
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 mr-1.5 text-gray-400" />
                                {exam.duration}
                              </div>
                              <div className="flex items-center">
                                <BarChart className="w-4 h-4 mr-1.5 text-gray-400" />
                                {exam.venue}
            </div>
            </div>
          </div>
        </div>
                        <div className="mt-3 md:mt-0">
                          <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {exam.status}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="recent" className="space-y-4">
              {mockData.recentExams.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="border border-emerald-100 shadow-md hover:shadow-lg transition-all overflow-hidden group">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-start gap-4 w-full md:w-auto">
                          <div className="bg-emerald-50 p-3 rounded-lg flex-shrink-0">
                            <GraduationCap className="w-6 h-6 text-emerald-600" />
                          </div>
            <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {exam.name}
                            </h3>
                            <p className="text-emerald-600 font-medium mb-2">
                              {exam.subject}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                                {exam.date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                                {exam.time}
                              </div>
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 mr-1.5 text-gray-400" />
                                {exam.duration}
            </div>
                              <div className="flex items-center">
                                <BarChart className="w-4 h-4 mr-1.5 text-gray-400" />
                                {exam.venue}
            </div>
          </div>
        </div>
      </div>
                        <div className="flex flex-col items-end gap-3">
                          <div className="bg-emerald-50 px-5 py-2 rounded-lg border border-emerald-100 text-center">
                            <span className="text-xl font-bold text-emerald-600">
                              {exam.score}
                            </span>
                            <p className="text-xs text-emerald-600 font-medium">
                              Score
                            </p>
                    </div>
                          <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {exam.status}
                          </span>
                  </div>
                </div>
              </CardContent>
            </Card>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="previous" className="space-y-4">
              {mockData.previousExams.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-all overflow-hidden group">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-start gap-4 w-full md:w-auto">
                          <div className="bg-gray-100 p-3 rounded-lg flex-shrink-0">
                            <FileText className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {exam.name}
                            </h3>
                            <p className="text-gray-600 font-medium mb-2">
                              {exam.subject}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                                {exam.date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                                {exam.time}
                              </div>
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 mr-1.5 text-gray-400" />
                                {exam.duration}
                              </div>
                              <div className="flex items-center">
                                <BarChart className="w-4 h-4 mr-1.5 text-gray-400" />
                                {exam.venue}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <div className="bg-gray-100 px-5 py-2 rounded-lg border border-gray-200 text-center">
                            <span className="text-xl font-bold text-gray-700">
                              {exam.score}
                            </span>
                            <p className="text-xs text-gray-600 font-medium">
                              Score
                            </p>
                          </div>
                          <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            {exam.status}
                          </span>
                        </div>
        </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
