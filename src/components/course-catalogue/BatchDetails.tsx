import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, BookOpen, Book } from "lucide-react";
import MaterialsTable from "./MaterialsTable";

interface BatchDetailsProps {
  batch: any;
  materialLinks: any[];
  isLoadingMaterials: boolean;
  onClose: () => void;
}

const BatchDetails: React.FC<BatchDetailsProps> = ({
  batch,
  materialLinks,
  isLoadingMaterials,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
      key="selected-batch"
    >
      <Card
        className="w-full bg-white/80 backdrop-blur-sm border-indigo-100 shadow-lg hover:shadow-xl transition-all relative"
        onClick={onClose}
      >
        <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-t-lg"></div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                <BookOpen className="w-8 h-8 mr-3 text-indigo-600" />
                {batch.coursename}
              </CardTitle>
              <p className="text-lg text-gray-600 ml-11">
                {batch.classname} ({batch.sectionName})
              </p>
            </div>
            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 text-sm">
              {batch.sessionName}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            {/* Loading indicator */}
            {isLoadingMaterials && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-300 border-t-indigo-600 mb-2"></div>
                  <p className="text-sm text-indigo-600">
                    Loading course materials...
                  </p>
                </div>
              </div>
            )}
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
              <Book className="w-5 h-5 mr-2 text-indigo-600" />
              Subjects & Papers
            </h3>
            <MaterialsTable
              papers={batch.papers}
              materialLinks={materialLinks}
            />
          </div>
          <p className="text-sm text-gray-500 text-center mt-6">
            Press ESC or click anywhere to close
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BatchDetails;
