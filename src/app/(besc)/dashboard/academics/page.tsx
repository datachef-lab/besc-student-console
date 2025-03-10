"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// Mock data - replace with actual data from your backend
const mockDocuments = {
  marksheets: {
    1: [
      {
        id: "ms-1-1",
        title: "First Semester Marksheet",
        type: "marksheet",
        semester: 1,
        issueDate: "2024-01-15",
        downloadUrl:
          "https://www.bakeru.edu/images/pdf/SOE/EdD_Theses/Kelly_Vickie.pdf",
      },
      {
        id: "ms-1-2",
        title: "First Semester Backlog Marksheet",
        type: "marksheet",
        semester: 1,
        issueDate: "2024-02-20",
        downloadUrl:
          "https://www.bakeru.edu/images/pdf/SOE/EdD_Theses/Kelly_Vickie.pdf",
      },
    ],
    2: [
      {
        id: "ms-2-1",
        title: "Second Semester Marksheet",
        type: "marksheet",
        semester: 2,
        issueDate: "2024-06-30",
        downloadUrl:
          "https://www.bakeru.edu/images/pdf/SOE/EdD_Theses/Kelly_Vickie.pdf",
      },
    ],
  },
  otherDocuments: [
    {
      id: "cert-1",
      title: "Course Completion Certificate",
      type: "certificate",
      issueDate: "2024-03-15",
      downloadUrl:
        "https://www.bakeru.edu/images/pdf/SOE/EdD_Theses/Kelly_Vickie.pdf",
    },
    {
      id: "cert-2",
      title: "Merit Certificate",
      type: "certificate",
      issueDate: "2024-02-10",
      downloadUrl:
        "https://www.bakeru.edu/images/pdf/SOE/EdD_Theses/Kelly_Vickie.pdf",
    },
    {
      id: "cert-3",
      title: "Internship Certificate",
      type: "certificate",
      issueDate: "2024-01-20",
      downloadUrl:
        "https://www.bakeru.edu/images/pdf/SOE/EdD_Theses/Kelly_Vickie.pdf",
    },
  ],
};

export default function DocumentsPage() {
  const [selectedSemester, setSelectedSemester] = useState<string>("1");
  const [selectedView, setSelectedView] = useState<string>("marksheets");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDownload = async (downloadUrl: string) => {
    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadUrl.split("/").pop() || "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download document. Please try again.");
    }
  };

  const handlePreview = (downloadUrl: string) => {
    setPreviewUrl(downloadUrl);
  };

  const closePreview = () => {
    setPreviewUrl(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold">Academics Dashboard</h1>

        {selectedView === "marksheets" && (
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Select
              value={selectedSemester}
              onValueChange={setSelectedSemester}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <SelectItem key={sem} value={sem.toString()}>
                    Semester {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="mb-4">
          <TabsTrigger value="marksheets">Marksheets</TabsTrigger>
          <TabsTrigger value="other-documents">Other Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="marksheets">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockDocuments.marksheets[
              selectedSemester as keyof typeof mockDocuments.marksheets
            ]?.map((doc) => (
              <Card key={doc.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        {doc.title}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Issue Date: {doc.issueDate}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(doc.downloadUrl)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDownload(doc.downloadUrl)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="other-documents">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockDocuments.otherDocuments.map((cert) => (
              <Card key={cert.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        {cert.title}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Issue Date: {cert.issueDate}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(cert.downloadUrl)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDownload(cert.downloadUrl)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* PDF Preview Modal */}
      {previewUrl && (
        <Dialog open={!!previewUrl} onOpenChange={closePreview}>
          <DialogContent className="max-w-4xl h-[80vh] p-0">
            <DialogTitle className="sr-only">PDF Document Preview</DialogTitle>
            <div className="relative w-full h-full">
              <button
                onClick={closePreview}
                className="absolute top-4 right-4 z-50 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                aria-label="Close PDF Preview"
              >
                <X className="w-6 h-6" />
              </button>
              <iframe
                src={previewUrl}
                width="100%"
                height="100%"
                className="border-none"
                title="PDF Preview"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
