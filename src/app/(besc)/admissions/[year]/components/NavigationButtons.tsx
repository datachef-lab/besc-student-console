import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationButtonsProps {
  currentStep: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  totalSteps: number;
}

export default function NavigationButtons({
  currentStep,
  onPrevious,
  onNext,
  onSubmit,
  totalSteps,
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between mt-8 pt-6 border-t">
      <button
        onClick={onPrevious}
        disabled={currentStep === 1}
        className={`flex items-center px-4 py-2 rounded-md ${
          currentStep === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-gray-500 text-white hover:bg-gray-600"
        }`}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </button>

      {currentStep < totalSteps ? (
        <button
          onClick={onNext}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      ) : (
        <button
          onClick={onSubmit}
          className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium"
        >
          Submit Application
        </button>
      )}
    </div>
  );
}
