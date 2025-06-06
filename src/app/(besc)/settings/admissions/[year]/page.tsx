"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

// Simulated API data fetcher
async function fetchAdmissionsData({
  collegeId,
  departmentId,
  yearRange,
}: {
  collegeId?: number;
  departmentId?: number;
  yearRange?: [number, number];
}) {
  // In real implementation, make API call here
  return [
    { year: 2020, totalApplications: 300, paymentsDone: 200, drafts: 100 },
    { year: 2021, totalApplications: 320, paymentsDone: 250, drafts: 70 },
    { year: 2022, totalApplications: 310, paymentsDone: 270, drafts: 40 },
    { year: 2023, totalApplications: 400, paymentsDone: 390, drafts: 10 },
  ];
}

export default function AdmissionPage() {
  const [collegeId] = useState(1); // Can be controlled via props
  const [departmentId] = useState<number | undefined>(undefined);
  const [yearRange] = useState<[number, number] | undefined>(undefined);

  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof (typeof data)[0] | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchAdmissionsData({
        collegeId,
        departmentId,
        yearRange,
      });
      setData(result);
    };
    fetchData();
  }, [collegeId, departmentId, yearRange]);

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.year.toString().includes(searchTerm.trim())
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      return sortOrder === "asc" ? valA - valB : valB - valA;
    });
  }, [filteredData, sortField, sortOrder]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (field: keyof (typeof data)[0]) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: keyof (typeof data)[0]) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? "▲" : "▼";
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Admissions Data
        </h1> */}

        {/* Search and Pagination Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by year..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Total Years" value={sortedData.length} />
          <StatCard
            label="Total Applications"
            value={sortedData.reduce((sum, x) => sum + x.totalApplications, 0)}
          />
          <StatCard
            label="Total Payments"
            value={sortedData.reduce((sum, x) => sum + x.paymentsDone, 0)}
          />
          <StatCard
            label="Total Drafts"
            value={sortedData.reduce((sum, x) => sum + x.drafts, 0)}
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <Th>Sr No</Th>
                  <Th onClick={() => handleSort("year")}>
                    Admission Year {getSortIcon("year")}
                  </Th>
                  <Th onClick={() => handleSort("totalApplications")}>
                    Applications {getSortIcon("totalApplications")}
                  </Th>
                  <Th onClick={() => handleSort("paymentsDone")}>
                    Payments {getSortIcon("paymentsDone")}
                  </Th>
                  <Th onClick={() => handleSort("drafts")}>
                    Drafts {getSortIcon("drafts")}
                  </Th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((item, index) => (
                  <tr key={item.year}>
                    <Td>{(currentPage - 1) * itemsPerPage + index + 1}</Td>
                    <Td>{item.year}</Td>
                    <Td>{item.totalApplications.toLocaleString()}</Td>
                    <Td>
                      {item.paymentsDone.toLocaleString()} (
                      {Math.round(
                        (item.paymentsDone / item.totalApplications) * 100
                      )}
                      %)
                    </Td>
                    <Td>
                      {item.drafts.toLocaleString()} (
                      {Math.round((item.drafts / item.totalApplications) * 100)}
                      %)
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 flex justify-between items-center">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="text-sm px-4 py-2 border rounded disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 inline" /> Prev
              </button>
              <div className="flex gap-2">
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`text-sm px-3 py-1 border rounded ${
                      currentPage === page ? "bg-blue-100 text-blue-700" : ""
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="text-sm px-4 py-2 border rounded disabled:opacity-50"
              >
                Next <ChevronRight className="w-4 h-4 inline" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <div className="text-sm font-medium text-gray-500">{label}</div>
    <div className="text-2xl font-bold text-gray-900">
      {value.toLocaleString()}
    </div>
  </div>
);

const Th = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <th
    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
    onClick={onClick}
  >
    {children}
  </th>
);

const Td = ({ children }: { children: React.ReactNode }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
    {children}
  </td>
);
