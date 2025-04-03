"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { Student } from "@/types/academics/student";
import { useAuth } from "@/hooks/use-auth";

interface Batch {
  course?: { courseName: string } | null;
  section?: { sectionName: string } | null;
}

interface StudentContextType {
  student: Student | null;
  batches: Batch[];
  loading: boolean;
}

export const StudentContext = createContext<StudentContextType | undefined>(
  undefined
);

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(user);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const res = await fetch(`/api/student?email=${user?.email}`);
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setStudent(data.student);
          setBatches(data.batches);
        } else {
          console.error("Error fetching student:", data.error);
        }
      } catch (error) {
        console.error("Error fetching student:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [user]);

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
