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
  X,
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
    additionalLinks: [],
  });
  const [tempAdditionalLink, setTempAdditionalLink] = useState<AdditionalLink>({
    title: "",
    url: "",
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

  const addAdditionalLink = () => {
    if (tempAdditionalLink.title && tempAdditionalLink.url) {
      setCurrentMaterialLink({
        ...currentMaterialLink,
        additionalLinks: [
          ...currentMaterialLink.additionalLinks,
          {
            title: tempAdditionalLink.title,
            url: tempAdditionalLink.url,
          },
        ],
      });
      setTempAdditionalLink({ title: "", url: "" });
    }
  };

  const removeAdditionalLink = (index: number) => {
    const updatedLinks = [...currentMaterialLink.additionalLinks];
    updatedLinks.splice(index, 1);
    setCurrentMaterialLink({
      ...currentMaterialLink,
      additionalLinks: updatedLinks,
    });
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
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <p className="mt-4 text-sm text-muted-foreground">
                No material links found with current filters
              </p>
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-[60px] font-medium">
                        No.
                      </TableHead>
                      <TableHead className="font-medium w-[220px]">
                        Subject
                      </TableHead>
                      <TableHead className="font-medium w-[350px]">
                        Material Link
                      </TableHead>
                      <TableHead className="font-medium w-[100px]">
                        Type
                      </TableHead>
                      <TableHead className="font-medium w-[120px]">
                        Course
                      </TableHead>
                      <TableHead className="font-medium w-[120px]">
                        Semester
                      </TableHead>
                      <TableHead className="font-medium w-[100px]">
                        Add. Resources
                      </TableHead>
                      <TableHead className="w-[100px] text-right font-medium">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaterials.map((material, index) => {
                      const course = mockCourses.find(
                        (c) => c.id === material.courseId
                      );
                      const semester = mockSemesters.find(
                        (s) => s.id === material.semesterId
                      );

                      return (
                        <TableRow
                          key={material.id}
                          className="border-b hover:bg-muted/5"
                        >
                          <TableCell className="font-medium align-middle py-3">
                            {index + 1}
                          </TableCell>
                          <TableCell className="align-middle py-3">
                            <div>
                              <div className="font-medium">
                                {getSubjectName(material.subjectId)}
                              </div>
                              <Badge
                                className="mt-1 text-xs"
                                variant={
                                  getSubjectType(material.subjectId) === "Core"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {getSubjectPaper(material.subjectId)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="align-middle py-3">
                            <div>
                              <a
                                href={material.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center gap-1.5 font-medium"
                              >
                                <ExternalLink size={14} />
                                <span>{material.title}</span>
                              </a>
                              {material.description && (
                                <p className="text-xs text-muted-foreground mt-1 max-w-[300px] truncate">
                                  {material.description}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="align-middle py-3">
                            <Badge
                              variant={
                                getSubjectType(material.subjectId) === "Core"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {getSubjectType(material.subjectId)}
                            </Badge>
                          </TableCell>
                          <TableCell className="align-middle py-3 text-sm">
                            {course?.name || "—"}
                          </TableCell>
                          <TableCell className="align-middle py-3 text-sm">
                            {semester?.name || "—"}
                          </TableCell>
                          <TableCell className="align-middle py-3 text-center">
                            {material.additionalLinks.length > 0 ? (
                              <Badge variant="outline" className="text-xs">
                                {material.additionalLinks.length}
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right py-3">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-primary"
                                onClick={() => openEditModal(material)}
                                title="Edit Material"
                              >
                                <Edit size={15} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() => handleRemoveLink(material.id)}
                                title="Delete Material"
                              >
                                <Trash2 size={15} />
                              </Button>
                            </div>
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
                <div className="flex flex-wrap justify-end gap-2">
                  {mockSubjects.map((subject) => (
                    <Button
                      key={subject.id}
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() =>
                        openAddModal(
                          subject.id,
                          selectedCourse !== "all" ? selectedCourse : "1",
                          selectedSemester !== "all" ? selectedSemester : "1"
                        )
                      }
                    >
                      <Plus size={14} className="mr-1" />
                      {subject.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Material Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogTitle>
            {isEditing ? "Edit Material" : "Add Material"}
          </DialogTitle>

          {/* Subject context info */}
          <div className="text-sm text-muted-foreground mb-4">
            Subject:{" "}
            <span className="font-medium">
              {getSubjectName(currentMaterialLink.subjectId)}
            </span>{" "}
            •{getSubjectType(currentMaterialLink.subjectId)} •
            {getSubjectPaper(currentMaterialLink.subjectId)}
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">
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
              />
            </div>

            <div>
              <Label htmlFor="url">
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
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
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
                rows={3}
              />
            </div>

            {/* Additional Links Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Secondary Resources</Label>
                <span className="text-xs text-muted-foreground">
                  (Optional)
                </span>
              </div>

              {/* List of existing additional links */}
              {currentMaterialLink.additionalLinks.length > 0 && (
                <div className="space-y-2 mb-4 max-h-[200px] overflow-y-auto pr-1">
                  {currentMaterialLink.additionalLinks.map((link, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border rounded-md p-2"
                    >
                      <div>
                        <div className="font-medium text-sm">{link.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[350px]">
                          {link.url}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAdditionalLink(index)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new additional link */}
              <div className="grid grid-cols-3 gap-2 items-end">
                <div className="col-span-1">
                  <Label htmlFor="additionalTitle" className="text-sm">
                    Title
                  </Label>
                  <Input
                    id="additionalTitle"
                    value={tempAdditionalLink.title}
                    onChange={(e) =>
                      setTempAdditionalLink({
                        ...tempAdditionalLink,
                        title: e.target.value,
                      })
                    }
                    placeholder="Title"
                    className="text-sm"
                  />
                </div>
                <div className="col-span-1">
                  <Label htmlFor="additionalUrl" className="text-sm">
                    URL
                  </Label>
                  <Input
                    id="additionalUrl"
                    value={tempAdditionalLink.url}
                    onChange={(e) =>
                      setTempAdditionalLink({
                        ...tempAdditionalLink,
                        url: e.target.value,
                      })
                    }
                    placeholder="URL"
                    className="text-sm"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addAdditionalLink}
                  disabled={
                    !tempAdditionalLink.title || !tempAdditionalLink.url
                  }
                >
                  Add Resource
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveMaterial}
              disabled={!currentMaterialLink.title || !currentMaterialLink.url}
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
