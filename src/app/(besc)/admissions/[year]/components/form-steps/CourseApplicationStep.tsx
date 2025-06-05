import { useState, useEffect } from "react";
import { FormData } from "../../types";
import { AdmissionCourseApplication, ApplicationForm, Course } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode } from 'react';

interface CourseApplicationStepProps {
  applicationForm: ApplicationForm,
  availableCourses?: Course[]; // Make availableCourses optional to prevent the error if not provided initially
  stepNotes?: ReactNode; // Add stepNotes prop
}

// Remove CourseSelection interface as we will use Course from schema + local state for selection
// interface CourseSelection {
//   id: number;
//   name: string;
//   selected: boolean;
// }

interface CourseWithSelection extends Course {
  selected: boolean;
  
}

export default function CourseApplicationStep({ applicationForm, availableCourses }: CourseApplicationStepProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseApplication, setCourseApplication] = useState<AdmissionCourseApplication[]>([]);

  useEffect(() => {
    // Populate courses state from availableCourses prop when it becomes available
    if (availableCourses && availableCourses.length > 0) {
      setCourses(availableCourses.map(course => ({
        ...course,
        selected: false,
      })));
    }
  }, [availableCourses]); // Dependency array includes availableCourses

  const handleCourseSelect = (courseId: number, isSelected: boolean) => {
    if (isSelected) {
      setCourseApplication((prev) => [...prev, {
        courseId,
        applicationFormId: applicationForm.id!,
      }])
    }
    else {
      setCourseApplication(courseApplication.filter(crs => crs.courseId != courseId));
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Step 3 of 5 - Course Selection</h2>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-lg shadow p-4 text-left text-sm">
          <p className="font-semibold mb-2">Please Note:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Course / Session selected here can not be Removed once Saved.</li>
            <li>Multiple course/sessions can be added later on using the same login details sent via SMS/Email in your registered mobile no or email ID.</li>
          </ol>
        </div>
      </div>

      {/* Add heading for Course Selection table */}
      <h3 className="text-lg font-semibold mb-2">18. Course Selection</h3>

      <div className="overflow-x-auto rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sl</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Render courses only if they are loaded */}
            {courses.map((course, index) => (
              <tr key={course.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                {/* Assuming Course schema has a 'name' property */}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{course.name}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {/* Ensure course.id is a number before calling handleCourseSelect */}
                  {typeof course.id === 'number' && (
                    <Checkbox
                      checked={courseApplication.some(crs => crs.courseId === course.id)}
                      onCheckedChange={(isChecked: boolean) => handleCourseSelect(course.id as number, isChecked)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end space-x-2 mt-4">
        <Label className="text-sm font-medium">Total Application Fees to be paid:</Label>
        <span className="text-sm">₹</span>
        <Input type="text" value="" className="w-24 text-right" readOnly />{/* Placeholder for fee */} 
        <span className="text-sm">.00</span>
      </div>

      <div className="flex justify-end mt-6">
        <Button>Submit</Button>
      </div>
    </div>
  );
}
