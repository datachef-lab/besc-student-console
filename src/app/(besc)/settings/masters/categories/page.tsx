'use client';

import { useState } from 'react';
import { columns, Category } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { AddCategoryDialog } from './category-dialog';
import { Button } from '@/components/ui/button';
import { uploadCategoriesFromFile, downloadCategories } from './actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormStatus } from 'react-dom';
import { Loader2, Upload, Download } from 'lucide-react';

// Dummy data for Categories
const dummyCategories: Category[] = [
  {
    id: '1',
    name: 'Science',
    createdAt: new Date('2023-01-15')
  },
  {
    id: '2',
    name: 'Arts',
    createdAt: new Date('2023-02-20')
  },
  {
    id: '3',
    name: 'Commerce',
    createdAt: new Date('2023-03-10')
  },
  {
    id: '4',
    name: 'Vocational',
    createdAt: new Date('2023-04-05')
  },
];

export default function CategoriesPage() {
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
    const result = await uploadCategoriesFromFile(formData);
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
    const result = await downloadCategories();
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
            <h2 className="text-2xl font-semibold">Categories</h2>
            <div className="flex items-center gap-4">
              {/* Upload Form */}
              <form onSubmit={handleFileUpload} className="flex items-center gap-2">
                <Label htmlFor="upload-categories" className="sr-only">Upload Categories File</Label>
                <Input
                  id="upload-categories"
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

              {/* Add Category Button */}
              <AddCategoryDialog />
            </div>
          </div>
        </div>
        <div className="p-6">
          <DataTable columns={columns} data={dummyCategories} />
        </div>
      </div>
    </div>
  );
}
