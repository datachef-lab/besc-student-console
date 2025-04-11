"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface Installment {
  id: number;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  paidOn: string | null;
}

interface Fee {
  id: number;
  name: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue" | "partially_paid";
  installments: Installment[];
}

// Mock data for demonstration
const mockFeesData: Fee[] = [
  {
    id: 1,
    name: "Tuition Fee",
    totalAmount: 50000,
    paidAmount: 40000,
    dueDate: "2025-06-30",
    status: "partially_paid",
    installments: [
      {
        id: 1,
        amount: 20000,
        dueDate: "2025-04-15",
        status: "paid",
        paidOn: "2025-04-10",
      },
      {
        id: 2,
        amount: 20000,
        dueDate: "2025-05-15",
        status: "paid",
        paidOn: "2025-05-12",
      },
      {
        id: 3,
        amount: 10000,
        dueDate: "2025-06-15",
        status: "pending",
        paidOn: null,
      },
    ],
  },
  {
    id: 2,
    name: "Examination Fee",
    totalAmount: 5000,
    paidAmount: 5000,
    dueDate: "2025-04-30",
    status: "paid",
    installments: [
      {
        id: 1,
        amount: 5000,
        dueDate: "2025-04-30",
        status: "paid",
        paidOn: "2025-04-25",
      },
    ],
  },
  {
    id: 3,
    name: "Hostel Fee",
    totalAmount: 30000,
    paidAmount: 0,
    dueDate: "2025-05-15",
    status: "pending",
    installments: [
      {
        id: 1,
        amount: 15000,
        dueDate: "2025-05-15",
        status: "pending",
        paidOn: null,
      },
      {
        id: 2,
        amount: 15000,
        dueDate: "2025-07-15",
        status: "pending",
        paidOn: null,
      },
    ],
  },
  {
    id: 4,
    name: "Library Fee",
    totalAmount: 2000,
    paidAmount: 2000,
    dueDate: "2025-04-10",
    status: "paid",
    installments: [
      {
        id: 1,
        amount: 2000,
        dueDate: "2025-04-10",
        status: "paid",
        paidOn: "2025-04-05",
      },
    ],
  },
];

export default function AdmissionFeesPage() {
  const [feesData, setFeesData] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFee, setSelectedFee] = useState<number | null>(null);

  // Simulate API call to fetch fees data
  useEffect(() => {
    setTimeout(() => {
      setFeesData(mockFeesData);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string): string => {
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

  const getStatusColor = (
    status: Fee["status"] | Installment["status"]
  ): string => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "partially_paid":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (
    status: Fee["status"] | Installment["status"]
  ): React.ReactNode => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "overdue":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "partially_paid":
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const handleCardClick = (feeId: number): void => {
    if (selectedFee === feeId) {
      setSelectedFee(null);
    } else {
      setSelectedFee(feeId);
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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Enrollment & Fees</h1>

      <div className="space-y-6">
        {selectedFee !== null ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <Card
              className="w-full cursor-pointer bg-muted/50"
              onClick={() => handleCardClick(selectedFee)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold">
                      {feesData[selectedFee].name}
                    </CardTitle>
                    <p className="text-lg text-muted-foreground">
                      Due: {formatDate(feesData[selectedFee].dueDate)}
                    </p>
                  </div>
                  <Badge
                    className={getStatusColor(feesData[selectedFee].status)}
                  >
                    <span className="flex items-center gap-1">
                      {getStatusIcon(feesData[selectedFee].status)}
                      {feesData[selectedFee].status
                        .replace("_", " ")
                        .toUpperCase()}
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-sm font-medium">Total Amount</p>
                      <p className="text-lg font-bold">
                        {formatCurrency(feesData[selectedFee].totalAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Paid Amount</p>
                      <p className="text-lg font-bold">
                        {formatCurrency(feesData[selectedFee].paidAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Due Date</p>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Calendar className="w-4 h-4" />{" "}
                        {formatDate(feesData[selectedFee].dueDate)}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-2">Installments</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>No.</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Paid On</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {feesData[selectedFee].installments.map(
                          (installment, idx) => (
                            <TableRow key={installment.id}>
                              <TableCell>{idx + 1}</TableCell>
                              <TableCell>
                                {formatCurrency(installment.amount)}
                              </TableCell>
                              <TableCell>
                                {formatDate(installment.dueDate)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={getStatusColor(installment.status)}
                                >
                                  <span className="flex items-center gap-1">
                                    {getStatusIcon(installment.status)}
                                    {installment.status.toUpperCase()}
                                  </span>
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {installment.paidOn
                                  ? formatDate(installment.paidOn)
                                  : "-"}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Click to close
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feesData.map((fee, index) => (
              <motion.div
                key={fee.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Card
                  className="h-32 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleCardClick(index)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1">{fee.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-1 flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Due:{" "}
                      {formatDate(fee.dueDate)}
                    </p>
                    <Badge
                      className={`mt-2 text-xs ${getStatusColor(fee.status)}`}
                    >
                      <span className="flex items-center gap-1">
                        {getStatusIcon(fee.status)}
                        {fee.status.replace("_", " ").toUpperCase()}
                      </span>
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
