"use client";

import React, { useState, useEffect } from "react";
import { useStudent } from "@/providers/student-provider";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence } from "framer-motion";
import { DbCourseMaterial } from "@/types/academics/course-material";
import { GraduationCap, School } from "lucide-react";
import BatchGrid from "@/components/course-catalogue/BatchGrid";
import BatchDetails from "@/components/course-catalogue/BatchDetails";

export default function CourseCataloguePage() {
  const { batches, loading, accessControl } = useStudent();
  const router = useRouter();
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
  const [materialLinks, setMaterialLinks] = useState<DbCourseMaterial[]>([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState<boolean>(false);

  useEffect(() => {
    if (!accessControl?.access_course) {
      router.back();
    }
  }, [accessControl, router]);

  // Fetch materials for all subjects in a batch with a single API call
  const fetchBatchMaterials = async (
    batchSubjects: Array<{ subjectId?: number }>
  ) => {
    if (!batchSubjects || batchSubjects.length === 0) return;

    try {
      setIsLoadingMaterials(true);

      // Extract all subject IDs from the batch
      const subjectIds = batchSubjects
        .filter((subject) => subject.subjectId)
        .map((subject) => subject.subjectId!);

      if (subjectIds.length === 0) return;

      // Create URL with all subject IDs as query parameters
      const queryParams = new URLSearchParams();
      subjectIds.forEach((id) =>
        queryParams.append("subjectIds", id.toString())
      );

      console.log(
        `Fetching materials for ${subjectIds.length} subjects with a single API call`
      );
      const response = await fetch(
        `/api/batch-course-materials?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(
          `API returned ${response.status}: ${await response.text()}`
        );
      }

      const materials = await response.json();
      console.log(
        `Successfully fetched ${materials.length} materials for all subjects`
      );
      setMaterialLinks(materials);
    } catch (error) {
      console.error("Error fetching batch materials:", error);
    } finally {
      setIsLoadingMaterials(false);
    }
  };

  // Use the batch API when selecting a batch
  useEffect(() => {
    if (selectedBatch !== null && batches[selectedBatch]?.papers) {
      const currentBatchPapers = batches[selectedBatch].papers;
      fetchBatchMaterials(currentBatchPapers);
    }
  }, [selectedBatch, batches]);

  // Add useEffect for escape key handling
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedBatch !== null) {
        setSelectedBatch(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedBatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/20 p-6 space-y-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const handleCardClick = (index: number) => {
    if (selectedBatch === index) {
      setSelectedBatch(null);
    } else {
      setSelectedBatch(index);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white py-10 px-6 mb-8 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-400 mix-blend-overlay blur-2xl"></div>
          <div className="absolute right-40 top-20 w-32 h-32 rounded-full bg-purple-400 mix-blend-overlay blur-xl"></div>
          <div className="absolute left-20 bottom-10 w-48 h-48 rounded-full bg-indigo-300 mix-blend-overlay blur-2xl"></div>
          <div className="absolute inset-0 bg-[url('/illustrations/dots-pattern.svg')] opacity-5"></div>
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center">
            <div className="mr-5 bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-white/10">
              <GraduationCap size={36} className="text-white drop-shadow-md" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white drop-shadow-md">
                Course Catalogue
              </h1>
              <p className="text-blue-50 text-lg drop-shadow max-w-2xl">
                Explore your academic journey and access course materials
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {batches.length === 0 ? (
          <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-2xl border border-indigo-100 shadow-lg">
            <School className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-gray-600">
              No academic information available
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {selectedBatch !== null ? (
                <BatchDetails
                  batch={batches[selectedBatch]}
                  materialLinks={materialLinks}
                  isLoadingMaterials={isLoadingMaterials}
                  onClose={() => setSelectedBatch(null)}
                />
              ) : (
                <BatchGrid batches={batches} onCardClick={handleCardClick} />
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
