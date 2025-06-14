import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import React from 'react'

type CreateAdmissionDialogProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    onCreate:  () => Promise<void>;
    year: number;
    onYearChange: (year: number) => void;
}

export default function CreateAdmissionDialog({
    open,
    setOpen,
    onCreate,
    year,
    onYearChange
}: CreateAdmissionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Admission
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Admission</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="year">Admission Year</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="Enter year (e.g., 2024)"
                    value={year}
                    onChange={(e) => onYearChange(Number(e.target.value))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() =>setOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={onCreate}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
  )
}
