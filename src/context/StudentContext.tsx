"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { Student } from "@/types/academics/student";
import { useAuth } from "@/hooks/use-auth";
import { BatchCustom } from "@/types/academics/batch";
import { getStudentData } from "@/app/actions/student-actions";

interface StudentContextType {
  student: Student | null;
  batches: BatchCustom[];
  loading: boolean;
}

export const StudentContext = createContext<StudentContextType | undefined>(
  undefined
);

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [batches, setBatches] = useState<BatchCustom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudent() {
      if (!user?.codeNumber) {
        setLoading(false);
        return;
      }

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
          setBatches([]);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [user?.codeNumber]);

  return (
    <StudentContext.Provider value={{ student, batches, loading }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
}
