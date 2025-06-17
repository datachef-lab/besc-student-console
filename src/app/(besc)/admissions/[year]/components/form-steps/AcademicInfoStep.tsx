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
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import SubjectMarksModal from "./SubjectMarksModal";
import InstituteDetailsModal from "./InstituteDetailsModal";
import { AcademicSubjects, ApplicationForm, boardResultStatusType, BoardUniversity, Colleges, Institution, LanguageMedium, StudentAcademicSubjects, Course } from "@/db/schema";
import { AdmissionAcademicInfoDto, BoardUniversityDto } from "@/types/admissions";
import { useParams } from "next/navigation";
import { getCourses } from "../../action";

// Define a type for Academic Subject for fetching
interface AcademicSubject { id: number; name: string; }

interface AcademicInfoStepProps {
  applicationForm: ApplicationForm;
  stepHeading?: string;
  stepNotes: React.ReactNode;
  academicInfo: AdmissionAcademicInfoDto;
  setAcademicInfo: React.Dispatch<React.SetStateAction<AdmissionAcademicInfoDto>>;
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

export default function AcademicInfoStep({ applicationForm, stepHeading, stepNotes, academicInfo, setAcademicInfo }: AcademicInfoStepProps) {
  const params = useParams();
  const admissionYear = parseInt(params.year as string);
  
  // Generate year options (current year and 3 years back)
  const yearOptions = Array.from({ length: 4 }, (_, i) => admissionYear - i);

  
  const [boardUniversities, setBoardUniversities] = useState<BoardUniversityDto[]>([]);
  const [languageMediums, setLanguageMediums] = useState<LanguageMedium[]>([]);
  const [colleges, setColleges] = useState<Colleges[]>([]);
  const [academicSubjects, setAcademicSubjects] = useState<AcademicSubject[]>([]); // New state for academic subjects
  const [courses, setCourses] = useState<Course[]>([]); // New state for courses

  console.log('academicSubjects in AcademicInfoStep:', academicSubjects);

  const [showMarksEntryModal, setShowMarksEntryModal] = useState(false);
  const [showInstituteDetailsModal, setShowInstituteDetailsModal] = useState(false);
  const [enteredInstituteDetails, setEnteredInstituteDetails] = useState<InstituteDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch board universities
        const boardUniversitiesResponse = await fetch('/api/board-universities');
        if (boardUniversitiesResponse.ok) {
          const data = await boardUniversitiesResponse.json();
          setBoardUniversities(data);
        }

        // Fetch language mediums
        const languageMediumsResponse = await fetch('/api/language-mediums');
        if (languageMediumsResponse.ok) {
          const {data} = await languageMediumsResponse.json();
          setLanguageMediums(data);
        }

        // Fetch colleges
        const collegesResponse = await fetch('/api/colleges');
        if (collegesResponse.ok) {
          const data = await collegesResponse.json();
          setColleges(data.colleges);
        }

        // Fetch courses
        const coursesResponse = await getCourses();
        // const data = await coursesResponse.json();
        // console.log("courses:", data);
        setCourses(coursesResponse);


        // Fetch academic subjects
        const academicSubjectsResponse = await fetch('/api/academic-subjects');
        if (academicSubjectsResponse.ok) {
          const data = await academicSubjectsResponse.json();
          if (data.success && Array.isArray(data.data)) {
            setAcademicSubjects(data.data);
          } else {
            console.error('API response for academic subjects was not successful or data was not an array:', data);
            setAcademicSubjects([]);
          }
        } else {
          console.error('Failed to fetch academic subjects:', academicSubjectsResponse.status, academicSubjectsResponse.statusText);
          setAcademicSubjects([]);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    void fetchData();
  }, []);

  // Helper to find subject name by ID
  const getSubjectName = (id: number) => {
    const subject = (academicSubjects || []).find(sub => sub.id === id);
    return subject ? subject.name : 'Unknown Subject';
  };

  // Effect to clear subjects when boardUniversityId changes
  useEffect(() => {
    if (academicInfo.boardUniversityId !== 0 && academicInfo.subjects.length > 0) {
      setAcademicInfo(prev => ({
        ...prev,
        subjects: []
      }));
    }
  }, [academicInfo.boardUniversityId]);

  const handleAcademicInfoChange = (field: keyof AdmissionAcademicInfoDto, value: any) => {
    setAcademicInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOpenMarksEntry = () => {
    // If no subjects are entered, add 4 default rows
    if (academicInfo.subjects.length === 0) {
      const defaultSubjects: StudentAcademicSubjects[] = Array.from({ length: 4 }, () => ({
        applicationFormId: academicInfo.applicationFormId,
        academicSubjectId: 0, // Placeholder, will be selected in modal
        fullMarks: '0',
        totalMarks: '0',
        resultStatus: "PASS" as "PASS" | "FAIL" | "FAIL IN THEORY" | "FAIL IN PRACTICAL", // Explicitly cast to the correct union type
        admissionAcademicInfoId: academicInfo.id ?? 0,
      }));
      setAcademicInfo(prev => ({
        ...prev,
        subjects: defaultSubjects
      }));
    }
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
      instituteId: (colleges || []).find(i => i.name === details.institute)?.id ?? 0,
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
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="text-base sm:text-lg font-semibold mb-2">{stepHeading || "Step 2 of 5 - Academic Details (Sr. No. 14 to 17)"}</h2>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-lg shadow p-3 sm:p-4 text-left text-sm">
          {stepNotes}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <div>
          <Label className="flex items-center mb-1 text-sm">14. Board Result Status <span className="text-red-600">*</span></Label>
          <Select 
            value={academicInfo.boardResultStatus} 
            onValueChange={(val) => handleAcademicInfoChange("boardResultStatus", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {boardResultStatusType.enumValues.map(value => (
                  <SelectItem key={value} value={value}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="flex items-center mb-1 text-sm">15. Board/University <span className="text-red-600">*</span></Label>
          <Select 
            value={academicInfo.boardUniversityId === 0 ? "0" : academicInfo.boardUniversityId.toString()} 
            onValueChange={(val) => handleAcademicInfoChange("boardUniversityId", parseInt(val))}
            disabled={academicInfo.boardResultStatus !== "PASS"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Board/University" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Select Board/University</SelectItem>
              {boardUniversities.map((board) => (
                board.id && (
                  <SelectItem key={board.id} value={board.id.toString()}>
                    {board.name}
                  </SelectItem>
                )
              ))}
            </SelectContent>
          </Select>
          {academicInfo.boardResultStatus !== "PASS" && (
            <p className="text-sm text-red-600 mt-2">
              Failed or Compartmental students are not allowed to apply as per Calcutta University Norms.
            </p>
          )}
        </div>

        <div>
          <Label className="flex items-center mb-1 text-sm">16. Subjectwise Marks <span className="text-red-600">*</span></Label>
          <Dialog open={showMarksEntryModal} onOpenChange={setShowMarksEntryModal}>
            <DialogTrigger asChild>
              <Button 
                onClick={handleOpenMarksEntry} 
                className="w-full sm:w-auto"
                disabled={academicInfo.boardUniversityId === 0}
              >Marks Entry</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-screen-xl max-h-[95vh] p-4 sm:p-6">
              <DialogTitle>Marks Entry</DialogTitle>
              <SubjectMarksModal 
                onSave={handleSaveMarksEntry} 
                onClose={handleCloseMarksEntry} 
                academicSubjects={academicSubjects}
                initialSubjects={academicInfo.subjects}
              />
            </DialogContent>
          </Dialog>

          {academicInfo.subjects.length > 0 && (
            <div className="mt-4 overflow-x-auto rounded-md border max-h-[300px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sl</th>
                    <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32 sm:w-48">Subject</th>
                    <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks</th>
                    <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks Obtained</th>
                    <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32 sm:w-40">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {academicInfo.subjects.map((subject: StudentAcademicSubjects, index: number) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{getSubjectName(subject.academicSubjectId)}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{subject.fullMarks}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{subject.totalMarks}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{subject.resultStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <Label className="flex items-center mb-1 text-sm">17. Institute Details <span className="text-red-600">*</span></Label>
          <Dialog open={showInstituteDetailsModal} onOpenChange={setShowInstituteDetailsModal}>
            <DialogTrigger asChild>
              <Button 
                onClick={handleOpenInstituteDetails} 
                className="w-full sm:w-auto"
                disabled={academicInfo.boardResultStatus !== "PASS" || academicInfo.boardUniversityId === 0}
              >Institute Details Entry</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-screen-lg max-h-[95vh] p-4 sm:p-6">
              <DialogTitle>Institute Details</DialogTitle>
              <InstituteDetailsModal 
                colleges={colleges}
                languageMediums={languageMediums}
                onChange={handleAcademicInfoChange} 
                onClose={handleCloseInstituteDetails} 
                academicInfo={academicInfo}
                registeredCourses={courses}
                
              />
            </DialogContent>
          </Dialog>

          {enteredInstituteDetails && (
            <div className="mt-4 p-3 sm:p-4 border rounded-md bg-gray-50">
              <p className="font-semibold mb-2 text-sm sm:text-base">Entered Institute Details:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
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
