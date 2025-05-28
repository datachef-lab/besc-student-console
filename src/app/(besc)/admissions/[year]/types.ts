export interface FormData {
  // General Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;

  // Academic Information
  previousEducation: string;
  gpa: string;
  graduationYear: string;
  institution: string;
  major: string;
  academicReferences: string;

  // Course Application
  program: string;
  startDate: string;
  studyMode: string;
  campus: string;
  specializations: string[];

  // Additional Information
  workExperience: string;
  extracurriculars: string;
  personalStatement: string;
  emergencyContact: string;
  emergencyPhone: string;

  // Payment
  paymentMethod: string;
  scholarships: boolean;
  financialAid: boolean;
}

export interface StepProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
}

export interface Step {
  number: number;
  title: string;
}
