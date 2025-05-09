"use client";

import { useStudent } from "@/context/StudentContext";
import { useAuth } from "@/hooks/use-auth";
import React, { useEffect } from "react";

export default function SharedArea({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const { student } = useStudent();

  useEffect(() => {}, [user]);

  return (user && student && children)
}
