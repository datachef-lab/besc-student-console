import { FormData } from "../../types";

interface AdditionalInfoStepProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
}

export default function AdditionalInfoStep({ formData, handleInputChange }: AdditionalInfoStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Work Experience
          </label>
          <textarea
            value={formData.workExperience}
            onChange={(e) =>
              handleInputChange("workExperience", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Describe your relevant work experience..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Extracurricular Activities
          </label>
          <textarea
            value={formData.extracurriculars}
            onChange={(e) =>
              handleInputChange("extracurriculars", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="List your extracurricular activities, volunteer work, etc..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Personal Statement *
          </label>
          <textarea
            value={formData.personalStatement}
            onChange={(e) =>
              handleInputChange("personalStatement", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Why do you want to join this program? What are your goals?"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Emergency Contact Name *
            </label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={(e) =>
                handleInputChange("emergencyContact", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Emergency Contact Phone *
            </label>
            <input
              type="tel"
              value={formData.emergencyPhone}
              onChange={(e) =>
                handleInputChange("emergencyPhone", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}
