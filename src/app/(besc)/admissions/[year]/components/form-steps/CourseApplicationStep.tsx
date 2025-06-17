import { useState, useEffect } from "react";
import { AdmissionCourseApplication, ApplicationForm, Course } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode } from 'react';
import { getCourses } from "../../action";

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
    // if (availableCourses && availableCourses.length > 0) {
    //   setCourses(availableCourses.map(course => ({
    //     ...course,
    //     selected: false,
    //   })));
    // }
    fetchCourses();
  }, []); // Dependency array includes availableCourses

  const fetchCourses = async () => {
    try {
      // const response = await fetch("/api/admissions/courses");
      const data = await getCourses();
      // console.log("courses:", data)
      setCourses(data);

    } catch (error) {
      console.log(error)
    }
  }

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
    <div className="space-y-6 p-2 sm:p-4">
      <div className="mb-4">
        <h2 className="text-base sm:text-lg font-semibold mb-2">Step 3 of 5 - Course Selection</h2>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-lg shadow p-3 sm:p-4 text-left text-xs sm:text-sm">
          <p className="font-semibold mb-2">Please Note:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Course / Session selected here can not be Removed once Saved.</li>
            <li>Multiple course/sessions can be added later on using the same login details sent via SMS/Email in your registered mobile no or email ID.</li>
          </ol>
        </div>
      </div>

      <h3 className="text-base sm:text-lg font-semibold mb-2">18. Course Selection</h3>

      {/* Desktop Table View */}
      <div className="hidden w-full sm:block rounded-md border max-h-[300px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">Sl</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Select</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course, index) => (
                <tr key={course.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{course.name}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">
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

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {courses.map((course, index) => (
          <div key={course.id} className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900">{index + 1}.</span>
                <span className="text-sm text-gray-500">{course.name}</span>
              </div>
              {typeof course.id === 'number' && (
                <Checkbox
                  checked={courseApplication.some(crs => crs.courseId === course.id)}
                  onCheckedChange={(isChecked: boolean) => handleCourseSelect(course.id as number, isChecked)}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-end gap-2 mt-6">
        <Label className="text-sm font-medium">Total Application Fees to be paid:</Label>
        <div className="flex items-center gap-1">
          <span className="text-sm">₹</span>
          <Input type="text" value="" className="w-24 text-right" readOnly />
          <span className="text-sm">.00</span>
        </div>
      </div>

    </div>
  );
}
