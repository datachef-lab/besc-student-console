"use client";

import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";

import { FileText, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Course } from "@/types/academics/course";
import { AcademicClass } from "@/types/academics/academic-class";
import { BatchSubject } from "@/types/academics/batch-subjects";
import { DbCourseMaterial } from "@/types/academics/course-material";
import SubjectRow from "@/components/settings/SubjectRow";
import MaterialItemForm from "./MaterialItemForm";
import SelectCourseAndSemester from "./SelectCourseAndSemester";

export default function MaterialsSettingsPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<AcademicClass[]>([]);
  const [subjects, setSubjects] = useState<BatchSubject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedSemester, setSelectedSemester] =
    useState<AcademicClass | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMaterialLink, setCurrentMaterialLink] =
    useState<DbCourseMaterial>({
      id: 0,
      subject_id_fk: 0,
      title: "",
      url: "",
      type: "link",
      file_path: null,
    });

  const [materialLinks, setMaterialLinks] = useState<DbCourseMaterial[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [coursesResponse, classesResponse] = await Promise.all([
          fetch("/api/courses"),
          fetch("/api/classes"),
        ]);

        if (!coursesResponse.ok || !classesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [coursesData, classesData] = await Promise.all([
          coursesResponse.json(),
          classesResponse.json(),
        ]);

        // Ensure we're setting arrays
        const validCourses = Array.isArray(coursesData) ? coursesData : [];
        const validClasses = Array.isArray(classesData) ? classesData : [];

        setCourses(validCourses);
        setClasses(validClasses);

        // Set default selections to first elements if available
        if (validCourses.length > 0 && validClasses.length > 0) {
          const firstCourse = validCourses[0];
          const firstClass = validClasses[0];
          console.log(
            "Setting initial course and class:",
            firstCourse,
            firstClass
          );
          setSelectedCourse(firstCourse);
          setSelectedSemester(firstClass);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setCourses([]);
        setClasses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Separate effect for fetching subjects when course or semester changes
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedCourse?.id || !selectedSemester?.id) {
        console.log("Course or semester not selected, skipping subjects fetch");
        return;
      }

      try {
        console.log(
          "Starting to fetch subjects for course:",
          selectedCourse.id,
          "class:",
          selectedSemester.id
        );

        const response = await fetch(
          `/api/subjects?courseId=${selectedCourse.id}&classId=${selectedSemester.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch subjects");
        }

        const data = await response.json();
        console.log("Raw API Response:", JSON.stringify(data, null, 2));

        if (!Array.isArray(data)) {
          console.error("Invalid response format:", data);
          setSubjects([]);
          return;
        }

        console.log(`Received ${data.length} subjects from API`);

        // Log each subject for debugging
        data.forEach((subject, index) => {
          console.log(`Subject ${index + 1}:`, {
            id: subject.subjectId,
            name: subject.subjectname,
            type: subject.subjecttypename,
            paper: subject.paperName,
          });
        });

        console.log("Setting subjects to state:", data);
        setSubjects(data);
      } catch (error) {
        console.error("Error in fetchSubjects:", error);
        setSubjects([]);
      }
    };

    fetchSubjects();
  }, [selectedCourse?.id, selectedSemester?.id]);

  // Debug effect to monitor subjects state
  useEffect(() => {
    console.log("Subjects state updated:", JSON.stringify(subjects, null, 2));
    console.log("Subjects state length:", subjects.length);
  }, [subjects]);

  // Debug effect to monitor selected values
  useEffect(() => {
    console.log("Selected course:", selectedCourse);
    console.log("Selected semester:", selectedSemester);
  }, [selectedCourse, selectedSemester]);

  // Debug effect to monitor material links
  useEffect(() => {
    console.log("Current material links:", materialLinks);
  }, [materialLinks]);

  // Define fetchCourseMaterials outside the useEffect
  const fetchCourseMaterials = async () => {
    if (!subjects.length) return;

    try {
      // Fetch materials for all subjects
      const materialsPromises = subjects.map((subject) =>
        fetch(`/api/course-materials?subjectId=${subject.subjectId}`)
          .then((res) => res.json())
          .catch((err) => {
            console.error(
              `Error fetching materials for subject ${subject.subjectId}:`,
              err
            );
            return [];
          })
      );

      const materialsArrays = await Promise.all(materialsPromises);
      const allMaterials = materialsArrays.flat();

      console.log(`Fetched ${allMaterials.length} total materials`);
      setMaterialLinks(allMaterials);
    } catch (error) {
      console.error("Error fetching course materials:", error);
      setMaterialLinks([]);
    }
  };

  // Function to refresh materials for a specific subject
  const refreshSubjectMaterials = async (subjectId: number) => {
    try {
      console.log(`Explicitly refreshing materials for subject ${subjectId}`);
      const response = await fetch(
        `/api/course-materials?subjectId=${subjectId}`
      );
      const materials = await response.json();

      console.log(
        `Fetched ${materials.length} materials for subject ${subjectId}`
      );

      // Update the materialLinks state by replacing materials for this subject
      // and keeping materials for other subjects
      setMaterialLinks((prev) => {
        const filteredMaterials = prev.filter(
          (m) => m.subject_id_fk !== subjectId
        );
        return [...filteredMaterials, ...materials];
      });

      // Also force the UI to update by changing the subject reference
      setSubjects(
        subjects.map((subject) =>
          subject.subjectId === subjectId
            ? { ...subject, _refreshTimestamp: Date.now() }
            : subject
        )
      );
    } catch (error) {
      console.error(
        `Error refreshing materials for subject ${subjectId}:`,
        error
      );
    }
  };

  // Add new effect to fetch course materials when subjects change
  useEffect(() => {
    fetchCourseMaterials();
  }, [subjects]);

  const openAddModal = (subjectId: number) => {
    setIsEditing(false);
    setCurrentMaterialLink({
      id: 0,
      subject_id_fk: subjectId,
      title: "",
      url: "",
      type: "link",
      file_path: null,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (material: DbCourseMaterial) => {
    setIsEditing(true);
    setCurrentMaterialLink(material);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveMaterial = async () => {
    if (!currentMaterialLink.title || !currentMaterialLink.subject_id_fk) {
      // Show validation error
      return;
    }

    try {
      const formData = new FormData();
      formData.append(
        "subjectId",
        currentMaterialLink.subject_id_fk.toString()
      );
      formData.append("title", currentMaterialLink.title);
      formData.append("type", currentMaterialLink.type);
      formData.append("url", currentMaterialLink.url || "");

      // If it's a file type and we have a file, append it
      if (
        currentMaterialLink.type === "file" &&
        currentMaterialLink.file_path
      ) {
        // Check if file_path is a Blob URL or actual file data
        if (currentMaterialLink.file_path.startsWith("blob:")) {
          // Get the file from the fileInput element
          const fileInput = document.getElementById(
            "fileUpload"
          ) as HTMLInputElement;
          if (fileInput && fileInput.files && fileInput.files.length > 0) {
            formData.append("file", fileInput.files[0]);
            console.log("File appended to FormData:", fileInput.files[0]);
          } else {
            console.error("File input element not found or no files selected");
          }
        } else {
          formData.append("file_path", currentMaterialLink.file_path);
        }
      }

      const response = await fetch("/api/course-materials", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save material");
      }

      const result = await response.json();
      console.log("Material saved:", result);

      // Close the modal first to prevent UI glitches
      closeModal();

      // Get the subject ID that was just updated
      const subjectId = currentMaterialLink.subject_id_fk;

      // Refresh materials specifically for this subject
      await refreshSubjectMaterials(subjectId);

      console.log("Materials refreshed for subject:", subjectId);
    } catch (error) {
      console.error("Error saving material:", error);
      // Close the modal even on error
      closeModal();
    }
  };

  const handleDeleteMaterial = async (materialId: number) => {
    try {
      const response = await fetch(`/api/course-materials?id=${materialId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete material");
      }

      // Update the materialLinks state by removing the deleted material
      setMaterialLinks((prev) => prev.filter((m) => m.id !== materialId));
    } catch (error) {
      console.error("Error deleting material:", error);
      // You might want to show a toast notification here
    }
  };

  // Add loading state UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user?.isAdmin) {
    return null;
  }

  return (
    selectedCourse &&
    selectedSemester && (
      <div className="space-y-4 px-0">
        {/* {JSON.stringify(subjects)} */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="text-primary h-5 w-5" />
            <h1 className="text-xl font-medium">Course Materials</h1>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage course material links for students across all courses
        </p>

        {/* Filter and Table */}
        <div>
          <SelectCourseAndSemester
            courses={courses}
            classes={classes}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            selectedSemester={selectedSemester}
            setSelectedSemester={setSelectedSemester}
          />

          {/* Materials Table */}
          <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b bg-muted/30 hover:bg-muted/30">
                      {[
                        "Sr. No",
                        "Subject",
                        "Type",
                        "Paper",
                        "Materials",
                        "Actions",
                      ].map((header) => (
                        <TableHead
                          key={header}
                          className="font-medium py-2.5 text-center"
                        >
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Group materials by subject */}
                    {subjects.length > 0 ? (
                      subjects.map((subject, index) => (
                        <SubjectRow
                          key={`subject-${subject.subjectId}`}
                          index={index}
                          subject={subject}
                          openAddModal={openAddModal}
                          openEditModal={openEditModal}
                          onDeleteMaterial={handleDeleteMaterial}
                          materials={materialLinks}
                        />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="h-8 w-8 text-muted-foreground opacity-40" />
                            <p className="text-sm text-muted-foreground">
                              {selectedCourse === null ||
                              selectedSemester === null
                                ? "Please select a course and semester to view subjects"
                                : "No subjects found for the selected course and semester"}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Material Modal */}
        <MaterialItemForm
          closeModal={closeModal}
          currentMaterialLink={currentMaterialLink}
          isEditing={isEditing}
          isModalOpen={isModalOpen}
          onSaveMaterial={handleSaveMaterial}
          setCurrentMaterialLink={setCurrentMaterialLink}
          subjects={subjects}
          setIsModalOpen={setIsModalOpen}
        />

        {/* Add custom scrollbar style */}
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
          }
        `}</style>
      </div>
    )
  );
}
