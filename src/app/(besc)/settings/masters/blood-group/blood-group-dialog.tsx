"use client";

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
import { addBloodGroup, type AddBloodGroupResult } from "./actions";
import { useState } from "react";

// Define the expected return type of the server action
// interface AddBloodGroupActionReturn { success: boolean; message?: string; error?: string; }

export function BloodGroupDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [bloodGroupType, setBloodGroupType] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        // Call the server action and cast the result to the expected type
        const result: AddBloodGroupResult = await addBloodGroup(formData);
        
        // Assuming the action returns { success: boolean, message?: string, error?: string }
        if (result && result.success) {
            setIsOpen(false); // Close modal on success
            setBloodGroupType(''); // Clear input
            // Potentially show a success toast using result.message
             console.log("Success:", result.message);
        } else {
            // Handle error (e.g., show error message using result.error)
            console.error("Error:", result && result.error ? result.error : "An unknown error occurred.");
        }
    };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Blood Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Blood Group</DialogTitle>
          <DialogDescription>
            Enter the details for the new blood group.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Input 
                id="type" 
                name="type" 
                className="col-span-3" 
                required 
                value={bloodGroupType}
                onChange={(e) => setBloodGroupType(e.target.value)}
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