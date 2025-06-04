import React from "react";
import { Button } from "@/components/ui/button";

// Full course list grouped by school, as per the provided image
const courseGroups = [
  {
    school: "NSHM Business School",
    courses: [
      "Bachelor of Business Administration",
      "BBA - Hospital Management",
      "BBA - Global Business",
      "BBA - Sports Management",
      "BBA – ATA – BSE",
      "Master of Business Administration",
      "Master of Hospital Administration",
      "Executive MBA",
    ],
  },
  {
    school: "NSHM Institute of Health Sciences",
    courses: [
      "Bachelor of Pharmacy",
      "Bachelor of Pharmacy L",
      "Bachelor of Optometry",
      "B.Sc. - Psychology",
      "B.Sc. - Dietetics & Nutrition",
      "Master of Optometry",
      "Master of Optometry (BL)",
      "Master of Pharmacy - Pharmacology",
      "Master of Pharmacy - Pharmaceutics",
      "Master of Public Health",
      "Master of Public Health (BL)",
      "M.Sc. - Clinical Psychology",
      "M.Sc. - Dietetics & Nutrition",
      "M.Sc. - Yoga",
    ],
  },
  {
    school: "NSHM Media School",
    courses: [
      "B.Sc. - Film & Television",
      "B.Sc. - Media Science",
      "M.Sc. - Media Science",
    ],
  },
  {
    school: "NSHM Design School",
    courses: [
      "B.Sc. - Fashion Design & Management",
      "B.Sc. - Interior Designing",
      "B.Sc. - Multimedia, Animation & Graphics",
      "M.Sc. - Animation & Graphic Design",
    ],
  },
  {
    school: "NSHM Institute of Computing & Analytics",
    courses: [
      "B.Sc. - Data Science",
      "B.Sc. - Cyber Security",
      "Bachelor of Computer Applications",
      "M.Sc. - Data Science & Analytics",
      "M.Sc. - Information & Cyber Security",
      "Master of Computer Application",
    ],
  },
  {
    school: "NSHM Institute of Hotel and Tourism Management",
    courses: [
      "B.Sc. - Hospitality & Hotel Administration",
      "BBA - Travel & Tourism Management",
      "M.Sc. - Hospitality Management",
      "Master of Tourism & Travel Management",
      "Master of Tourism & Travel Management (BL)",
    ],
  },
];

// Flattened course list for table
const courses = courseGroups.flatMap(group =>
  group.courses.map(course => ({
    school: group.school,
    name: course,
    duration: course.startsWith("B.Sc.") || course.startsWith("BBA") || course.startsWith("Bachelor") ? "3 Years" : course.startsWith("M.Sc.") || course.startsWith("Master") ? "2 Years" : "",
    validTill: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now for all
  }))
);

function formatDateTime(date: Date) {
  return `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

export default function AdmissionsPage() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-2 md:px-6 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-10 mb-12 flex flex-col items-center text-center text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">Admissions Open for 2025</h1>
        <p className="text-lg md:text-xl mb-6 font-medium">Start your journey with us. Apply now to secure your seat for the upcoming academic year!</p>
        <Button asChild size="lg" className="text-lg px-8 py-4 bg-white text-blue-700 font-bold shadow-xl hover:bg-blue-100">
          <a href="/admissions/apply" target="_blank" rel="noopener noreferrer">
            Apply Now
          </a>
        </Button>
      </section>

      {/* Courses Table */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Courses Offered</h2>
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="min-w-full border border-gray-200 text-sm md:text-base">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 md:px-6 text-left font-semibold text-gray-700 border-b">School</th>
                <th className="py-3 px-4 md:px-6 text-left font-semibold text-gray-700 border-b">Course Name</th>
                <th className="py-3 px-4 md:px-6 text-left font-semibold text-gray-700 border-b">Duration</th>
                <th className="py-3 px-4 md:px-6 text-left font-semibold text-gray-700 border-b">Valid Till</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="py-3 px-4 md:px-6 border-b text-gray-900 whitespace-nowrap">{course.school}</td>
                  <td className="py-3 px-4 md:px-6 border-b text-gray-800 whitespace-nowrap">{course.name}</td>
                  <td className="py-3 px-4 md:px-6 border-b text-gray-700 whitespace-nowrap">{course.duration}</td>
                  <td className="py-3 px-4 md:px-6 border-b text-gray-700 whitespace-nowrap">{formatDateTime(course.validTill)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
