import { FormData } from "../../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SubjectMarksModal from "./SubjectMarksModal";
import InstituteDetailsModal from "./InstituteDetailsModal";

interface AcademicInfoStepProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
  stepHeading?: string;
  stepNotes: React.ReactNode;
}

interface SubjectMark {
  subject: string;
  totalMarks: number | '';
  marksObtained: number | '';
  resultStatus: string;
}

interface InstituteDetails {
  rollNo: string;
  schoolNo: string;
  centerNo: string;
  admitCardId: string;
  institute: string;
  otherInstitute: string;
  medium: string;
  yearOfPassing: string;
  stream: string;
  calcuttaUniversityRegistered: string;
  calcuttaUniversityRegistrationNo: string;
  previouslyRegisteredCourse: string;
  otherCourse: string;
  previousCollege: string;
  otherCollege: string;
}

export default function AcademicInfoStep({ formData, handleInputChange, stepHeading, stepNotes }: AcademicInfoStepProps) {
  const [showMarksEntryModal, setShowMarksEntryModal] = useState(false);
  const [enteredSubjects, setEnteredSubjects] = useState<SubjectMark[]>([]);
  const [showInstituteDetailsModal, setShowInstituteDetailsModal] = useState(false);
  const [enteredInstituteDetails, setEnteredInstituteDetails] = useState<InstituteDetails | null>(null);

  const handleOpenMarksEntry = () => {
    setShowMarksEntryModal(true);
  };

  const handleCloseMarksEntry = () => {
    setShowMarksEntryModal(false);
  };

  const handleSaveMarksEntry = (subjects: SubjectMark[]) => {
    setEnteredSubjects(subjects);
  };

  const handleOpenInstituteDetails = () => {
    setShowInstituteDetailsModal(true);
  };

  const handleCloseInstituteDetails = () => {
    setShowInstituteDetailsModal(false);
  };

  const handleSaveInstituteDetails = (details: InstituteDetails) => {
    setEnteredInstituteDetails(details);
  };

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">{stepHeading || "Step 2 of 5 - Academic Details (Sr. No. 14 to 17)"}</h2>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-lg shadow p-4 text-left">
          {stepNotes}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="flex items-center mb-1">14. Board Result Status <span className="text-red-600">*</span></Label>
          <Select value={formData.boardResultStatus || ""} onValueChange={val => handleInputChange("boardResultStatus" as keyof FormData, val)}>
            <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Pass">Pass</SelectItem>
              <SelectItem value="Fail">Fail</SelectItem>
              <SelectItem value="Compartmental">Compartmental</SelectItem>

            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="flex items-center mb-1">15. Board/University <span className="text-red-600">*</span></Label>
           <Select value={formData.boardUniversity || ""} onValueChange={val => handleInputChange("boardUniversity" as keyof FormData, val)}>
            <SelectTrigger><SelectValue placeholder="Select Board/University" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="CBSE">Central Board of Secondary Education (CBSE)</SelectItem>
              <SelectItem value="ISC">Council for the Indian School Certificate Examinations (ISC)</SelectItem>
              <SelectItem value="WBBSE">West Bengal Board of Secondary Education (WBBSE)</SelectItem>
               <SelectItem value="WBCHSE">West Bengal Council of Higher Secondary Education (WBCHSE)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label className="flex items-center mb-1">16. Subjectwise Marks <span className="text-red-600">*</span></Label>
          <Dialog open={showMarksEntryModal} onOpenChange={setShowMarksEntryModal}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenMarksEntry}>Marks Entry</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-screen-xl max-h-[95vh] overflow-y-auto">
              <SubjectMarksModal onSave={handleSaveMarksEntry} onClose={handleCloseMarksEntry} />
            </DialogContent>
          </Dialog>

          {enteredSubjects.length > 0 && (
            <div className="mt-4 overflow-x-auto rounded-md border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sl</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Subject</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Full Marks</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks Obtained (Including Practical)</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Subject Result Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enteredSubjects.map((subject, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{subject.subject}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{subject.totalMarks}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{subject.marksObtained}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{subject.resultStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div>
          <Label className="flex items-center mb-1">17. Institute Details <span className="text-red-600">*</span></Label>
          <Dialog open={showInstituteDetailsModal} onOpenChange={setShowInstituteDetailsModal}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenInstituteDetails}>Institute Details Entry</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-screen-lg max-h-[95vh] overflow-y-auto">
              <InstituteDetailsModal onSave={handleSaveInstituteDetails} onClose={handleCloseInstituteDetails} initialData={enteredInstituteDetails || undefined} />
            </DialogContent>
          </Dialog>
           {enteredInstituteDetails && (
            <div className="mt-4 p-4 border rounded-md bg-gray-50">
              <p className="font-semibold mb-2">Entered Institute Details:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <p><strong>Roll No:</strong> {enteredInstituteDetails.rollNo}</p>
                <p><strong>School No:</strong> {enteredInstituteDetails.schoolNo}</p>
                <p><strong>Center No:</strong> {enteredInstituteDetails.centerNo}</p>
                <p><strong>Admit Card ID:</strong> {enteredInstituteDetails.admitCardId}</p>
                <p><strong>Institute:</strong> {enteredInstituteDetails.institute}</p>
                {enteredInstituteDetails.institute === 'Other Institute' && (
                  <p><strong>Other Institute:</strong> {enteredInstituteDetails.otherInstitute}</p>
                )}
                <p><strong>Medium:</strong> {enteredInstituteDetails.medium}</p>
                <p><strong>Year Of Passing:</strong> {enteredInstituteDetails.yearOfPassing}</p>
                <p><strong>Stream:</strong> {enteredInstituteDetails.stream}</p>
                <p><strong>Calcutta University Registered:</strong> {enteredInstituteDetails.calcuttaUniversityRegistered}</p>
                {enteredInstituteDetails.calcuttaUniversityRegistered === 'Yes' && (
                   <p><strong>Calcutta University Registration No:</strong> {enteredInstituteDetails.calcuttaUniversityRegistrationNo}</p>
                )}
                <p><strong>Previously Registered Course:</strong> {enteredInstituteDetails.previouslyRegisteredCourse}</p>
                {enteredInstituteDetails.previouslyRegisteredCourse === 'Other Course' && (
                   <p><strong>Other Course:</strong> {enteredInstituteDetails.otherCourse}</p>
                )}
                 <p><strong>Previous College:</strong> {enteredInstituteDetails.previousCollege}</p>
                 {enteredInstituteDetails.previousCollege === 'Other college' && (
                   <p><strong>Other college:</strong> {enteredInstituteDetails.otherCollege}</p>
                 )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
