"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useStudent } from "@/context/StudentContext";
import { useEffect } from "react";

interface SharedAreaProps {
  children: React.ReactNode;
}

// Map routes to restricted features for client-side checking
const FEATURE_ROUTES: Record<string, string> = {
  "/dashboard/course-catalogue": "courseCatalogue",
  "/dashboard/library": "library",
  "/dashboard/exams": "exams",
  "/dashboard/documents": "documents",
};

export default function SharedArea({ children }: SharedAreaProps) {
  const { user } = useAuth();
  const { student } = useStudent();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if user is suspended
    if (user?.isSuspended) {
      console.log("User is suspended, redirecting to dashboard");
      router.push("/dashboard?error=account-suspended");
      return;
    }

    // Check for route-based feature restrictions
    const restrictedFeature = Object.entries(FEATURE_ROUTES).find(([route]) =>
      pathname.startsWith(route)
    );

    if (
      restrictedFeature &&
      user?.restrictedFeatures?.includes(restrictedFeature[1])
    ) {
      console.log(
        `User is restricted from accessing ${restrictedFeature[1]}, redirecting to dashboard`
      );
      router.push("/dashboard?error=access-denied");
      return;
    }
  }, [pathname, user, router]);

  // Don't render anything while redirecting or if user is restricted
  const isRestricted =
    user?.isSuspended ||
    (pathname &&
      Object.entries(FEATURE_ROUTES).some(
        ([route, feature]) =>
          pathname.startsWith(route) &&
          user?.restrictedFeatures?.includes(feature)
      ));

  if (isRestricted) {
    return null;
  }

  return user && student ? <>{children}</> : null;
}
