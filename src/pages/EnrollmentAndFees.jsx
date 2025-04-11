<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Enrollment Status Card */}
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-blue-900">Enrollment Status</h3>
      <div className="p-2 bg-blue-100 rounded-lg">
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-blue-600 font-medium">Current Semester</p>
        <p className="text-2xl font-bold text-blue-900">2024 Spring</p>
      </div>
      <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
        Active
      </span>
    </div>
  </div>

  {/* Academic Progress Card */}
  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-purple-100">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-purple-900">
        Academic Progress
      </h3>
      <div className="p-2 bg-purple-100 rounded-lg">
        <svg
          className="w-6 h-6 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      </div>
    </div>
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm text-purple-600 font-medium">
            Credits Completed
          </span>
          <span className="text-sm text-purple-900 font-medium">75/120</span>
        </div>
        <div className="w-full bg-purple-100 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full"
            style={{ width: "62.5%" }}
          ></div>
        </div>
      </div>
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm text-purple-600 font-medium">GPA</span>
          <span className="text-sm text-purple-900 font-medium">3.8/4.0</span>
        </div>
        <div className="w-full bg-purple-100 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full"
            style={{ width: "95%" }}
          ></div>
        </div>
      </div>
    </div>
  </div>

  {/* Financial Summary Card */}
  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 shadow-lg border border-emerald-100">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-emerald-900">
        Financial Summary
      </h3>
      <div className="p-2 bg-emerald-100 rounded-lg">
        <svg
          className="w-6 h-6 text-emerald-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-emerald-600">Tuition Due</span>
        <span className="text-lg font-bold text-emerald-900">$12,500</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-emerald-600">Scholarships</span>
        <span className="text-lg font-bold text-emerald-900">$5,000</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-emerald-600">Balance</span>
        <span className="text-lg font-bold text-emerald-900">$7,500</span>
      </div>
    </div>
  </div>
</div>;

{
  /* Payment History Section */
}
<div className="mt-8">
  <h2 className="text-xl font-bold text-gray-800 mb-4">Payment History</h2>
  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-lg border border-amber-100">
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-amber-200">
            <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-amber-700 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-amber-200">
          <tr className="hover:bg-amber-50/50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">
              Jan 15, 2024
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">
              Spring Tuition
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">
              $12,500
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                Paid
              </span>
            </td>
          </tr>
          <tr className="hover:bg-amber-50/50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">
              Dec 10, 2023
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">
              Fall Tuition
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-900">
              $12,500
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                Paid
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>;

{
  /* Important Dates Section */
}
<div className="mt-8">
  <h2 className="text-xl font-bold text-gray-800 mb-4">Important Dates</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-rose-100">
      <h3 className="text-lg font-semibold text-rose-900 mb-4">Spring 2024</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-rose-600">Registration Deadline</span>
          <span className="text-sm font-medium text-rose-900">
            Jan 20, 2024
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-rose-600">Payment Due</span>
          <span className="text-sm font-medium text-rose-900">
            Jan 25, 2024
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-rose-600">Classes Start</span>
          <span className="text-sm font-medium text-rose-900">
            Jan 30, 2024
          </span>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-br from-cyan-50 to-sky-50 rounded-2xl p-6 shadow-lg border border-cyan-100">
      <h3 className="text-lg font-semibold text-cyan-900 mb-4">Fall 2024</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-cyan-600">Registration Opens</span>
          <span className="text-sm font-medium text-cyan-900">Apr 1, 2024</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-cyan-600">Early Registration</span>
          <span className="text-sm font-medium text-cyan-900">
            Apr 15, 2024
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-cyan-600">Classes Start</span>
          <span className="text-sm font-medium text-cyan-900">
            Aug 26, 2024
          </span>
        </div>
      </div>
    </div>
  </div>
</div>;
