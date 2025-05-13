"use client";

import React, { useEffect } from "react";
import {
  Calendar,
  Clock,
  Search,
  BookMarked,
  BarChart,
  BookOpen,
  BookCopy,
  ArrowRight,
  Star,
  User,
  Library,
} from "lucide-react";
import Image from "next/image";
import { useStudent } from "@/context/StudentContext";
import { useRouter } from "next/dist/client/components/navigation";

export default function LibraryPage() {
  const { accessControl } = useStudent();
  const router = useRouter();
  useEffect(() => {
    if (!accessControl?.access_course) {
      router.back();
    }
  }, [accessControl, router]);
  // Sample data
  const recentBooks = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      borrowDate: "2025-03-28",
      dueDate: "2025-04-18",
      cover:
        "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1602190253l/52578297.jpg",
      category: "Fiction",
      rating: 4.5,
    },
    {
      id: 2,
      title: "Klara and the Sun",
      author: "Kazuo Ishiguro",
      borrowDate: "2025-03-30",
      dueDate: "2025-04-20",
      cover:
        "https://m.media-amazon.com/images/I/61tqFlvlU3L._AC_UF1000,1000_QL80_.jpg",
      category: "Science Fiction",
      rating: 4.2,
    },
    {
      id: 3,
      title: "Project Hail Mary",
      author: "Andy Weir",
      borrowDate: "2025-04-02",
      dueDate: "2025-04-23",
      cover: "https://m.media-amazon.com/images/I/81gYjHx8YmL.jpg",
      category: "Science Fiction",
      rating: 4.7,
    },
  ];

  const recommendedBooks = [
    {
      id: 4,
      title: "Atomic Habits",
      author: "James Clear",
      cover:
        "https://m.media-amazon.com/images/I/81wgcld4wxL._AC_UF894,1000_QL80_.jpg",
      category: "Self-Help",
      rating: 4.8,
    },
    {
      id: 5,
      title: "Educated",
      author: "Tara Westover",
      cover:
        "https://m.media-amazon.com/images/I/71B-XC38kLL._AC_UF1000,1000_QL80_.jpg",
      category: "Biography",
      rating: 4.5,
    },
    {
      id: 6,
      title: "The Song of Achilles",
      author: "Madeline Miller",
      cover:
        "https://m.media-amazon.com/images/I/81kxw4aF4OL._AC_UF1000,1000_QL80_.jpg",
      category: "Fiction",
      rating: 4.6,
    },
  ];

  // Function to render star ratings
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              className={`${
                i < Math.floor(rating)
                  ? "text-amber-400 fill-amber-400"
                  : i < rating
                  ? "text-amber-400 fill-amber-400 opacity-50"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="ml-1 text-xs text-gray-500">{rating}</span>
      </div>
    );
  };

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
                    <p className="text-3xl font-bold text-blue-700">7</p>
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
                    <p className="text-3xl font-bold text-amber-700">3</p>
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
                    Reservations
                  </p>
                  <div className="flex items-center">
                    <p className="text-3xl font-bold text-purple-700">2</p>
                    <span className="ml-2 text-xs text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                      Reserved
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
                    Reading Hours
                  </p>
                  <div className="flex items-center">
                    <p className="text-3xl font-bold text-emerald-700">28</p>
                    <span className="ml-2 text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      This Week
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

        {/* Dual Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Loans Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 relative overflow-hidden border-b border-blue-100">
                <div className="flex justify-between items-center relative">
                  <h2 className="text-xl font-bold text-blue-700 flex items-center">
                    <BookOpen className="mr-2 h-6 w-6 text-blue-600" />
                    Your Current Loans
                  </h2>
                  <span className="bg-blue-100/80 text-blue-700 text-sm px-3 py-1.5 rounded-full font-medium">
                    {recentBooks.length} Books
                  </span>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-white via-blue-50/10 to-blue-50/20">
                <div className="space-y-8">
                  {recentBooks.map((book) => (
                    <div
                      key={book.id}
                      className="flex space-x-6 hover:bg-blue-50/50 p-4 rounded-xl transition-all group shadow-sm hover:shadow-md"
                    >
                      <div className="relative w-[100px] min-w-[100px]">
                        <div className="book-cover-shadow absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                        <div className="book-cover relative">
                          <Image
                            src={book.cover}
                            alt={book.title}
                            className="rounded-lg shadow-xl object-cover w-full h-[150px] transform group-hover:scale-105 transition-transform duration-300"
                            width={100}
                            height={150}
                            style={{ objectFit: "cover" }}
                          />
                          <div className="absolute inset-0 rounded-lg shadow-inner bg-gradient-to-b from-black/10 to-black/20"></div>
                        </div>
                        <div className="absolute -right-3 -top-3 bg-gradient-to-br from-blue-700 to-indigo-800 text-white text-xs px-2 py-1 rounded-lg shadow-lg">
                          {book.category}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-bold text-xl text-gray-800">
                            {book.title}
                          </h3>
                          {renderRating(book.rating)}
                        </div>
                        <div className="flex items-center mt-1.5 text-gray-600">
                          <User className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                          <p>{book.author}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between bg-blue-50 rounded-lg p-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1.5 text-blue-400" />
                            <span>
                              Borrowed:{" "}
                              <span className="font-medium">
                                {book.borrowDate}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center text-sm font-medium text-amber-500">
                            <Clock className="h-4 w-4 mr-1.5" />
                            <span>
                              Due:{" "}
                              <span className="font-bold">{book.dueDate}</span>
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

                <div className="mt-8 text-center">
                  <button className="inline-flex items-center text-indigo-500 font-medium hover:text-indigo-600 transition-colors border border-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-50">
                    View All Loans
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Books Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden h-full">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-5 relative overflow-hidden border-b border-purple-100">
                <div className="flex justify-between items-center relative">
                  <h2 className="text-xl font-bold text-purple-700 flex items-center">
                    <BookCopy className="mr-2 h-6 w-6 text-purple-600" />
                    For You
                  </h2>
                  <span className="bg-purple-100/80 text-purple-700 text-xs px-2 py-1 rounded-full">
                    Recommendations
                  </span>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-white via-purple-50/10 to-purple-50/20">
                <div className="space-y-6">
                  {recommendedBooks.map((book) => (
                    <div
                      key={book.id}
                      className="flex space-x-4 hover:bg-purple-50/50 p-4 rounded-xl transition-all group shadow-sm hover:shadow-md"
                    >
                      <div className="relative w-[80px] min-w-[80px]">
                        <div className="book-cover-shadow absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                        <div className="relative">
                          <Image
                            src={book.cover}
                            alt={book.title}
                            className="rounded-lg shadow-xl object-cover w-full h-[120px] transform group-hover:scale-105 transition-transform duration-300"
                            width={80}
                            height={120}
                            style={{ objectFit: "cover" }}
                          />
                          <div className="absolute inset-0 rounded-lg shadow-inner bg-gradient-to-b from-black/10 to-black/20"></div>
                        </div>
                        <div className="absolute -right-2 -top-2 w-6 h-6 bg-gradient-to-br from-purple-700 to-purple-800 rounded-full flex items-center justify-center shadow-lg">
                          <Star size={12} className="text-white fill-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="inline-block mb-1.5">
                          <span className="text-xs font-medium text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full">
                            {book.category}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-800 leading-tight">
                          {book.title}
                        </h3>
                        <p className="text-gray-600 text-sm">{book.author}</p>
                        <div className="mt-1">{renderRating(book.rating)}</div>
                        <button className="mt-2 text-purple-500 text-sm font-medium hover:text-purple-600 transition-colors bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-lg inline-flex items-center">
                          Reserve <ArrowRight className="ml-1 h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <button className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:from-purple-500 hover:to-pink-500 transition-all shadow-md hover:shadow-lg w-full">
                    Explore More Books
                  </button>
                </div>
              </div>
            </div>
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
