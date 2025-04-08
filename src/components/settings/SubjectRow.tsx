import React, { useState } from "react";
import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Trash2, Pencil, Plus, Link2, File } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { BatchSubject } from "@/types/academics/batch-subjects";
import { Badge } from "../ui/badge";
import { DbCourseMaterial } from "@/types/academics/course-material";

type SubjectRowProps = {
  index: number;
  subject: BatchSubject;
  openAddModal: (subjectId: number) => void;
  openEditModal: (material: DbCourseMaterial) => void;
  onDeleteMaterial: (materialId: number) => Promise<void>;
  materials: DbCourseMaterial[];
};

export default function SubjectRow({
  index,
  subject,
  openAddModal,
  openEditModal,
  onDeleteMaterial,
  materials,
}: SubjectRowProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] =
    useState<DbCourseMaterial | null>(null);

  const handleDeleteClick = (material: DbCourseMaterial) => {
    setMaterialToDelete(material);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (materialToDelete) {
      await onDeleteMaterial(materialToDelete.id as number);
      setIsDeleteDialogOpen(false);
      setMaterialToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setMaterialToDelete(null);
  };

  const handleMaterialClick = (material: DbCourseMaterial) => {
    if (material.type === "link") {
      // Open link in new tab
      window.open(material.url, "_blank", "noopener,noreferrer");
    } else if (material.type === "file" && material.file_path) {
      // Download file
      window.location.href = `/api/download?filePath=${encodeURIComponent(
        material.file_path
      )}`;
    }
  };

  const getMaterialIcon = (material: DbCourseMaterial) => {
    if (material.type === "link") {
      return <Link2 className="h-4 w-4 text-blue-500" />;
    }
    return <File className="h-4 w-4 text-primary" />;
  };

  const subjectMaterials = materials.filter(
    (material) => material.subject_id_fk === subject.subjectId
  );

  return (
    <>
      <TableRow key={subject.subjectId} className="border-b hover:bg-muted/5">
        <TableCell className="align-top pl-6 font-mono text-xs text-muted-foreground pt-3 pb-2 text-center">
          {index + 1}
        </TableCell>
        <TableCell className="align-top pt-3 pb-2 text-center">
          <div className="font-medium">{subject.subjectname}</div>
        </TableCell>
        <TableCell className="align-top pt-3 pb-2 text-center">
          <Badge variant={"outline"} className="text-xs font-normal">
            {subject.subjecttypename}
          </Badge>
        </TableCell>
        <TableCell className="align-top pt-3 pb-2 text-center text-sm">
          {subject.paperName}
        </TableCell>
        <TableCell className="py-2 align-top">
          <div className="flex flex-col gap-1">
            {subjectMaterials.length > 0 ? (
              subjectMaterials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between gap-2 bg-white p-2 rounded-md hover:bg-muted/5 transition-colors"
                >
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleMaterialClick(material)}
                  >
                    {getMaterialIcon(material)}
                    <span className="text-sm">{material.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => openEditModal(material)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteClick(material)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-muted-foreground py-2">
                No materials added
              </div>
            )}
          </div>
        </TableCell>
        <TableCell className="text-right py-2 align-top pr-6">
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 rounded-full"
            onClick={() => openAddModal(subject.subjectId)}
            title={`Add material to ${subject.subjectname}`}
          >
            <Plus size={15} />
          </Button>
        </TableCell>
      </TableRow>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Material</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this material? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
