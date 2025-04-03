"use client";

import React, { useState } from "react";
import { useStudent } from "@/context/StudentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AcademicsPage() {
  const { batches, loading } = useStudent();
  const [selectedBatch, setSelectedBatch] = useState<number | null>(
    batches.length > 0 ? 0 : null
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-64" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  const selectedBatchData =
    selectedBatch !== null ? batches[selectedBatch] : null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Academic Information
        </h1>
        <Select
          value={selectedBatch?.toString()}
          onValueChange={(value) => setSelectedBatch(Number(value))}
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {batches.map((batch, index) => (
              <SelectItem key={index} value={index.toString()}>
                {batch.coursename} - {batch.classname} ({batch.sectionName})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {batches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No academic information available
          </p>
        </div>
      ) : selectedBatchData ? (
        <div className="space-y-6">
          <Card className="bg-muted/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold">
                    {selectedBatchData.coursename}
                  </CardTitle>
                  <p className="text-lg text-muted-foreground">
                    {selectedBatchData.classname}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">Section</p>
                    <p className="text-lg font-semibold">
                      {selectedBatchData.sectionName}
                    </p>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div className="text-right">
                    <p className="text-sm font-medium">Shift</p>
                    <p className="text-lg font-semibold">
                      {selectedBatchData.shiftName}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Session:</span>
                <Badge variant="secondary" className="text-sm">
                  {selectedBatchData.sessionName}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subjects & Papers</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedBatchData.papers &&
              selectedBatchData.papers.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Subject</TableHead>
                        <TableHead className="w-[40%]">Paper</TableHead>
                        <TableHead className="w-[20%]">Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedBatchData.papers.map((paper, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {paper.subjectname}
                          </TableCell>
                          <TableCell>{paper.paperName}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {paper.subjecttypename}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No papers available for this batch
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Please select a class to view academic information
          </p>
        </div>
      )}
    </div>
  );
}
