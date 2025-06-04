"use server";

import db from "@/db";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { type Course } from "@/db/schema";

export async function deleteCourse(courseId: number) {
  await db.delete(courses).where(eq(courses.id, courseId));
  revalidatePath("/settings/masters");
}

export async function downloadCourses() {
  const allCourses = await db.select().from(courses).orderBy(courses.id);

  // Create CSV content
  const csvHeader = ["Sr. No", "Name", "Short Name", "Code Prefix", "University Code"].join(",") + "\n";
  const csvBody = allCourses.map((course, index) =>
    `${index + 1},${course.name},${course.shortName || ""},${course.codePrefix || ""},${course.universityCode || ""}`
  ).join("\n");

  const csvContent = csvHeader + csvBody;

  // Create a downloadable response
  const headers = new Headers();
  headers.append('Content-Type', 'text/csv');
  headers.append('Content-Disposition', 'attachment; filename="courses.csv"');

  return new NextResponse(csvContent, { headers });
}

export async function handleCourseSubmit(formData: FormData, course?: Course) {
  const name = formData.get("name") as string;
  const shortName = formData.get("shortName") as string;
  const codePrefix = formData.get("codePrefix") as string;
  const universityCode = formData.get("universityCode") as string;

  if (!course) { // Add mode
    await db.insert(courses).values({
      name,
      shortName,
      codePrefix,
      universityCode,
    });
  } else if (typeof course.id === 'number') { // Edit mode
    await db
      .update(courses)
      .set({
        name,
        shortName,
        codePrefix,
        universityCode,
      })
      .where(eq(courses.id, course.id));
  }

  revalidatePath("/settings/masters");
}

export async function uploadCoursesFromFile(formData: FormData) {
  "use server";
  const file = formData.get('file') as File;
  if (!file || file.size === 0) {
    console.error("No file uploaded or empty file.");
    return;
  }

  // TODO: Implement file parsing and database insertion
  console.log("Uploaded file:", file.name);
  
  // Revalidate path after upload
  // revalidatePath("/settings/masters");
} 