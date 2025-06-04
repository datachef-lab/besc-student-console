import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SingleParentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SingleParentModal: React.FC<SingleParentModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Important Information Regarding Single Parent Status</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p className="text-sm text-gray-700">
            Please select Single Parent as 'Yes' only in case of separation
            between the parents. In case of the demise of parent(s), the student
            needs to Select 'No' & mention the demised parent's name as per
            Class XII Board Admit Card or Marksheet by selecting 'Late' in Sr.
            No. 25 &/or 27, as applicable.
          </p>
        </DialogDescription>
        <div className="flex justify-end">
          <Button onClick={onClose}>I want to continue with single parent</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SingleParentModal; 