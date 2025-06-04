import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil } from "lucide-react";
import { courses } from "@/db/schema";
import { type Course } from "@/db/schema";
import { handleCourseSubmit } from "./actions";

interface CourseDialogProps {
  mode: "add" | "edit";
  course?: Course;
  children?: React.ReactNode;
}

export function CourseDialog({ mode, course, children }: CourseDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button>
            {mode === "add" ? (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </>
            ) : (
              <>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Course
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Course" : "Edit Course"}
          </DialogTitle>
        </DialogHeader>
        <form action={(formData) => handleCourseSubmit(formData, course)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Course Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={course?.name ?? ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortName">Short Name</Label>
            <Input
              id="shortName"
              name="shortName"
              defaultValue={course?.shortName ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="codePrefix">Code Prefix</Label>
            <Input
              id="codePrefix"
              name="codePrefix"
              defaultValue={course?.codePrefix ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="universityCode">University Code</Label>
            <Input
              id="universityCode"
              name="universityCode"
              defaultValue={course?.universityCode ?? ""}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">
              {mode === "add" ? "Add Course" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 