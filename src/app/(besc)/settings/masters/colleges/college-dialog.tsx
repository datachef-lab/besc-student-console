'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Colleges, Degree } from "@/db/schema";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CollegeDialogProps {
  mode?: 'add' | 'edit';
  college?: Colleges;
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export function CollegeDialog({ mode = 'add', college, onSuccess, children }: CollegeDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetch("/api/degrees")
        .then(res => res.json())
        .then(data => setDegrees(data))
        .catch(() => setDegrees([]));
    }
  }, [open]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
    };

    try {
      const response = await fetch(`/api/colleges${mode === 'edit' ? `?id=${college?.id}` : ''}`, {
        method: mode === 'add' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save college');
      }

      toast({
        title: `College ${mode === 'add' ? 'added' : 'updated'} successfully`,
        description: `The college has been ${mode === 'add' ? 'added' : 'updated'} successfully.`,
      });

      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button>Add College</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add College' : 'Edit College'}</DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Add a new college to the system.' : 'Edit the college details.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={college?.name}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input
                id="code"
                name="code"
                defaultValue={college?.code ?? ''}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sequence" className="text-right">
                Sequence
              </Label>
              <Input
                id="sequence"
                name="sequence"
                type="number"
                defaultValue={college?.sequence ?? ''}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : mode === 'add' ? 'Add College' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 