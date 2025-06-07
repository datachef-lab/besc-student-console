"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

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
    {
      id: 1,
      name: "John Doe",
      formStatus: "Submitted",
      payment: "Paid",
      submittedAt: "2023-05-15",
      category: "General",
      religion: "Hindu",
      nationality: "Indian",
      annualIncome: "5-10 LPA",
      gender: "Male",
      course: "B.Tech",
    },
    {
      id: 2,
      name: "Jane Smith",
      formStatus: "Draft",
      payment: "Pending",
      submittedAt: "2023-05-18",
      category: "OBC",
      religion: "Christian",
      nationality: "Indian",
      annualIncome: "2-5 LPA",
      gender: "Female",
      course: "B.Sc",
    },
    {
      id: 3,
      name: "Robert Johnson",
      formStatus: "Submitted",
      payment: "Paid",
      submittedAt: "2023-05-20",
      category: "SC",
      religion: "Muslim",
      nationality: "Indian",
      annualIncome: "Below 2 LPA",
      gender: "Male",
      course: "B.Com",
    },
    {
      id: 4,
      name: "Emily Davis",
      formStatus: "Submitted",
      payment: "Paid",
      submittedAt: "2023-05-22",
      category: "ST",
      religion: "Sikh",
      nationality: "NRI",
      annualIncome: "Above 10 LPA",
      gender: "Female",
      course: "MBA",
    },
    // Duplicate with unique IDs for demo
    {
      id: 5,
      name: "John Doe",
      formStatus: "Submitted",
      payment: "Paid",
      submittedAt: "2023-05-15",
      category: "General",
      religion: "Hindu",
      nationality: "Indian",
      annualIncome: "5-10 LPA",
      gender: "Male",
      course: "B.Tech",
    },
    {
      id: 6,
      name: "Jane Smith",
      formStatus: "Draft",
      payment: "Pending",
      submittedAt: "2023-05-18",
      category: "OBC",
      religion: "Christian",
      nationality: "Indian",
      annualIncome: "2-5 LPA",
      gender: "Female",
      course: "B.Sc",
    },
    {
      id: 7,
      name: "Robert Johnson",
      formStatus: "Submitted",
      payment: "Paid",
      submittedAt: "2023-05-20",
      category: "SC",
      religion: "Muslim",
      nationality: "Indian",
      annualIncome: "Below 2 LPA",
      gender: "Male",
      course: "B.Com",
    },
    {
      id: 8,
      name: "Emily Davis",
      formStatus: "Submitted",
      payment: "Paid",
      submittedAt: "2023-05-22",
      category: "ST",
      religion: "Sikh",
      nationality: "NRI",
      annualIncome: "Above 10 LPA",
      gender: "Female",
      course: "MBA",
    },
  ];
}

export default function AdmissionPage() {
  const params = useParams();
  const pathname = usePathname();
  const year = pathname.split("/").pop(); // Extract year from route

  // Set dynamic page title
  useEffect(() => {
    document.title = `Admissions - ${year}`;
  }, [year]);

  const [collegeId] = useState(1);
  const [departmentId] = useState<number | undefined>(undefined);
  const [yearRange] = useState<[number, number] | undefined>(undefined);

  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "submittedAt",
    direction: "desc",
  });

  // Filter states
  const [filters, setFilters] = useState({
    category: "",
    religion: "",
    nationality: "",
    annualIncome: "",
    gender: "",
    course: "",
    formStatus: "",
    payment: "",
  });

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
    return data.filter((item) => {
      // Search filter
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toString().includes(searchTerm);

      // Other filters
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return item[key] === value;
      });

      return matchesSearch && matchesFilters;
    });
  }, [data, searchTerm, filters]);

  const sortedData = useMemo(() => {
    const sortableItems = [...filteredData];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setCurrentPage(1);
  };

  // Get unique values for filter dropdowns
  const getUniqueValues = (field: string) => {
    const values = new Set(data.map((item) => item[field]));
    return Array.from(values).filter(Boolean);
  };

  const submittedCount = data.filter(
    (item) => item.formStatus === "Submitted"
  ).length;
  const draftCount = data.filter((item) => item.formStatus === "Draft").length;
  const paidCount = data.filter((item) => item.payment === "Paid").length;

  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => setCurrentPage(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // First page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Ellipsis or more pages
      if (currentPage > 3) {
        items.push(<PaginationEllipsis key="ellipsis-start" />);
      }

      // Middle pages
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => setCurrentPage(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Ellipsis or more pages
      if (currentPage < totalPages - 2) {
        items.push(<PaginationEllipsis key="ellipsis-end" />);
      }

      // Last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Admissions Dashboard - {year}
        </h1>

        {/* Summary Stats */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Applications"
            value={data.length}
            bgColor="bg-blue-50"
            textColor="text-blue-600"
          />
          <StatCard
            label="Payments Completed"
            value={paidCount}
            bgColor="bg-green-50"
            textColor="text-green-600"
          />
          <StatCard
            label="Drafts"
            value={draftCount}
            bgColor="bg-yellow-50"
            textColor="text-yellow-600"
          />
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Filters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <FilterSelect
              label="Category"
              options={getUniqueValues("category")}
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            />
            <FilterSelect
              label="Religion"
              options={getUniqueValues("religion")}
              value={filters.religion}
              onChange={(e) => handleFilterChange("religion", e.target.value)}
            />
            <FilterSelect
              label="Nationality"
              options={getUniqueValues("nationality")}
              value={filters.nationality}
              onChange={(e) =>
                handleFilterChange("nationality", e.target.value)
              }
            />
            <FilterSelect
              label="Annual Income"
              options={getUniqueValues("annualIncome")}
              value={filters.annualIncome}
              onChange={(e) =>
                handleFilterChange("annualIncome", e.target.value)
              }
            />
            <FilterSelect
              label="Gender"
              options={getUniqueValues("gender")}
              value={filters.gender}
              onChange={(e) => handleFilterChange("gender", e.target.value)}
            />
            <FilterSelect
              label="Course"
              options={getUniqueValues("course")}
              value={filters.course}
              onChange={(e) => handleFilterChange("course", e.target.value)}
            />
            <FilterSelect
              label="Form Status"
              options={getUniqueValues("formStatus")}
              value={filters.formStatus}
              onChange={(e) => handleFilterChange("formStatus", e.target.value)}
            />
            <FilterSelect
              label="Payment Status"
              options={getUniqueValues("payment")}
              value={filters.payment}
              onChange={(e) => handleFilterChange("payment", e.target.value)}
            />
          </div>
        </div>

        {/* Search and Pagination Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or ID..."
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

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("name")}
                  >
                    Name
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("formStatus")}
                  >
                    Form Status
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("payment")}
                  >
                    Payment
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("submittedAt")}
                  >
                    Submitted At
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.formStatus === "Submitted"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.formStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.payment === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.payment}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(item.submittedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200">
              <div className="mb-2 sm:mb-0">
                <span className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
                  {filteredData.length} entries
                </span>
              </div>
              <Pagination className="justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        if (currentPage !== 1) {
                          setCurrentPage((p) => Math.max(1, p - 1));
                        }
                      }}
                      aria-disabled={currentPage === 1}
                      tabIndex={currentPage === 1 ? -1 : 0}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {getPaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        if (currentPage !== totalPages) {
                          setCurrentPage((p) => Math.min(totalPages, p + 1));
                        }
                      }}
                      aria-disabled={currentPage === totalPages}
                      tabIndex={currentPage === totalPages ? -1 : 0}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const StatCard = ({
  label,
  value,
  bgColor = "bg-white",
  textColor = "text-gray-900",
}: {
  label: string;
  value: number;
  bgColor?: string;
  textColor?: string;
}) => (
  <div className={`${bgColor} p-4 rounded-lg shadow-sm border border-gray-200`}>
    <div className="text-sm font-medium text-gray-500">{label}</div>
    <div className={`text-2xl font-bold ${textColor}`}>
      {value.toLocaleString()}
    </div>
  </div>
);

const FilterSelect = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: any[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">All</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);
