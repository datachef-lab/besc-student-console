import { useState } from "react";
import { FormData } from "../../types";

interface AcademicInfoStepProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
}

interface SubjectMark {
  id: number;
  subject: string;
  totalFullMarks: string;
  marksObtained: string;
  resultStatus: string;
}

export default function AcademicInfoStep({
  formData,
  handleInputChange,
}: AcademicInfoStepProps) {
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [showInstitutionModal, setShowInstitutionModal] = useState(false);
  const [subjectMarks, setSubjectMarks] = useState<SubjectMark[]>([
    {
      id: 1,
      subject: "",
      totalFullMarks: "",
      marksObtained: "",
      resultStatus: "",
    },
    {
      id: 2,
      subject: "",
      totalFullMarks: "",
      marksObtained: "",
      resultStatus: "",
    },
    {
      id: 3,
      subject: "",
      totalFullMarks: "",
      marksObtained: "",
      resultStatus: "",
    },
    {
      id: 4,
      subject: "",
      totalFullMarks: "",
      marksObtained: "",
      resultStatus: "",
    },
    {
      id: 5,
      subject: "",
      totalFullMarks: "",
      marksObtained: "",
      resultStatus: "",
    },
  ]);

  const [institutionDetails, setInstitutionDetails] = useState({
    boardRollNo: "",
    selectInstitute: "",
    otherInstitute: "",
    selectMedium: "English",
    yearOfPassing: "",
    streamFrom: "",
    calcuttaUniversityRegistered: "No",
    calcuttaUniversityRegNo: "",
    previouslyRegisteredCourse: "",
    otherCourse: "",
  });

  const subjects = [
    "English",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Economics",
    "Accountancy",
    "Business Studies",
    "History",
    "Geography",
    "Political Science",
    "Additional English",
  ];

  const resultStatuses = [
    "Pass",
    "Fail in theory",
    "Fail in practical",
    "Fail",
  ];

  const institutes = [
    "Select Institute",
    "St. Xavier's College",
    "Presidency College",
    "Jadavpur University",
    "University of Calcutta",
    "Other Institute",
  ];

  const mediums = ["English", "Bengali", "Hindi"];

  const years = [
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
    "2016",
    "2015",
  ];

  const streams = ["Science", "Commerce", "Arts/Humanities", "Vocational"];

  const courses = ["B.A.", "B.Sc.", "B.Com", "B.Tech", "Other"];

  // Updated Board/University list based on the provided image
  const boardsUniversities = [
    "Council for the Indian School Certificate Examination (ISC)",
    "Central Board of Secondary Education (CBSE)",
    "West Bengal Council of Higher Secondary Education(WBCHSE)",
    "National Institute of Open Schooling (NIOS)",
    "Assam Higher Secondary Education Council",
    "BANASTHALI VIDYAPITH",
    "Bihar Intermediate Education Council",
    "Bihar School Examination Board",
    "Board Of Intermediate Education Andhra Pradesh",
    "Board of Secondary Education, Madhya Pradesh, Bhopal",
    "Board of Secondary Education, Rajasthan",
    "Chhattisgarh Board of Secondary Education",
    "Council Of Higher Secondary Education Manipur",
    "Council Of Higher Secondary Education, Odisha",
    "Goa Board of Secondary and Higher Secondary Education",
    "Government Of Karnataka Dept. Of Pre-University Education",
    "GOVERNMENT OF NEPAL, NATIONAL EXAMINATIONS BOARD",
    "Gujarat Secondary and Higher Secondary Education Board",
    "Haryana Board Of School Education",
    "Himachal Pradesh Board of School Education",
    "IGCSE Programme From University Of Cambridge (International Exam)",
    "Jammu and Kashmir Board of School Education",
    "JHARKHAND ACADEMIC COUNCIL,RANCHI",
    "Karnataka School Examination & Assessment Board, Bengaluru",
    "Kerala Board Of Higher Secondary Education",
    "Kerala Board of Public Examination",
    "MAHARASHTRA STATE BOARD OF SECONDARY AND HIGHER SECONDARY EDUCATION",
    "Meghalaya Board of School Education",
    "Mizoram Board of School Education",
    "Nagaland Board of School Education",
    "Punjab School Education Board",
    "Rabindra Mukta Vidyalaya, West Bengal",
    "STATE BOARD OF SCHOOL EXAMINATIONS (SEC.) & BOARD OF HIGHER SECONDARY EXAMINATIONS TAMIL NADU",
    "Telangana State Board of Intermediate Education",
    "Tripura Board of Secondary Education",
    "Uttar Pradesh Board of High School and Intermediate Education",
    "West Bengal Board of Madrasah Education",
    "WEST BENGAL STATE COUNCIL OF TECHNICAL AND VOCATIONAL EDUCATION AND SKILL DEVELOPMENT",
  ];

  const handleSubjectwiseMarksClick = () => {
    setShowMarksModal(true);
  };

  const handleInstitutionDetailsClick = () => {
    setShowInstitutionModal(true);
  };

  const updateInstitutionDetail = (field: string, value: string) => {
    setInstitutionDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInstitutionDone = () => {
    handleInputChange("institution", institutionDetails);
    setShowInstitutionModal(false);
  };

  const handleInstitutionClose = () => {
    setShowInstitutionModal(false);
  };

  const addRow = () => {
    const newId = Math.max(...subjectMarks.map((s) => s.id)) + 1;
    setSubjectMarks([
      ...subjectMarks,
      {
        id: newId,
        subject: "",
        totalFullMarks: "",
        marksObtained: "",
        resultStatus: "",
      },
    ]);
  };

  const removeRow = (id: number) => {
    if (subjectMarks.length > 1) {
      setSubjectMarks(subjectMarks.filter((mark) => mark.id !== id));
    }
  };

  const updateSubjectMark = (
    id: number,
    field: keyof SubjectMark,
    value: string
  ) => {
    setSubjectMarks(
      subjectMarks.map((mark) =>
        mark.id === id ? { ...mark, [field]: value } : mark
      )
    );
  };

  const handleDone = () => {
    // Save the marks data and close modal
    handleInputChange("subjectwiseMarks", subjectMarks);
    setShowMarksModal(false);
  };

  const handleClose = () => {
    setShowMarksModal(false);
  };

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Academic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Board Result Status
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
              <option value="pass">Pass</option>
              <option value="fail">Fail</option>
              <option value="compartmental">Compartmental</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Board/University
            </label>
            <select
              value={formData.boardUniversity}
              onChange={(e) =>
                handleInputChange("boardUniversity", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select...</option>
              {boardsUniversities.map((board, index) => (
                <option key={index} value={board}>
                  {board}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Subjectwise Marks
            </label>
            <button
              type="button"
              onClick={handleSubjectwiseMarksClick}
              className="w-full p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left bg-gradient-to-r from-blue-50 to-indigo-50 transition-all duration-300 group shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {Array.isArray(formData.subjectwiseMarks) &&
                      formData.subjectwiseMarks.length > 0
                        ? "Marks Added"
                        : "Add Subject Marks"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {Array.isArray(formData.subjectwiseMarks) &&
                      formData.subjectwiseMarks.length > 0
                        ? `${formData.subjectwiseMarks.length} subjects entered`
                        : "Click to enter subject-wise marks"}
                    </div>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Institution Details *
            </label>
            <button
              type="button"
              onClick={handleInstitutionDetailsClick}
              className="w-full p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-left bg-gradient-to-r from-green-50 to-emerald-50 transition-all duration-300 group shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {formData.institution &&
                      typeof formData.institution === "object"
                        ? "Institution Added"
                        : "Add Institution"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formData.institution &&
                      typeof formData.institution === "object"
                        ? "Institution details completed"
                        : "Click to add institution details"}
                    </div>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Marks Entry Modal */}
      {showMarksModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Marks Entry
              </h2>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Note Section */}
              <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-yellow-600 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 mb-2">
                      Please Note:
                    </h3>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <p>
                        <strong>i.</strong> Please enter all Subjects Marks as
                        per Class XII Board MarkSheet
                      </p>
                      <p>
                        <strong>For Example:</strong> If you have Five Subjects
                        then Marks of Five Subjects have to be Entered.
                      </p>
                      <p>
                        <strong>ii.</strong> Applicants with theory and
                        practical division of marks, need to add the marks
                        before entering but select the subject result status as
                        per the marksheet only, as applicable.
                      </p>
                      <p>
                        <strong>iii.</strong> Marks entered with "Subject Result
                        Status" as "Fail / Fail in Theory / Fail in Practical"
                        will not be considered for calculation of BO4.
                      </p>
                      <p>
                        <strong>iv.</strong> English Marks must be Entered.
                      </p>
                      <p>
                        <strong>v.</strong> For students, who have studied more
                        than 1 (One) English subject with 100 marks each, they
                        can select "Additional English" in row no. 2 & give
                        their 2nd English subject marks.
                      </p>
                      <p>
                        <strong>vi.</strong> Please do not Enter SUPW / SUPW &
                        Community Services Marks / Grade.
                      </p>
                      <p>
                        <strong>vii.</strong> In case if you cannot find your
                        subject in the dropdown, please mail us your scanned
                        copy of marksheet at admission@thebges.edu.in
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marks Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-300">
                        Sl
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-300">
                        Subject
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-300">
                        Total Full Marks
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-300">
                        Total Marks Obtained
                        <br />
                        (Including Practical)
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-300">
                        Subject Result Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-b border-gray-300">
                        Remove
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {subjectMarks.map((mark, index) => (
                      <tr key={mark.id} className="border-b border-gray-200">
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {index + 1} of {subjectMarks.length}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={mark.subject}
                            onChange={(e) =>
                              updateSubjectMark(
                                mark.id,
                                "subject",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Subject</option>
                            {subjects.map((subject) => (
                              <option key={subject} value={subject}>
                                {subject}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={mark.totalFullMarks}
                            onChange={(e) =>
                              updateSubjectMark(
                                mark.id,
                                "totalFullMarks",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            max="100"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={mark.marksObtained}
                            onChange={(e) =>
                              updateSubjectMark(
                                mark.id,
                                "marksObtained",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            max="100"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={mark.resultStatus}
                            onChange={(e) =>
                              updateSubjectMark(
                                mark.id,
                                "resultStatus",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Status</option>
                            {resultStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => removeRow(mark.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md transition-colors duration-200"
                            disabled={subjectMarks.length === 1}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Row Button */}
              <div className="mt-4">
                <button
                  onClick={addRow}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
                >
                  <span className="text-lg">+</span>
                  Add Row
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={handleDone}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Done
              </button>
              <button
                onClick={handleClose}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Institution Details Modal */}
      {showInstitutionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Institute Details
              </h2>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Note Section */}
              <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-yellow-600 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 mb-2">
                      Please Note:
                    </h3>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <p>
                        <strong>i.</strong> Please select your Class 12 school
                        name under the "Select Institute" option in serial no.
                        b(i). In case your school's name is not enlisted in the
                        dropdown list, select "Other Institute" from the list
                        and enter the name of your school in serial no. b(ii).
                      </p>
                      <p>
                        <strong>ii.</strong> Sr. No. f to j is applicable for
                        students who have cleared class XII board exam in or
                        before year 2024.
                      </p>
                      <p>
                        <strong>iii.</strong>{" "}
                        <span className="text-red-600">Red dot</span> indicates
                        mandatory field.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Board Roll No <span className="text-red-500">•</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">a(i)</span>
                    <input
                      type="text"
                      value={institutionDetails.boardRollNo}
                      onChange={(e) =>
                        updateInstitutionDetail("boardRollNo", e.target.value)
                      }
                      placeholder="Board Roll No / UID"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select Institute <span className="text-red-500">•</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">b(i)</span>
                    <select
                      value={institutionDetails.selectInstitute}
                      onChange={(e) =>
                        updateInstitutionDetail(
                          "selectInstitute",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {institutes.map((institute) => (
                        <option key={institute} value={institute}>
                          {institute}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Other Institute
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">b(ii)</span>
                    <input
                      type="text"
                      value={institutionDetails.otherInstitute}
                      onChange={(e) =>
                        updateInstitutionDetail(
                          "otherInstitute",
                          e.target.value
                        )
                      }
                      placeholder="Other Institute"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select Medium <span className="text-red-500">•</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">c.</span>
                    <select
                      value={institutionDetails.selectMedium}
                      onChange={(e) =>
                        updateInstitutionDetail("selectMedium", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {mediums.map((medium) => (
                        <option key={medium} value={medium}>
                          {medium}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select Year Of Passing{" "}
                    <span className="text-red-500">•</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">d.</span>
                    <select
                      value={institutionDetails.yearOfPassing}
                      onChange={(e) =>
                        updateInstitutionDetail("yearOfPassing", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Year Of Passing</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Coming from which Stream{" "}
                    <span className="text-red-500">•</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">e.</span>
                    <select
                      value={institutionDetails.streamFrom}
                      onChange={(e) =>
                        updateInstitutionDetail("streamFrom", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Stream</option>
                      {streams.map((stream) => (
                        <option key={stream} value={stream}>
                          {stream}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Have you ever been registered for any undergraduate courses
                    under calcutta University?
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">f.</span>
                    <select
                      value={institutionDetails.calcuttaUniversityRegistered}
                      onChange={(e) =>
                        updateInstitutionDetail(
                          "calcuttaUniversityRegistered",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Calcutta University Registration No as '000-0000-0000-00'
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">g.</span>
                    <input
                      type="text"
                      value={institutionDetails.calcuttaUniversityRegNo}
                      onChange={(e) =>
                        updateInstitutionDetail(
                          "calcuttaUniversityRegNo",
                          e.target.value
                        )
                      }
                      placeholder="Calcutta University Registration No as '000-0000-0000-00'"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Previously Registered Course
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">h(i)</span>
                    <select
                      value={institutionDetails.previouslyRegisteredCourse}
                      onChange={(e) =>
                        updateInstitutionDetail(
                          "previouslyRegisteredCourse",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">
                        Select Previously Registered Course
                      </option>
                      {courses.map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Other Course
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">h(ii)</span>
                    <input
                      type="text"
                      value={institutionDetails.otherCourse}
                      onChange={(e) =>
                        updateInstitutionDetail("otherCourse", e.target.value)
                      }
                      placeholder="Other Course"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={handleInstitutionDone}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Done
              </button>
              <button
                onClick={handleInstitutionClose}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
