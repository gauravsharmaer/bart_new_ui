"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "./button";

interface FaceVerificationProps {
  progress?: number;
  instruction?: string | JSX.Element;
  error?: string;
  webcamComponent?: React.ReactNode;
  onBackClick?: () => void;
  showCamera?: boolean;
  isModelLoaded?: boolean;
  isWebcamReady?: boolean;
  isAnalyzing?: boolean;
  showGif?: boolean;
  hasFaceDescriptors?: boolean;
}

export default function FaceVerification({
  progress = 0,
  instruction,
  error,
  webcamComponent,
  onBackClick,
  showCamera = true,
  isModelLoaded = false,
  isWebcamReady = false,
  isAnalyzing = false,
  showGif = false,
  hasFaceDescriptors = false,
}: FaceVerificationProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-[323px] bg-white rounded-[20px] shadow-xl relative animate-in fade-in duration-300">
        <div className="p-6">
          <div className="space-y-4">
            {/* Back button */}
            <div className="flex items-start">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full -ml-2 shadow-md bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={onBackClick || (() => window.history.back())}
              >
                <ArrowLeft className="h-6 w-6 text-gray-700" />
                <span className="sr-only">Go back</span>
              </Button>
            </div>

            {/* Title and subtitle */}
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight">
                Face Verification
              </h2>
              <p className="text-sm text-gray-500">
                {isAnalyzing && hasFaceDescriptors
                  ? instruction
                  : "Please wait while we analyze your face"}
              </p>
            </div>

            {/* Loading States */}
            {!isAnalyzing && !showGif && (
              <div className="flex flex-col items-center gap-2">
                {!isModelLoaded ? (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent" />
                    <span className="text-gray-700">Loading ...</span>
                  </div>
                ) : !isWebcamReady ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 animate-pulse rounded-full" />
                    <span className="text-gray-700">
                      Initializing Camera...
                    </span>
                  </div>
                ) : !hasFaceDescriptors ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 animate-pulse rounded-full" />
                    <span className="text-gray-700">
                      Waiting for face detection...
                    </span>
                  </div>
                ) : null}
              </div>
            )}

            {/* Camera view */}
            <div className="flex items-center justify-center py-4">
              {showCamera ? (
                <div className="relative w-48 h-36 bg-gray-50 rounded-2xl overflow-hidden">
                  {webcamComponent}
                  {/* Corner borders */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-black rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-black rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-black rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-black rounded-br-lg" />
                </div>
              ) : null}
            </div>

            {/* Progress section */}
            <div className="space-y-3">
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
                      <rect
                        width="100%"
                        height="100%"
                        fill="url(#progress-dots)"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
