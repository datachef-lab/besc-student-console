"use client";
import { useState } from "react";
import { FormData, Step } from "./types";
import {
  ProgressTimeline,
  NavigationButtons,
  GeneralInfoStep,
  AcademicInfoStep,
  CourseApplicationStep,
  AdditionalInfoStep,
  PaymentStep,
} from "./components";

export default function StudentSignupForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    // General Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",

    // Academic Information
    previousEducation: "",
    gpa: "",
    graduationYear: "",
    institution: "",
    major: "",
    academicReferences: "",

    // Course Application
    program: "",
    startDate: "",
    studyMode: "",
    campus: "",
    specializations: [],

    // Additional Information
    workExperience: "",
    extracurriculars: "",
    personalStatement: "",
    emergencyContact: "",
    emergencyPhone: "",

    // Payment
    paymentMethod: "",
    scholarships: false,
    financialAid: false,
  });

  const steps: Step[] = [
    { number: 1, title: "General Information" },
    { number: 2, title: "Academic Information" },
    { number: 3, title: "Course Application" },
    { number: 4, title: "Additional Information" },
    { number: 5, title: "Payment" },
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    alert("Application submitted successfully!");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <GeneralInfoStep
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <AcademicInfoStep
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <CourseApplicationStep
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 4:
        return (
          <AdditionalInfoStep
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 5:
        return (
          <PaymentStep
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ProgressTimeline currentStep={currentStep} steps={steps} />

      {/* Form Content */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {renderStepContent()}

        <NavigationButtons
          currentStep={currentStep}
          totalSteps={steps.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
