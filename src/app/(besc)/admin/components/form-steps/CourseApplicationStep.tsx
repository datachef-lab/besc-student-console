import { FormData } from "../../types";

interface CourseApplicationStepProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
}

export default function CourseApplicationStep({ formData, handleInputChange }: CourseApplicationStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Course Application</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Program *
          </label>
          <select
            value={formData.program}
            onChange={(e) => handleInputChange("program", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Program...</option>
            <option value="computer-science">Computer Science</option>
            <option value="business">Business Administration</option>
            <option value="engineering">Engineering</option>
            <option value="psychology">Psychology</option>
            <option value="education">Education</option>
            <option value="nursing">Nursing</option>
            <option value="arts">Liberal Arts</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Preferred Start Date *
          </label>
          <select
            value={formData.startDate}
            onChange={(e) =>
              handleInputChange("startDate", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select...</option>
            <option value="fall-2025">Fall 2025</option>
            <option value="spring-2026">Spring 2026</option>
            <option value="summer-2026">Summer 2026</option>
            <option value="fall-2026">Fall 2026</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Study Mode *
          </label>
          <select
            value={formData.studyMode}
            onChange={(e) =>
              handleInputChange("studyMode", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select...</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="online">Online</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Preferred Campus *
          </label>
          <select
            value={formData.campus}
            onChange={(e) => handleInputChange("campus", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Campus...</option>
            <option value="main">Main Campus</option>
            <option value="downtown">Downtown Campus</option>
            <option value="north">North Campus</option>
            <option value="online">Online Only</option>
          </select>
        </div>
      </div>
    </div>
  );
}
