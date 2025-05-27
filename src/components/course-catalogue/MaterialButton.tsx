import React from "react";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";

interface MaterialButtonProps {
  material: any;
}

const MaterialButton: React.FC<MaterialButtonProps> = ({ material }) => {
  if (material.type === "file") {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-3 text-blue-700 hover:text-blue-800 hover:bg-blue-50 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          window.open(
            `/api/download?filePath=${encodeURIComponent(
              material.file_path || ""
            )}`,
            "_blank"
          );
        }}
      >
        <Download className="h-3.5 w-3.5 mr-1.5" />
        {material.title}
      </Button>
    );
  } else {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-3 text-purple-700 hover:text-purple-800 hover:bg-purple-50 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          window.open(material.url, "_blank");
        }}
      >
        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
        {material.title}
      </Button>
    );
  }
};

export default MaterialButton;
