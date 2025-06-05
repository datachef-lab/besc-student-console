import { ApplicationForm, paymentMode } from "@/db/schema";
import { ReactNode } from 'react';

interface PaymentStepProps {
  applicationForm: ApplicationForm;
  stepNotes?: ReactNode;
  onPaymentInfoChange: (field: keyof ApplicationForm, value: any) => void;
}

let paymentMethods = paymentMode.enumValues

export default function PaymentStep({
  applicationForm,
  stepNotes,
  onPaymentInfoChange,
}: PaymentStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
      {stepNotes && <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 rounded-lg shadow p-4 text-left text-sm">{stepNotes}</div>}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Payment Method *
          </label>
          <select
            value={''}
            onChange={(e) => {}
              // onPaymentInfoChange("paymentMethod", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Payment Method...</option>
            {paymentMethods.map((method) => (
              <option key={method} value={method}>{method}</option>
            ))}
            <option value="financial-aid">Financial Aid</option>
            <option value="scholarship">Scholarship</option>
          </select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="scholarships"
              checked={ false}
              onChange={(e) =>
              {}
                // onPaymentInfoChange("scholarships", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="scholarships" className="ml-2 text-sm">
              I am interested in scholarship opportunities
            </label>
          </div>
{/* 
          <div className="flex items-center">
            <input
              type="checkbox"
              id="financialAid"
              checked={applicationForm.financialAid || false}
              onChange={(e) =>
                onPaymentInfoChange("financialAid", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="financialAid" className="ml-2 text-sm">
              I would like information about financial aid
            </label>
          </div> */}
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-medium text-blue-900 mb-2">
            Application Fee
          </h3>
          <p className="text-blue-800 text-sm">
            A non-refundable application fee of $75 is required to process
            your application. This fee will be collected after you submit
            your application.
          </p>
        </div>
      </div>
    </div>
  );
}
