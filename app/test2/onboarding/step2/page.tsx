"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Typography } from "@/components/elements/Typography";
import { AppHeader } from "@/components/modules/AppHeader";
import { SelectableChip } from "@/components/elements/SelectableChip";

export default function OnboardingStep2() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const RESTRICTIONS = [
    "계란", "우유", "땅콩", "견과류", "밀", "조개류", "갑각류", "생선", "대두", "복숭아", "돼지고기", "소고기"
  ];

  const toggle = (item: string) => {
    if (selected.includes(item)) {
       setSelected(selected.filter(s => s !== item));
    } else {
       setSelected([...selected, item]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <AppHeader showBack onBack={() => router.back()} /> 

      <div className="px-6 py-2">
         {/* 100% Progress */}
         <Progress value={100} className="h-2 bg-gray-100" />
      </div>

      <div className="flex-1 px-6 pt-8 animate-in fade-in slide-in-from-right-4 duration-500">
        <Typography variant="h4" weight="bold" className="mb-2 leading-tight">
          못 먹는 재료가 <br />
          있나요?
        </Typography>
        <Typography variant="body2" className="text-gray-500 mb-8">
            해당 재료가 포함된 레시피는 제외할게요.
        </Typography>

        <div className="flex flex-wrap gap-2.5">
          {RESTRICTIONS.map((item) => (
            <SelectableChip
                key={item}
                label={item}
                size="md"
                selected={selected.includes(item)}
                onClick={() => toggle(item)}
                className="text-base px-5 py-2" 
            />
          ))}
        </div>
      </div>

      <div className="p-6 pb-10">
        <Button 
          className="w-full h-14 text-lg font-bold rounded-xl"
          onClick={() => router.push("/mobile/dashboard")}
        >
          완료하고 시작하기
        </Button>
      </div>
    </div>
  );
}
