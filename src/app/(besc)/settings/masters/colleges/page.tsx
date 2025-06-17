'use client';

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Upload, Download, Plus, FileText } from "lucide-react";
import { CollegeDialog } from "./college-dialog";
import { Colleges } from "@/db/schema";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import * as XLSX from 'xlsx';

export default function CollegePage() {
  const [data, setData] = useState<Colleges[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedCollege, setSelectedCollege] = useState<Colleges | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 10;

  const fetchColleges = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/colleges?page=${page}&limit=${ITEMS_PER_PAGE}`);
      const result = await res.json();
      setData(result.colleges || []);
      setTotalCount(result.totalCount || 0);
    } catch (err) {
      setData([]);
      setTotalCount(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchColleges(currentPage);
  }, [currentPage]);

  const handleDownloadTemplate = () => {
    const sampleData = [
      ["Name", "Code", "Sequence"],
      ["Sample College", "COL001", 1],
    ];
    const ws = XLSX.utils.aoa_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "college_template.xlsx");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadProgress(0);
    // 1. Read the Excel file
    const arrayBuffer = await selectedFile.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json: any[] = XLSX.utils.sheet_to_json(sheet);
    // 2. Validate and filter data
    const validColleges = json
      .map(row => ({
        name: row["Name"] || row["name"],
        code: row["Code"] || row["code"] || "",
        sequence: row["Sequence"] || row["sequence"] || null,
      }))
      .filter(college => college.name);
    setUploadTotal(validColleges.length);
    // 3. Send each college to the backend
    for (let i = 0; i < validColleges.length; i++) {
      await fetch("/api/colleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validColleges[i]),
      });
      setUploadProgress(i + 1);
    }
    setIsUploading(false);
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadTotal(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
    fetchColleges(currentPage);
  };

  const handleDownloadColleges = async () => {
    let allColleges: any[] = [];
    let page = 1;
    let totalPages = 1;
    do {
      const res = await fetch(`/api/colleges?page=${page}&limit=${ITEMS_PER_PAGE}`);
      const result = await res.json();
      if (Array.isArray(result.colleges)) {
        allColleges = allColleges.concat(result.colleges);
        if (result.totalCount) {
          totalPages = Math.ceil(result.totalCount / ITEMS_PER_PAGE);
        }
      } else {
        break;
      }
      page++;
    } while (page <= totalPages);
    // Convert to Excel and download
    const ws = XLSX.utils.json_to_sheet(allColleges);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Colleges");
    XLSX.writeFile(wb, "colleges.xlsx");
  };

  const handleEdit = (college: Colleges) => {
    setSelectedCollege(college);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedCollege(null);
    setDialogMode('add');
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/colleges?id=${id}`, { method: 'DELETE' });
    fetchColleges();
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Colleges Management</h2>
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2 mb-4">
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Choose File</Button>
          {selectedFile && (
            <span className="text-sm text-gray-600">{selectedFile.name}</span>
          )}
          <Button variant="default" onClick={handleUploadFile} disabled={!selectedFile || isUploading}>
            <Upload className="mr-2 h-4 w-4" />Upload File
          </Button>
          <Button variant="secondary" onClick={handleDownloadTemplate}><FileText className="mr-2 h-4 w-4" />Download Template</Button>
        </div>
        {isUploading && (
          <div className="mb-2 text-sm text-blue-600">Uploading {uploadProgress} of {uploadTotal} colleges...</div>
        )}
        <div className="flex justify-end gap-2 mb-2 pr-6">
          {/* <Button variant="default" onClick={handleAdd}><Plus className="mr-2 h-4 w-4" />Add College</Button> */}
        <CollegeDialog
          key={dialogMode + (selectedCollege?.id ?? 'add')}
          mode={dialogMode}
          college={selectedCollege || undefined}
          onSuccess={() => { setDialogOpen(false); fetchColleges(); }}
        />
          <Button variant="secondary" onClick={handleDownloadColleges}><Download className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="bg-white rounded-lg  p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y border divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sequence</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8">No colleges found.</td></tr>
              ) : (
                data.map((college, idx) => (
                  <tr key={college.id} className="hover:bg-gray-50 text-sm">
                    <td className="px-6 py-2 whitespace-nowrap">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                    <td className="px-6 py-2 whitespace-nowrap">{college.name}</td>
                    <td className="px-6 py-2 whitespace-nowrap">{college.code || '-'}</td>
                    <td className="px-6 py-2 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${!college.disabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {!college.disabled ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap">{college.sequence ?? '-'}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(college)}>
                          <Pencil className="h-4 w-4 text-blue-500" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
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
                              <AlertDialogAction onClick={() => college.id && handleDelete(college.id)} className="bg-red-600 hover:bg-red-700">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
