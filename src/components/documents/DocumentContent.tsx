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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScanDoc } from "@/lib/services/docs";

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
      title: "Registration Certificate",
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
interface DocumentContentProps {
  scannedDocs: ScanDoc[];
}

export default function DocumentContent({ scannedDocs }: DocumentContentProps) {
  console.log(scannedDocs);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white py-10 px-6 mb-8 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-400 mix-blend-overlay blur-2xl"></div>
          <div className="absolute right-40 top-20 w-32 h-32 rounded-full bg-purple-400 mix-blend-overlay blur-xl"></div>
          <div className="absolute left-20 bottom-10 w-48 h-48 rounded-full bg-indigo-300 mix-blend-overlay blur-2xl"></div>
          <div className="absolute inset-0 bg-[url('/illustrations/dots-pattern.svg')] opacity-5"></div>
        </div>
        <div className="max-w-6xl mx-auto relative">
          <div className="flex items-center">
            <div className="mr-5 bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-white/10">
              <FileText size={36} className="text-white drop-shadow-md" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-md">
                Academic Documents
              </h1>
              <p className="text-blue-50 text-lg drop-shadow max-w-2xl">
                Access and manage all your important academic documents in one
                place
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="bg-white/70 backdrop-blur-sm px-5 py-3 rounded-xl shadow-sm border border-indigo-100">
            <Tabs
              value={selectedView}
              onValueChange={setSelectedView}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-[360px] bg-indigo-50">
                <TabsTrigger
                  value="marksheets"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
                >
                  Marksheets
                </TabsTrigger>
                <TabsTrigger
                  value="other-documents"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                >
                  Other Documents
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {selectedView === "marksheets" && (
            <div className="mt-4 sm:mt-0">
              <Select
                value={selectedSemester}
                onValueChange={setSelectedSemester}
              >
                <SelectTrigger className="w-[180px] border-indigo-200 bg-white/80 backdrop-blur-sm">
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

        <Tabs
          value={selectedView}
          onValueChange={setSelectedView}
          className="mt-0"
        >
          <TabsContent value="marksheets">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockDocuments.marksheets[
                selectedSemester as unknown as keyof typeof mockDocuments.marksheets
              ]?.map((doc) => (
                <Card
                  key={doc.id}
                  className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30 group"
                >
                  <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 w-full"></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center text-gray-800 group-hover:text-blue-700 transition-colors">
                          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-lg mr-3 text-white shadow-md">
                            <FileText className="w-5 h-5" />
                          </div>
                          <span className="font-semibold">{doc.title}</span>
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-2 ml-12 flex items-center">
                          <span className="h-2 w-2 rounded-full bg-blue-400 mr-2"></span>
                          Issue Date: {doc.issueDate}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 pb-5">
                    <div className="flex space-x-3 mt-4">
                      <Button
                        variant="outline"
                        className="border-blue-100 hover:border-blue-200 hover:bg-blue-50 text-gray-600 hover:text-blue-700 transition-colors"
                        onClick={() => handlePreview(doc.downloadUrl)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
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
                <Card
                  key={cert.id}
                  className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50/30 group"
                >
                  <div className="h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 w-full"></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center text-gray-800 group-hover:text-purple-700 transition-colors">
                          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2.5 rounded-lg mr-3 text-white shadow-md">
                            <FileText className="w-5 h-5" />
                          </div>
                          <span className="font-semibold">{cert.title}</span>
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-2 ml-12 flex items-center">
                          <span className="h-2 w-2 rounded-full bg-purple-400 mr-2"></span>
                          Issue Date: {cert.issueDate}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 pb-5">
                    <div className="flex space-x-3 mt-4">
                      <Button
                        variant="outline"
                        className="border-purple-100 hover:border-purple-200 hover:bg-purple-50 text-gray-600 hover:text-purple-700 transition-colors"
                        onClick={() => handlePreview(cert.downloadUrl)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all"
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
      </div>

      {/* PDF Preview Modal */}
      {previewUrl && (
        <Dialog open={!!previewUrl} onOpenChange={closePreview}>
          <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 border-none rounded-xl shadow-2xl overflow-hidden">
            <button
              onClick={closePreview}
              className="absolute right-4 top-4 z-50 text-gray-500 hover:text-gray-700 bg-white/80 hover:bg-white rounded-lg p-2 transition-colors"
              aria-label="Close PDF Preview"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={previewUrl}
              width="100%"
              height="100%"
              className="border-none"
              title="PDF Preview"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
