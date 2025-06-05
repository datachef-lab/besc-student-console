"use client";
import { useEffect, useState } from "react";
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
import Image from "next/image";
import { Admission, AdmissionGeneralInfo, ApplicationForm } from "@/db/schema";
import { useParams, useRouter } from "next/navigation";

// Notes for each step
const stepNotes: Record<number, React.ReactNode> = {
  1: (
    <div>
      <div><b>Please Note :</b></div>
      <ol className="list-decimal ml-5 mt-1 space-y-1 text-sm">
        <li>All the fields in the above Form are mandatory.</li>
        <li>Please cross check all the fields especially <b>Category, Gender & Mobile Number</b> before submitting the Form, as these fields are not editable afterwards.</li>
        <li>As per UGC directives in alignment with NEP 2020, all applicants seeking admission are required to create an Academic Bank of Credits (ABC) account. You will be required to submit this ABC ID at the time of registration to University of Calcutta. <a href="https://www.abc.gov.in/" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">Click here to create your ABC ID.</a></li>
        <li>For Indian citizens applying for admission, it is mandatory to possess an Aadhar Card. Kindly ensure that you have your Aadhar and related ready to prevent any delays in the admission process.</li>
        <li><span className="text-red-600 font-bold">Red dot</span> indicates mandatory field.</li>
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
      <b>Course Application Note:</b> Select your desired program and specialization carefully. Once submitted, changes may not be allowed.
    </div>
  ),
  4: (
    <div>
      <b>Please Note :</b>
      <ol className="list-decimal ml-5 mt-1 space-y-1 text-sm">
        <li>
          Sr. No. 19 cannot be same as Mobile Number and Whatsapp Number given in
          Step 1.
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
      <b>Payment Note:</b> Review your payment details before proceeding. Application fees are non-refundable.
    </div>
  ),
};

export default function StudentSignupForm() {
  const { year } = useParams<{year: string}>();
  const router = useRouter();

  
  const [currentStep, setCurrentStep] = useState(1);
  const [admission, setAdmisson] = useState<Admission | null>(null);
  const [applicationForm, setApplicationForm] = useState<ApplicationForm>({
    admissionId: 0,
    admissionStep: "GENERAL_INFORMATION",
    formStatus: "DRAFT",
  });
  const [generalInfo, setGeneralInfo] = useState<AdmissionGeneralInfo>({
    applicationFormId: applicationForm?.id ?? 0,
    dateOfBirth: new Date().toISOString().split('T')[0],
    email: "",
    firstName: "",
    middleName: null,
    lastName: "",
    mobileNumber: "",
    password: "",
    categoryId: null,
    degreeLevel: "UNDER_GRADUATE",
    residenceOfKolkata: true,
    gender: "FEMALE",
    isGujarati: false,
    nationalityId: null,
    otherNationality: null,
    religionId: null,
    whatsappNumber: null,    
  });

  const steps: Step[] = [
    { number: 1, title: "General Information" },
    { number: 2, title: "Academic Information" },
    { number: 3, title: "Course Application" },
    { number: 4, title: "Additional Information" },
    { number: 5, title: "Payment" },
  ];

  useEffect(() => {
    if (isNaN(Number(year))) {
      router.push("/");
      return;
    }

    fetchAdmission()
      .then(async (adm) => {
        setAdmisson(adm as Admission);
        if (adm) {
          await fetchApplicantionForm(adm.id!)
        }
      })
      .catch(err => alert(err));

  }, [year, router]);

  const fetchAdmission = async (): Promise<Admission  | null> => {
    try {
      
    } catch (error) {
      
    }

    return null; // TODO
  }
  const fetchApplicantionForm =  async (admissionId: number): Promise<ApplicationForm  | null> => {
    try {
      
    } catch (error) {
      
    }

    return null; // TODO
  }

  const handleInputChange = (field: keyof ApplicationForm, value: any) => {
    setApplicationForm((prev) => ({
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
    console.log("Form submitted:", applicationForm);
    alert("Application submitted successfully!");
  };

  

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <GeneralInfoStep
          setGeneralInfo={setGeneralInfo}
            applicationForm={applicationForm}
            stepNotes={stepNotes[currentStep]}
            generalInfo={generalInfo}
          />
        );
      case 2:
        return (
          <AcademicInfoStep
            applicationForm={applicationForm}
            stepNotes={stepNotes[currentStep]}
          />
        );
      case 3:
        return (
          <CourseApplicationStep
            applicationForm={applicationForm}
            stepNotes={stepNotes[currentStep]}
          />
        );
      case 4:
        return (
          <AdditionalInfoStep
            generalInfo={generalInfo}
            applicationForm={applicationForm}
            stepNotes={stepNotes[currentStep]}
          />
        );
      case 5:
        return (
          <PaymentStep
          onPaymentInfoChange={(field: keyof ApplicationForm, value: any) => {}}
            applicationForm={applicationForm}
            stepNotes={stepNotes[currentStep]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-screen flex">
        {/* Progress Timeline */}
        <div className="w-[280px] flex-shrink-0 h-full">
          <div className="h-full bg-gradient-to-b from-purple-700 to-purple-600 p-6 rounded-xl shadow-lg">
            <ProgressTimeline currentStep={currentStep} steps={steps} />
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white p-3 rounded-xl shadow-sm">
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

        {/* Right Sidebar */}
        <div className="w-[280px] flex-shrink-0 h-full">
          <div
            className="h-full bg-white p-0 shadow-sm overflow-hidden relative rounded-xl"
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
