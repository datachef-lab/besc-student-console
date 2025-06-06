import { FormData } from "../../types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SubjectMarksModal from "./SubjectMarksModal";
import InstituteDetailsModal from "./InstituteDetailsModal";
import { AcademicSubjects, AdmissionAcademicInfo, ApplicationForm, BoardUniversity, Colleges, Institution, LanguageMedium, StudentAcademicSubjects } from "@/db/schema";
import { AdmissionAcademicInfoDto } from "@/types/admissions";
import { useParams } from "next/navigation";

// Define a type for Academic Subject for fetching
interface AcademicSubject { id: number; name: string; }

interface AcademicInfoStepProps {
  applicationForm: ApplicationForm,
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

export default function AcademicInfoStep({ applicationForm, stepHeading, stepNotes }: AcademicInfoStepProps) {
  const params = useParams();
  const admissionYear = parseInt(params.year as string);
  
  // Generate year options (current year and 3 years back)
  const yearOptions = Array.from({ length: 4 }, (_, i) => admissionYear - i);

  const [academicInfo, setAcademicInfo] = useState<AdmissionAcademicInfoDto>({
    applicationFormId: applicationForm.id ?? 0,
    boardResultStatus: "PASS",
    boardUniversityId: 0,
    instituteId: 0,
    otherInstitute: null,
    languageMediumId: 0,
    streamType: "COMMERCE",
    yearOfPassing: admissionYear,
    cuRegistrationNumber: null,
    isRegisteredForUGInCU: false,
    previousCollegeId: 0,
    otherCollege: null,
    previouslyRegisteredCourseId: 0,
    otherPreviouslyRegisteredCourse: null,
    subjects: []
  });

  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [boardUniversities, setBoardUniversities] = useState<BoardUniversity[]>([]);
  const [languageMediums, setLanguageMediums] = useState<LanguageMedium[]>([]);
  const [colleges, setColleges] = useState<Colleges[]>([]);
  const [academicSubjects, setAcademicSubjects] = useState<AcademicSubject[]>([]); // New state for academic subjects

  const [showMarksEntryModal, setShowMarksEntryModal] = useState(false);
  const [showInstituteDetailsModal, setShowInstituteDetailsModal] = useState(false);
  const [enteredInstituteDetails, setEnteredInstituteDetails] = useState<InstituteDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch institutions
        const institutionsResponse = await fetch('/api/institutions');
        if (institutionsResponse.ok) {
          const data = await institutionsResponse.json();
          setInstitutions(data);
        }

        // Fetch board universities
        const boardUniversitiesResponse = await fetch('/api/board-universities');
        if (boardUniversitiesResponse.ok) {
          const data = await boardUniversitiesResponse.json();
          setBoardUniversities(data.data);
        }

        // Fetch language mediums
        const languageMediumsResponse = await fetch('/api/language-mediums');
        if (languageMediumsResponse.ok) {
          const data = await languageMediumsResponse.json();
          setLanguageMediums(data);
        }

        // Fetch colleges
        const collegesResponse = await fetch('/api/colleges');
        if (collegesResponse.ok) {
          const data = await collegesResponse.json();
          setColleges(data);
        }

        // Fetch academic subjects
        const academicSubjectsResponse = await fetch('/api/academic-subjects'); // Assuming this endpoint exists
        if (academicSubjectsResponse.ok) {
          const data = await academicSubjectsResponse.json();
          setAcademicSubjects(data);
        } else {
          console.error('Failed to fetch academic subjects:', academicSubjectsResponse.status, academicSubjectsResponse.statusText);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    void fetchData();
  }, []);

  const handleAcademicInfoChange = (field: keyof AdmissionAcademicInfo, value: any) => {
    setAcademicInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOpenMarksEntry = () => {
    setShowMarksEntryModal(true);
  };

  const handleCloseMarksEntry = () => {
    setShowMarksEntryModal(false);
  };  

  const handleSaveMarksEntry = (subjects: StudentAcademicSubjects[]) => {
    // Store subjects in academicInfo state
    setAcademicInfo(prev => ({
      ...prev,
      subjects: subjects
    }));
  };

  const handleOpenInstituteDetails = () => {
    setShowInstituteDetailsModal(true);
  };

  const handleCloseInstituteDetails = () => {
    setShowInstituteDetailsModal(false);
  };

  const handleSaveInstituteDetails = (details: InstituteDetails) => {
    setEnteredInstituteDetails(details);
    // Update academicInfo with institute details
    setAcademicInfo(prev => ({
      ...prev,
      indexNumber: details.rollNo,
      instituteId: institutions.find(i => i.name === details.institute)?.id ?? 0,
      otherInstitute: details.institute === 'Other Institute' ? details.otherInstitute : null,
      languageMediumId: languageMediums.find(m => m.name === details.medium)?.id ?? 0,
      yearOfPassing: parseInt(details.yearOfPassing),
      streamType: details.stream as "COMMERCE" | "SCIENCE" | "HUMANITIES",
      isRegisteredForUGInCU: details.calcuttaUniversityRegistered === 'Yes',
      cuRegistrationNumber: details.calcuttaUniversityRegistered === 'Yes' ? details.calcuttaUniversityRegistrationNo : null,
      previousCollegeId: colleges.find(c => c.name === details.previousCollege)?.id ?? 0,
      otherCollege: details.previousCollege === 'Other college' ? details.otherCollege : null,
      previouslyRegisteredCourseId: 0,
      otherPreviouslyRegisteredCourse: details.previouslyRegisteredCourse === 'Other Course' ? details.otherCourse : null,
    }));
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
          <Select 
            value={academicInfo.boardResultStatus} 
            onValueChange={(val) => handleAcademicInfoChange("boardResultStatus", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PASS">Pass</SelectItem>
              <SelectItem value="FAIL">Fail</SelectItem>
              <SelectItem value="COMPARTMENTAL">Compartmental</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="flex items-center mb-1">15. Board/University <span className="text-red-600">*</span></Label>
          <Select 
            value={academicInfo.boardUniversityId.toString()} 
            onValueChange={(val) => handleAcademicInfoChange("boardUniversityId", parseInt(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Board/University" />
            </SelectTrigger>
            <SelectContent>
              {boardUniversities.map((board) => (
                board.id && (
                  <SelectItem key={board.id} value={board.id.toString()}>
                    {board.name}
                  </SelectItem>
                )
              ))}
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
              <SubjectMarksModal 
                onSave={handleSaveMarksEntry} 
                onClose={handleCloseMarksEntry} 
                academicSubjects={academicSubjects} // Pass academic subjects as prop
                initialSubjects={academicInfo.subjects} // Pass existing subjects for editing
              />
            </DialogContent>
          </Dialog>

          {academicInfo.subjects.length > 0 && (
            <div className="mt-4 overflow-x-auto rounded-md border max-h-[300px] overflow-y-auto">
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
                  {academicInfo.subjects.map((subject, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{subject.academicSubjectId}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{subject.fullMarks}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{subject.totalMarks}</td>
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
              <InstituteDetailsModal 
                colleges={colleges}
                institutions={institutions}
                languageMediums={languageMediums}
                onChange={handleAcademicInfoChange} 
                onClose={handleCloseInstituteDetails} 
                academicInfo={academicInfo} 
              />
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
                <p><strong>Year Of Passing:</strong> {enteredInstituteDetails.yearOfPassing}{enteredInstituteDetails.yearOfPassing !== admissionYear.toString()}</p>
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
