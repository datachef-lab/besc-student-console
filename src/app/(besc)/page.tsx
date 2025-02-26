import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";

export default function RootPage() {
  return (
    <AuroraBackground>
      <div className="min-h-screen w-full flex flex-col justify-between items-center bg-black px-6">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-3xl z-10">
            {/* Welcome Text */}
            <p className="py-1.5 px-3 bg-zinc-900/50 backdrop-blur-md font-light rounded-full text-white text-sm inline-block">
              Welcome to{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 font-semibold">
                BESC Student Console
              </span>
            </p>

            {/* Heading & Description */}
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent">
              Stay Ahead with BESC
            </h1>
            <h3 className="text-xl md:text-2xl font-medium text-gray-300">
              Your all-in-one academic dashboard for attendance, grades, and
              events.
            </h3>

            {/* Call-to-Action */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="ghost"
                  className="px-6 border text-white py-3 text-lg font-medium"
                >
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <footer className="w-full py-4 text-center">
          <p className="text-sm text-gray-500">
            Need help? Visit the{" "}
            <Link href="/support" className="text-blue-400 underline">
              Support Center
            </Link>
            .
          </p>
        </footer>
      </div>
    </AuroraBackground>
  );
}
