"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Users, Baby, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Typography } from "@/components/elements/Typography";
import { AppHeader } from "@/components/modules/AppHeader";
import { cn } from "@/lib/utils";

export default function OnboardingStep1() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const OPTIONS = [
    { id: "1", label: "1인 가구", icon: User },
    { id: "2", label: "2인 가구", icon: Users },
    { id: "3", label: "3인 가구", icon: Baby },
    { id: "4", label: "4인 이상", icon: Home },
  ];

  return (
    <div className="flex flex-col h-screen bg-white">
      <AppHeader showBack onBack={() => router.back()} /> 
      
      <div className="px-6 py-2">
         {/* 50% Progress for step 1 of 2 */}
         <Progress value={50} className="h-2 bg-gray-100" />
      </div>

      <div className="flex-1 px-6 pt-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <Typography variant="h4" weight="bold" className="mb-2 leading-tight">
          몇 명을 위한 <br />
          요리를 하시나요?
        </Typography>
        <Typography variant="body2" className="text-gray-500 mb-8">
            가구원 수에 맞춰 식재료 양을 추천해드려요.
        </Typography>

        <div className="grid grid-cols-2 gap-4">
          {OPTIONS.map((opt) => (
             <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={cn(
                    "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all",
                    selected === opt.id 
                        ? "border-primary bg-primary/5 ring-1 ring-primary" 
                        : "border-gray-100 bg-white hover:border-gray-200"
                )}
             >
                <div className={cn(
                    "p-3 rounded-full transition-colors",
                    selected === opt.id ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                )}>
                    <opt.icon className="w-6 h-6" />
                </div>
                <span className={cn(
                    "font-bold",
                    selected === opt.id ? "text-primary" : "text-gray-600"
                )}>
                    {opt.label}
                </span>
             </button>
          ))}
        </div>
      </div>

      <div className="p-6 pb-10">
        <Button 
          className="w-full h-14 text-lg font-bold rounded-xl" 
          disabled={!selected}
          onClick={() => router.push("/mobile/onboarding/step2")}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
