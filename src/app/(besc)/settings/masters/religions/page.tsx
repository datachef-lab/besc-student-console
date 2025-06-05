'use client';

import { useState } from 'react';
import { columns, Religion } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { AddReligionDialog } from './religion-dialog';
import { Button } from '@/components/ui/button';
import { uploadReligionsFromFile, downloadReligions } from './actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormStatus } from 'react-dom';
import { Loader2, Upload, Download } from 'lucide-react';

// Dummy data for Religions
const dummyReligions: Religion[] = [
  {
    id: '1',
    name: 'Hinduism',
    createdAt: new Date('2023-01-15')
  },
  {
    id: '2',
    name: 'Islam',
    createdAt: new Date('2023-02-20')
  },
  {
    id: '3',
    name: 'Christianity',
    createdAt: new Date('2023-03-10')
  },
  {
    id: '4',
    name: 'Buddhism',
    createdAt: new Date('2023-04-05')
  },
  {
    id: '5',
    name: 'Sikhism',
    createdAt: new Date('2023-05-01')
  }
];

export default function ReligionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | undefined>(undefined);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setUploadError('Please select a file to upload.');
      return;
    }
    setIsUploading(true);
    setUploadError(undefined);
    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadReligionsFromFile(formData);
    if (!result.success) {
      setUploadError(result.error);
    } else {
      setFile(null); // Clear file input on success
      alert(result.message); // Or use a toast notification
    }
    setIsUploading(false);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadError(undefined);
    const result = await downloadReligions();
    if (!result.success) {
      setDownloadError(result.error);
    } else {
      alert(result.message); // Or handle file download directly
    }
    setIsDownloading(false);
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Religions</h2>
            <div className="flex items-center gap-4">
              {/* Upload Form */}
              <form onSubmit={handleFileUpload} className="flex items-center gap-2">
                <Label htmlFor="upload-religions" className="sr-only">Upload Religions File</Label>
                <Input
                  id="upload-religions"
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="max-w-xs"
                />
                <Button type="submit" disabled={isUploading || !file} variant="outline">
                  {isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </>
                  )}
                </Button>
                {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
              </form>

              {/* Download Button */}
              <Button onClick={handleDownload} disabled={isDownloading} variant="outline">
                {isDownloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </>
                )}
              </Button>

              {/* Add Religion Button */}
              <AddReligionDialog />
            </div>
          </div>
        </div>
        <div className="p-6">
          <DataTable columns={columns} data={dummyReligions} />
        </div>
      </div>
    </div>
  );
}
