"use client";

import React, { useState, useTransition } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download, Loader2 } from "lucide-react";
import { bloodGroup, type BloodGroup } from "@/db/schema";
// import { db } from "@/db";
// import { sql } from "drizzle-orm";
import { BloodGroupDialog } from "./blood-group-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Import placeholder actions for upload/download (assuming they exist in ./actions)
import { uploadBloodGroupsFromFile, downloadBloodGroups } from './actions';

export default function BloodGroup() {
  // Using dummy data for now as requested
  const data: BloodGroup[] = [
    { id: 1, type: "A+", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, type: "B+", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 3, type: "O+", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 4, type: "AB+", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 5, type: "A-", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 6, type: "B-", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 7, type: "O-", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 8, type: "AB-", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];

  const [isPendingUpload, startUploadTransition] = useTransition();
  const [isPendingDownload, startDownloadTransition] = useTransition();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blood Groups</h1>
         <div className="flex items-center gap-4">
           {/* Upload Button/Form */}
           <form action={async (formData: FormData) => {
            startUploadTransition(async () => {
              await uploadBloodGroupsFromFile(formData);
            });
           }} className="flex items-center gap-2">
            <Label htmlFor="blood-group-upload" className="sr-only">Upload Blood Groups File</Label>
            <Input id="blood-group-upload" type="file" name="file" accept=".csv, .xlsx" className="max-w-sm" />
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
              await downloadBloodGroups();
            });
          }}>
            <Button type="submit" variant="outline" size="sm" disabled={isPendingDownload}>
              {isPendingDownload ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download Blood Groups
            </Button>
          </form>
          {/* Add Blood Group Dialog Trigger */}
          <BloodGroupDialog />
        </div>
      </div>
      
      {/* Table Container matching Materials page style */}
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <DataTable<BloodGroup> columns={columns} data={data} />
      </div>
    </div>
  );
}
