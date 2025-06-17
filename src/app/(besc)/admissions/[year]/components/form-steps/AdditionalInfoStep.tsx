import React, { useEffect, useState } from 'react';
import SingleParentModal from './SingleParentModal';
import { ReactNode } from 'react';
import { AnnualIncome, ApplicationForm, BloodGroup, Category, Religion, sportsCategory, SportsInfo, collegeDepartment, AdmissionGeneralInfo } from "@/db/schema";
import { AdmissionAdditionalInfoDto } from "@/types/admissions";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface AdditionalInfoStepProps {
  stepNotes: React.ReactNode;
  applicationForm: ApplicationFormDto;
  generalInfo: {
    applicationFormId: number;
    firstName: string;
    dateOfBirth: string;
    password: string;
    whatsappNumber?: string;
  };
  onNext: () => void;
  onPrev: () => void;
}

const collegeDepartments = collegeDepartment.enumValues;

export default function AdditionalInfoStep({
  applicationForm,
  stepNotes,
  generalInfo,
  onNext,
  onPrev
}: AdditionalInfoStepProps) {
  // Initialize state from applicationForm.admissionAdditionalInfo or with defaults
  const [additionalInfo, setAdditionalInfo] = useState<AdmissionAdditionalInfoDto>({
    applicationFormId: applicationForm.id ?? 0,
    annualIncomeId: 0,
    bloodGroupId: 0,
    categoryId: 0,
    religionId: 0,
    alternateMobileNumber: "",
    applyUnderNCCCategory: false,
    applyUnderSportsCategory: false,
    departmentOfStaffParent: null,
    disabilityType: null, // Assuming disabilityType is part of schema
    fatherName: "",
    fatherTitle: null,
    motherName: "",
    motherTitle: null,
    nameOfStaffParent: null,
    hasInternetAccess: true,
    hasLaptopOrDesktop: true,
    hasSmartphone: true,
    isEitherParentStaff: false,
    isPhysicallyChallenged: false,
    isSingleParent: false,
    sportsInfo: [], // Initialize with empty array
  });

  const [annualIncomes, setAnnualIncomes] = useState<AnnualIncome[]>([]);
  const [bloodGroups, setBloodGroups] = useState<BloodGroup[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [religions, setReligions] = useState<Religion[]>([]);
  const [sportsCategories, setSportsCategories] = useState<sportsCategory[]>([]);

  const [isSingleParentModalOpen, setIsSingleParentModalOpen] = useState(false);
  const [alternateMobileError, setAlternateMobileError] = useState<string | null>(null); // State for error message
  const [singleParentDetailsType, setSingleParentDetailsType] = useState<'father' | 'mother' | null>(null); // To track which parent's details are entered

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Fetch data for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [annualIncomesRes, bloodGroupsRes, categoriesRes, religionsRes, sportsCategoriesRes] = await Promise.all([
          fetch('/api/annual-incomes'),
          fetch('/api/blood-groups'),
          fetch('/api/categories'),
          fetch('/api/religions'),
          fetch('/api/sports-categories'),
        ]);

        if (annualIncomesRes.ok) {
          const data = await annualIncomesRes.json();
          setAnnualIncomes(data.success ? data.data : []);
        }
        if (bloodGroupsRes.ok) {
          const data = await bloodGroupsRes.json();
          setBloodGroups(data.success ? data.data : []);
        }
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data.success ? data.data : []);
        }
        if (religionsRes.ok) {
          const data = await religionsRes.json();
          setReligions(data.success ? data.data : []);
        }
        if (sportsCategoriesRes.ok) {
          const data = await sportsCategoriesRes.json();
          setSportsCategories(data.success ? data.data : []);
        }
        
      } catch (error) {
        console.error('Error fetching additional info data:', error);
      }
    };

    void fetchData();
  }, []);

  // Handle changes in additionalInfo state
  const handleAdditionalInfoChange = (field: keyof AdmissionAdditionalInfoDto, value: any) => {
    if (field === 'alternateMobileNumber') {
      // Validate alternate mobile number
      if (value === generalInfo.mobileNumber) {
        setAlternateMobileError('Alternate Mobile Number cannot be the same as Mobile Number.');
      } else {
        setAlternateMobileError(null);
      }
    }
    
    setAdditionalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle changes in sports entries within additionalInfo.sportsInfo
  const handleSportsEntryChange = (index: number, field: keyof SportsInfo, value: any) => {
    const newSportsInfo = [...additionalInfo.sportsInfo];
    // Basic type conversion for number IDs if needed
    if (field === 'sportsCategoryId') {
        (newSportsInfo[index][field] as any) = parseInt(value);
    } else {
        (newSportsInfo[index][field] as any) = value; // Use as any for now, consider refining types
    }
    
    setAdditionalInfo(prev => ({
        ...prev,
        sportsInfo: newSportsInfo
    }));
  };

  // Add a new sports entry
  const addSportsEntry = () => {
    const newEntry: SportsInfo = { // Use schema type for new entry
      additionalInfoId: additionalInfo.id ?? 0, // Set parent ID (0 if not available yet)
      sportsCategoryId: 0, // Default or placeholder
      level: 'OTHERS',
    };
    setAdditionalInfo(prev => ({
      ...prev,
      sportsInfo: [...prev.sportsInfo, newEntry]
    }));
  };
  
  // Handle remove sports entry
  const removeSportsEntry = (index: number) => {
      setAdditionalInfo(prev => ({
          ...prev,
          sportsInfo: prev.sportsInfo.filter((_, i) => i !== index)
      }));
  };

  // Helper to find sports category name by ID
  const getSportsCategoryName = (id: number) => {
    const category = sportsCategories.find(cat => cat.id === id);
    return category ? category.name : 'Unknown Sport';
  };

  // Refactored handleSingleParentChange
  const handleSingleParentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === "Yes";
    handleAdditionalInfoChange("isSingleParent", value);
    if (value) {
      setIsSingleParentModalOpen(true);
      // The modal will now handle prompting for parent type selection
    } else {
      setSingleParentDetailsType(null); // Reset when not single parent
      // Clear father and mother fields when switching back from single parent
      setAdditionalInfo(prev => ({
        ...prev,
        fatherName: '',
        fatherTitle: null,
        motherName: '',
        motherTitle: null,
      }));
    }
  };

  // Handle parent type selection from modal
  const handleSelectParentType = (parentType: 'father' | 'mother') => {
    setSingleParentDetailsType(parentType);
     // Clear the details of the other parent when one is selected via modal
    if (parentType === 'father') {
       setAdditionalInfo(prev => ({
            ...prev,
            motherName: '',
            motherTitle: null,
          }));
    } else if (parentType === 'mother') {
       setAdditionalInfo(prev => ({
            ...prev,
            fatherName: '',
            fatherTitle: null,
          }));
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!additionalInfo.fatherName?.trim()) {
      errors.fatherName = "Father's name is required";
    }
    if (!additionalInfo.motherName?.trim()) {
      errors.motherName = "Mother's name is required";
    }
    if (!additionalInfo.fatherTitle) {
      errors.fatherTitle = "Father's title is required";
    }
    if (!additionalInfo.motherTitle) {
      errors.motherTitle = "Mother's title is required";
    }
    if (!additionalInfo.annualIncomeId) {
      errors.annualIncomeId = "Annual family income is required";
    }
    if (!additionalInfo.bloodGroupId) {
      errors.bloodGroupId = "Blood group is required";
    }
    if (!additionalInfo.religionId) {
      errors.religionId = "Religion is required";
    }
    if (additionalInfo.isPhysicallyChallenged && !additionalInfo.disabilityType) {
      errors.disabilityType = "Disability type is required";
    }
    if (additionalInfo.isEitherParentStaff && !additionalInfo.nameOfStaffParent) {
      errors.nameOfStaffParent = "Staff parent name is required";
    }
    if (additionalInfo.isEitherParentStaff && !additionalInfo.departmentOfStaffParent) {
      errors.departmentOfStaffParent = "Staff parent department is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before proceeding",
        variant: "destructive",
        onClose: () => {},
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = {
        form: {
          admissionId: applicationForm.admissionId,
          status: "DRAFT",
          currentStep: 4,
          admissionStep: "ADDITIONAL_INFORMATION"
        },
        additionalInfo: additionalInfo
      };

      const response = await fetch("/api/admissions/application-forms", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save form");
      }

      toast({
        title: "Success",
        description: "Form saved successfully",
        onClose: () => {},
      });

      onNext();
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
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      onPrev();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 p-2 sm:p-4">
        <h2 className="text-base sm:text-xl font-semibold mb-4">
          Step 4 of 5 - Additional Information (Sr. No 19 to 37)
        </h2>
        {stepNotes && <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-lg shadow p-3 sm:p-4 text-left text-xs sm:text-sm">{stepNotes}</div>}
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              19. Alternate Mobile Number (10-digit only) *
            </label>
            <input
              type="text"
              value={additionalInfo.alternateMobileNumber || ''}
              onChange={(e) =>
                handleAdditionalInfoChange("alternateMobileNumber", e.target.value)
              }
              className={`w-full p-2 border ${alternateMobileError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              required
            />
            {alternateMobileError && <p className="text-red-500 text-sm mt-1">{alternateMobileError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              20. Blood Group *
            </label>
            <select
              value={additionalInfo.bloodGroupId || ''}
              onChange={(e) => handleAdditionalInfoChange("bloodGroupId", parseInt(e.target.value) || 0)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Blood Group</option>
               {bloodGroups.map(group => (
                <option key={group.id} value={group.id}>{group.type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              21. Religion *
            </label>
            <select
              value={additionalInfo.religionId || ''}
              onChange={(e) => handleAdditionalInfoChange("religionId", parseInt(e.target.value) || 0)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Religion</option>
               {religions.map(religion => (
                <option key={religion.id} value={religion.id}>{religion.name}</option>
              ))}
            </select>
          </div>
           {/* Category field - added based on state variable */}
           <div>
            <label className="block text-sm font-medium mb-1">
              Category *
            </label>
            <select
              value={additionalInfo.categoryId || ''}
              onChange={(e) => handleAdditionalInfoChange("categoryId", parseInt(e.target.value) || 0)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Category</option>
               {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              22. Physically Challenged *
            </label>
            <select
              value={additionalInfo.isPhysicallyChallenged ? 'Yes' : 'No'}
              onChange={(e) =>
                handleAdditionalInfoChange("isPhysicallyChallenged", e.target.value === 'Yes')
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          {additionalInfo.isPhysicallyChallenged && (
            <div>
              <label className="block text-sm font-medium mb-1">
                23. Type of Physically Challenged
              </label>
              <input // Assuming disabilityType is a string in schema
                type="text"
                value={additionalInfo.disabilityType || ''}
                onChange={(e) =>
                  handleAdditionalInfoChange("disabilityType", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
               {/* If it's a select, use select element and map options */}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">
              24. Single Parent *
            </label>
            <select
              value={additionalInfo.isSingleParent ? 'Yes' : 'No'}
              onChange={handleSingleParentChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              25. Select Title (Father's Name) *
            </label>
            <select
              value={additionalInfo.fatherTitle || ''}
              onChange={(e) => handleAdditionalInfoChange("fatherTitle", e.target.value || null)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={additionalInfo.isSingleParent === true && singleParentDetailsType === 'mother'} // Disable if single parent and mother details are entered
            >
              <option value="">Select Title</option>
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Dr.">Dr.</option>
              <option value="Late">Late</option>
              {/* Add other relevant titles if needed */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              26. Father's Name *
            </label>
            <input
              type="text"
              value={additionalInfo.fatherName || ''}
              onChange={(e) => handleAdditionalInfoChange("fatherName", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="AS PER CLASS XII BOARD ADMIT CARD"
              required
              disabled={additionalInfo.isSingleParent === true && singleParentDetailsType === 'mother'} // Disable if single parent and mother details are entered
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              27. Select Title (Mother's Name) *
            </label>
            <select
              value={additionalInfo.motherTitle || ''}
              onChange={(e) => handleAdditionalInfoChange("motherTitle", e.target.value || null)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={additionalInfo.isSingleParent === true && singleParentDetailsType === 'father'} // Disable if single parent and father details are entered
            >
              <option value="">Select Title</option>
              <option value="Ms.">Ms.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Dr.">Dr.</option>
              <option value="Late">Late</option>
              {/* Add other relevant titles if needed */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              28. Mother's Name *
            </label>
            <input
              type="text"
              value={additionalInfo.motherName || ''}
              onChange={(e) => handleAdditionalInfoChange("motherName", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="AS PER CLASS XII BOARD ADMIT CARD"
              required
              disabled={additionalInfo.isSingleParent === true && singleParentDetailsType === 'father'} // Disable if single parent and father details are entered
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              29. Is either of your Parents a staff of this College/Society/or its
              units? *
            </label>
            <select
              value={additionalInfo.isEitherParentStaff ? 'Yes' : 'No'}
              onChange={(e) => handleAdditionalInfoChange("isEitherParentStaff", e.target.value === 'Yes')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:focus:border-blue-500"
              required
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          {additionalInfo.isEitherParentStaff && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">30. Name</label>
                <input
                  type="text"
                  value={additionalInfo.nameOfStaffParent || ''}
                  onChange={(e) =>
                    handleAdditionalInfoChange("nameOfStaffParent", e.target.value || null)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">31. Department</label>
                 <select
                  value={additionalInfo.departmentOfStaffParent || ''}
                  onChange={(e) => handleAdditionalInfoChange("departmentOfStaffParent", e.target.value || null)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Department</option>
                  {collegeDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">
              32. Do you have a Smartphone? *
            </label>
            <select
              value={additionalInfo.hasSmartphone ? 'Yes' : 'No'}
              onChange={(e) => handleAdditionalInfoChange("hasSmartphone", e.target.value === 'Yes')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:focus:border-blue-500"
              required
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              33. At your place of residence, do you have access to Laptop/Desktop? *
            </label>
            <select
              value={additionalInfo.hasLaptopOrDesktop ? 'Yes' : 'No'}
              onChange={(e) =>
                handleAdditionalInfoChange("hasLaptopOrDesktop", e.target.value === 'Yes')
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:focus:border-blue-500"
              required
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              34. At your place of residence, do you have access to Internet? *
            </label>
            <select
              value={additionalInfo.hasInternetAccess ? 'Yes' : 'No'}
              onChange={(e) => handleAdditionalInfoChange("hasInternetAccess", e.target.value === 'Yes')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:focus:border-blue-500"
              required
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              35. Annual Family Income *
            </label>
            <select
              value={additionalInfo.annualIncomeId || ''}
              onChange={(e) =>
                handleAdditionalInfoChange("annualIncomeId", parseInt(e.target.value) || 0)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:focus:border-blue-500"
              required
            >
              <option value="">Select</option>
               {annualIncomes.map(income => (
                <option key={income.id} value={income.id}>{income.range}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              36. Do you want to apply under NCC Category? *
            </label>
            <select
              value={additionalInfo.applyUnderNCCCategory ? 'Yes' : 'No'}
              onChange={(e) => handleAdditionalInfoChange("applyUnderNCCCategory", e.target.value === 'Yes')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:focus:border-blue-500"
              required
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              37. Do you want to apply under Sports Category? *
            </label>
            <select
              value={additionalInfo.applyUnderSportsCategory ? 'Yes' : 'No'}
              onChange={(e) => handleAdditionalInfoChange("applyUnderSportsCategory", e.target.value === 'Yes')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:focus:border-blue-500"
              required
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          {additionalInfo.applyUnderSportsCategory && (
            <div className="md:col-span-2">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Sports Details</h3>
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto rounded-md border">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Sr. No.</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sports</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {additionalInfo.sportsInfo.map((entry, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border-b">
                          {index + 1}
                        </td>
                        <td className="py-2 px-4 border-b">
                          <select
                            value={entry.sportsCategoryId || ''}
                            onChange={(e) => handleSportsEntryChange(index, 'sportsCategoryId', e.target.value)}
                            className="w-full p-1 border border-gray-300 rounded-md"
                          >
                            <option value="">Select Sport</option>
                            {sportsCategories.map(sport => (
                              sport.id && (
                                <option key={sport.id} value={sport.id}>{sport.name}</option>
                              )
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-4 border-b">
                          <input
                            type="text"
                            value={entry.level || ''}
                            onChange={(e) => handleSportsEntryChange(index, 'level', e.target.value)}
                            className="w-full p-1 border border-gray-300 rounded-md"
                          />
                        </td>
                        <td className="py-2 px-4 border-b">
                          <button
                            type="button"
                            onClick={() => removeSportsEntry(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden space-y-3">
                {additionalInfo.sportsInfo.map((entry, index) => (
                  <div key={index} className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Sr. No. {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeSportsEntry(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Sports</label>
                        <select
                          value={entry.sportsCategoryId || ''}
                          onChange={(e) => handleSportsEntryChange(index, 'sportsCategoryId', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="">Select Sport</option>
                          {sportsCategories.map(sport => (
                            sport.id && (
                              <option key={sport.id} value={sport.id}>{sport.name}</option>
                            )
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Level</label>
                        <input
                          type="text"
                          value={entry.level || ''}
                          onChange={(e) => handleSportsEntryChange(index, 'level', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addSportsEntry}
                className="mt-3 w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm"
              >
                Add Row
              </button>
            </div>
          )}
        </div>
      </div>
      <SingleParentModal
        isOpen={isSingleParentModalOpen}
        onClose={() => setIsSingleParentModalOpen(false)}
        onSelectParentType={handleSelectParentType}
      />

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isSubmitting}
          >
            Previous
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save & Continue"}
        </Button>
      </div>

      {/* Display validation errors */}
      {Object.keys(formErrors).length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <h4 className="text-red-800 font-semibold mb-2">Please fix the following errors:</h4>
          <ul className="list-disc list-inside text-red-700">
            {Object.entries(formErrors).map(([field, error]) => (
              <li key={field}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
