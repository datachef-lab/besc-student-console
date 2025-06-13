"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";
import { Loader2, Trash2 } from "lucide-react";
import { addCategory, deleteCategory, AddCategoryResult } from "./actions"; // Import actions
import { Category } from "@/db/schema";
import { Checkbox } from "@/components/ui/checkbox";

// --- Add/Edit Category Dialog ---
interface AddCategoryDialogProps {
  initialData?: Category;
  trigger?: React.ReactNode;
}

export function AddCategoryDialog({
  initialData,
  trigger,
}: AddCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmit = async (formData: FormData) => {
    setError(undefined); // Clear previous errors
    // If initialData exists, add the ID for update action (adjust action accordingly)
    if (initialData) {
      formData.append("id", String(initialData!.id));
    }
    const result: AddCategoryResult = await addCategory(formData);
    if (!result.success) {
      setError(result.error);
    } else {
      setIsOpen(false); // Close on success
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>{initialData ? "Edit" : "Add Category"}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Category Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={initialData?.name}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Code
              </Label>
              <Input
                id="code"
                name="code"
                defaultValue={initialData?.code}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Is Document Required?
              </Label>
              <input type="hidden" name="documentRequired" value="false" />
              <Checkbox
                name="documentRequired"
                value="true"
                defaultChecked={!!initialData?.documentRequired}
                className="col-span-3"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        "Save changes"
      )}
    </Button>
  );
}

// --- Delete Category Dialog ---
interface DeleteCategoryDialogProps {
  categoryId: string;
}

export function DeleteCategoryDialog({
  categoryId,
}: DeleteCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setError(undefined); // Clear previous errors
    setIsDeleting(true);
    const result = await deleteCategory(categoryId);
    if (!result.success) {
      setError(result.error);
    } else {
      setIsOpen(false); // Close on success
    }
    setIsDeleting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Are you sure you want to delete this category?</p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isDeleting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
