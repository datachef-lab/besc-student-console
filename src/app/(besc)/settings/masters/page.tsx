import React from "react";
import db from "@/db";
import { courses } from "@/db/schema";
import { desc } from "drizzle-orm";
import { CourseList } from "./course-list";

export default async function MastersPage() {
  const allCourses = await db.select().from(courses).orderBy(desc(courses.createdAt));

  return (
    <CourseList initialCourses={allCourses} />
  );
}
