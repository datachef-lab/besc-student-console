"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Info,
  Receipt,
  XCircle,
} from "lucide-react";
import { Instalment } from "@/types/fees/instalment";
import { FeeSummary } from "../page"; // Assuming FeeSummary type is exported from page.tsx
import {
  formatDate,
  formatCurrency,
  getPaymentDueDateInfo,
  getStatusInfo as getUtilStatusInfo,
} from "../utils.tsx"; // Corrected import path

interface FeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFeeType: string | null;
  instalments: Instalment[];
  summary: FeeSummary | null;
}

const FeeDetailModal: React.FC<FeeDetailModalProps> = ({
  isOpen,
  onClose,
  selectedFeeType,
  instalments,
  summary,
}) => {
  if (!isOpen || !selectedFeeType || !summary) return null;

  const statusDetails =
    instalments.length > 0
      ? getUtilStatusInfo(instalments[0])
      : {
          status: summary.status.toUpperCase(),
          color: "bg-gray-100 text-gray-800",
          icon: <AlertCircle className="w-4 h-4" />,
          borderColor: "border-gray-300",
        };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full max-w-4xl max-h-[90vh] bg-white border-none rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col"
      >
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
                className={`px-4 py-2 text-sm font-semibold rounded-lg shadow-sm ${statusDetails.color}`}
              >
                <span className="flex items-center gap-2">
                  {statusDetails.icon}
                  {statusDetails.status.replace("_", " ").toUpperCase()}
                </span>
              </Badge>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                aria-label="Close modal"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-y-auto flex-grow">
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
                        ? Math.round((summary.paid / summary.total) * 100)
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
                        {instalments.map((instalment, index) => {
                          const statusInfo = getUtilStatusInfo(instalment);
                          const dueDateString =
                            instalment.metadata.lastDate instanceof Date
                              ? instalment.metadata.lastDate.toISOString()
                              : instalment.metadata.lastDate;
                          const dueDateInfo = getPaymentDueDateInfo(
                            dueDateString,
                            instalment.hasPaid
                          );
                          const paidDateString =
                            instalment.paidAt instanceof Date
                              ? instalment.paidAt.toISOString()
                              : instalment.paidAt;

                          let daysText = "";
                          if (dueDateInfo) {
                            if (dueDateInfo.status === "overdue") {
                              daysText = `Overdue by ${dueDateInfo.days} day${
                                dueDateInfo.days === 1 ? "" : "s"
                              }`;
                            } else if (
                              dueDateInfo.status === "critical" ||
                              dueDateInfo.status === "warning" ||
                              dueDateInfo.status === "normal"
                            ) {
                              daysText = `Due in ${dueDateInfo.days} day${
                                dueDateInfo.days === 1 ? "" : "s"
                              }`;
                            }
                          }

                          return (
                            <TableRow
                              key={instalment.id}
                              className="hover:bg-indigo-50/30 transition-colors"
                            >
                              <TableCell className="font-medium text-slate-700">
                                {instalment.instalmentNumber}
                              </TableCell>
                              <TableCell className="font-semibold text-slate-800">
                                {formatCurrency(instalment.amount)}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span
                                    className={`font-medium ${
                                      dueDateInfo?.color || "text-slate-700"
                                    }`}
                                  >
                                    {formatDate(dueDateString)}
                                  </span>
                                  {dueDateInfo && daysText && (
                                    <span
                                      className={`text-xs ${dueDateInfo.color}`}
                                    >
                                      {daysText}
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={`px-2.5 py-1 text-xs font-semibold border-2 ${statusInfo.borderColor} ${statusInfo.color}`}
                                >
                                  <span className="flex items-center gap-1.5">
                                    {statusInfo.icon}
                                    {statusInfo.status
                                      .replace("_", " ")
                                      .toUpperCase()}
                                  </span>
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {instalment.paidAt ? (
                                  <div className="flex flex-col text-xs">
                                    <span className="text-green-600 font-medium flex items-center gap-1">
                                      <CheckCircle className="w-3.5 h-3.5" />{" "}
                                      Paid on: {formatDate(paidDateString)}
                                    </span>
                                    {instalment.metadata.receiptTypeName && (
                                      <span className="text-slate-500">
                                        Type:{" "}
                                        {instalment.metadata.receiptTypeName}
                                      </span>
                                    )}
                                    {instalment.details?.paymentMode && (
                                      <span className="text-slate-500">
                                        Mode: {instalment.details.paymentMode}
                                      </span>
                                    )}
                                    {instalment.details?.challanNumber && (
                                      <a
                                        href={`/receipt/${instalment.details.challanNumber}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 mt-0.5"
                                      >
                                        View Receipt{" "}
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
                                  </div>
                                ) : instalment.cancelled ? (
                                  <div className="flex items-center text-xs text-red-600">
                                    <XCircle className="w-3.5 h-3.5 mr-1" />{" "}
                                    Cancelled
                                  </div>
                                ) : (
                                  <div className="flex items-center text-xs text-amber-600">
                                    <Clock className="w-3.5 h-3.5 mr-1" />{" "}
                                    Pending
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>


              </div>
            </div>
          </CardContent>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FeeDetailModal;
