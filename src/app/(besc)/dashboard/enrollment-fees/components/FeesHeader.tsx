import { School } from "lucide-react";

export default function FeesHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-400 mix-blend-overlay blur-2xl"></div>
        <div className="absolute right-40 top-20 w-32 h-32 rounded-full bg-purple-400 mix-blend-overlay blur-xl"></div>
        <div className="absolute left-20 bottom-10 w-48 h-48 rounded-full bg-indigo-300 mix-blend-overlay blur-2xl"></div>
        {/* Optional: Add a subtle pattern if desired */}
        {/* <div className="absolute inset-0 bg-[url('/illustrations/dots-pattern.svg')] opacity-5"></div> */}
      </div>
      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center">
          <div className="mr-6 bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-white/10">
            <School size={40} className="text-white drop-shadow-md" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 text-white drop-shadow-md">
              Fees & Instalments
            </h1>
            <p className="text-blue-50 text-xl drop-shadow max-w-2xl">
              Track your fee payments and upcoming instalments all in one place
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
