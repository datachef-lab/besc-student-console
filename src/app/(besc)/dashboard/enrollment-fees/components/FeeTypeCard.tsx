"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";
import { Instalment } from "@/types/fees/instalment";
import { FeeSummary } from "../page"; // Assuming FeeSummary type is exported from page.tsx or a types file
import {
  formatDate,
  formatCurrency,
  getPaymentDueDateInfo,
  getStatusInfo as getUtilStatusInfo,
} from "../utils.tsx";

interface FeeTypeCardProps {
  feeType: string;
  feeInstalments: Instalment[];
  summary: FeeSummary;
  onCardClick: (feeType: string) => void;
  index: number; // For animation delay
}

const FeeTypeCard: React.FC<FeeTypeCardProps> = ({
  feeType,
  feeInstalments,
  summary,
  onCardClick,
  index,
}) => {
  if (feeInstalments.length === 0) return null;

  const firstInstalment = feeInstalments[0];
  const overallStatusInfo = getUtilStatusInfo(firstInstalment);

  const lastDateForDueDateInfo =
    firstInstalment.metadata.lastDate instanceof Date
      ? firstInstalment.metadata.lastDate.toISOString()
      : firstInstalment.metadata.lastDate;
  const overallDueDateInfo = firstInstalment
    ? getPaymentDueDateInfo(lastDateForDueDateInfo, firstInstalment.hasPaid)
    : null;

  return (
    <motion.div
      key={feeType}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="w-full"
    >
      <Card
        className="w-full cursor-pointer bg-white border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden group"
        onClick={() => onCardClick(feeType)}
      >
        <CardHeader
          className={`pb-4 pt-5 px-5 border-b bg-gradient-to-br ${overallStatusInfo.borderColor
            .replace("border-", "from-")
            .replace("-300", "-50")} ${overallStatusInfo.borderColor
            .replace("border-", "to-")
            .replace("-300", "-100")}`}
        >
          <div className="flex items-center justify-between mb-2">
            <CardTitle
              className={`text-lg font-bold ${overallStatusInfo.textColor}`}
            >
              {feeType}
            </CardTitle>
            <Badge
              variant="outline"
              className={`px-2.5 py-1 text-xs font-semibold border-2 ${overallStatusInfo.borderColor} ${overallStatusInfo.color}`}
            >
              <span className="flex items-center gap-1.5">
                {overallStatusInfo.icon}
                {summary.status.replace("_", " ").toUpperCase()}
              </span>
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            {firstInstalment.metadata.className} -{" "}
            {firstInstalment.metadata.sessionName}
          </p>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500">Total Amount</p>
              <p className="text-xl font-semibold text-slate-700">
                {formatCurrency(summary.total)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 text-right">Due Date</p>
              <p
                className={`text-sm font-medium ${
                  overallDueDateInfo?.color || "text-slate-700"
                }`}
              >
                {formatDate(firstInstalment.metadata.lastDate)}
              </p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progress</span>
              <span>
                {formatCurrency(summary.paid)} / {formatCurrency(summary.total)}
              </span>
            </div>
            <Progress
              value={(summary.paid / summary.total) * 100}
              className="h-2"
            />
          </div>

          <div className="text-xs text-slate-500 pt-2">
            <p>Instalment: {firstInstalment.instalmentNumber}</p>
          </div>

          {overallDueDateInfo && (
            <div
              className={`mt-3 p-2.5 rounded-md text-xs flex items-center gap-2 ${overallDueDateInfo.bgColor} ${overallDueDateInfo.borderColor} border`}
            >
              <AlertCircle className={`w-4 h-4 ${overallDueDateInfo.color}`} />
              <span className={`${overallDueDateInfo.color} font-medium`}>
                {overallDueDateInfo.status === "overdue"
                  ? `Payment overdue by ${overallDueDateInfo.days} ${
                      overallDueDateInfo.days === 1 ? "day" : "days"
                    }.`
                  : `Payment due in ${overallDueDateInfo.days} ${
                      overallDueDateInfo.days === 1 ? "day" : "days"
                    }.`}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeeTypeCard;
