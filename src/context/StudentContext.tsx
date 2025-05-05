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

export const StudentContext = createContext<StudentContextType | undefined>(
  undefined
);

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [batches, setBatches] = useState<BatchCustom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // Fetch student data with debouncing (minimum 10 seconds between requests)
  const fetchStudentData = async (force = false) => {
    if (!user?.codeNumber) {
      setLoading(false);
      return;
    }

    // Skip if we recently fetched (within 10 seconds) unless forced
    const now = Date.now();
    if (!force && now - lastFetchTime < 10000) {
      return;
    }

    setLastFetchTime(now);
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching student data for:", user.codeNumber);

      // Use the server action to fetch data
      const { student: studentData, batches: batchesData } =
        await getStudentData(user.codeNumber);

      if (studentData) {
        setStudent(studentData);
        setBatches(batchesData || []);
      } else {
        console.error("Student data not found");
        setError("Student data not found");
        setBatches([]);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("Failed to load student data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Manual refetch function - forces a new fetch regardless of time
  const refetch = async () => {
    await fetchStudentData(true);
  };

  // Initial fetch when component mounts or user changes
  useEffect(() => {
    fetchStudentData();
  }, [user?.codeNumber]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      student,
      batches,
      loading,
      error,
      refetch,
    }),
    [student, batches, loading, error]
  );

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
}
