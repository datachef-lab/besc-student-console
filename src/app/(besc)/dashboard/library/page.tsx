"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Search,
  BookMarked,
  BarChart,
  BookOpen,
  ArrowRight,
  User,
  Library,
} from "lucide-react";
import { useStudent } from "@/context/StudentContext";
import { useRouter } from "next/dist/client/components/navigation";
import { IssuedBookDetails } from "@/types/academics/library";

export default function LibraryPage() {
  const { accessControl, student } = useStudent();
  const router = useRouter();
  const [issuedBooks, setIssuedBooks] = useState<IssuedBookDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessControl?.access_course) {
      router.back();
    }
  }, [accessControl, router]);

  useEffect(() => {
    const fetchLibraryData = async () => {
      if (!student?.id) return;

      try {
        setLoading(true);
        const response = await fetch(
          `/api/student/library?studentId=${student.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch library data");
        }
        const data = await response.json();
        setIssuedBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryData();
  }, [student?.id]);

  // Calculate stats
  const activeBooks = issuedBooks.filter((book) => !book.isReturn).length;
  const dueSoonBooks = issuedBooks.filter((book) => {
    if (book.isReturn) return false;
    const returnDate = new Date(book.returnDate);
    const today = new Date();
    const diffDays = Math.ceil(
      (returnDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 7 && diffDays > 0;
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-400 mix-blend-overlay blur-2xl"></div>
          <div className="absolute right-40 top-20 w-32 h-32 rounded-full bg-purple-400 mix-blend-overlay blur-xl"></div>
          <div className="absolute left-20 bottom-10 w-48 h-48 rounded-full bg-indigo-300 mix-blend-overlay blur-2xl"></div>
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center">
            <div className="mr-4 bg-white/10 backdrop-blur-sm p-3 rounded-lg shadow-xl">
              <Library size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-md">
                College Library
              </h1>
              <p className="text-blue-50 text-lg drop-shadow">
                Your digital gateway to knowledge and discovery
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-10">
        {/* Search Bar */}
        <div className="mb-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for books, authors, or topics..."
              className="w-full p-5 pl-14 pr-36 border-none rounded-xl shadow-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
            <Search className="absolute left-5 top-5 text-blue-400" size={22} />
            <button className="absolute right-3 top-3 bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-6 py-2 rounded-lg hover:from-blue-500 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg">
              Search
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-100/80 to-blue-50/80 rounded-xl shadow-sm border border-blue-200 overflow-hidden group hover:shadow-md transform hover:-translate-y-1 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium mb-1">
                    Books Borrowed
                  </p>
                  <div className="flex items-center">
                    <p className="text-3xl font-bold text-blue-700">
                      {activeBooks}
                    </p>
                    <span className="ml-2 text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                </div>
                <div className="bg-blue-200 p-3 rounded-xl group-hover:bg-blue-300/70 transition-all">
                  <BookMarked size={24} className="text-blue-700" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-100/80 to-amber-50/80 rounded-xl shadow-sm border border-amber-200 overflow-hidden group hover:shadow-md transform hover:-translate-y-1 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-700 font-medium mb-1">
                    Due Soon
                  </p>
                  <div className="flex items-center">
                    <p className="text-3xl font-bold text-amber-700">
                      {dueSoonBooks}
                    </p>
                    <span className="ml-2 text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  </div>
                </div>
                <div className="bg-amber-200 p-3 rounded-xl group-hover:bg-amber-300/70 transition-all">
                  <Clock size={24} className="text-amber-700" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-100/80 to-purple-50/80 rounded-xl shadow-sm border border-purple-200 overflow-hidden group hover:shadow-md transform hover:-translate-y-1 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium mb-1">
                    Total Books
                  </p>
                  <div className="flex items-center">
                    <p className="text-3xl font-bold text-purple-700">
                      {issuedBooks.length}
                    </p>
                    <span className="ml-2 text-xs text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                      All Time
                    </span>
                  </div>
                </div>
                <div className="bg-purple-200 p-3 rounded-xl group-hover:bg-purple-300/70 transition-all">
                  <Calendar size={24} className="text-purple-700" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-100/80 to-emerald-50/80 rounded-xl shadow-sm border border-emerald-200 overflow-hidden group hover:shadow-md transform hover:-translate-y-1 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-700 font-medium mb-1">
                    Fine Amount
                  </p>
                  <div className="flex items-center">
                    <p className="text-3xl font-bold text-emerald-700">
                      ₹
                      {issuedBooks.reduce(
                        (sum, book) => sum + (book.fine || 0),
                        0
                      )}
                    </p>
                    <span className="ml-2 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Total
                    </span>
                  </div>
                </div>
                <div className="bg-emerald-200 p-3 rounded-xl group-hover:bg-emerald-300/70 transition-all">
                  <BarChart size={24} className="text-emerald-700" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Loans Section */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 relative overflow-hidden border-b border-blue-100">
            <div className="flex justify-between items-center relative">
              <h2 className="text-xl font-bold text-blue-700 flex items-center">
                <BookOpen className="mr-2 h-6 w-6 text-blue-600" />
                Your Current Loans
              </h2>
              <span className="bg-blue-100/80 text-blue-700 text-sm px-3 py-1.5 rounded-full font-medium">
                {activeBooks} Books
              </span>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-white via-blue-50/10 to-blue-50/20">
            <div className="space-y-8">
              {issuedBooks
                .filter((book) => !book.isReturn)
                .map((book) => (
                  <div
                    key={book.copyId + "-" + book.issueDate}
                    className="flex space-x-6 hover:bg-blue-50/50 p-4 rounded-xl transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="relative w-[100px] min-w-[100px]">
                      <div className="book-cover-shadow absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                      <div className="book-cover relative">
                        <div className="w-full h-[150px] bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-blue-400" />
                        </div>
                        <div className="absolute inset-0 rounded-lg shadow-inner bg-gradient-to-b from-black/10 to-black/20"></div>
                      </div>
                      <div className="absolute -right-3 -top-3 bg-gradient-to-br from-blue-700 to-indigo-800 text-white text-xs px-2 py-1 rounded-lg shadow-lg">
                        {book.subjectgroupName}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-xl text-gray-800">
                          {book.mainTitle}
                        </h3>
                        <div className="text-sm text-gray-500">
                          ISBN: {book.isbn}
                        </div>
                      </div>
                      <div className="flex items-center mt-1.5 text-gray-600">
                        <User className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                        <p>{book.publisherName}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1.5 text-blue-400" />
                          <span>
                            Borrowed:{" "}
                            <span className="font-medium">
                              {new Date(book.issueDate).toLocaleDateString()}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center text-sm font-medium text-amber-500">
                          <Clock className="h-4 w-4 mr-1.5" />
                          <span>
                            Due:{" "}
                            <span className="font-bold">
                              {new Date(book.returnDate).toLocaleDateString()}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:from-blue-500 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg flex items-center">
                          Renew Book
                          <ArrowRight className="ml-1.5 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {activeBooks === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No active book loans found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Issued History Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 relative overflow-hidden border-b border-gray-100">
            <div className="flex justify-between items-center relative">
              <h2 className="text-xl font-bold text-gray-700 flex items-center">
                <BookOpen className="mr-2 h-6 w-6 text-gray-600" />
                Your Issued History
              </h2>
              <span className="bg-gray-100/80 text-gray-700 text-sm px-3 py-1.5 rounded-full font-medium">
                {issuedBooks.filter((book) => book.isReturn).length} Books
              </span>
            </div>
          </div>
          <div className="p-6 bg-gradient-to-br from-white via-gray-50/10 to-gray-50/20">
            <div className="space-y-8">
              {issuedBooks
                .filter((book) => book.isReturn)
                .map((book) => (
                  <div
                    key={book.copyId + "-" + book.issueDate}
                    className="flex space-x-6 hover:bg-gray-50/50 p-4 rounded-xl transition-all group shadow-sm hover:shadow-md"
                  >
                    <div className="relative w-[100px] min-w-[100px]">
                      <div className="book-cover-shadow absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                      <div className="book-cover relative">
                        <div className="w-full h-[150px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-gray-400" />
                        </div>
                        <div className="absolute inset-0 rounded-lg shadow-inner bg-gradient-to-b from-black/10 to-black/20"></div>
                      </div>
                      <div className="absolute -right-3 -top-3 bg-gradient-to-br from-gray-700 to-gray-800 text-white text-xs px-2 py-1 rounded-lg shadow-lg">
                        {book.subjectgroupName}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-xl text-gray-800">
                          {book.mainTitle}
                        </h3>
                        <div className="text-sm text-gray-500">
                          ISBN: {book.isbn}
                        </div>
                      </div>
                      <div className="flex items-center mt-1.5 text-gray-600">
                        <User className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                        <p>{book.publisherName}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                          <span>
                            Borrowed:{" "}
                            <span className="font-medium">
                              {new Date(book.issueDate).toLocaleDateString()}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center text-sm font-medium text-emerald-500">
                          <Clock className="h-4 w-4 mr-1.5" />
                          <span>
                            Returned:{" "}
                            <span className="font-bold">
                              {book.actualRetDate
                                ? new Date(
                                    book.actualRetDate
                                  ).toLocaleDateString()
                                : "-"}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {issuedBooks.filter((book) => book.isReturn).length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No past book loans found.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .book-cover-shadow {
          background: radial-gradient(
            ellipse at center,
            rgba(0, 0, 0, 0.4) 0%,
            rgba(0, 0, 0, 0) 70%
          );
          transform: translateY(10px) rotateX(60deg);
          filter: blur(5px);
        }
      `}</style>
    </div>
  );
}
