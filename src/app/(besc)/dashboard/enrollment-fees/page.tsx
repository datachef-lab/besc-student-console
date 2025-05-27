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
  Percent,
  Award,
  Hourglass,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Instalment } from "@/types/fees/instalment";
import { useStudent } from "@/providers/student-provider";
import {
  formatDate,
  formatCurrency,
  getPaymentDueDateInfo,
  getStatusInfo as getUtilStatusInfo,
} from "./utils.tsx";
import FeesHeader from "./components/FeesHeader";
import LoadingSkeleton from "./components/LoadingSkeleton";
import FeeTypeCard from "./components/FeeTypeCard";
import FeeDetailModal from "./components/FeeDetailModal";

interface ExtendedComponentMetadata {
  id: number;
  headName: string;
  type: string;
  amount: number;
  specialTypeName: string | null;
  instalmentTypeName: string | null;
  lateTypeCalculation: string | null;
  concession: number | null;
  dueDate?: string;
  scholarshipAmount?: number;
  scholarshipName?: string;
}

export interface FeeSummary {
  total: number;
  paid: number;
  due: number;
  status: string;
  instalments: Instalment[];
}

interface GroupedInstalments {
  [key: string]: Instalment[];
}

interface FeeSummaries {
  [key: string]: FeeSummary;
}

export default function FeesPage() {
  const { student } = useStudent();
  const [loading, setLoading] = useState(true);
  const [selectedFeeType, setSelectedFeeType] = useState<string | null>(null);
  const [groupedInstalments, setGroupedInstalments] = useState<GroupedInstalments>(
    {}
  );
  const [feeSummaries, setFeeSummaries] = useState<FeeSummaries>({});

  useEffect(() => {
    const fetchInstalments = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/fees?studentId=${student?.id || 0}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = (await response.json()) as Instalment[];

        const grouped = data.reduce((acc, instalment) => {
          const key = `${instalment.metadata.receiptTypeName}_${instalment.instalmentNumber}`;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(instalment);
          return acc;
        }, {} as GroupedInstalments);

        setGroupedInstalments(grouped);

        const summaries: FeeSummaries = {};

        Object.entries(grouped).forEach(([key, instalments]) => {
          const instalment = instalments[0]; // Assuming one instalment per group for summary
          const total = instalment.amount;
          const paid = instalment.hasPaid ? instalment.amount : 0;
          let status = "pending";

          const utilStatus = getUtilStatusInfo(instalment);
          status = utilStatus.status.toLowerCase(); // Use status from util

          summaries[key] = { total, paid, due: 0, status, instalments };
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
    } else {
      setLoading(false); // Stop loading if no student ID
    }
  }, [student]);

  const handleCardClick = (feeType: string): void => {
    if (selectedFeeType === feeType) {
      setSelectedFeeType(null);
    } else {
      setSelectedFeeType(feeType);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/20">
        <FeesHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-16 relative z-10">
          <LoadingSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/20">
      {/* Header Banner */}
      <FeesHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-16 relative z-10">
        <div className="space-y-8">
          <FeeDetailModal 
            isOpen={selectedFeeType !== null}
            onClose={() => setSelectedFeeType(null)}
            selectedFeeType={selectedFeeType}
            instalments={selectedFeeType ? groupedInstalments[selectedFeeType] || [] : []}
            summary={selectedFeeType ? feeSummaries[selectedFeeType] || null : null}
          />

          {selectedFeeType === null && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(groupedInstalments).map(
                ([feeType, feeInstalments], index) => (
                  <FeeTypeCard
                    key={feeType}
                    feeType={feeType}
                    feeInstalments={feeInstalments}
                    summary={feeSummaries[feeType]}
                    onCardClick={handleCardClick}
                    index={index}
                  />
                )
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
