"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { Student } from "@/types/academics/student";

interface Batch {
  course?: { courseName: string } | null;
  section?: { sectionName: string } | null;
}

interface StudentContextType {
  student: Student | null;
  batch: Batch | null;
  loading: boolean;
}

export const StudentContext = createContext<StudentContextType | undefined>(
  undefined
);

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const email = "0101181122@thebges.edu.in"; // Dynamic in future
        const res = await fetch(`/api/student?email=${email}`);
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setStudent(data.student);
          setBatch(data.batch);
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
  }, []);

  return (
    <StudentContext.Provider value={{ student, batch, loading }}>
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
