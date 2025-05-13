"use client";
import { useAuth } from "@/hooks/use-auth";
import { useStudent } from "@/context/StudentContext";

interface SharedAreaProps {
  children: React.ReactNode;
}

export default function SharedArea({ children }: SharedAreaProps) {
  const { user } = useAuth();
  const { student, accessControl } = useStudent();

  return user && student && accessControl ? <>{children}</> : null;
}
