import { FormData, SportsEntry } from "../../types";
import React, { useState } from 'react';
import SingleParentModal from './SingleParentModal';
import { ReactNode } from 'react';

interface AdditionalInfoStepProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
  stepNotes?: ReactNode;
}

export default function AdditionalInfoStep({
  formData,
  handleInputChange,
  stepNotes,
}: AdditionalInfoStepProps) {
  const [isSingleParentModalOpen, setIsSingleParentModalOpen] = useState(false);

  // Assuming sports entries are stored in formData.sportsEntries array
  const sportsEntries: SportsEntry[] = formData.sportsEntries || [];

  const handleSingleParentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    handleInputChange("singleParent", value);
    if (value === "Yes") {
      setIsSingleParentModalOpen(true);
    }
  };

  const handleSportsEntryChange = (index: number, field: keyof SportsEntry, value: string) => {
    const newSportsEntries = [...sportsEntries];
    newSportsEntries[index] = { ...newSportsEntries[index], [field]: value };
    handleInputChange("sportsEntries", newSportsEntries);
  };

  const addSportsEntry = () => {
    // Calculate the next Sr. No. based on the current number of entries
    const nextSrNo = sportsEntries.length + 1;
    const newSportsEntries = [...sportsEntries, { srNo: String(nextSrNo), sports: '', level: '' }];
    handleInputChange("sportsEntries", newSportsEntries);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        Step 4 of 5 - Additional Information (Sr. No 19 to 37)
      </h2>
      {stepNotes && <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-lg shadow p-4 text-left text-sm">{stepNotes}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            19. Alternate Mobile Number (10-digit only) *
          </label>
          <input
            type="text"
            value={formData.alternateMobile}
            onChange={(e) =>
              handleInputChange("alternateMobile", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            20. Blood Group *
          </label>
          <select
            value={formData.bloodGroup}
            onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            21. Religion *
          </label>
          <select
            value={formData.religion}
            onChange={(e) => handleInputChange("religion", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Religion</option>
            {/* TODO: Add actual religion options here */}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            22. Physically Challenged *
          </label>
          <select
            value={formData.physicallyChallenged}
            onChange={(e) =>
              handleInputChange("physicallyChallenged", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        {formData.physicallyChallenged === "Yes" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              23. Type of Physically Challenged
            </label>
            <select
              value={formData.typeOfPhysicallyChallenged}
              onChange={(e) =>
                handleInputChange("typeOfPhysicallyChallenged", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Type of Physically Challenged</option>
              <option value="Orthopedic">Orthopedic</option>
              <option value="Visual Impairment">Visual Impairment</option>
              <option value="Hearing Impairment">Hearing Impairment</option>
              <option value="Other">Other</option>
              {/* Add options here */}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">
            24. Single Parent *
          </label>
          <select
            value={formData.singleParent}
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
            value={formData.fatherTitle}
            onChange={(e) => handleInputChange("fatherTitle", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
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
            value={formData.fatherName}
            onChange={(e) => handleInputChange("fatherName", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="AS PER CLASS XII BOARD ADMIT CARD"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            27. Select Title (Mother's Name) *
          </label>
          <select
            value={formData.motherTitle}
            onChange={(e) => handleInputChange("motherTitle", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
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
            value={formData.motherName}
            onChange={(e) => handleInputChange("motherName", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="AS PER CLASS XII BOARD ADMIT CARD"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            29. Is either of your Parents a staff of this College/Society/or its
            units? *
          </label>
          <select
            value={formData.isParentStaff}
            onChange={(e) => handleInputChange("isParentStaff", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:focus:border-blue-500"
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        {formData.isParentStaff === "Yes" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">30. Name</label>
              <input
                type="text"
                value={formData.parentStaffName}
                onChange={(e) =>
                  handleInputChange("parentStaffName", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">31. Department</label>
              <select
                value={formData.parentStaffDepartment}
                onChange={(e) =>
                  handleInputChange("parentStaffDepartment", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="Science">Science</option>
                <option value="Arts">Arts</option>
                <option value="Commerce">Commerce</option>
                <option value="Other">Other</option>
                {/* TODO: Add actual department options here */}
              </select>
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">
            32. Do you have a Smartphone? *
          </label>
          <select
            value={formData.hasSmartphone}
            onChange={(e) => handleInputChange("hasSmartphone", e.target.value)}
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
            value={formData.hasLaptopDesktop}
            onChange={(e) =>
              handleInputChange("hasLaptopDesktop", e.target.value)
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
            value={formData.hasInternet}
            onChange={(e) => handleInputChange("hasInternet", e.target.value)}
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
            value={formData.annualFamilyIncome}
            onChange={(e) =>
              handleInputChange("annualFamilyIncome", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:focus:border-blue-500"
            required
          >
            <option value="">Select</option>
            <option value="Below 1 Lakh">Below 1 Lakh</option>
            <option value="1 to 3 Lakhs">1 to 3 Lakhs</option>
            <option value="3 to 5 Lakhs">3 to 5 Lakhs</option>
            <option value="5 to 8 Lakhs">5 to 8 Lakhs</option>
            <option value="Above 8 Lakhs">Above 8 Lakhs</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            36. Do you want to apply under NCC Category? *
          </label>
          <select
            value={formData.applyNCC}
            onChange={(e) => handleInputChange("applyNCC", e.target.value)}
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
            value={formData.applySports}
            onChange={(e) => handleInputChange("applySports", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:focus:border-blue-500"
            required
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        {formData.applySports === "Yes" && (
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Sports Details</h3>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Sr. No.</th>
                  <th className="py-2 px-4 border-b">Sports</th>
                  <th className="py-2 px-4 border-b">Level</th>
                </tr>
              </thead>
              <tbody>
                {sportsEntries.map((entry, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">
                      <input
                        type="text"
                        value={entry.srNo}
                        readOnly
                        onChange={(e) => handleSportsEntryChange(index, 'srNo', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="py-2 px-4 border-b">
                      <select
                        value={entry.sports}
                        onChange={(e) => handleSportsEntryChange(index, 'sports', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded-md"
                      >
                        <option value="">Select Sport</option>
                        <option value="Cricket">Cricket</option>
                        <option value="Football">Football</option>
                        <option value="Basketball">Basketball</option>
                        {/* TODO: Add actual sports options */}
                      </select>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <select
                        value={entry.level}
                        onChange={(e) => handleSportsEntryChange(index, 'level', e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded-md"
                      >
                        <option value="">Select Level</option>
                        <option value="District">District</option>
                        <option value="State">State</option>
                        <option value="National">National</option>
                        {/* TODO: Add actual level options */}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              onClick={addSportsEntry}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Add Row
            </button>
          </div>
        )}
      </div>
      <SingleParentModal
        isOpen={isSingleParentModalOpen}
        onClose={() => setIsSingleParentModalOpen(false)}
      />
    </div>
  );
}
