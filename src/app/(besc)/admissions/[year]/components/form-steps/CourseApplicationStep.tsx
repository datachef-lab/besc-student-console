import { useState, useEffect } from "react";
import { AdmissionCourseApplication, ApplicationForm, Course } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode } from 'react';
import { getCourses } from "../../action";
import { toast } from "@/components/ui/use-toast";

interface CourseApplicationStepProps {
  stepNotes: React.ReactNode;
  applicationForm: ApplicationFormDto;
  onNext: () => void;
  onPrev: () => void;
}

interface CourseWithSelection extends Course {
  selected: boolean;
  
}

export default function CourseApplicationStep({
  applicationForm,
  availableCourses,
  stepNotes,
  onNext,
  onPrev
}: CourseApplicationStepProps) {
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (selectedCourses.length === 0) {
      errors.courses = "Please select at least one course";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before proceeding",
        variant: "destructive",
        onClose: () => {},
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = {
        form: {
          admissionId: applicationForm.admissionId,
          status: "DRAFT",
          currentStep: 3,
          admissionStep: "COURSE_APPLICATION"
        },
        courseApplications: selectedCourses.map(courseId => ({
          applicationFormId: applicationForm.id,
          courseId: courseId
        }))
      };

      const response = await fetch("/api/admissions/application-forms", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save form");
      }

      toast({
        title: "Success",
        description: "Form saved successfully",
        onClose: () => {},
      });

      onNext();
    } catch (error) {
      console.error("Error saving form:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save form",
        variant: "destructive",
        onClose: () => {},
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      onPrev();
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">{stepHeading || "Step 3 of 5 - Course Application"}</h2>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-lg shadow p-4 text-left">
          {stepNotes}
        </div>
      </div>

      {/* Course Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select Your Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableCourses?.map((course) => (
            <div key={course.id} className="flex items-center space-x-2">
              <Checkbox
                id={`course-${course.id}`}
                checked={selectedCourses.includes(course.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedCourses([...selectedCourses, course.id]);
                  } else {
                    setSelectedCourses(selectedCourses.filter(id => id !== course.id));
                  }
                }}
              />
              <Label htmlFor={`course-${course.id}`}>{course.name}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isSubmitting}
          >
            Previous
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save & Continue"}
        </Button>
      </div>

      {/* Display validation errors */}
      {Object.keys(formErrors).length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <h4 className="text-red-800 font-semibold mb-2">Please fix the following errors:</h4>
          <ul className="list-disc list-inside text-red-700">
            {Object.entries(formErrors).map(([field, error]) => (
              <li key={field}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
