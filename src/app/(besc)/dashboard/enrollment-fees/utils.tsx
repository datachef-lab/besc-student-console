import { Instalment } from "@/types/fees/instalment";
import { AlertCircle, CheckCircle, Hourglass } from "lucide-react";
import React from "react"; // Import React for JSX

export const formatDate = (dateString: string | Date | null): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getPaymentDueDateInfo = (
  dueDate: string | null | undefined,
  isPaid: boolean = false
) => {
  if (!dueDate || isPaid) return null; // Don't show due date info if already paid

  try {
    const today = new Date();
    const dueDateObj = new Date(dueDate);
    if (isNaN(dueDateObj.getTime())) return null;

    const diffTime = dueDateObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        status: "overdue",
        days: Math.abs(diffDays),
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    } else if (diffDays <= 3) {
      return {
        status: "critical",
        days: diffDays,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
      };
    } else if (diffDays <= 7) {
      return {
        status: "warning",
        days: diffDays,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      };
    } else {
      return {
        status: "normal",
        days: diffDays,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      };
    }
  } catch (error) {
    console.error("Error processing date", error);
    return null;
  }
};

export const getStatusInfo = (
  instalment: Instalment
): {
  status: string;
  color: string;
  icon: React.ReactNode;
  textColor: string;
  borderColor: string;
} => {
  if (instalment.cancelled) {
    return {
      status: "Cancelled",
      color: "bg-gray-100 text-gray-700",
      icon: <AlertCircle className="w-4 h-4 text-gray-500" />,
      textColor: "text-gray-700",
      borderColor: "border-gray-300",
    };
  }

  if (instalment.hasPaid) {
    return {
      status: "Paid",
      color: "bg-green-100 text-green-700",
      icon: <CheckCircle className="w-4 h-4 text-green-500" />,
      textColor: "text-green-700",
      borderColor: "border-green-300",
    };
  }

  const dueDate = instalment.metadata.lastDate;
  const dueDateString =
    dueDate instanceof Date ? dueDate.toISOString() : dueDate;
  if (dueDateString && new Date(dueDateString) < new Date()) {
    return {
      status: "Overdue",
      color: "bg-red-100 text-red-700",
      icon: <AlertCircle className="w-4 h-4 text-red-500" />,
      textColor: "text-red-700",
      borderColor: "border-red-300",
    };
  }

  return {
    status: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    icon: <Hourglass className="w-4 h-4 text-yellow-500" />,
    textColor: "text-yellow-700",
    borderColor: "border-yellow-300",
  };
};
