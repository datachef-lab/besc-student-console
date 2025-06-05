'use client';

import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AddNationalityDialog } from './nationality-dialog';
import { uploadNationalitiesFromFile, downloadNationalities } from './actions';

// Dummy data for demonstration
const dummyData = [
  { id: '1', name: 'Indian', createdAt: new Date('2024-01-01') },
  { id: '2', name: 'American', createdAt: new Date('2024-01-02') },
  { id: '3', name: 'British', createdAt: new Date('2024-01-03') },
  { id: '4', name: 'Canadian', createdAt: new Date('2024-01-04') },
  { id: '5', name: 'Australian', createdAt: new Date('2024-01-05') },
];

export default function Nationalities() {
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await uploadNationalitiesFromFile(formData);
      if (result.success) {
        console.log('Success: Nationalities uploaded successfully');
      } else {
        console.error('Error: Failed to upload nationalities', result.error);
      }
    } catch (error) {
      console.error('Error: An error occurred while uploading', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const result = await downloadNationalities();
      if (result.success) {
        console.log('Success: Nationalities downloaded successfully');
      } else {
        console.error('Error: Failed to download nationalities', result.error);
      }
    } catch (error) {
      console.error('Error: An error occurred while downloading', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Nationalities</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="w-[200px]"
            />
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? 'Downloading...' : 'Download'}
            </Button>
          </div>
          <AddNationalityDialog />
        </div>
      </div>
      <div className="rounded-md border">
        <DataTable columns={columns} data={dummyData} />
      </div>
    </div>
  );
}
