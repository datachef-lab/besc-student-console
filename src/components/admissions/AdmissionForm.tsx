"use client";
import { useEffect, useState } from "react";
import { Step } from "@/app/(besc)/admissions/[year]/types";
import {
  ProgressTimeline,
  NavigationButtons,
  GeneralInfoStep,
  AcademicInfoStep,
  CourseApplicationStep,
  AdditionalInfoStep,
  PaymentStep,
} from "@/app/(besc)/admissions/[year]/components";
import Image from "next/image";
import { Admission, AdmissionGeneralInfo, ApplicationForm } from "@/db/schema";
import { useParams, useRouter } from "next/navigation";
import { AdmissionAcademicInfoDto, BoardUniversityDto } from "@/types/admissions";
import { AcademicSubjects, BoardUniversity, Payment, SportsInfo, StudentAcademicSubjects } from "@/db/schema";
import { useApplicationForm } from "@/hooks/use-application-form";
import { useToast } from "@/components/ui/use-toast";

// Notes for each step
const stepNotes: Record<number, React.ReactNode> = {
  1: (
    <div>
      <div>
        <b>Please Note :</b>
      </div>
      <ol className="list-decimal ml-5 mt-1 space-y-1 text-sm">
        <li>All the fields in the above Form are mandatory.</li>
        <li>
          Please cross check all the fields especially{" "}
          <b>Category, Gender & Mobile Number</b> before submitting the Form, as
          these fields are not editable afterwards.
        </li>
        <li>
          As per UGC directives in alignment with NEP 2020, all applicants
          seeking admission are required to create an Academic Bank of Credits
          (ABC) account. You will be required to submit this ABC ID at the time
          of registration to University of Calcutta.{" "}
          <a
            href="https://www.abc.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline"
          >
            Click here to create your ABC ID.
          </a>
        </li>
        <li>
          For Indian citizens applying for admission, it is mandatory to possess
          an Aadhar Card. Kindly ensure that you have your Aadhar and related
          ready to prevent any delays in the admission process.
        </li>
        <li>
          <span className="text-red-600 font-bold">Red dot</span> indicates
          mandatory field.
        </li>
      </ol>
    </div>
  ),
  2: (
    <div>
      <b>Please Note :</b>
      <ol className="list-decimal ml-5 mt-1 space-y-1 text-sm">
        <li>
          Candidates with "Pass Certificate Awarded" as their Class XII Board
          result are only eligible to apply.
        </li>
        <li>
          Fail / Compartmental students are not allowed to apply as per Calcutta
          University Norms.
        </li>
        <li>
          Fill-up your marks as per your class XII Board marksheet in the marks
          Entry option.
        </li>
        <li>
          In case your Board has not issued the Original Marksheet yet, you can
          proceed with your application by entering the marks as given in your
          Digital Marksheet.
        </li>
        <li>
          It is mandatory for students to provide the Original copy of the Class
          XII Board Marksheet at the time of document verification or when asked
          by the College, if selected.
        </li>
        <li>
          Applicants whose board is not listed in the drop-down, need to get an
          Equivalency Certificate from Equivalency Department of Calcutta
          University, College street campus.
        </li>
        <li>
          Once Board / Marks & Institute details are filled up, please click on
          Submit button to save and continue for course selection.
        </li>
        <li>
          <span className="text-red-600 font-bold">Red dot</span> indicates
          mandatory field.
        </li>
      </ol>
    </div>
  ),
  3: (
    <div>
      <b>Course Application Note:</b> Select your desired program and
      specialization carefully. Once submitted, changes may not be allowed.
    </div>
  ),
  4: (
    <div>
      <b>Please Note :</b>
      <ol className="list-decimal ml-5 mt-1 space-y-1 text-sm">
        <li>
          Sr. No. 19 cannot be same as Mobile Number and Whatsapp Number given
          in Step 1.
        </li>
        <li>
          In case of Physically challanged being 'Yes', relevant documents will
          be required at the time of admission, if Selected.
        </li>
        <li>
          <span className="text-red-600 font-bold">Red dot</span> indicates
          mandatory field.
        </li>
      </ol>
    </div>
  ),
  5: (
    <div>
      <b>Payment Note:</b> Review your payment details before proceeding.
      Application fees are non-refundable.
    </div>
  ),
};

export default function AdmissionForm() {
  const { toast } = useToast();
  const { applicationForm, setApplicationForm } = useApplicationForm();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [academicInfo, setAcademicInfo] = useState<AdmissionAcademicInfoDto>({
    applicationFormId: 0,
    boardUniversityId: 0,
    boardResultStatus: "PASS",
    instituteId: 0,
    languageMediumId: 0,
    yearOfPassing: new Date().getFullYear(),
    streamType: "SCIENCE",
    isRegisteredForUGInCU: false,
    subjects: []
  });

  useEffect(() => {
    if (applicationForm?.admissionStep) {
      // Map the admissionStep string to the corresponding step number
      const stepMap: Record<string, number> = {
        GENERAL_INFORMATION: 1,
        ACADEMIC_INFORMATION: 2,
        COURSE_APPLICATION: 3,
        ADDITIONAL_INFORMATION: 4,
        PAYMENT_INFORMATION: 5,
      };
      setCurrentStep(stepMap[applicationForm.admissionStep] || 1);
    }
  }, [applicationForm]);

  const steps: Step[] = [
    { number: 1, title: "General Information" },
    { number: 2, title: "Academic Information" },
    { number: 3, title: "Course Application" },
    { number: 4, title: "Additional Information" },
    { number: 5, title: "Payment" },
  ];

  const handleNext = async () => {
    if (currentStep === 1) {
      // Check if it's a new application or existing one
      const isNewApplication = !applicationForm?.id || !applicationForm?.generalInfo?.id || applicationForm.id === 0 || applicationForm.generalInfo.id === 0;

      try {
        setIsSubmitting(true);
        const formData = {
          form: {
            admissionId: applicationForm?.admissionId,
            status: "DRAFT",
            currentStep: 1,
            admissionStep: "GENERAL_INFORMATION"
          },
          generalInfo: applicationForm?.generalInfo
        };

        const response = await fetch("/api/admissions/application-forms", {
          method: isNewApplication ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to save form");
        }

        // Update the application form in context
        setApplicationForm(data);

        toast({
          title: "Success",
          description: "Form saved successfully",
          onClose: () => {},
        });

        // Proceed to next step
        setCurrentStep(currentStep + 1);
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
    } else {
      // For other steps, just move to next step
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", applicationForm);
    alert("Application submitted successfully!");
  };

  const renderStepContent = () => {
    if (!applicationForm) return null;

    switch (currentStep) {
      case 1:
        return (
          <GeneralInfoStep
            stepNotes={stepNotes[currentStep]}
            onNext={handleNext}
            onPrev={handlePrevious}
          />
        );
      case 2:
        return (
          <AcademicInfoStep
            stepNotes={stepNotes[currentStep]}
            applicationForm={applicationForm}
            academicInfo={academicInfo}
            setAcademicInfo={setAcademicInfo}
          />
        );
      case 3:
        if (!applicationForm) {
          return <div>Please complete all previous steps first.</div>;
        }
        return (
          <CourseApplicationStep
            stepNotes={stepNotes[currentStep]}
            applicationForm={applicationForm}
          />
        );
      case 4:
        if (!applicationForm.generalInfo) {
          return <div>Please complete the general information step first.</div>;
        }
        return (
          <AdditionalInfoStep
            stepNotes={stepNotes[currentStep]}
            applicationForm={applicationForm}
            generalInfo={applicationForm.generalInfo}
          />
        );
      case 5:
        if (!applicationForm) {
          return <div>Please complete all previous steps first.</div>;
        }
        return (
          <PaymentStep
            stepNotes={stepNotes[currentStep]}
            applicationForm={applicationForm}
            onPaymentInfoChange={(paymentInfo) => {
              // Handle payment info change
              console.log('Payment info changed:', paymentInfo);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="h-screen flex flex-col lg:flex-row">
        {/* Progress Timeline - Now responsive */}
        <div className="w-full lg:w-[280px] lg:flex-shrink-0 lg:h-full">
          <div className="h-auto lg:h-full bg-gradient-to-b from-purple-700 to-purple-600 p-4 lg:p-6 shadow-lg">
            <ProgressTimeline currentStep={currentStep} steps={steps} />
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="flex-1 mx-auto bg-white p-3 rounded-xl shadow-sm w-full">
            {renderStepContent()}

            <NavigationButtons
              currentStep={currentStep}
              totalSteps={steps.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSubmit={handleSubmit}
              nextButtonDisabled={isSubmitting}
            />
          </div>

          {/* Footer - Only visible on mobile */}
          <div className="lg:hidden py-4 px-2 text-xs text-gray-500 text-center border-t border-gray-200 mt-4">
            © 2025 DataChef. All rights reserved.
          </div>
        </div>

        {/* Right Sidebar - Hide on mobile */}
        <div className="hidden lg:block w-[280px] flex-shrink-0 h-full">
          <div
            className="h-full bg-white p-0 shadow-sm overflow-hidden relative"
            style={{
              backgroundImage: "url('/illustrations/admission-form.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
