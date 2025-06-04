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
import { useState } from "react";

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

interface InstituteDetailsModalProps {
  onSave: (details: InstituteDetails) => void;
  onClose: () => void;
  initialData?: InstituteDetails;
}

export default function InstituteDetailsModal({ onSave, onClose, initialData }: InstituteDetailsModalProps) {
  const [details, setDetails] = useState<InstituteDetails>(initialData || {
    rollNo: '',
    schoolNo: '',
    centerNo: '',
    admitCardId: '',
    institute: '',
    otherInstitute: '',
    medium: '',
    yearOfPassing: '',
    stream: '',
    calcuttaUniversityRegistered: '',
    calcuttaUniversityRegistrationNo: '',
    previouslyRegisteredCourse: '',
    otherCourse: '',
    previousCollege: '',
    otherCollege: '',
  });

  const handleInputChange = (field: keyof InstituteDetails, value: any) => {
    setDetails({ ...details, [field]: value });
  };

  const handleSave = () => {
    onSave(details);
    onClose();
  };

  return (
    <div className="space-y-6 p-4">
      <h3 className="text-xl font-semibold">Institute Details Entry</h3>
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-lg shadow p-4 text-left text-sm mb-4">
        <p className="font-semibold mb-2">Please Note:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Please select your Class 12 school name under the "Select Institute" option in serial no. b(i). In case your school's name is not enlisted in the dropdown list, select "Other Institute" from the list and enter the name of your school in serial no. b(ii).</li>
          <li>Sr. No f(i) is applicable for students who have cleared Class XII board exam in or before year 2024.</li>
          <li>Red dot indicates mandatory field.</li>
        </ol>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="flex items-center mb-1">a(i) Roll No <span className="text-red-600">*</span></Label>
            <Input value={details.rollNo} onChange={(e) => handleInputChange('rollNo', e.target.value)} className="w-full" />
          </div>
          <div>
            <Label className="flex items-center mb-1">a(ii) School No <span className="text-red-600">*</span></Label>
            <Input value={details.schoolNo} onChange={(e) => handleInputChange('schoolNo', e.target.value)} className="w-full" />
          </div>
          <div>
            <Label className="flex items-center mb-1">a(iii) Center No <span className="text-red-600">*</span></Label>
            <Input value={details.centerNo} onChange={(e) => handleInputChange('centerNo', e.target.value)} className="w-full" />
          </div>
        </div>
        <div>
          <Label className="flex items-center mb-1">a(iv) Admit Card ID. <span className="text-red-600">*</span></Label>
          <Input value={details.admitCardId} onChange={(e) => handleInputChange('admitCardId', e.target.value)} className="w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center mb-1">b(i). Select Institute <span className="text-red-600">*</span></Label>
            <Select value={details.institute} onValueChange={(val) => handleInputChange('institute', val)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select Institute" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="BAGHBAZAR MULTIPURPOSE GIRLS SCHOOL">BAGHBAZAR MULTIPURPOSE GIRLS SCHOOL</SelectItem>
                <SelectItem value="Other Institute">Other Institute</SelectItem>
                {/* Add more institutes as needed or fetch dynamically */}
              </SelectContent>
            </Select>
          </div>
          {details.institute === 'Other Institute' && (
            <div>
              <Label className="flex items-center mb-1">b(ii). Other Institute</Label>
              <Input value={details.otherInstitute} onChange={(e) => handleInputChange('otherInstitute', e.target.value)} className="w-full" />
            </div>
          )}
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center mb-1">Select Medium <span className="text-red-600">*</span></Label>
            <Select value={details.medium} onValueChange={(val) => handleInputChange('medium', val)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select Medium" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Bengali">Bengali</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="flex items-center mb-1">Select Year Of Passing <span className="text-red-600">*</span></Label>
            <Select value={details.yearOfPassing} onValueChange={(val) => handleInputChange('yearOfPassing', val)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select Year Of Passing" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                {/* Add more years as needed or fetch dynamically */}
              </SelectContent>
            </Select>
          </div>
         </div>
        <div>
          <Label className="flex items-center mb-1">e. Coming from which Stream <span className="text-red-600">*</span></Label>
          <Select value={details.stream} onValueChange={(val) => handleInputChange('stream', val)}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Select Stream" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="SCIENCE">SCIENCE</SelectItem>
              <SelectItem value="ARTS">ARTS</SelectItem>
              <SelectItem value="COMMERCE">COMMERCE</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
          <div>
            <Label className="flex items-center mb-1">f. Have you ever been registered for any undergraduate courses under Calcutta University? <span className="text-red-600">*</span></Label>
            <Select value={details.calcuttaUniversityRegistered} onValueChange={(val) => handleInputChange('calcuttaUniversityRegistered', val)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {details.calcuttaUniversityRegistered === 'Yes' && (
            <div>
              <Label className="flex items-center mb-1">g. Calcutta University Registration No</Label>
              <Input value={details.calcuttaUniversityRegistrationNo} onChange={(e) => handleInputChange('calcuttaUniversityRegistrationNo', e.target.value)} className="w-full" />
            </div>
          )}
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
          <div>
            <Label className="flex items-center mb-1">h(i). Previously Registered Course</Label>
            <Select value={details.previouslyRegisteredCourse} onValueChange={(val) => handleInputChange('previouslyRegisteredCourse', val)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select Previous Registered Course" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Course 1">Course 1</SelectItem>
                <SelectItem value="Course 2">Course 2</SelectItem>
                <SelectItem value="Other Course">Other Course</SelectItem>
                {/* Add more courses as needed or fetch dynamically */}
              </SelectContent>
            </Select>
          </div>
           {details.previouslyRegisteredCourse === 'Other Course' && (
            <div>
              <Label className="flex items-center mb-1">h(ii). Other Course</Label>
              <Input value={details.otherCourse} onChange={(e) => handleInputChange('otherCourse', e.target.value)} className="w-full" />
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
          <div>
            <Label className="flex items-center mb-1">i(i). Previous College</Label>
            <Select value={details.previousCollege} onValueChange={(val) => handleInputChange('previousCollege', val)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select Previous College" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="College A">College A</SelectItem>
                <SelectItem value="College B">College B</SelectItem>
                 <SelectItem value="Other college">Other college</SelectItem>
                {/* Add more colleges as needed or fetch dynamically */}
              </SelectContent>
            </Select>
          </div>
          {details.previousCollege === 'Other college' && (
            <div>
              <Label className="flex items-center mb-1">i(ii). Other college</Label>
              <Input value={details.otherCollege} onChange={(e) => handleInputChange('otherCollege', e.target.value)} className="w-full" />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <Button onClick={handleSave}>Done</Button>
      </div>
    </div>
  );
} 