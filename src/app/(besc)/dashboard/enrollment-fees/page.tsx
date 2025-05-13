"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Receipt,
  CreditCard,
  School,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Instalment } from "@/types/fees/instalment";
import { useStudent } from "@/context/StudentContext";

export default function FeesPage() {
  const { student } = useStudent();
  const [loading, setLoading] = useState(true);
  const [selectedFeeType, setSelectedFeeType] = useState<string | null>(null);
  const [groupedInstalments, setGroupedInstalments] = useState<
    Record<string, Instalment[]>
  >({});
  const [feeSummaries, setFeeSummaries] = useState<
    Record<string, { total: number; paid: number; status: string }>
  >({});

  // Simulate API call to fetch fees data
  useEffect(() => {
    const fetchInstalments = async () => {
      try {
        // In a real application, fetch from API
        const response = await fetch(`/api/fees?studentId=${student?.id || 0}`);
        const data = (await response.json()) as Instalment[];

        // Group instalments by receipt type
        const grouped = data.reduce((acc, instalment) => {
          const key = instalment.metadata.receiptTypeName;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(instalment);
          return acc;
        }, {} as Record<string, Instalment[]>);

        setGroupedInstalments(grouped);

        // Calculate fee summaries
        const summaries: Record<
          string,
          { total: number; paid: number; status: string }
        > = {};

        Object.entries(grouped).forEach(([feeType, instalments]) => {
          const total = instalments.reduce((sum, inst) => sum + inst.amount, 0);
          const paid = instalments
            .filter((inst) => inst.hasPaid)
            .reduce((sum, inst) => sum + inst.amount, 0);

          let status = "pending";
          if (paid === total) {
            status = "paid";
          } else if (paid > 0) {
            status = "partially_paid";
          } else {
            // Check if any instalment is overdue
            const hasOverdue = instalments.some(
              (inst) =>
                !inst.hasPaid &&
                inst.metadata.lastDate &&
                new Date(inst.metadata.lastDate) < new Date()
            );
            if (hasOverdue) {
              status = "overdue";
            }
          }

          summaries[feeType] = { total, paid, status };
        });

        setFeeSummaries(summaries);
      } catch (error) {
        console.error("Error fetching instalments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (student?.id) {
      fetchInstalments();
    }
  }, [student]);

  const formatDate = (dateString: string | Date | null): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusInfo = (instalment: Instalment) => {
    if (instalment.cancelled) {
      return {
        status: "cancelled",
        color: "bg-gray-100 text-gray-800",
        icon: <AlertCircle className="w-4 h-4 text-gray-600" />,
      };
    }

    if (instalment.hasPaid) {
      return {
        status: "paid",
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-4 h-4 text-green-600" />,
      };
    }

    const lastDate = instalment.metadata.lastDate
      ? new Date(instalment.metadata.lastDate)
      : null;

    if (lastDate && lastDate < new Date()) {
      return {
        status: "overdue",
        color: "bg-red-100 text-red-800",
        icon: <AlertCircle className="w-4 h-4 text-red-600" />,
      };
    }

    return {
      status: "pending",
      color: "bg-yellow-100 text-yellow-800",
      icon: <Clock className="w-4 h-4 text-yellow-600" />,
    };
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "partially_paid":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "partially_paid":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "overdue":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "cancelled":
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const handleCardClick = (feeType: string): void => {
    if (selectedFeeType === feeType) {
      setSelectedFeeType(null);
    } else {
      setSelectedFeeType(feeType);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-400 mix-blend-overlay blur-2xl"></div>
          <div className="absolute right-40 top-20 w-32 h-32 rounded-full bg-purple-400 mix-blend-overlay blur-xl"></div>
          <div className="absolute left-20 bottom-10 w-48 h-48 rounded-full bg-indigo-300 mix-blend-overlay blur-2xl"></div>
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center">
            <div className="mr-6 bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-white/10">
              <School size={40} className="text-white drop-shadow-md" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-3 text-white drop-shadow-md">
                Fees & Instalments
              </h1>
              <p className="text-blue-50 text-xl drop-shadow max-w-2xl">
                Track your fee payments and upcoming instalments all in one
                place
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-16 relative z-10">
        <div className="space-y-8">
          {selectedFeeType !== null ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setSelectedFeeType(null)}
              ></div>
              <Card className="w-full max-w-4xl max-h-[90vh] cursor-pointer bg-white border-none rounded-2xl shadow-2xl overflow-hidden relative z-10">
                {(() => {
                  const instalments = groupedInstalments[selectedFeeType] || [];
                  const summary = feeSummaries[selectedFeeType] || {
                    total: 0,
                    paid: 0,
                    status: "pending",
                  };

                  return (
                    <>
                      <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 sticky top-0 z-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-2 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600"></div>
                              <CardTitle className="text-2xl md:text-3xl font-bold text-blue-800">
                                {selectedFeeType}
                              </CardTitle>
                            </div>
                            {instalments.length > 0 && (
                              <p className="text-lg text-blue-600 flex items-center gap-2 pl-5">
                                <Calendar className="h-5 w-5 text-blue-500" />
                                {instalments[0].metadata.className} -{" "}
                                {instalments[0].metadata.sessionName}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              className={`px-4 py-2 text-sm font-semibold rounded-lg shadow-sm ${getStatusColorClass(
                                summary.status
                              )}`}
                            >
                              <span className="flex items-center gap-2">
                                {getStatusIcon(summary.status)}
                                {summary.status.replace("_", " ").toUpperCase()}
                              </span>
                            </Badge>
                            <button
                              onClick={() => setSelectedFeeType(null)}
                              className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                            >
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
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </CardHeader>
                      <div className="overflow-y-auto max-h-[calc(90vh-5rem)]">
                        <CardContent className="p-0">
                          <div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                              <div className="p-6 border-b md:border-b-0 md:border-r border-blue-100 bg-gradient-to-br from-blue-50/50 to-blue-50/20">
                                <p className="text-base font-medium text-blue-600 mb-1 flex items-center gap-2">
                                  <span className="h-4 w-4 rounded-full bg-blue-200 flex items-center justify-center">
                                    <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                                  </span>
                                  Total Amount
                                </p>
                                <p className="text-3xl font-bold text-blue-800 pl-6">
                                  {formatCurrency(summary.total)}
                                </p>
                              </div>
                              <div className="p-6 border-b md:border-b-0 md:border-r border-green-100 bg-gradient-to-br from-green-50/50 to-green-50/20">
                                <p className="text-base font-medium text-green-600 mb-1 flex items-center gap-2">
                                  <span className="h-4 w-4 rounded-full bg-green-200 flex items-center justify-center">
                                    <span className="h-2 w-2 rounded-full bg-green-600"></span>
                                  </span>
                                  Paid Amount
                                </p>
                                <p className="text-3xl font-bold text-green-800 pl-6">
                                  {formatCurrency(summary.paid)}
                                </p>
                              </div>
                              <div className="p-6 bg-gradient-to-br from-purple-50/50 to-purple-50/20">
                                <p className="text-base font-medium text-purple-600 mb-1 flex items-center gap-2">
                                  <span className="h-4 w-4 rounded-full bg-purple-200 flex items-center justify-center">
                                    <span className="h-2 w-2 rounded-full bg-purple-600"></span>
                                  </span>
                                  Payment Progress
                                </p>
                                <div className="pl-6 pt-2">
                                  <Progress
                                    value={
                                      summary.total > 0
                                        ? (summary.paid / summary.total) * 100
                                        : 0
                                    }
                                    className="h-3 bg-purple-100"
                                  />
                                  <p className="text-lg font-bold text-purple-800 mt-1">
                                    {summary.total > 0
                                      ? Math.round(
                                          (summary.paid / summary.total) * 100
                                        )
                                      : 0}
                                    %
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="p-6 pt-8">
                              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5 mb-6 shadow-sm">
                                <h3 className="text-xl font-bold text-indigo-800 mb-5 flex items-center gap-2">
                                  <div className="p-1.5 bg-indigo-100 rounded-lg">
                                    <Receipt className="w-5 h-5 text-indigo-600" />
                                  </div>
                                  Instalment Details
                                </h3>
                                <div className="rounded-xl overflow-hidden border border-indigo-100 bg-white shadow-sm">
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="bg-gradient-to-r from-indigo-50 to-blue-50">
                                        <TableHead className="text-indigo-700 font-semibold">
                                          No.
                                        </TableHead>
                                        <TableHead className="text-indigo-700 font-semibold">
                                          Amount
                                        </TableHead>
                                        <TableHead className="text-indigo-700 font-semibold">
                                          Due Date
                                        </TableHead>
                                        <TableHead className="text-indigo-700 font-semibold">
                                          Status
                                        </TableHead>
                                        <TableHead className="text-indigo-700 font-semibold">
                                          Payment Details
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {instalments.map((instalment) => {
                                        const statusInfo =
                                          getStatusInfo(instalment);
                                        return (
                                          <TableRow
                                            key={instalment.id}
                                            className="hover:bg-blue-50/50 transition-colors"
                                          >
                                            <TableCell className="font-medium text-gray-700">
                                              {instalment.instalmentNumber}
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-900">
                                              {formatCurrency(
                                                instalment.amount
                                              )}
                                            </TableCell>
                                            <TableCell className="text-gray-700">
                                              {formatDate(
                                                instalment.metadata.lastDate
                                              )}
                                            </TableCell>
                                            <TableCell>
                                              <Badge
                                                className={`px-2 py-1 shadow-sm ${statusInfo.color}`}
                                              >
                                                <span className="flex items-center gap-1">
                                                  {statusInfo.icon}
                                                  {statusInfo.status.toUpperCase()}
                                                </span>
                                              </Badge>
                                            </TableCell>
                                            <TableCell>
                                              {instalment.hasPaid ? (
                                                <div className="space-y-1">
                                                  <span className="text-green-600 font-medium flex items-center gap-1">
                                                    <CheckCircle className="h-4 w-4" />
                                                    Paid on{" "}
                                                    {formatDate(
                                                      instalment.paidAt
                                                    )}
                                                  </span>
                                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    <CreditCard className="h-3 w-3" />
                                                    {
                                                      instalment.details
                                                        .paymentMode
                                                    }{" "}
                                                    | Challan:{" "}
                                                    {
                                                      instalment.details
                                                        .challanNumber
                                                    }
                                                  </span>
                                                </div>
                                              ) : (
                                                <span className="text-gray-500">
                                                  -
                                                </span>
                                              )}
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>

                              {/* Components Section */}
                              {instalments.length > 0 &&
                                instalments[0].details.components.length >
                                  0 && (
                                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 shadow-sm">
                                    <h3 className="text-xl font-bold text-blue-800 mb-5 flex items-center gap-2">
                                      <div className="p-1.5 bg-blue-100 rounded-lg">
                                        <CreditCard className="w-5 h-5 text-blue-600" />
                                      </div>
                                      Fee Components
                                    </h3>
                                    <div className="rounded-xl overflow-hidden border border-blue-100 bg-white shadow-sm">
                                      <Table>
                                        <TableHeader>
                                          <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50">
                                            <TableHead className="text-blue-700 font-semibold">
                                              Component
                                            </TableHead>
                                            <TableHead className="text-blue-700 font-semibold">
                                              Type
                                            </TableHead>
                                            <TableHead className="text-blue-700 font-semibold">
                                              Amount
                                            </TableHead>
                                            <TableHead className="text-blue-700 font-semibold">
                                              Status
                                            </TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {instalments[0].details.components.map(
                                            (component) => (
                                              <TableRow
                                                key={component.id}
                                                className="hover:bg-blue-50/50 transition-colors"
                                              >
                                                <TableCell className="font-medium text-gray-800">
                                                  {component.headName}
                                                </TableCell>
                                                <TableCell className="text-gray-700">
                                                  {component.metadata.type}
                                                </TableCell>
                                                <TableCell className="font-medium text-gray-900">
                                                  {formatCurrency(
                                                    component.metadata.amount
                                                  )}
                                                </TableCell>
                                                <TableCell>
                                                  <Badge
                                                    className={`px-2 py-1 shadow-sm ${
                                                      component.hasPaid
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                                  >
                                                    <span className="flex items-center gap-1">
                                                      {component.hasPaid ? (
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                      ) : (
                                                        <Clock className="h-4 w-4 text-yellow-600" />
                                                      )}
                                                      {component.hasPaid
                                                        ? "PAID"
                                                        : "PENDING"}
                                                    </span>
                                                  </Badge>
                                                </TableCell>
                                              </TableRow>
                                            )
                                          )}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </div>
                                )}
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </>
                  );
                })()}
              </Card>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(groupedInstalments).map(
                ([feeType, feeInstalments]) => {
                  const summary = feeSummaries[feeType] || {
                    total: 0,
                    paid: 0,
                    status: "pending",
                  };
                  const firstInstalment = feeInstalments[0];

                  return (
                    <motion.div
                      key={feeType}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Card
                        className="cursor-pointer hover:shadow-xl transition-all border-none bg-white shadow-lg overflow-hidden rounded-xl h-full"
                        onClick={() => handleCardClick(feeType)}
                      >
                        <div className="relative h-full flex flex-col">
                          <div className="absolute top-0 h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
                          <CardHeader className="pb-2 relative">
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-10 w-1.5 rounded-full ${
                                  summary.status === "paid"
                                    ? "bg-green-500"
                                    : summary.status === "partially_paid"
                                    ? "bg-blue-500"
                                    : summary.status === "overdue"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                                }`}
                              ></div>
                              <CardTitle className="text-xl font-bold text-gray-800">
                                {feeType}
                              </CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent className="relative flex-grow">
                            <div className="flex justify-between items-center mb-4">
                              <p className="text-2xl font-bold text-blue-700">
                                {formatCurrency(summary.total)}
                              </p>
                              <Badge
                                className={`px-3 py-1.5 shadow-sm rounded-lg ${getStatusColorClass(
                                  summary.status
                                )}`}
                              >
                                <span className="flex items-center gap-1.5">
                                  {getStatusIcon(summary.status)}
                                  {summary.status
                                    .replace("_", " ")
                                    .toUpperCase()}
                                </span>
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                              <Calendar className="w-4 h-4 text-indigo-500" />
                              <span>
                                {firstInstalment.metadata.className} -{" "}
                                {firstInstalment.metadata.sessionName}
                              </span>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">
                                  Payment Progress
                                </span>
                                <span className="font-medium text-blue-700">
                                  {summary.total > 0
                                    ? Math.round(
                                        (summary.paid / summary.total) * 100
                                      )
                                    : 0}
                                  %
                                </span>
                              </div>
                              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                                  style={{
                                    width: `${
                                      summary.total > 0
                                        ? (summary.paid / summary.total) * 100
                                        : 0
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">
                                  Instalments
                                </span>
                                <span className="font-medium text-indigo-700">
                                  {
                                    feeInstalments.filter((i) => i.hasPaid)
                                      .length
                                  }{" "}
                                  / {feeInstalments.length}
                                </span>
                              </div>
                            </div>

                            <div className="absolute bottom-0 right-0 w-16 h-16 overflow-hidden opacity-10">
                              <div className="absolute inset-0 bg-blue-500 rounded-tl-full"></div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
