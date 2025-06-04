"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Upload, Download, Loader2 } from "lucide-react";
import { CourseDialog } from "./course-dialog";
import { deleteCourse, downloadCourses, handleCourseSubmit, uploadCoursesFromFile } from "./actions";
import { type Course } from "@/db/schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CourseListProps {
  initialCourses: Course[];
}

export function CourseList({ initialCourses }: CourseListProps) {
  const [isPendingUpload, startUploadTransition] = useTransition();
  const [isPendingDownload, startDownloadTransition] = useTransition();
  const [isPendingDelete, startDeleteTransition] = useTransition();
  // We'll use initialCourses passed from the server

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <div className="flex items-center gap-4">
           <form action={uploadCoursesFromFile} className="flex items-center gap-2">
            <Label htmlFor="course-upload" className="sr-only">Upload Courses File</Label>
            <Input id="course-upload" type="file" name="file" accept=".csv, .xlsx" className="max-w-sm" />
            <Button type="submit" size="sm" disabled={isPendingUpload}>
              {isPendingUpload ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload File
            </Button>
          </form>
          <form action={async () => {
            startDownloadTransition(async () => {
              await downloadCourses();
            });
          }}>
            <Button type="submit" variant="outline" size="sm" disabled={isPendingDownload}>
              {isPendingDownload ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Download Courses
            </Button>
          </form>
          <CourseDialog mode="add" />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Sr. No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Short Name</TableHead>
              <TableHead>Code Prefix</TableHead>
              <TableHead>University Code</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialCourses.map((course, index) => (
              <TableRow key={`course-${course.id}-${index}`}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.shortName}</TableCell>
                <TableCell>{course.codePrefix}</TableCell>
                <TableCell>{course.universityCode}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <CourseDialog mode="edit" course={course}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </CourseDialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isPendingDelete}>
                          {isPendingDelete ? (
                             <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                             <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the course:
                            <span className="font-medium"> {course.name}</span>.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={async () => {
                            startDeleteTransition(async () => {
                              if (course.id) {
                                await deleteCourse(course.id);
                              } else {
                                console.error("Error deleting course: Missing ID.");
                              }
                            });
                          }}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 