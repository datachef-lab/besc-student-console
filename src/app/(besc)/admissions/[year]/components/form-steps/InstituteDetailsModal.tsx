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
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdmissionAcademicInfo, BoardUniversity, Colleges, Course, LanguageMedium, streamType } from "@/db/schema"; // Import necessary types

interface InstituteDetailsModalProps {
  onChange: (field: keyof AdmissionAcademicInfo, value: any) => void;
  onClose: () => void;
  academicInfo: AdmissionAcademicInfo;
  languageMediums: LanguageMedium[]; // Add languageMediums prop
  colleges: Colleges[]; // Add colleges prop - will be used for institutes too
  // If previously registered courses need dynamic options, add a similar prop
  // previouslyRegisteredCourses: Course[];
  registeredCourses: Course[];
}

export default function InstituteDetailsModal({
  onChange,
  onClose,
  academicInfo,
  languageMediums,
  registeredCourses,
  colleges,
}: InstituteDetailsModalProps) {
  console.log('Colleges in InstituteDetailsModal:', colleges);
  const params = useParams();
  const admissionYear = parseInt(params.year as string);

  // Generate year options (current year and 3 years back)
  const yearOptions = Array.from({ length: 4 }, (_, i) => admissionYear - i);

  const handleSave = () => {
    onClose();
  };

  // Find the 'Other Institute' ID from the colleges list (formerly institutions)
  const otherInstitute = (colleges || []).find(inst => inst.name === 'Other Institute');
  const otherInstituteId = otherInstitute?.id;

  // Find the 'Other college' ID from the colleges list
  const otherCollege = (colleges || []).find(coll => coll.name === 'Other college');
  const otherCollegeId = otherCollege?.id;

  // Note: Assuming 'Other Course' handling will be similar if courses are made dynamic

  return (
    <div className="flex flex-col h-full">
      {JSON.stringify(registeredCourses)}
      <div className="space-y-4 p-2 sm:p-4 flex-shrink-0">
        <h3 className="text-lg sm:text-xl font-semibold">Institute Details Entry</h3>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-lg shadow p-3 sm:p-4 text-left text-xs sm:text-sm mb-4">
          <p className="font-semibold mb-2">Please Note:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Please select your Class 12 school name under the "Select Institute" option in serial no. b(i). In case your school's name is not enlisted in the dropdown list, select "Other Institute" from the list and enter the name of your school in serial no. b(ii).</li>
            <li>Sr. No f(i) is applicable for students who have cleared Class XII board exam in or before year 2024.</li>
            <li>Red dot indicates mandatory field.</li>
          </ol>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto px-2 sm:px-4 pb-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <Label className="flex items-center mb-1 text-xs sm:text-sm">a(i) Roll No <span className="text-red-600">*</span></Label>
              <Input value={academicInfo.rollNumber || ''} onChange={(e) => onChange('rollNumber', e.target.value)} className="w-full h-8 text-xs sm:text-sm" />
            </div>
            <div>
              <Label className="flex items-center mb-1 text-xs sm:text-sm">a(ii) School No <span className="text-red-600">*</span></Label>
              <Input value={academicInfo.schoolNumber || ''} onChange={(e) => onChange('schoolNumber', e.target.value)} className="w-full h-8 text-xs sm:text-sm" />
            </div>
            <div>
              <Label className="flex items-center mb-1 text-xs sm:text-sm">a(iii) Center No <span className="text-red-600">*</span></Label>
              <Input value={academicInfo.centerNumber || ''} onChange={(e) => onChange('centerNumber', e.target.value)} className="w-full h-8 text-xs sm:text-sm" />
            </div>
          </div>
          <div>
            <Label className="flex items-center mb-1 text-xs sm:text-sm">a(iv) Admit Card ID. <span className="text-red-600">*</span></Label>
            <Input value={academicInfo.admitCardId || ''} onChange={(e) => onChange('admitCardId', e.target.value)} className="w-full h-8 text-xs sm:text-sm" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label className="flex items-center mb-1 text-xs sm:text-sm">b(i). Select Institute <span className="text-red-600">*</span></Label>
              <Select value={academicInfo.instituteId === 0 ? "0" : academicInfo.instituteId?.toString() || ''} onValueChange={(val) => onChange('instituteId', parseInt(val))}>
                <SelectTrigger className="w-full h-8 text-xs sm:text-sm"><SelectValue placeholder="Select Institute" /></SelectTrigger>
                <SelectContent>
                   <SelectItem value="0">Select Institute</SelectItem>
                   {(colleges || []).map((coll) => (
                    coll.id && (
                     <SelectItem key={coll.id} value={coll.id.toString()} className="text-xs sm:text-sm">
                       {coll.name}
                     </SelectItem>
                    )
                  ))}
                </SelectContent>
              </Select>
            </div>
            {academicInfo.instituteId === otherInstituteId && (
              <div>
                <Label className="flex items-center mb-1 text-xs sm:text-sm">b(ii). Other Institute</Label>
                <Input value={academicInfo.otherInstitute || ''} onChange={(e) => onChange('otherInstitute', e.target.value)} className="w-full h-8 text-xs sm:text-sm" />
              </div>
            )}
          </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label className="flex items-center mb-1 text-xs sm:text-sm">Select Medium <span className="text-red-600">*</span></Label>
              <Select value={academicInfo.languageMediumId === 0 ? "0" : academicInfo.languageMediumId?.toString() || ''} onValueChange={(val) => onChange('languageMediumId', parseInt(val))}>
                <SelectTrigger className="w-full h-8 text-xs sm:text-sm"><SelectValue placeholder="Select Medium" /></SelectTrigger>
                <SelectContent>
                   <SelectItem value="0">Select Medium</SelectItem>
                   {languageMediums.map((medium) => (
                    medium.id && (
                     <SelectItem key={medium.id} value={medium.id.toString()} className="text-xs sm:text-sm">
                       {medium.name}
                     </SelectItem>
                    )
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="flex items-center mb-1 text-xs sm:text-sm">Select Year Of Passing <span className="text-red-600">*</span></Label>
              <Select value={academicInfo.yearOfPassing === admissionYear ? "0" : academicInfo.yearOfPassing?.toString() || ''} onValueChange={(val) => onChange('yearOfPassing', parseInt(val))}>
                <SelectTrigger className="w-full h-8 text-xs sm:text-sm"><SelectValue placeholder="Select Year Of Passing" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Select Year Of Passing</SelectItem>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year.toString()} className="text-xs sm:text-sm">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
           </div>
          <div>
            <Label className="flex items-center mb-1 text-xs sm:text-sm">e. Coming from which Stream <span className="text-red-600">*</span></Label>
            <Select value={academicInfo.streamType || 'null'} onValueChange={(val) => onChange('streamType', val as "COMMERCE" | "SCIENCE" | "HUMANITIES")}>
              <SelectTrigger className="w-full h-8 text-xs sm:text-sm"><SelectValue placeholder="Select Stream" /></SelectTrigger>
              <SelectContent>
                {streamType.enumValues.map(value => (
                  <SelectItem key={value} value={value}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label className="flex items-center mb-1 text-xs sm:text-sm">f. Have you ever been registered for any undergraduate courses under Calcutta University? <span className="text-red-600">*</span></Label>
              <Select
                value={academicInfo.isRegisteredForUGInCU === true ? 'Yes' : academicInfo.isRegisteredForUGInCU === false ? 'No' : 'null'}
                onValueChange={(val) => onChange('isRegisteredForUGInCU', val === 'Yes' ? true : val === 'No' ? false : null)}
                disabled={academicInfo.yearOfPassing === admissionYear}
              >
                <SelectTrigger className="w-full h-8 text-xs sm:text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">Select</SelectItem>
                  <SelectItem value="Yes" className="text-xs sm:text-sm">Yes</SelectItem>
                  <SelectItem value="No" className="text-xs sm:text-sm">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {academicInfo.isRegisteredForUGInCU === true && (
              <div>
                <Label className="flex items-center mb-1 text-xs sm:text-sm">g. Calcutta University Registration No</Label>
                <Input
                  value={academicInfo.cuRegistrationNumber || ''}
                  onChange={(e) => onChange('cuRegistrationNumber', e.target.value)}
                  className="w-full h-8 text-xs sm:text-sm"
                  disabled={academicInfo.yearOfPassing === admissionYear}
                />
              </div>
            )}
          </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label className="flex items-center mb-1 text-xs sm:text-sm">h(i). Previously Registered Course</Label>
              <Select value={academicInfo.previouslyRegisteredCourseId?.toString() || (academicInfo.otherPreviouslyRegisteredCourse !== null && academicInfo.previouslyRegisteredCourseId === null ? 'OTHER' : '')} onValueChange={(val) => {
                if (val === 'OTHER') {
                  onChange('previouslyRegisteredCourseId', null);
                  onChange('otherPreviouslyRegisteredCourse', '');
                } else {
                  onChange('previouslyRegisteredCourseId', parseInt(val));
                  onChange('otherPreviouslyRegisteredCourse', null);
                }
              }}>
                <SelectTrigger className="w-full h-8 text-xs sm:text-sm"><SelectValue placeholder="Select Previous Registered Course" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Select Previous Registered Course</SelectItem>
                  {registeredCourses.map((course) => (
                    
                      <SelectItem key={course.id} value={course.id!.toString()} className="text-xs sm:text-sm">
                        {course.name}
                      </SelectItem>
                    
                  ))}
                  <SelectItem value="OTHER" className="text-xs sm:text-sm">Other Course</SelectItem>
                </SelectContent>
              </Select>
            </div>
             {academicInfo.previouslyRegisteredCourseId === null && (
              <div>
                <Label className="flex items-center mb-1 text-xs sm:text-sm">h(ii). Other Course</Label>
                <Input value={academicInfo.otherPreviouslyRegisteredCourse || ''} onChange={(e) => onChange('otherPreviouslyRegisteredCourse', e.target.value)} className="w-full h-8 text-xs sm:text-sm" />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label className="flex items-center mb-1 text-xs sm:text-sm">i. Previous College</Label>
              <Select value={academicInfo.previousCollegeId === 0 ? "0" : academicInfo.previousCollegeId?.toString() || (academicInfo.otherCollege !== null && academicInfo.previousCollegeId === null ? 'OTHER_COLLEGE' : '')} onValueChange={(val) => {
                if (val === 'OTHER_COLLEGE') {
                  onChange('previousCollegeId', null);
                  onChange('otherCollege', '');
                } else {
                  onChange('previousCollegeId', parseInt(val));
                  onChange('otherCollege', null);
                }
              }}>
                <SelectTrigger className="w-full h-8 text-xs sm:text-sm"><SelectValue placeholder="Select Previous College" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Select Previous College</SelectItem>
                  {colleges.map((college) => (
                    college.id && (
                      <SelectItem key={college.id} value={college.id.toString()} className="text-xs sm:text-sm">
                        {college.name}
                      </SelectItem>
                    )
                  ))}
                  <SelectItem value="OTHER_COLLEGE" className="text-xs sm:text-sm">Other college</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {academicInfo.previousCollegeId === null && (
              <div>
                <Label className="flex items-center mb-1 text-xs sm:text-sm">j. Other college</Label>
                <Input value={academicInfo.otherCollege || ''} onChange={(e) => onChange('otherCollege', e.target.value)} className="w-full h-8 text-xs sm:text-sm" />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-auto p-2 sm:p-4 border-t">
        <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">Close</Button>
        <Button onClick={handleSave} className="w-full sm:w-auto">Done</Button>
      </div>
    </div>
  );
} 