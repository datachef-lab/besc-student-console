"use server";

import { db, dbPostgres } from "@/db";
import { courses } from "@/db/schema";
import { findAllCourse } from "@/lib/services/course.service";

export async function getCourses() {
    return await dbPostgres.select().from(courses);
}