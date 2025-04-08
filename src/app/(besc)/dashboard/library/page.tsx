import React from "react";
import { Calendar, Clock, Search, BookMarked, BarChart } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Library Dashboard",
};

export default function LibraryPage() {
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
    },
    {
      id: 2,
      title: "Klara and the Sun",
      author: "Kazuo Ishiguro",
      borrowDate: "2025-03-30",
      dueDate: "2025-04-20",
      cover:
        "https://m.media-amazon.com/images/I/61tqFlvlU3L._AC_UF1000,1000_QL80_.jpg",
    },
    {
      id: 3,
      title: "Project Hail Mary",
      author: "Andy Weir",
      borrowDate: "2025-04-02",
      dueDate: "2025-04-23",
      cover: "https://m.media-amazon.com/images/I/81gYjHx8YmL.jpg",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for books, authors, or topics..."
              className="w-full p-3 pl-10 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Books Borrowed</p>
                <p className="text-2xl font-bold">7</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BookMarked size={20} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Due Soon</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Clock size={20} className="text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Reservations</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Calendar size={20} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Reading Hours</p>
                <p className="text-2xl font-bold">28</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <BarChart size={20} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Sections */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold mb-4">Your Current Loans</h2>

            <div className="space-y-4">
              {recentBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex space-x-4 border-b border-gray-100 pb-4"
                >
                  <Image
                    src={book.cover}
                    alt={book.title}
                    className="rounded shadow-sm"
                    width={90}
                    height={140}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{book.title}</h3>
                    <p className="text-gray-600">{book.author}</p>
                    <div className="mt-2 flex flex-col sm:flex-row sm:justify-between">
                      <p className="text-sm text-gray-500">
                        Borrowed: {book.borrowDate}
                      </p>
                      <p className="text-sm text-red-500 font-medium">
                        Due: {book.dueDate}
                      </p>
                    </div>
                    <div className="mt-3">
                      <button className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-100">
                        Renew
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <button className="text-indigo-600 font-medium text-sm hover:text-indigo-800">
                View All Loans
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
