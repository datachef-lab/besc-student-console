import { Check } from "lucide-react";
import { Step } from "../types";

interface ProgressTimelineProps {
  currentStep: number;
  steps: Step[];
}

export default function ProgressTimeline({ currentStep, steps }: ProgressTimelineProps) {
  return (
    <div className="mb-12">
      <div className="flex items-start justify-between relative">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="flex flex-col items-center relative flex-1"
          >
            {/* Step Circle */}
            <div className="relative z-10">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300 shadow-lg ${
                  currentStep > step.number
                    ? "bg-gradient-to-br from-green-400 to-green-600 text-white transform scale-105"
                    : currentStep === step.number
                    ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white transform scale-110 ring-4 ring-blue-200"
                    : "bg-white text-gray-500 border-2 border-gray-300 hover:border-gray-400"
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="w-7 h-7" />
                ) : (
                  step.number
                )}
              </div>

              {/* Pulse animation for current step */}
              {currentStep === step.number && (
                <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-25"></div>
              )}
            </div>

            {/* Connecting Line - positioned between circles */}
            {index < steps.length - 1 && (
              <div
                className="absolute top-8 left-1/2 w-full h-0.5 flex items-center"
                style={{ zIndex: 1 }}
              >
                <div className="w-full h-0.5 ml-8">
                  <div
                    className={`h-full transition-all duration-500 ${
                      currentStep > step.number
                        ? "bg-gradient-to-r from-green-500 to-green-400"
                        : "bg-gray-200"
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Step Title and Status */}
            <div className="mt-4 text-center max-w-32 relative z-10">
              <h3
                className={`text-sm font-semibold transition-colors duration-200 ${
                  currentStep >= step.number ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {step.title}
              </h3>
              <div className="mt-1">
                {currentStep > step.number ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Check className="w-3 h-3 mr-1" />
                    Completed
                  </span>
                ) : currentStep === step.number ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse"></div>
                    Current
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    Pending
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
