"use client";

import { useRouter } from "next/navigation";
import { Camera, Bell, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/elements/Typography";
import { IconBox } from "@/components/elements/IconBox";

export default function MobileLandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-between h-screen p-6 bg-white pb-10">
      {/* Header / Logo Area */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <Typography variant="h1" className="text-4xl font-black text-primary italic tracking-tighter">
          냉파고수
        </Typography>
        
        <div className="relative w-64 h-64 bg-slate-50 rounded-full flex items-center justify-center mb-4 ring-1 ring-slate-100">
          <span className="text-8xl animate-pulse">🧊</span>
        </div>

        <div className="space-y-3">
          <Typography variant="h3" weight="bold" className="leading-tight">
            냉장고 파먹기, <br />
            <span className="text-primary">AI로 3초 만에</span>
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            귀찮은 식재료 관리, 이제 사진 한 장으로 끝내세요.
          </Typography>
        </div>
      </div>

      {/* Feature Icons */}
      <div className="flex justify-center gap-8 mb-12 w-full">
        <FeatureItem icon={<Camera className="w-6 h-6" />} label="자동인식" />
        <FeatureItem icon={<Bell className="w-6 h-6" />} label="유통알림" />
        <FeatureItem icon={<BookOpen className="w-6 h-6" />} label="레시피" />
      </div>

      {/* CTA Button */}
      <Button 
        size="lg" 
        className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20"
        onClick={() => router.push("/mobile/onboarding/step1")}
      >
        시작하기
      </Button>
    </div>
  );
}

const FeatureItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex flex-col items-center gap-2">
    <IconBox icon={icon} size="lg" variant="primary" className="bg-blue-50 text-primary mb-1" />
    <Typography variant="caption" weight="medium" className="text-gray-600">{label}</Typography>
  </div>
);
