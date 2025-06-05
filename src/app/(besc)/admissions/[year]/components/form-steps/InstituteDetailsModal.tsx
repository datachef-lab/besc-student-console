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
import { useParams } from "next/navigation";
import { AdmissionAcademicInfo, BoardUniversity, Colleges, Institution, LanguageMedium } from "@/db/schema"; // Import necessary types

interface InstituteDetailsModalProps {
  onChange: (field: keyof AdmissionAcademicInfo, value: any) => void;
  onClose: () => void;
  academicInfo: AdmissionAcademicInfo;
  institutions: Institution[]; // Add institutions prop
  languageMediums: LanguageMedium[]; // Add languageMediums prop
  colleges: Colleges[]; // Add colleges prop
  // If previously registered courses need dynamic options, add a similar prop
  // previouslyRegisteredCourses: Course[];
}

export default function InstituteDetailsModal({
  onChange,
  onClose,
  academicInfo,
  institutions, // Destructure new props
  languageMediums,
  colleges,
}: InstituteDetailsModalProps) {
  const params = useParams();
  const admissionYear = parseInt(params.year as string);

  // Generate year options (current year and 3 years back)
  const yearOptions = Array.from({ length: 4 }, (_, i) => admissionYear - i);

  const handleSave = () => {
    onClose();
  };

  // Find the 'Other Institute' ID from the institutions list
  const otherInstitute = institutions.find(inst => inst.name === 'Other Institute');
  const otherInstituteId = otherInstitute?.id;

  // Find the 'Other college' ID from the colleges list
  const otherCollege = colleges.find(coll => coll.name === 'Other college');
  const otherCollegeId = otherCollege?.id;

  // Note: Assuming 'Other Course' handling will be similar if courses are made dynamic

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
            <Input value={academicInfo.rollNumber || ''} onChange={(e) => onChange('rollNumber', e.target.value)} className="w-full" />
          </div>
          <div>
            <Label className="flex items-center mb-1">a(ii) School No <span className="text-red-600">*</span></Label>
            <Input value={academicInfo.schoolNumber || ''} onChange={(e) => onChange('schoolNumber', e.target.value)} className="w-full" />
          </div>
          <div>
            <Label className="flex items-center mb-1">a(iii) Center No <span className="text-red-600">*</span></Label>
            <Input value={academicInfo.centerNumber || ''} onChange={(e) => onChange('centerNumber', e.target.value)} className="w-full" />
          </div>
        </div>
        <div>
          <Label className="flex items-center mb-1">a(iv) Admit Card ID. <span className="text-red-600">*</span></Label>
          <Input value={academicInfo.admitCardId || ''} onChange={(e) => onChange('admitCardId', e.target.value)} className="w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center mb-1">b(i). Select Institute <span className="text-red-600">*</span></Label>
            <Select value={academicInfo.instituteId?.toString() || ''} onValueChange={(val) => onChange('instituteId', parseInt(val))}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select Institute" /></SelectTrigger>
              <SelectContent>
                 {institutions.map((inst) => (
                  inst.id && (
                   <SelectItem key={inst.id} value={inst.id.toString()}>
                     {inst.name}
                   </SelectItem>
                  )
                ))}
              </SelectContent>
            </Select>
          </div>
          {academicInfo.instituteId === otherInstituteId && (
            <div>
              <Label className="flex items-center mb-1">b(ii). Other Institute</Label>
              <Input value={academicInfo.otherInstitute || ''} onChange={(e) => onChange('otherInstitute', e.target.value)} className="w-full" />
            </div>
          )}
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center mb-1">Select Medium <span className="text-red-600">*</span></Label>
            <Select value={academicInfo.languageMediumId?.toString() || ''} onValueChange={(val) => onChange('languageMediumId', parseInt(val))}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select Medium" /></SelectTrigger>
              <SelectContent>
                 {languageMediums.map((medium) => (
                  medium.id && (
                   <SelectItem key={medium.id} value={medium.id.toString()}>
                     {medium.name}
                   </SelectItem>
                  )
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="flex items-center mb-1">Select Year Of Passing <span className="text-red-600">*</span></Label>
            <Select value={academicInfo.yearOfPassing?.toString() || ''} onValueChange={(val) => onChange('yearOfPassing', parseInt(val))}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select Year Of Passing" /></SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
         </div>
        <div>
          <Label className="flex items-center mb-1">e. Coming from which Stream <span className="text-red-600">*</span></Label>
          <Select value={academicInfo.streamType || ''} onValueChange={(val) => onChange('streamType', val as "COMMERCE" | "SCIENCE" | "HUMANITIES")}>
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
            <Select
              value={academicInfo.isRegisteredForUGInCU === true ? 'Yes' : academicInfo.isRegisteredForUGInCU === false ? 'No' : ''}
              onValueChange={(val) => onChange('isRegisteredForUGInCU', val === 'Yes')}
              disabled={academicInfo.yearOfPassing === admissionYear}
            >
              <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {academicInfo.isRegisteredForUGInCU === true && (
            <div>
              <Label className="flex items-center mb-1">g. Calcutta University Registration No</Label>
              <Input
                value={academicInfo.cuRegistrationNumber || ''}
                onChange={(e) => onChange('cuRegistrationNumber', e.target.value)}
                className="w-full"
                disabled={academicInfo.yearOfPassing === admissionYear}
              />
            </div>
          )}
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
          <div>
            <Label className="flex items-center mb-1">h(i). Previously Registered Course</Label>
             {/* Assuming previously registered courses need dynamic options */}
             {/* Update this Select to use a courses prop if necessary */}
            <Select value={academicInfo.previouslyRegisteredCourseId?.toString() || (academicInfo.otherPreviouslyRegisteredCourse !== null && academicInfo.previouslyRegisteredCourseId === null ? 'OTHER' : '')} onValueChange={(val) => {
              if (val === 'OTHER') {
                onChange('previouslyRegisteredCourseId', null);
                onChange('otherPreviouslyRegisteredCourse', ''); // Clear other field when selecting other
              } else {
                onChange('previouslyRegisteredCourseId', parseInt(val));
                onChange('otherPreviouslyRegisteredCourse', null); // Clear other field when selecting a specific course
              }
            }}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select Previous Registered Course" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Course 1_ID">Course 1</SelectItem>
                <SelectItem value="Course 2_ID">Course 2</SelectItem>
                {/* Add more courses as needed or fetch dynamically in parent and pass as prop */}
                <SelectItem value="OTHER">Other Course</SelectItem>
              </SelectContent>
            </Select>
          </div>
           {academicInfo.previouslyRegisteredCourseId === null && (
            <div>
              <Label className="flex items-center mb-1">h(ii). Other Course</Label>
              <Input value={academicInfo.otherPreviouslyRegisteredCourse || ''} onChange={(e) => onChange('otherPreviouslyRegisteredCourse', e.target.value)} className="w-full" />
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
          <div>
            <Label className="flex items-center mb-1">i(i). Previous College</Label>
            <Select value={academicInfo.previousCollegeId?.toString() || ''} onValueChange={(val) => onChange('previousCollegeId', parseInt(val))}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select Previous College" /></SelectTrigger>
              <SelectContent>
                 {colleges.map((college) => (
                  college.id && (
                   <SelectItem key={college.id} value={college.id.toString()}>
                     {college.name}
                   </SelectItem>
                  )
                ))}
              </SelectContent>
            </Select>
          </div>
          {academicInfo.previousCollegeId === otherCollegeId && (
            <div>
              <Label className="flex items-center mb-1">i(ii). Other college</Label>
              <Input value={academicInfo.otherCollege || ''} onChange={(e) => onChange('otherCollege', e.target.value)} className="w-full" />
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