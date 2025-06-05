"use client";

import React, { useState, useTransition } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download, Loader2 } from "lucide-react";
import { BoardUniversity } from "@/db/schema";
// import { db } from "@/db";
// import { sql } from "drizzle-orm";
import { BoardUniversityDialog } from "./board-university-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Import placeholder actions for upload/download (assuming they exist in ./actions)
import { uploadBoardUniversitiesFromFile, downloadBoardUniversities } from './actions';

export default function BoardUniversitiesPage() {
  // Using dummy data for now as requested
  const data: BoardUniversity[] = [
    { id: 1, name: "Gujarat University", code: "GU", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, name: "Delhi University", code: "DU", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 3, name: "Mumbai University", code: "MU", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 4, name: "Jawaharlal Nehru University", code: "JNU", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 5, name: "Bangalore University", code: "BU", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];

  const [isPendingUpload, startUploadTransition] = useTransition();
  const [isPendingDownload, startDownloadTransition] = useTransition();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Board Universities</h1>
         <div className="flex items-center gap-4">
           {/* Upload Button/Form */}
           <form action={async (formData: FormData) => {
            startUploadTransition(async () => {
              await uploadBoardUniversitiesFromFile(formData);
            });
           }} className="flex items-center gap-2">
            <Label htmlFor="board-university-upload" className="sr-only">Upload Board Universities File</Label>
            <Input id="board-university-upload" type="file" name="file" accept=".csv, .xlsx" className="max-w-sm" />
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
              await downloadBoardUniversities();
            });
          }}>
            <Button type="submit" variant="outline" size="sm" disabled={isPendingDownload}>
              {isPendingDownload ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download Board Universities
            </Button>
          </form>
          {/* Add Board University Dialog Trigger */}
          <BoardUniversityDialog />
        </div>
      </div>
      
      {/* Table Container matching Materials page style */}
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <DataTable<BoardUniversity> columns={columns} data={data} />
      </div>
    </div>
  );
}
