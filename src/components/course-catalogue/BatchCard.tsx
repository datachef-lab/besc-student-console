import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

interface BatchCardProps {
  batch: any;
  onClick: () => void;
  index: number;
}

const BatchCard: React.FC<BatchCardProps> = ({ batch, onClick }) => {
  return (
    <Card
      className="cursor-pointer bg-white hover:bg-white/95 shadow-md hover:shadow-xl transition-all overflow-hidden group rounded-xl"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
              {batch.coursename}
            </h3>
            <p className="text-sm text-gray-500 mb-3 line-clamp-1">
              {batch.classname} ({batch.sectionName})
            </p>
            <Badge className="bg-blue-100 hover:bg-blue-200 text-blue-700 border-0 transition-colors">
              {batch.sessionName}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchCard;
