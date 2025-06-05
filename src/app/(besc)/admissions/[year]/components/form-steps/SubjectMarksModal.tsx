import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudentAcademicSubjects } from "@/db/schema";
import { useState, useEffect } from "react";

interface SubjectMark {
  subject: string;
  totalMarks: number | '';
  marksObtained: number | '';
  resultStatus: string;
}

// Define a type for Academic Subject for fetching (can be moved to a shared types file)
interface AcademicSubject { id: number; name: string; }

interface SubjectMarksModalProps {
  onSave: (subjects: StudentAcademicSubjects[]) => void;
  onClose: () => void;
  academicSubjects: AcademicSubject[]; // Added academicSubjects prop
  initialSubjects: StudentAcademicSubjects[]; // Added initialSubjects prop
}

export default function SubjectMarksModal({ onSave, onClose, academicSubjects, initialSubjects }: SubjectMarksModalProps) {
  // Initialize state with initialSubjects prop
  const [subjects, setSubjects] = useState<StudentAcademicSubjects[]>(initialSubjects);

  useEffect(() => {
    // If initialSubjects change (e.g., when editing a saved form), update the modal's state
    setSubjects(initialSubjects);
  }, [initialSubjects]);

  const handleAddRow = () => {
    setSubjects([...subjects, {
      academicSubjectId: 0, // Default or placeholder - needs actual ID
      fullMarks: '',
      totalMarks: '',
      resultStatus: "PASS", // Default status
      admissionAcademicInfoId: 0, // Placeholder - should be set in parent
      // Add other required fields from StudentAcademicSubjects with default values if necessary
    }]);
  };

  const handleRemoveRow = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  // Update handleInputChange to work with StudentAcademicSubjects type
  const handleInputChange = (index: number, field: keyof StudentAcademicSubjects, value: any) => {
    const newSubjects = [...subjects];
    // Basic type checking and conversion for numeric values
    if (field === 'fullMarks' || field === 'totalMarks') {
       (newSubjects[index][field] as any) = value.toString(); // Store as string as per schema
    } else if (field === 'academicSubjectId') {
       (newSubjects[index][field] as any) = parseInt(value); // Store as number
    } else if (field === 'resultStatus') {
       (newSubjects[index][field] as any) = value as "PASS" | "FAIL" | "FAIL IN THEORY" | "FAIL IN PRACTICAL"; // Type assertion
    } else {
       (newSubjects[index][field] as any) = value;
    }
    setSubjects(newSubjects);
  };

  const handleSave = () => {
    // Ensure academicSubjectId is set before saving, maybe add validation
    // Ensure admissionAcademicInfoId is set in the parent component before saving the overall form
    onSave(subjects);
    onClose();
  };

  // Helper to find subject name by ID
  const getSubjectName = (id: number) => {
    const subject = academicSubjects.find(sub => sub.id === id);
    return subject ? subject.name : 'Unknown Subject';
  };

  return (
    <div className="space-y-6 p-4 flex flex-col h-full">
      <h3 className="text-xl font-semibold">Marks Entry</h3>
      <div className="flex flex-col md:flex-row gap-6 flex-grow overflow-hidden">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-lg shadow p-4 text-left text-sm md:w-1/3 h-full overflow-y-auto">
          <p className="font-semibold mb-2">Please Note:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Please enter all Subjects Marks as per Class XII Board MarkSheet</li>
            <li>For Example : If you have Five Subjects then Marks of Five Subjects have to be Entered.</li>
            <li>Applicants with theory and practical division of marks, need to add the marks before entering but select the subject result status as per the marksheet only, as applicable.</li>
            <li>Marks entered with "Subject Result Status" as "Fail / Fail in Theory / Fail in Practical" will not be considered for calculation of BO4.</li>
            <li>English Marks must be Entered.</li>
            <li>For students, who have studied more than 1 (One) English subject with 100 marks each, they can select "Additional English" in row no. 2 & give their 2nd English subject marks.</li>
            <li>Please do not Enter SUPW / SUPW & Community Services Marks / Grade.</li>
            <li>In case if you cannot find your subject in the dropdown, please mail us your scanned copy of marksheet at <a href="mailto:admission@thebges.edu.in" className="underline text-blue-600">admission@thebges.edu.in</a></li>
          </ol>
        </div>
        <div className="md:w-2/3 flex flex-col">
          <div className="overflow-x-auto overflow-y-auto flex-grow border rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sl</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Subject</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Full Marks</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks Obtained (Including Practical)</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Subject Result Status</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remove</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subjects.map((subject, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1} of {subjects.length}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                       <Select 
                         value={subject.academicSubjectId ? subject.academicSubjectId.toString() : ''} // Use academicSubjectId
                         onValueChange={val => handleInputChange(index, "academicSubjectId", val)}
                       >
                        <SelectTrigger className="h-8"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                        <SelectContent>
                           {academicSubjects.map(sub => (
                            <SelectItem key={sub.id} value={sub.id.toString()}>{sub.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                       <Input
                        type="number"
                        value={subject.fullMarks} // Use fullMarks
                        onChange={(e) => handleInputChange(index, 'fullMarks', e.target.value)}
                        className="w-full h-8"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                       <Input
                        type="number"
                        value={subject.totalMarks} // Use totalMarks (from schema)
                        onChange={(e) => handleInputChange(index, 'totalMarks', e.target.value)}
                        className="w-full h-8"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                       <Select 
                         value={subject.resultStatus} // Use resultStatus
                         onValueChange={val => handleInputChange(index, "resultStatus", val)}
                       >
                        <SelectTrigger className="h-8"><SelectValue placeholder="Select Status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PASS">Pass</SelectItem>
                          <SelectItem value="FAIL">Fail</SelectItem>
                          <SelectItem value="FAIL IN THEORY">Fail in Theory</SelectItem>
                          <SelectItem value="FAIL IN PRACTICAL">Fail in Practical</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="destructive" size="sm" onClick={() => handleRemoveRow(index)} className="h-8 px-2 py-1">
                        X
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
           <Button onClick={handleAddRow} className="mt-4">+ Add Row</Button>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button onClick={handleSave}>Done</Button>
      </div>
    </div>
  );
} 