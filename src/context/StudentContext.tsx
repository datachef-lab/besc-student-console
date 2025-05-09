"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Student } from "@/types/academics/student";
import { useAuth } from "@/hooks/use-auth";
import { BatchCustom } from "@/types/academics/batch";
import { getStudentData } from "@/app/actions/student-actions";

interface StudentContextType {
  student: Student | null;
  batches: BatchCustom[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Create the context with a default value
const StudentContext = createContext<StudentContextType>({
  student: null,
  batches: [],
  loading: true,
  error: null,
  refetch: async () => {},
});

// Custom hook to use the context
export const useStudent = () => useContext(StudentContext);

// Provider component to wrap around components that need access to the context
export const StudentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [batches, setBatches] = useState<BatchCustom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch student data
  const fetchStudentData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const res = await getStudentData(user.uid);

      if (!res) {
        throw new Error("Failed to fetch student data");
      }

      // Make sure we copy restriction fields from the auth user to the student data
      setStudent({
        ...res.student,
        isSuspended: user.isSuspended || res.student.isSuspended,
        restrictedFeatures:
          user.restrictedFeatures || res.student.restrictedFeatures || [],
      });

      setBatches(res.batches || []);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch student data when the user changes
  useEffect(() => {
    if (user) {
      fetchStudentData();
    } else {
      setStudent(null);
      setBatches([]);
    }
  }, [user]);

  // Create the context value object
  const value = useMemo(
    () => ({
      student,
      batches,
      loading,
      error,
      refetch: fetchStudentData,
    }),
    [student, batches, loading, error]
  );

  // Return the provider with the value
  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
};
