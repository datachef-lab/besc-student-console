"use client";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// Types for components
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

interface AnimatedCounterProps {
  target: number;
  title: string;
  symbol?: string;
  delay?: number;
}

// Animated shapes component
const AnimatedShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated circles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          initial={{
            opacity: 0.7,
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            scale: Math.random() * 0.6 + 0.4,
          }}
          animate={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: Math.random() * 20 + 15,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          style={{
            width: `${Math.random() * 300 + 100}px`,
            height: `${Math.random() * 300 + 100}px`,
            background: `radial-gradient(circle, ${
              [
                "rgba(147, 51, 234, 0.18)", // purple
                "rgba(236, 72, 153, 0.18)", // pink
                "rgba(79, 70, 229, 0.15)", // indigo
                "rgba(6, 182, 212, 0.15)", // cyan
                "rgba(16, 185, 129, 0.12)", // emerald
                "rgba(239, 68, 68, 0.15)", // red
                "rgba(245, 158, 11, 0.12)", // amber
                "rgba(59, 130, 246, 0.15)", // blue
                "rgba(232, 121, 249, 0.18)", // fuchsia
                "rgba(139, 92, 246, 0.18)", // violet
                "rgba(14, 165, 233, 0.15)", // sky
                "rgba(20, 184, 166, 0.12)", // teal
              ][i % 12]
            } 0%, transparent 70%)`,
          }}
        />
      ))}
    </div>
  );
};

// Feature card component
const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  delay,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="flex flex-col items-center rounded-2xl p-8 bg-gradient-to-br from-slate-900/90 to-purple-950/80 backdrop-blur-lg border border-purple-500/30 hover:border-pink-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-fuchsia-500/20"
    >
      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-fuchsia-600 to-pink-600 mb-5 text-white text-2xl shadow-lg shadow-pink-600/30">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-300 text-center">{description}</p>
    </motion.div>
  );
};

// Stats counter component
const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  target,
  title,
  symbol = "",
  delay = 0,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start > target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center p-4"
    >
      <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-fuchsia-500">
        {count}
        {symbol}
      </span>
      <span className="text-sm text-slate-300 mt-2">{title}</span>
    </motion.div>
  );
};

export default function RootPage() {
  return (
    <AuroraBackground showRadialGradient={false}>
      <AnimatedShapes />
      <div className="min-h-screen w-full flex flex-col justify-between items-center backdrop-blur-sm px-6 relative z-10 bg-gradient-to-b from-slate-900/90 to-slate-950/90">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-7xl mx-auto py-6 px-4 flex justify-between items-center"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-7 h-7 text-white"
              >
                <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">
              BESC Student Console
            </h1>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link
              href="/about"
              className="text-slate-300 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/features"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="/support"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Support
            </Link>
          </div>
          <Link href="/sign-in">
            <Button
              variant="outline"
              className="bg-slate-800/70 backdrop-blur-md border-purple-400/30 text-white hover:bg-slate-700/80 transition-all duration-300 hover:border-fuchsia-400/50"
            >
              Sign In
            </Button>
          </Link>
        </motion.header>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl mx-auto py-12">
          <div className="text-center space-y-8 mb-16">
            {/* Welcome Tag */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <p className="py-1.5 px-5 bg-gradient-to-r from-slate-800/80 to-purple-900/70 backdrop-blur-md font-medium rounded-full text-white text-sm inline-block border border-purple-500/30 shadow-lg shadow-purple-500/10">
                Introducing the{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-pink-500 font-semibold">
                  Next-Gen Learning Portal
                </span>
              </p>
            </motion.div>

            {/* Heading & Description */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-white"
            >
              Elevate Your{" "}
              <motion.span
                className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-pink-500"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ backgroundSize: "200% auto" }}
              >
                Academic Journey
              </motion.span>
            </motion.h1>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl font-medium text-slate-300 max-w-3xl mx-auto"
            >
              Your comprehensive academic dashboard providing real-time access
              to attendance, grades, events, and resources in one seamless
              interface.
            </motion.h3>

            {/* Call-to-Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6"
            >
              <Link href="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="px-8 py-6 text-lg font-medium bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white border-none shadow-lg shadow-pink-900/30 hover:shadow-pink-900/50 transition-all duration-300"
                  >
                    Go to Dashboard
                  </Button>
                </motion.div>
              </Link>
              <Link href="/tour">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-6 text-lg font-medium border-slate-500/30 text-white bg-slate-800/50 backdrop-blur-md hover:bg-slate-700/60 transition-all duration-300"
                  >
                    Take a Tour
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="w-full py-10"
          >
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              Everything You Need in One Place
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <FeatureCard
                icon="📊"
                title="Academic Performance"
                description="Track your grades, progress, and academic achievements with intuitive visualizations."
                delay={1.0}
              />
              <FeatureCard
                icon="📅"
                title="Schedule Management"
                description="Stay on top of classes, events, and deadlines with our integrated calendar."
                delay={1.2}
              />
              <FeatureCard
                icon="📚"
                title="Resource Library"
                description="Access course materials, textbooks, and study resources anytime, anywhere."
                delay={1.4}
              />
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="w-full py-12 my-10"
          >
            <div className="bg-gradient-to-br from-slate-900/90 to-purple-950/80 backdrop-blur-md rounded-2xl border border-purple-500/30 p-8 max-w-4xl mx-auto shadow-2xl shadow-purple-900/10">
              <h2 className="text-3xl font-bold text-center text-white mb-8">
                Join Our Growing Community
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AnimatedCounter
                  target={5000}
                  title="Active Users"
                  delay={1.8}
                />
                <AnimatedCounter
                  target={98}
                  title="Satisfaction Rate"
                  symbol="%"
                  delay={2.0}
                />
                <AnimatedCounter
                  target={24}
                  title="Hours Support"
                  symbol="h"
                  delay={2.2}
                />
                <AnimatedCounter
                  target={150}
                  title="Courses Available"
                  delay={2.4}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Section */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6, duration: 0.8 }}
          className="w-full py-6 border-t border-slate-700/50 backdrop-blur-md"
        >
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <p className="text-slate-400">
                © {new Date().getFullYear()} BESC Student Portal
              </p>
              <span className="hidden md:inline text-slate-600">•</span>
              <Link
                href="/privacy"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <span className="hidden md:inline text-slate-600">•</span>
              <Link
                href="/terms"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Terms
              </Link>
            </div>

            <div className="flex space-x-4">
              <Link
                href="/support"
                className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
              >
                Need help? Contact Support
              </Link>
            </div>
          </div>
        </motion.footer>
      </div>
    </AuroraBackground>
  );
}
