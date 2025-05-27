import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import MaterialButton from "./MaterialButton";
// import MaterialButton from "./MaterialButton"; // To be implemented

interface MaterialsTableProps {
  papers: any[];
  materialLinks: any[];
}

const MaterialsTable: React.FC<MaterialsTableProps> = ({
  papers,
  materialLinks,
}) => {
  if (!papers || papers.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50/50 rounded-xl border border-dashed border-gray-300">
        <span
          role="img"
          aria-label="book"
          className="w-12 h-12 mx-auto text-gray-400 mb-3"
        >
          📚
        </span>
        <p className="text-gray-600">No papers available for this batch</p>
      </div>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-indigo-100">
          <TableHead className="w-[25%] text-indigo-900 font-semibold">
            Subject
          </TableHead>
          <TableHead className="w-[25%] text-indigo-900 font-semibold">
            Paper
          </TableHead>
          <TableHead className="w-[20%] text-indigo-900 font-semibold">
            Type
          </TableHead>
          <TableHead className="w-[30%] text-indigo-900 font-semibold">
            Materials
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {papers.map((paper, index) => (
          <TableRow key={index} className="hover:bg-gray-50/50">
            <TableCell className="font-medium text-gray-900">
              {paper.subjectname}
            </TableCell>
            <TableCell className="text-gray-700">{paper.paperName}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs"
              >
                {paper.subjecttypename}
              </Badge>
            </TableCell>
            <TableCell>
              {/* Replace with <MaterialButton ... /> for each material */}
              {paper.subjectId &&
                materialLinks
                  .filter((m) => m.subject_id_fk === paper.subjectId)
                  .map((material, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-1">
                      <MaterialButton material={material} />
                    </div>
                  ))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MaterialsTable;
