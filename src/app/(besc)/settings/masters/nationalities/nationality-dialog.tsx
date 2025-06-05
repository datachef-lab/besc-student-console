'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormStatus } from 'react-dom';
import { Loader2, Trash2 } from 'lucide-react';
import { addNationality, deleteNationality, AddNationalityResult } from './actions';

// --- Add/Edit Nationality Dialog ---
interface AddNationalityDialogProps {
  initialData?: {
    id: string;
    name: string;
  };
  trigger?: React.ReactNode;
}

export function AddNationalityDialog({ initialData, trigger }: AddNationalityDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmit = async (formData: FormData) => {
    setError(undefined);
    if (initialData) {
      formData.append('id', initialData.id);
    }
    const result: AddNationalityResult = await addNationality(formData);
    if (!result.success) {
      setError(result.error);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>{initialData ? 'Edit' : 'Add Nationality'}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Nationality' : 'Add New Nationality'}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nationality Name
              </Label>
              <Input 
                id="name" 
                name="name" 
                defaultValue={initialData?.name} 
                className="col-span-3" 
                required 
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
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
        'Save changes'
      )}
    </Button>
  );
}

// --- Delete Nationality Dialog ---
interface DeleteNationalityDialogProps {
  nationalityId: string;
}

export function DeleteNationalityDialog({ nationalityId }: DeleteNationalityDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setError(undefined);
    setIsDeleting(true);
    const result = await deleteNationality(nationalityId);
    if (!result.success) {
      setError(result.error);
    } else {
      setIsOpen(false);
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
          <DialogTitle>Delete Nationality</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Are you sure you want to delete this nationality?</p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isDeleting}>Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 