"use client";

import { StudentProvider } from "@/context/StudentContext";
import { useAuth } from "@/hooks/use-auth";
import React, { useEffect } from "react";

export default function SharedArea({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  useEffect(() => {}, [user]);

  return <StudentProvider>{user && children}</StudentProvider>;
}
