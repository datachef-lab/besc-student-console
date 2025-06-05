"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { addAnnualIncome, type AddAnnualIncomeResult } from "./actions";

export function AnnualIncomeDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [incomeRange, setIncomeRange] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        
        const result: AddAnnualIncomeResult = await addAnnualIncome(formData);
        
        if (result && result.success) {
            setIsOpen(false); // Close modal on success
            setIncomeRange(''); // Clear input
            console.log("Success:", result.message);
        } else {
            console.error("Error:", result && result.error ? result.error : "An unknown error occurred.");
        }
    };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Annual Income Range
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Annual Income Range</DialogTitle>
          <DialogDescription>
            Enter the details for the new annual income range.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="range" className="text-right">
                Range
              </Label>
              <Input 
                id="range" 
                name="range" 
                className="col-span-3" 
                required 
                value={incomeRange}
                onChange={(e) => setIncomeRange(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 