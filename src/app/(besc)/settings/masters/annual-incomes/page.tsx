"use client";

import React, { useState, useTransition } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download, Loader2 } from "lucide-react";
import { AnnualIncome } from "@/db/schema";
// import { db } from "@/db";
// import { sql } from "drizzle-orm";
import { AnnualIncomeDialog } from "./annual-income-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Import placeholder actions for upload/download (assuming they exist in ./actions)
import { uploadAnnualIncomesFromFile, downloadAnnualIncomes } from './actions';

export default function AnnualIncomesPage() {
  // Using dummy data for now as requested
  const data: AnnualIncome[] = [
    { id: 1, range: "0-1,00,000", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, range: "1,00,001-2,50,000", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 3, range: "2,50,001-5,00,000", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 4, range: "5,00,001-10,00,000", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 5, range: "Above 10,00,000", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];

  const [isPendingUpload, startUploadTransition] = useTransition();
  const [isPendingDownload, startDownloadTransition] = useTransition();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Annual Income Ranges</h1>
         <div className="flex items-center gap-4">
           {/* Upload Button/Form */}
           <form action={async (formData: FormData) => {
            startUploadTransition(async () => {
              await uploadAnnualIncomesFromFile(formData);
            });
           }} className="flex items-center gap-2">
            <Label htmlFor="annual-income-upload" className="sr-only">Upload Annual Incomes File</Label>
            <Input id="annual-income-upload" type="file" name="file" accept=".csv, .xlsx" className="max-w-sm" />
            <Button type="submit" size="sm" disabled={isPendingUpload}>
              {isPendingUpload ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload File
            </Button>
          </form>
          {/* Download Button/Form */}
          <form action={async () => {
            startDownloadTransition(async () => {
              // Call the actual download action when implemented
              await downloadAnnualIncomes();
            });
          }}>
            <Button type="submit" variant="outline" size="sm" disabled={isPendingDownload}>
              {isPendingDownload ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download Annual Incomes
            </Button>
          </form>
          {/* Add Annual Income Dialog Trigger */}
          <AnnualIncomeDialog />
        </div>
      </div>
      
      {/* Table Container matching Materials page style */}
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <DataTable<AnnualIncome> columns={columns} data={data} />
      </div>
    </div>
  );
}
