"use client";

import React, { useState } from "react";
import { useStudent } from "@/context/StudentContext";
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

export default function AcademicsPage() {
  const { batches, loading } = useStudent();
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  const handleCardClick = (index: number) => {
    if (selectedBatch === index) {
      setSelectedBatch(null);
    } else {
      setSelectedBatch(index);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">
        Academic Information
      </h1>

      {batches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No academic information available
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {selectedBatch !== null ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Card
                className="w-full cursor-pointer bg-muted/50"
                onClick={() => setSelectedBatch(null)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-2xl font-bold">
                        {batches[selectedBatch].coursename}
                      </CardTitle>
                      <p className="text-lg text-muted-foreground">
                        {batches[selectedBatch].classname} (
                        {batches[selectedBatch].sectionName})
                      </p>
                    </div>
                    <Badge className="text-sm">
                      {batches[selectedBatch].sessionName}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Subjects & Papers
                    </h3>
                    {batches[selectedBatch].papers &&
                    batches[selectedBatch].papers.length > 0 ? (
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
                            {batches[selectedBatch].papers.map(
                              (paper, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">
                                    {paper.subjectname}
                                  </TableCell>
                                  <TableCell>{paper.paperName}</TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {paper.subjecttypename}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No papers available for this batch
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Click to close
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {batches.map((batch, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Card
                    className="h-32 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleCardClick(index)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-1">
                        {batch.coursename}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {batch.classname} ({batch.sectionName})
                      </p>
                      <Badge className="mt-2 text-xs">
                        {batch.sessionName}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
