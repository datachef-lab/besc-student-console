'use client';

import React, { useState, useEffect, useTransition, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Loader2, Trash2, Upload, Download, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { CollegeDialog } from "./college-dialog";
import { useToast } from "@/hooks/use-toast";
import { Colleges } from "@/db/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { uploadCollegesFromFile, downloadColleges, fetchPaginatedColleges } from "./actions";
import * as XLSX from 'xlsx';

const ITEMS_PER_PAGE = 10;
const REQUIRED_HEADERS = ['name', 'code'];

export default function CollegePage() {
  const [data, setData] = useState<Colleges[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isPendingUpload, startUploadTransition] = useTransition();
  const [isPendingDownload, startDownloadTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = data.slice(startIndex, endIndex);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const result = await fetchPaginatedColleges(currentPage, ITEMS_PER_PAGE);

      if (Array.isArray(result.colleges)) {
        setData(result.colleges);
        setTotalCount(result.totalCount);
      } else {
        setData([]);
        setTotalCount(0);
        toast({
          title: "Failed to fetch colleges",
          description: "An error occurred while fetching data.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching colleges:", error);
      setData([]);
      setTotalCount(0);
      toast({
        title: "Failed to fetch colleges",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleEdit = (college: Colleges) => {
    // Edit functionality is handled by the CollegeDialog component
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/colleges?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete college');
      }

      toast({
        title: "College deleted successfully",
        description: "The college has been deleted successfully.",
      });

      fetchColleges();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an Excel file to upload.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    startUploadTransition(async () => {
      const result = await uploadCollegesFromFile(formData);
      if (result.success) {
        toast({
          title: "Upload Successful",
          description: result.message,
        });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        fetchColleges();
      } else {
        toast({
          title: "Upload Failed",
          description: result.error || "An unknown error occurred.",
          variant: "destructive",
        });
      }
    });
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{ name: "", code: "" }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CollegeTemplate");
    XLSX.writeFile(wb, "college_template.xlsx");
  };

  const handleDownload = async () => {
    startDownloadTransition(async () => {
      const result = await downloadColleges();
      if (result.success && result.data) {
        const link = document.createElement('a');
        link.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + result.data;
        link.download = 'colleges.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({
          title: "Download Successful",
          description: "Colleges data downloaded successfully.",
        });
      } else {
        toast({
          title: "Download Failed",
          description: result.error || "Failed to download colleges data.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Colleges</h1>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".xlsx, .xls"
            id="upload-file-input"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 flex items-center gap-2"
          >
            Choose File
          </Button>
          {selectedFile && (
            <span className="text-sm text-gray-600">{selectedFile.name}</span>
          )}
          <Button
            type="button"
            size="sm"
            onClick={handleUpload}
            disabled={!selectedFile || isPendingUpload}
            className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
          >
            {isPendingUpload ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload size={20} />
            )}
            Upload File
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={downloadTemplate}
            className="bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2"
          >
            <FileText size={20} />
            Download Template
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isPendingDownload}
            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
          >
            {isPendingDownload ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download size={20} />
            )}
            Download Data
          </Button>
          <CollegeDialog onSuccess={fetchColleges} />
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-[80px] font-semibold text-gray-700">Sr. No</TableHead>
                <TableHead className="font-semibold text-gray-700">Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Code</TableHead>
                <TableHead className="font-semibold text-gray-700">Created At</TableHead>
                <TableHead className="font-semibold text-gray-700">Updated At</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    No colleges found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((college, index) => (
                  <TableRow key={college.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-600">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="text-gray-700">{college.name}</TableCell>
                    <TableCell className="text-gray-700">{college.code || 'N/A'}</TableCell>
                    <TableCell className="text-gray-700">
                      {college.createdAt ? new Date(college.createdAt).toLocaleString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {college.updatedAt ? new Date(college.updatedAt).toLocaleString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <CollegeDialog mode="edit" college={college} onSuccess={fetchColleges}>
                          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                            <Pencil className="h-4 w-4 text-blue-500" />
                          </Button>
                        </CollegeDialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the college.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => college.id && handleDelete(college.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} /> Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
