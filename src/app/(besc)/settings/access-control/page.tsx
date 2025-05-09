"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Search,
  UserX,
  Users,
  UserCheck,
  UserX as UserRemoved,
  GraduationCap,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DbStudent } from "@/types/academics/student";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Extended type with guaranteed array for restrictedFeatures
type StudentWithAccess = DbStudent & {
  restrictedFeatures: string[];
  isSuspended?: boolean;
};

// Types for student stats
type StudentStats = {
  totalStudents: number;
  activeStudents: number;
  suspendedStudents: number;
  graduatedStudents: number;
};

// Function to get initials from name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export default function AccessControlPage() {
  const { accessToken } = useAuth();
  const [students, setStudents] = useState<DbStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] =
    useState<StudentWithAccess | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [stats, setStats] = useState<StudentStats>({
    totalStudents: 0,
    activeStudents: 0,
    suspendedStudents: 0,
    graduatedStudents: 0,
  });

  // Fetch student statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!accessToken) return;

        const headers: HeadersInit = {
          Authorization: `Bearer ${accessToken}`,
        };

        const response = await fetch("/api/student/stats", { headers });

        if (!response.ok) {
          // If the stats endpoint doesn't exist yet, we'll use placeholder data
          setStats({
            totalStudents: 1254,
            activeStudents: 1187,
            suspendedStudents: 42,
            graduatedStudents: 25,
          });
          return;
        }

        const data = await response.json();
        setStats(data);
      } catch {
        // Use placeholder data if the API fails
        setStats({
          totalStudents: 1254,
          activeStudents: 1187,
          suspendedStudents: 42,
          graduatedStudents: 25,
        });
      }
    };

    fetchStats();
  }, [accessToken]);

  // Search and fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);

        // Prepare the API URL
        const url = searchQuery.trim()
          ? `/api/student/search?page=${page}&size=${pageSize}&query=${encodeURIComponent(
              searchQuery
            )}`
          : `/api/student/list?page=${page}&size=${pageSize}`;

        // Set authorization header if accessToken exists
        const headers: HeadersInit = {};
        if (accessToken) {
          headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const response = await fetch(url, { headers });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch students: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setStudents(data || []);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setStudents([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search to prevent excessive API calls
    const debounceTimeout = setTimeout(() => {
      if (accessToken) {
        fetchStudents();
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [page, accessToken, pageSize, searchQuery]);

  // Update student access permissions
  const updateStudentAccess = async (studentData: StudentWithAccess) => {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(`/api/student/${studentData.id}/access`, {
        method: "PUT",
        headers,
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error("Failed to update student access");
      }

      // Update the students list with the updated student
      setStudents(
        students.map((student) =>
          student.id === studentData.id
            ? { ...student, ...studentData }
            : student
        )
      );

      setIsDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const openStudentDialog = (student: DbStudent) => {
    // Ensure restrictedFeatures is always an array
    let restrictedFeatures: string[] = [];

    if (student.restrictedFeatures) {
      if (typeof student.restrictedFeatures === "string") {
        try {
          restrictedFeatures = JSON.parse(student.restrictedFeatures);
          if (!Array.isArray(restrictedFeatures)) {
            restrictedFeatures = [];
          }
        } catch {
          restrictedFeatures = [];
        }
      } else if (Array.isArray(student.restrictedFeatures)) {
        restrictedFeatures = student.restrictedFeatures;
      }
    }

    setSelectedStudent({
      ...student,
      restrictedFeatures,
    });
    setIsDialogOpen(true);
  };

  // Show loading state on initial load
  if (isLoading && students.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Access Control</h2>
          <p className="text-muted-foreground text-sm">
            Manage student access to portal features
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents.toLocaleString()}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          color="bg-blue-50 border-blue-100"
        />
        <StatCard
          title="Active Students"
          value={stats.activeStudents.toLocaleString()}
          icon={<UserCheck className="h-5 w-5 text-green-600" />}
          color="bg-green-50 border-green-100"
        />
        <StatCard
          title="Suspended Students"
          value={stats.suspendedStudents.toLocaleString()}
          icon={<UserRemoved className="h-5 w-5 text-red-600" />}
          color="bg-red-50 border-red-100"
        />
        <StatCard
          title="Graduated Students"
          value={stats.graduatedStudents.toLocaleString()}
          icon={<GraduationCap className="h-5 w-5 text-purple-600" />}
          color="bg-purple-50 border-purple-100"
        />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search students by name, code, email..."
          className="pl-9 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        )}
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <UserX className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">
                      {searchQuery.trim() !== ""
                        ? "No students found matching your search"
                        : "No students available"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8 rounded-full">
                          <AvatarImage
                            src={`https://74.207.233.48:8443/hrclIRP/studentimages/${student.imgFile}`}
                            alt={student.name || "student-profile-image"}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {getInitials(student.name || "")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {student.codeNumber}
                    </TableCell>
                    <TableCell className="text-sm">
                      {student.institutionalemail}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                          student.isSuspended
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {student.isSuspended ? "Suspended" : "Active"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => openStudentDialog(student)}
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center p-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="h-8"
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">Page {page}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={students.length < pageSize}
              className="h-8"
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedStudent && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <div className="flex items-center space-x-3 mb-2">
                <Avatar className="h-12 w-12 rounded-full">
                  <AvatarImage
                    src={`https://74.207.233.48:8443/hrclIRP/studentimages/${selectedStudent.imgFile}`}
                    alt={selectedStudent.name || "student-profile-image"}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-base">
                    {getInitials(selectedStudent.name || "")}
                  </AvatarFallback>
                </Avatar>
                <DialogTitle>Access for {selectedStudent.name}</DialogTitle>
              </div>
              <DialogDescription className="text-xs">
                Control which features this student can access
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between pb-2 border-b">
                <div>
                  <Label htmlFor="suspended" className="font-medium">
                    Account Status
                  </Label>
                </div>
                <Select
                  defaultValue={
                    selectedStudent.isSuspended ? "suspended" : "active"
                  }
                  onValueChange={(value) => {
                    setSelectedStudent({
                      ...selectedStudent,
                      isSuspended: value === "suspended",
                    });
                  }}
                >
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Feature Access</h4>

                {[
                  {
                    id: "courseCatalogue",
                    label: "Course Catalogue",
                    description: "Browse and view courses",
                  },
                  {
                    id: "library",
                    label: "Library",
                    description: "Access library resources",
                  },
                  {
                    id: "exams",
                    label: "Exams",
                    description: "View and manage exams",
                  },
                  {
                    id: "documents",
                    label: "Documents",
                    description: "View and download documents",
                  },
                ].map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <Label
                        htmlFor={feature.id}
                        className="font-medium text-sm"
                      >
                        {feature.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                    <Switch
                      id={feature.id}
                      checked={
                        !selectedStudent.restrictedFeatures.includes(feature.id)
                      }
                      onCheckedChange={(checked) => {
                        const restrictedFeatures =
                          selectedStudent.restrictedFeatures;
                        setSelectedStudent({
                          ...selectedStudent,
                          restrictedFeatures: checked
                            ? restrictedFeatures.filter(
                                (f: string) => f !== feature.id
                              )
                            : [...restrictedFeatures, feature.id],
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => updateStudentAccess(selectedStudent)}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card className={`${color} border`}>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="rounded-full p-2 bg-white/80 shadow-sm">{icon}</div>
      </CardContent>
    </Card>
  );
}
