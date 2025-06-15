"use server";

import { revalidatePath } from "next/cache";
import * as XLSX from 'xlsx';
import { createCollege, getColleges } from "@/lib/services/college.service";
import { createCollegesSchema } from "@/db/schema";

export async function uploadCollegesFromFile(formData: FormData): Promise<{ success: boolean; message?: string; error?: string }> {
  const file = formData.get('file') as File;
  if (!file) {
    return { success: false, error: "No file provided." };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet) as any[];

    const collegesToCreate = json.map(row => ({
      name: row.name,
      code: row.code ? String(row.code) : undefined,
    }));

    for (const collegeData of collegesToCreate) {
      const validatedData = createCollegesSchema.parse(collegeData);
      await createCollege(validatedData);
    }

    revalidatePath("/settings/masters/colleges");
    return { success: true, message: "Colleges uploaded successfully." };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to upload colleges." };
  }
}

export async function downloadColleges(): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    const colleges = await getColleges();

    const data = colleges.map(college => ({
      id: college.id,
      name: college.name,
      code: college.code,
      createdAt: college.createdAt?.toISOString(),
      updatedAt: college.updatedAt?.toISOString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Colleges");
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });

    return { success: true, data: wbout };
  } catch (error: any) {
    console.error("Error downloading colleges:", error);
    return { success: false, error: error.message || "Failed to download colleges." };
  }
}

export async function fetchPaginatedColleges(currentPage: number, itemsPerPage: number) {
  const colleges = await getColleges();

  const totalCount = colleges.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = colleges.slice(startIndex, endIndex);

  return {
    colleges: paginatedData,
    totalCount: totalCount,
  };
} 