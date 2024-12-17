'use client'

import { ArrowLeft } from 'lucide-react'
import { useState, useEffect } from "react"
import { Button } from "./button"

export default function FaceVerification() {
  const [progress, setProgress] = useState(10)

  useEffect(() => {
    const stages = [10, 50, 70, 100];
    let currentIndex = 0;

    const timer = setInterval(() => {
      if (currentIndex < stages.length) {
        setProgress(stages[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(timer);
      }
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Increased card height */}
      <div className="w-[323px] h-[370px] rounded-[20px] p-6 bg-white shadow-lg relative">
        <div className="space-y-4 pb-2">
          {/* Arrow button with gray shadow */}
          <div className="flex items-start">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full -ml-2 shadow-md bg-gray-100 drop-shadow-lg"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-9 w-9 text-black" /> {/* Larger arrow size */}
              <span className="sr-only">Go back</span>
            </Button>
          </div>

          {/* Title and subtitle */}
          <div className="space-y-1 mt-2">
            <h2 className="text-lg font-semibold tracking-tight text-left">
              Face Verification
            </h2>
            <p className="text-sm text-gray-500 text-left">
              Please look at the camera and hold still
            </p>
          </div>
        </div>

        {/* Image placeholder with slightly larger corners */}
        <div className="flex items-center justify-center pt-2 mb-4">
          <div className="relative w-32 h-32">
            {/* Slightly larger dark black corners */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t-[3px] border-l-[3px] border-black rounded-tl-[10px]" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t-[3px] border-r-[3px] border-black rounded-tr-[10px]" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-[3px] border-l-[3px] border-black rounded-bl-[10px]" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-[3px] border-r-[3px] border-black rounded-br-[10px]" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-3 pt-2">
          {/* Progress bar text */}
          <div className="flex justify-center text-sm text-gray-600">
            <span>{progress}% recognised</span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full relative bg-[#90D167] transition-all duration-1000 ease-in-out"
              style={{ width: `${progress}%` }}
            >
              {/* Dotted overlay */}
              <div className="absolute inset-0">
                <svg width="100%" height="100%" className="opacity-50">
                  <defs>
                    <pattern
                      id="progress-dots"
                      width="10"
                      height="10"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="2" cy="2" r="1" fill="#ffffff" />
                      <circle cx="6" cy="6" r="1" fill="#ffffff" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#progress-dots)" />
                </svg>
              </div>
              {/* Gradient pulse animation */}
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
