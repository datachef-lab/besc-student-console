"use client";

import React, { useState, useTransition, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Upload, Download, Loader2, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { BoardUniversityDialog } from "./board-university-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast"; // Assuming useToast is available
import * as XLSX from 'xlsx'; // Assuming xlsx is installed

// Import placeholder actions for upload/download (assuming they exist in ./actions)
import { uploadBoardUniversitiesFromFile, downloadBoardUniversities } from './actions';

// Assuming a type definition for BoardUniversity exists in your schema file
import { type BoardUniversity } from "@/db/schema";

// Define the expected return type for the placeholder downloadBoardUniversities action
interface DownloadBoardUniversitiesResult {
  success: boolean;
  data?: { boardUniversities: BoardUniversity[] };
  error?: string;
}

// Define items per page (placeholder for now)
const ITEMS_PER_PAGE = 10;

// Placeholder required headers for board university template (adjust as needed)
const REQUIRED_HEADERS = ['name', 'code'];

export default function BoardUniversitiesPage() {
  // Using dummy data for now as requested
  const [data, setData] = useState<BoardUniversity[]>([]); // Initialize with empty array

  const [isPendingUpload, startUploadTransition] = useTransition();
  const [isPendingDownload, startDownloadTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [numberOfEntries, setNumberOfEntries] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1); // State for current page (placeholder)
  const [totalCount, setTotalCount] = useState(0); // Placeholder total count
  const [loading, setLoading] = useState(true); // Add loading state

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast(); // Assuming useToast is available

  // Placeholder total pages calculation
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Function to fetch paginated board universities from the API
  const fetchBoardUniversities = async (page: number, limit: number) => {
    setLoading(true);
    try {
      // Assuming your API endpoint for board universities is /api/board-universities and supports pagination via query params
      const response = await fetch(`/api/board-universities?page=${page}&limit=${limit}`);
      const result = await response.json();

      if (result.success) {
        setData(result.boardUniversities); // Assuming the API returns board universities in a 'boardUniversities' field
        setTotalCount(result.totalCount); // Assuming the API returns total count in a 'totalCount' field
      } else {
        toast({
          title: "Failed to fetch board universities",
          description: result.error || "An error occurred while fetching data.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching board universities:", error);
      toast({
        title: "Failed to fetch board universities",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when currentPage changes
  useEffect(() => {
    fetchBoardUniversities(currentPage, ITEMS_PER_PAGE);
  }, [currentPage]); // Dependency on currentPage for pagination

  const downloadTemplate = () => {
    // Create a sample row with empty values
    const sampleData = [
      REQUIRED_HEADERS,
      ['', ''], // Empty row for example
      ['Sample University Name', 'SUN'], // Example row
    ];

    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(sampleData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'BoardUniversity Template');

    // Generate Excel file
    XLSX.writeFile(wb, 'board_university_template.xlsx');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];
          
          if (jsonData.length > 1) { // Subtract 1 for header row
            setNumberOfEntries(jsonData.length - 1);
          } else {
            setNumberOfEntries(0);
          }
          
          // We'll still do full validation on submit
        } catch (error) {
          console.error("Error reading file for entry count:", error);
          setSelectedFile(null);
          setNumberOfEntries(0);
          toast({
            title: "Error Reading File",
            description: "Could not read the selected file.",
            variant: "destructive",
          });
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setSelectedFile(null);
      setNumberOfEntries(0);
    }
  };

  const validateFile = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];
          const headers = (jsonData[0] as string[]).map(h => h.trim());
          
          const missingHeaders = REQUIRED_HEADERS.filter(h => !headers.includes(h));
          
          if (missingHeaders.length > 0) {
            toast({
              title: "Invalid File Format",
              description: `Missing required headers: ${missingHeaders.join(', ')}`,
              variant: "destructive",
            });
            resolve(false);
          } else {
            resolve(true);
          }
        } catch (error) {
          toast({
            title: "Invalid File Format",
            description: "Please upload a valid Excel file",
            variant: "destructive",
          });
          resolve(false);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUploadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Upload button clicked");
    if (!selectedFile) {
      console.log("No file selected");
      toast({
        title: "No File Selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    console.log("File selected, validating...");
    const isValid = await validateFile(selectedFile);
    if (!isValid) {
      console.log("File validation failed");
      return;
    }

    console.log("File valid, preparing formData...");
    const formData = new FormData();
    formData.append('file', selectedFile);

    console.log("Starting upload transition...");
    startUploadTransition(async () => {
      console.log("Inside upload transition, calling uploadBoardUniversitiesFromFile...");
      const result = await uploadBoardUniversitiesFromFile(formData); // Use board university specific action
      console.log("uploadBoardUniversitiesFromFile result:", result);
      if (!result.success) {
        console.error("Upload failed with error:", result.error);
        toast({
          title: "Upload Failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        console.log("Upload successful");
        toast({
          title: "Upload Successful",
          description: "Board universities have been uploaded successfully",
        });
        setSelectedFile(null);
        setNumberOfEntries(0);
        // Clear the file input
        if(fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // Refresh data after upload
        fetchBoardUniversities(currentPage, ITEMS_PER_PAGE);
      }
    });
  };

  const handlePageChange = (newPage: number) => {
    // This is a placeholder. Implement actual pagination fetching here.
    console.log("Page change requested:", newPage);
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDownloadClick = () => {
    startDownloadTransition(async () => {
      console.log("Download button clicked, calling downloadBoardUniversities server action...");
      const result: DownloadBoardUniversitiesResult = await downloadBoardUniversities(); // Use board university specific action and type assertion
      console.log("downloadBoardUniversities server action result:", result);

      if (result.success && result.data) {
        try {
          console.log("Received data, generating XLSX...");
          // Assuming the downloadBoardUniversities action returns an object with a 'boardUniversities' key
          const ws = XLSX.utils.json_to_sheet(result.data.boardUniversities);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "BoardUniversities");
          XLSX.writeFile(wb, "all_board_universities.xlsx");
          console.log("XLSX file generated and download triggered.");
        } catch (error) {
          console.error("Error generating or downloading XLSX:", error);
          toast({
            title: "Download Failed",
            description: "Could not generate Excel file.",
            variant: "destructive",
          });
        }
      } else if (!result.success) {
         console.error("Download failed with error from server action:", result.error);
         toast({
           title: "Download Failed",
           description: result.error || "Failed to fetch board universities for download.",
           variant: "destructive",
         });
      }
    });
  };

  // Placeholder for handleAddSuccess
  const handleAddSuccess = () => {
    fetchBoardUniversities(currentPage, ITEMS_PER_PAGE);
  };

  // Placeholder for handleEdit
  const handleEdit = (boardUniversity: BoardUniversity) => {
    // Implement logic to set the boardUniversity data to a state for the edit modal
    console.log("Edit clicked for:", boardUniversity);
    // Example: setEditingBoardUniversity(boardUniversity);
  };

  // Placeholder for handleEditSuccess
  const handleEditSuccess = () => {
    // Close edit modal and refresh data
    // Example: setEditingBoardUniversity(null);
    fetchBoardUniversities(currentPage, ITEMS_PER_PAGE);
  };

  // Placeholder for handleDelete
  const handleDelete = async (id: number) => {
    console.log("Delete clicked for ID:", id);
    // Implement delete API call and refresh data
    // Example: const result = await deleteBoardUniversity(id);
    // if (result.success) { fetchBoardUniversities(currentPage, ITEMS_PER_PAGE); }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Board / Universities Management</h1> {/* Updated title */}
        <div className="flex flex-wrap justify-between items-center gap-3"> {/* Container for both button groups */}
           
           {/* Upload/Download Template Group */}
           <div className="flex items-center gap-2"> {/* Group for upload and template */}
             {/* Upload Section */}
             <form onSubmit={handleUploadSubmit} className="flex items-center gap-2"> {/* Changed to onSubmit */}
              {/* Hidden file input */}
              <Input
                id="board-university-upload"
                type="file"
                name="file"
                accept=".csv, .xlsx"
                className="hidden"
                onChange={handleFileSelect} // Added onChange
                ref={fileInputRef}
              />
              {/* Choose File Button */}
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
              >
                <Upload size={20} />
                Choose File
              </Button>

              {/* Display selected file info */}
              {selectedFile && (
                <span className="text-sm text-gray-600">
                  {selectedFile.name} ({numberOfEntries} entries)
                </span>
              )}
              
              {/* Upload File Button */}
              <Button type="submit" size="sm" disabled={!selectedFile || isPendingUpload}
                className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
              >
              {isPendingUpload ? (
                  <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
              ) : (
                  <>
                <Upload className="mr-2 h-4 w-4" />
                    Upload File
                  </>
                )}
              </Button>
            </form>
            {/* Download Template Button */}
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={downloadTemplate} // Added onClick
              className="bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2"
            >
              <FileText size={20} />
              Download Template
            </Button>
           </div>

           {/* Add/Download Board Universities Group */}
           <div className="flex items-center gap-2"> {/* Group for add and download, adjusted gap */}
             {/* Add Board University Dialog Trigger */}
             <BoardUniversityDialog />
             {/* Download Board Universities Button */}
             <Button 
              type="button" // Changed to type button
              variant="outline" 
              size="sm" 
              onClick={handleDownloadClick} // Added onClick
              disabled={isPendingDownload} // Added disabled state
              className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-2"
             >
              {isPendingDownload ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                <Download className="mr-2 h-4 w-4" />
                  Download Board Universities {/* Changed text */}
                </>
              )}
            </Button>
           </div>
        </div>
      </div>
      
      {/* Table Container matching Courses page style */}
      <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden"> {/* Adjusted styling */}
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50"> {/* Added styling */}
              <TableHead className="w-[80px] font-semibold text-gray-700">Sr. No</TableHead> {/* Added styling */}
              <TableHead className="font-semibold text-gray-700">Name</TableHead> {/* Added styling */}
              <TableHead className="font-semibold text-gray-700">Code</TableHead> {/* Added styling */}
              <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead> {/* Added styling and alignment */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Loading state (placeholder) */}
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Loading board universities...</TableCell>
              </TableRow>
            ) : data.length === 0 ? ( // Assuming data is your state for table rows
              <TableRow>
                <TableCell colSpan={4} className="text-center">No board universities found.</TableCell>
              </TableRow>
            ) : (
              data.map((boardUniversity, index) => ( // Mapping over data state
                <TableRow key={`board-university-${boardUniversity.id}-${index}`} className="hover:bg-gray-50"> {/* Added styling */}
                  <TableCell className="font-medium text-gray-600">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell> {/* Added styling and dynamic Sr. No */}
                  <TableCell className="text-gray-700">{boardUniversity.name}</TableCell> {/* Added styling */}
                   <TableCell className="text-gray-700">{boardUniversity.code}</TableCell> {/* Added styling */}
                  <TableCell className="text-right"> {/* Added styling */}
                    <div className="flex justify-end gap-2"> {/* Added styling */}
                      {/* Edit Button */}
                      <Button variant="ghost" size="icon" className="hover:bg-gray-100" onClick={() => handleEdit(boardUniversity)}> {/* Added styling and onClick */}
                        <Pencil className="h-4 w-4 text-blue-500" /> {/* Added styling */}
                      </Button>
                      {/* Delete Button (Placeholder) */}
                      {/* You would add a delete button here if needed */}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls (Placeholder) */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center space-x-2 py-4"> {/* Added styling */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-gray-700"> {/* Added styling */}
            Page {currentPage} of {totalPages} {/* Placeholder values */}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
