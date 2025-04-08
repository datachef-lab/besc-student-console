"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Trash2,
  ExternalLink,
  Edit,
  Filter,
  Download,
  Plus,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// Define types
interface AdditionalLink {
  title: string;
  url: string;
}

interface MaterialLink {
  id: string;
  title: string;
  url: string;
  subjectId: string;
  courseId: string;
  semesterId: string;
  description: string;
  dateAdded: string;
  type: "link" | "file";
  additionalLinks: AdditionalLink[];
}

// Mock data for subjects, courses and semesters
const mockSubjects = [
  { id: "1", name: "Financial Accounting", type: "Core", paper: "Paper 1" },
  { id: "2", name: "Business Economics", type: "Core", paper: "Paper 2" },
  {
    id: "3",
    name: "Computer Applications",
    type: "Elective",
    paper: "Paper 1",
  },
  { id: "4", name: "Business Mathematics", type: "Core", paper: "Paper 3" },
  {
    id: "5",
    name: "Business Communication",
    type: "Elective",
    paper: "Paper 2",
  },
];

const mockCourses = [
  { id: "1", name: "Bachelor of Commerce" },
  { id: "2", name: "Bachelor of Business Administration" },
  { id: "3", name: "Bachelor of Computer Applications" },
];

const mockSemesters = [
  { id: "1", name: "Semester 1" },
  { id: "2", name: "Semester 2" },
  { id: "3", name: "Semester 3" },
  { id: "4", name: "Semester 4" },
  { id: "5", name: "Semester 5" },
  { id: "6", name: "Semester 6" },
];

export default function MaterialsSettingsPage() {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMaterialLink, setCurrentMaterialLink] = useState<
    Omit<MaterialLink, "dateAdded"> & { dateAdded?: string }
  >({
    id: "",
    title: "",
    url: "",
    subjectId: "",
    courseId: "",
    semesterId: "",
    description: "",
    type: "link",
    additionalLinks: [],
  });

  // Material link states
  const [materialLinks, setMaterialLinks] = useState<MaterialLink[]>([
    {
      id: "1",
      title: "Introduction to Financial Accounting",
      url: "https://example.com/accounting-intro",
      subjectId: "1",
      courseId: "1",
      semesterId: "1",
      description: "Basic concepts and principles of financial accounting",
      dateAdded: "2024-04-10",
      type: "link",
      additionalLinks: [
        {
          title: "Accounting Basics PDF",
          url: "https://example.com/accounting-basics.pdf",
        },
        {
          title: "Practice Problems",
          url: "https://example.com/accounting-practice",
        },
      ],
    },
    {
      id: "2",
      title: "Economics Fundamentals",
      url: "https://example.com/econ-basics",
      subjectId: "2",
      courseId: "1",
      semesterId: "1",
      description: "Introduction to basic economic principles",
      dateAdded: "2024-04-12",
      type: "link",
      additionalLinks: [],
    },
    {
      id: "3",
      title: "Computer Applications in Business",
      url: "https://example.com/comp-apps",
      subjectId: "3",
      courseId: "2",
      semesterId: "2",
      description: "Using software tools for business operations",
      dateAdded: "2024-04-15",
      type: "link",
      additionalLinks: [
        { title: "Excel Tutorial", url: "https://example.com/excel-tutorial" },
      ],
    },
    {
      id: "4",
      title: "Business Mathematics - Advanced Concepts",
      url: "https://example.com/bus-math",
      subjectId: "4",
      courseId: "2",
      semesterId: "3",
      description: "Advanced mathematical techniques for business analysis",
      dateAdded: "2024-04-18",
      type: "file",
      additionalLinks: [],
    },
    {
      id: "5",
      title: "Communication Skills for Professionals",
      url: "https://example.com/comm-skills",
      subjectId: "5",
      courseId: "3",
      semesterId: "2",
      description: "Developing effective business communication skills",
      dateAdded: "2024-04-20",
      type: "link",
      additionalLinks: [
        {
          title: "Presentation Tips",
          url: "https://example.com/presentation-tips",
        },
        {
          title: "Business Writing Guide",
          url: "https://example.com/writing-guide",
        },
      ],
    },
  ]);

  const handleRemoveLink = (id: string) => {
    setMaterialLinks(materialLinks.filter((link) => link.id !== id));
  };

  const openAddModal = (
    subjectId: string,
    courseId: string,
    semesterId: string
  ) => {
    setCurrentMaterialLink({
      id: "",
      title: "",
      url: "",
      subjectId: subjectId,
      courseId: courseId,
      semesterId: semesterId,
      description: "",
      type: "link",
      additionalLinks: [],
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (link: MaterialLink) => {
    setCurrentMaterialLink(link);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveMaterial = () => {
    if (
      !currentMaterialLink.title ||
      !currentMaterialLink.url ||
      !currentMaterialLink.subjectId ||
      !currentMaterialLink.courseId ||
      !currentMaterialLink.semesterId
    ) {
      // Show validation error
      return;
    }

    if (isEditing) {
      // Update existing material
      const updatedLink: MaterialLink = {
        ...currentMaterialLink,
        dateAdded:
          currentMaterialLink.dateAdded ||
          new Date().toISOString().split("T")[0],
      };

      setMaterialLinks(
        materialLinks.map((link) =>
          link.id === currentMaterialLink.id ? updatedLink : link
        )
      );
    } else {
      // Add new material
      const newMaterial: MaterialLink = {
        ...currentMaterialLink,
        id: Math.random().toString(36).substring(2, 9),
        dateAdded: new Date().toISOString().split("T")[0],
      };
      setMaterialLinks([...materialLinks, newMaterial]);
    }

    closeModal();
  };

  const getSubjectName = (id: string) => {
    const subject = mockSubjects.find((s) => s.id === id);
    return subject ? subject.name : "Unknown Subject";
  };

  const getSubjectType = (id: string) => {
    const subject = mockSubjects.find((s) => s.id === id);
    return subject ? subject.type : "Unknown Type";
  };

  const getSubjectPaper = (id: string) => {
    const subject = mockSubjects.find((s) => s.id === id);
    return subject ? subject.paper : "Unknown Paper";
  };

  // Filter materials based on selected course and semester
  const filteredMaterials = materialLinks.filter((material) => {
    const matchesCourse =
      selectedCourse === "all" || material.courseId === selectedCourse;
    const matchesSemester =
      selectedSemester === "all" || material.semesterId === selectedSemester;
    return matchesCourse && matchesSemester;
  });

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="space-y-4 px-0">
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Filter size={15} className="mr-2" />
              <span className="text-sm font-medium mr-3">Filter Materials</span>
            </div>

            <div className="flex space-x-2">
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="h-8 w-[200px] rounded-md border px-3 text-xs">
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {mockCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedSemester}
                onValueChange={setSelectedSemester}
              >
                <SelectTrigger className="h-8 w-[160px] rounded-md border px-3 text-xs">
                  <SelectValue placeholder="All Semesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {mockSemesters.map((semester) => (
                    <SelectItem key={semester.id} value={semester.id}>
                      {semester.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs gap-1.5"
          >
            <Download size={13} />
            Export
          </Button>
        </div>

        {/* Materials Table */}
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-14 w-14 text-muted-foreground opacity-40" />
              <p className="mt-4 text-sm text-muted-foreground">
                No material links found with current filters
              </p>
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b bg-muted/30 hover:bg-muted/30">
                      <TableHead className="w-[50px] font-medium pl-6 py-2.5 text-center">
                        No
                      </TableHead>
                      <TableHead className="font-medium w-[180px] py-2.5 text-center">
                        Subject
                      </TableHead>
                      <TableHead className="font-medium w-[100px] py-2.5 text-center">
                        Type
                      </TableHead>
                      <TableHead className="font-medium w-[80px] py-2.5 text-center">
                        Paper
                      </TableHead>
                      <TableHead className="font-medium w-[280px] py-2.5 text-center">
                        Materials
                      </TableHead>
                      <TableHead className="w-[90px] text-right pr-6 font-medium py-2.5">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Group materials by subject */}
                    {mockSubjects
                      .filter((subject) => {
                        // Get all materials for this subject
                        const subjectMaterials = filteredMaterials.filter(
                          (m) => m.subjectId === subject.id
                        );
                        // Only show subjects with materials matching the filters or when no filters are applied
                        return (
                          subjectMaterials.length > 0 ||
                          (selectedCourse === "all" &&
                            selectedSemester === "all")
                        );
                      })
                      .map((subject, index) => {
                        // Get materials for this subject
                        const subjectMaterials = filteredMaterials.filter(
                          (m) => m.subjectId === subject.id
                        );

                        return (
                          <TableRow
                            key={subject.id}
                            className="border-b hover:bg-muted/5"
                          >
                            <TableCell className="align-top pl-6 font-mono text-xs text-muted-foreground pt-3 pb-2 text-center">
                              {index + 1}
                            </TableCell>
                            <TableCell className="align-top pt-3 pb-2 text-center">
                              <div className="font-medium">{subject.name}</div>
                            </TableCell>
                            <TableCell className="align-top pt-3 pb-2 text-center">
                              <Badge
                                variant={
                                  subject.type === "Core"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs font-normal"
                              >
                                {subject.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="align-top pt-3 pb-2 text-center text-sm">
                              {subject.paper}
                            </TableCell>
                            <TableCell className="py-2 align-top">
                              {subjectMaterials.length > 0 ? (
                                <div className="space-y-0.5">
                                  {subjectMaterials.map((material) => (
                                    <div
                                      key={material.id}
                                      className="flex items-center justify-between group px-2 py-1 hover:bg-muted/10 rounded"
                                    >
                                      <a
                                        href={material.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline flex items-center gap-1.5 font-medium flex-1"
                                      >
                                        {material.type === "link" ? (
                                          <ExternalLink size={14} />
                                        ) : (
                                          <Download size={14} />
                                        )}
                                        <span>{material.title}</span>
                                      </a>
                                      <div className="flex gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6 text-muted-foreground hover:text-primary"
                                          onClick={() =>
                                            openEditModal(material)
                                          }
                                          title="Edit Material"
                                        >
                                          <Edit size={14} />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                          onClick={() =>
                                            handleRemoveLink(material.id)
                                          }
                                          title="Delete Material"
                                        >
                                          <Trash2 size={14} />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-xs text-center py-2 text-muted-foreground italic">
                                  No materials
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right py-2 align-top pr-6">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 rounded-full"
                                onClick={() =>
                                  openAddModal(
                                    subject.id,
                                    selectedCourse !== "all"
                                      ? selectedCourse
                                      : "1",
                                    selectedSemester !== "all"
                                      ? selectedSemester
                                      : "1"
                                  )
                                }
                                title={`Add material to ${subject.name}`}
                              >
                                <Plus size={15} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>

              <div className="border-t bg-muted/10 px-6 py-3 flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  Showing {filteredMaterials.length} of {materialLinks.length}{" "}
                  materials
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Material Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogTitle className="text-lg">
            {isEditing ? "Edit Material" : "Add Material"}
          </DialogTitle>

          {/* Subject context info */}
          <div className="bg-primary/5 -mx-6 px-6 py-3 border-y mb-5">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white font-medium">
                {getSubjectName(currentMaterialLink.subjectId)}
              </Badge>
              <span className="text-xs text-muted-foreground">•</span>
              <Badge variant="secondary" className="font-normal">
                {getSubjectType(currentMaterialLink.subjectId)}
              </Badge>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs">
                {getSubjectPaper(currentMaterialLink.subjectId)}
              </span>
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-5">
            <div className="bg-muted/10 p-3 rounded-lg">
              <Label
                htmlFor="materialType"
                className="mb-2 block text-sm font-medium"
              >
                Material Type <span className="text-red-500">*</span>
              </Label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="typeLink"
                    name="materialType"
                    className="mr-2 h-4 w-4 accent-primary"
                    checked={currentMaterialLink.type === "link"}
                    onChange={() =>
                      setCurrentMaterialLink({
                        ...currentMaterialLink,
                        type: "link",
                      })
                    }
                  />
                  <Label
                    htmlFor="typeLink"
                    className="cursor-pointer flex items-center gap-1.5"
                  >
                    <ExternalLink size={14} />
                    Link
                  </Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="typeFile"
                    name="materialType"
                    className="mr-2 h-4 w-4 accent-primary"
                    checked={currentMaterialLink.type === "file"}
                    onChange={() =>
                      setCurrentMaterialLink({
                        ...currentMaterialLink,
                        type: "file",
                      })
                    }
                  />
                  <Label
                    htmlFor="typeFile"
                    className="cursor-pointer flex items-center gap-1.5"
                  >
                    <FileText size={14} />
                    File Upload
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label
                htmlFor="title"
                className="mb-1.5 block text-sm font-medium"
              >
                Material Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={currentMaterialLink.title}
                onChange={(e) =>
                  setCurrentMaterialLink({
                    ...currentMaterialLink,
                    title: e.target.value,
                  })
                }
                placeholder="Enter material title"
                className="border-muted-foreground/20"
              />
            </div>

            {currentMaterialLink.type === "link" ? (
              <div>
                <Label
                  htmlFor="url"
                  className="mb-1.5 block text-sm font-medium"
                >
                  URL <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="url"
                  value={currentMaterialLink.url}
                  onChange={(e) =>
                    setCurrentMaterialLink({
                      ...currentMaterialLink,
                      url: e.target.value,
                    })
                  }
                  placeholder="https://example.com/resource"
                  className="border-muted-foreground/20"
                />
              </div>
            ) : (
              <div>
                <Label
                  htmlFor="fileUpload"
                  className="mb-1.5 block text-sm font-medium"
                >
                  File Upload <span className="text-red-500">*</span>
                </Label>
                <div className="mt-1">
                  <label
                    htmlFor="fileUpload"
                    className="cursor-pointer flex flex-col items-center justify-center w-full border-2 border-dashed border-primary/30 rounded-md py-6 px-4 hover:bg-primary/5 transition-all group bg-muted/5"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/15 transition-colors">
                      <FileText size={24} className="text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      Drag and drop or click to upload
                    </span>
                    <span className="text-xs text-muted-foreground mt-1.5 max-w-[240px] text-center">
                      PDF, DOCX, PPT, XLSX files up to 10MB
                    </span>
                    <input
                      id="fileUpload"
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setCurrentMaterialLink({
                            ...currentMaterialLink,
                            url: URL.createObjectURL(e.target.files[0]),
                            title:
                              e.target.files[0].name ||
                              currentMaterialLink.title,
                          });
                        }
                      }}
                    />
                  </label>
                </div>
                {currentMaterialLink.url && (
                  <div className="mt-3 text-sm bg-primary/5 p-3 rounded-md border border-primary/20 flex items-start gap-2.5">
                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {currentMaterialLink.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Ready to upload
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
                      onClick={() =>
                        setCurrentMaterialLink({
                          ...currentMaterialLink,
                          url: "",
                          title: "",
                        })
                      }
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div>
              <Label
                htmlFor="description"
                className="mb-1.5 block text-sm font-medium"
              >
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                value={currentMaterialLink.description}
                onChange={(e) =>
                  setCurrentMaterialLink({
                    ...currentMaterialLink,
                    description: e.target.value,
                  })
                }
                placeholder="Brief description of this material"
                className="border-muted-foreground/20 resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={closeModal} size="sm">
              Cancel
            </Button>
            <Button
              onClick={handleSaveMaterial}
              disabled={!currentMaterialLink.title || !currentMaterialLink.url}
              size="sm"
            >
              {isEditing ? "Update" : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
  );
}
