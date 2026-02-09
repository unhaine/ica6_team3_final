"use client";

import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";

export const FloatingCameraButton = () => {
  const router = useRouter();

  return (
    <div className="absolute bottom-8 right-5 z-50">
      <button 
        onClick={() => router.push("/camera")}
        className="group relative flex items-center justify-center transition-transform active:scale-95 shadow-xl rounded-full"
        aria-label="카메라"
      >
        {/* Outer Ring */}
        <div className="w-14 h-14 rounded-full border-2 border-purple-600 bg-white flex items-center justify-center">
           {/* Inner Circle */}
           <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center transition-transform group-hover:scale-105">
              <Camera className="w-6 h-6 text-white" />
           </div>
        </div>
      </button>
    </div>
  );
};
