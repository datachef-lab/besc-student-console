"use client"; // Ensures this runs only on the client side

import React, {
  useState,
  useCallback,
  useEffect,
  ReactNode,
  createContext,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { Student } from "@/types/academics/student";
import { StudentAccessControl } from "@/types/academics/access-control";
import { ApplicationFormDto } from "@/types/admissions";
import { Admission } from "@/db/schema";

const axiosInstance = axios.create({
  baseURL: "", // Use relative URLs
  withCredentials: true, // ✅ Ensures cookies are sent with requests
  headers: {
    "Content-Type": "application/json",
  },
});

type LoginCred = {
  accessToken: string;
  user: Student;
  accessControl: StudentAccessControl;
};

export interface ApplicationFormContextType {
  applicationForm: ApplicationFormDto | null;
  setApplicationForm: React.Dispatch<
    React.SetStateAction<ApplicationFormDto | null>
  >;
  displayFlag: boolean;
  isLoading: boolean;
}

export const ApplicationFormContext = createContext<
  ApplicationFormContextType | undefined
>(undefined);

interface ApplicationFormProviderProps {
  children: ReactNode;
  admission: Admission;
}

export const ApplicationFormProvider: React.FC<
  ApplicationFormProviderProps
> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [displayFlag, setDisplayFlag] = useState(false);
  const [applicationForm, setApplicationForm] =
    useState<ApplicationFormDto | null>(null);
  const router = useRouter();
  const pathname = usePathname(); // Get the current route

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisplayFlag(true);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  type LoginCred = {
    accessToken: string;
    user: Student;
    accessControl: StudentAccessControl;
  };

  const fetchApplicationForm =
    useCallback(async (): Promise<ApplicationFormDto | null> => {
      if (!pathname.startsWith("/admissions")) return null;

      try {
        const response = await axiosInstance.get<
          LoginCred | { applicationForm: ApplicationFormDto }
        >("/api/auth/admission-form-login/refresh", { withCredentials: true });

        console.log("Token refresh response received");

        const data = response.data;

        // Distinguish between LoginCred and ApplicationForm response
        if ("accessToken" in data && "user" in data) {
          // Redirect to dashboard for fully logged-in users
          router.push("/dashboard");
          return null;
        }

        if ("applicationForm" in data) {
          setApplicationForm(data.applicationForm);
          return data.applicationForm;
        }

        return null;
      } catch (error) {
        console.error("Failed to refresh-load applicationForm:", error);
        return null;
      } finally {
        setIsLoading(false);
      }
    }, [pathname, router]);

  useEffect(() => {
    if (!applicationForm) {
      fetchApplicationForm();
    }
  }, [applicationForm, pathname, fetchApplicationForm]);

  const contextValue: ApplicationFormContextType = {
    applicationForm,
    setApplicationForm,
    displayFlag,
    isLoading,
  };

  return (
    <ApplicationFormContext.Provider value={contextValue}>
      {children}
    </ApplicationFormContext.Provider>
  );
};
