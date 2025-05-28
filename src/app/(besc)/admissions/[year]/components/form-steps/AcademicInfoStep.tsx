import { FormData } from "../../types";

interface AcademicInfoStepProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
}

export default function AcademicInfoStep({ formData, handleInputChange }: AcademicInfoStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Academic Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Highest Level of Education *
          </label>
          <select
            value={formData.previousEducation}
            onChange={(e) =>
              handleInputChange("previousEducation", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select...</option>
            <option value="high-school">High School</option>
            <option value="associates">Associate's Degree</option>
            <option value="bachelors">Bachelor's Degree</option>
            <option value="masters">Master's Degree</option>
            <option value="doctorate">Doctorate</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">GPA</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="4"
            value={formData.gpa}
            onChange={(e) => handleInputChange("gpa", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Graduation Year *
          </label>
          <input
            type="number"
            min="1950"
            max="2030"
            value={formData.graduationYear}
            onChange={(e) =>
              handleInputChange("graduationYear", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Institution Name *
          </label>
          <input
            type="text"
            value={formData.institution}
            onChange={(e) =>
              handleInputChange("institution", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Major/Field of Study *
          </label>
          <input
            type="text"
            value={formData.major}
            onChange={(e) => handleInputChange("major", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Academic References
          </label>
          <textarea
            value={formData.academicReferences}
            onChange={(e) =>
              handleInputChange("academicReferences", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Please provide contact information for 2-3 academic references..."
          />
        </div>
      </div>
    </div>
  );
}
