"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  // Robust solution to prevent white flash
  useEffect(() => {
    // Apply styles directly to document
    document.documentElement.style.backgroundColor = "#1e1b4b";
    document.body.style.backgroundColor = "#1e1b4b";

    // Create a style element with !important rules
    const style = document.createElement("style");
    style.innerHTML = `
      html, body {
        background-color: #1e1b4b !important;
        color: white !important;
      }
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      document.documentElement.style.backgroundColor = "";
      document.body.style.backgroundColor = "";
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-900 text-white">
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 opacity-30 -z-10"></div>
      <div className="absolute inset-x-0 top-1/3 h-96 bg-gradient-to-r from-cyan-200 via-teal-200 to-blue-200 opacity-30 -z-10"></div>
      <div className="absolute inset-x-0 top-2/3 h-96 bg-gradient-to-r from-amber-200 via-orange-200 to-rose-200 opacity-30 -z-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation */}
        <nav className="flex justify-between items-center py-4 mb-12 relative">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-indigo-950"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold text-white">BESC Student</span>
              <div className="text-xs uppercase tracking-wider text-yellow-500">
                CONSOLE
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="flex items-center gap-1 text-white hover:text-yellow-400 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>Settings</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-indigo-800 border border-indigo-700 rounded-lg shadow-lg py-1 hidden group-hover:block z-10">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-white hover:bg-indigo-700"
                >
                  Profile
                </Link>
                <Link
                  href="/preferences"
                  className="block px-4 py-2 text-sm text-white hover:bg-indigo-700"
                >
                  Preferences
                </Link>
                <div className="border-t border-indigo-700 my-1"></div>
                <Link
                  href="/logout"
                  className="block px-4 py-2 text-sm text-yellow-400 hover:bg-indigo-700 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </Link>
              </div>
            </div>
            <Link href="/sign-in">
              <Button className="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-indigo-950 font-semibold rounded-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-16 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6 text-left">
            <div className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-medium mb-2">
              Student Portal v2.0
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
              Empower your{" "}
              <span className="text-yellow-400">academic journey</span>
            </h1>
            <p className="text-lg text-indigo-100 max-w-xl">
              Access your courses, assignments, and resources in one centralized
              platform designed to enhance your educational experience.
            </p>
            <div className="flex items-center gap-2 text-indigo-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Real-time Updates</span>
              <span className="mx-2">•</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Mobile Access</span>
              <span className="mx-2">•</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Secure</span>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="bg-indigo-800/50 border border-indigo-700 p-8 rounded-3xl">
              <div className="space-y-4">
                <div className="bg-indigo-700/50 p-4 rounded-xl border border-indigo-600">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-indigo-950"
                        >
                          <rect width="18" height="18" x="3" y="3" rx="2" />
                          <path d="M3 9h18" />
                          <path d="M9 21V9" />
                        </svg>
                      </div>
                      <span className="font-medium">Course Materials</span>
                    </div>
                  </div>
                  <p className="mt-2 text-indigo-200 text-sm">
                    Access all your study materials, textbooks, and lecture
                    notes in one place.
                  </p>
                </div>
                <div className="bg-indigo-700/50 p-4 rounded-xl border border-indigo-600">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-indigo-950"
                        >
                          <path d="M3 3v18h18" />
                          <path d="m19 9-5 5-4-4-3 3" />
                        </svg>
                      </div>
                      <span className="font-medium">Progress Tracking</span>
                    </div>
                  </div>
                  <p className="mt-2 text-indigo-200 text-sm">
                    Monitor your academic performance, attendance, and upcoming
                    assessments.
                  </p>
                </div>
                <div className="bg-yellow-500/20 p-4 rounded-xl border border-yellow-500/30 relative">
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-yellow-400"
                    >
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    Upcoming Classes Notifications
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        <span className="text-indigo-100">
                          Database Systems
                        </span>
                      </div>
                      <span className="text-yellow-400 font-medium">
                        10:00 AM Today
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        <span className="text-indigo-100">Web Development</span>
                      </div>
                      <span className="text-yellow-400 font-medium">
                        2:00 PM Today
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                        <span className="text-indigo-100">Data Structures</span>
                      </div>
                      <span className="text-yellow-400 font-medium">
                        9:30 AM Tomorrow
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 relative">
          <div className="text-center mb-16 relative">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Powerful Tools for Academic Success
            </h2>
            <p className="text-lg text-indigo-200 max-w-2xl mx-auto">
              Everything you need to excel in your academic journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Library Resources",
                description:
                  "Access digital books, journals, and research papers from our extensive collection",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-indigo-950"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                ),
              },
              {
                title: "Exam Portal",
                description:
                  "Prepare for and take online exams with our secure testing environment",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-indigo-950"
                  >
                    <path d="M12 22a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
                    <path d="M12 2v7" />
                    <path d="M12 13v2" />
                    <path d="m9 4 1 1" />
                    <path d="m15 4-1 1" />
                  </svg>
                ),
              },
              {
                title: "Attendance Tracking",
                description:
                  "Monitor your class attendance and receive notifications for upcoming sessions",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-indigo-950"
                  >
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <path d="M3 10h18" />
                    <path d="M9 16h6" />
                  </svg>
                ),
              },
              {
                title: "Study Materials",
                description:
                  "Access lecture notes, presentations, and supplementary learning resources",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-indigo-950"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                ),
              },
              {
                title: "Grade Management",
                description:
                  "View your grades, assessment feedback, and track your academic progress",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-indigo-950"
                  >
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                ),
              },
              {
                title: "Discussion Forums",
                description:
                  "Collaborate with peers and instructors through course-specific discussion boards",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-indigo-950"
                  >
                    <path d="M17 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2v4l-4-4H9a2 2 0 0 1-2-2v-1" />
                    <path d="M7 15H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2" />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-indigo-800/50 border border-indigo-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-xl mb-4 bg-yellow-500 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-indigo-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-indigo-800">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-indigo-950"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">
                BESC Student Portal
              </span>
            </div>
            <div className="flex gap-6 mb-4">
              <span className="text-indigo-300 text-sm hover:text-yellow-400 cursor-pointer">
                Privacy Policy
              </span>
              <span className="text-indigo-300 text-sm hover:text-yellow-400 cursor-pointer">
                Terms of Use
              </span>
            </div>
            <p className="text-indigo-400 text-sm text-center">
              © {new Date().getFullYear()} BESC Student Portal. All rights
              reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
