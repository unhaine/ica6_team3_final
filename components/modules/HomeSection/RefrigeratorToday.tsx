"use client";

import React from "react";

import { Typography, ActionButton } from "@/components/elements";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface Ingredient {
    name: string;
    dDay: number;
    emoji: string;
}

export function RefrigeratorToday() {
    const router = useRouter();

    // TODO: 실제 냉장고 데이터를 가져오는 로직으로 대체
    const ingredients: Ingredient[] = [
        { name: "햄", dDay: 1, emoji: "🥓" },
        { name: "우유", dDay: 2, emoji: "🥛" },
        { name: "달걀", dDay: 5, emoji: "🥚" },
    ];

    return (
        <div className="space-y-3">
            {/* Section Title */}
            <div className="flex items-center gap-1.5 px-1">
                <Clock className="w-4 h-4 text-purple-600" />
                <Typography variant="body2" weight="bold" className="text-gray-800">
                    먼저 먹어야하는 재료
                </Typography>
            </div>

            {/* Ingredients Grid */}
            <div className="flex justify-around items-start py-1">
                {ingredients.map((ingredient, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-purple-50 border border-purple-100/50">
                            <span className="text-xl">{ingredient.emoji}</span>
                        </div>
                        <div className="text-center flex flex-col -space-y-0.5">
                            <Typography 
                                variant="caption" 
                                weight="bold"
                                className={`text-[10px]
                                    ${ingredient.dDay === 1 ? 'text-red-500' : 
                                      ingredient.dDay === 2 ? 'text-orange-500' : 
                                      'text-blue-500'}
                                `}
                            >
                                D-{ingredient.dDay}
                            </Typography>
                            <Typography variant="caption" color="secondary" className="text-[10px]">
                                {ingredient.name}
                            </Typography>
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Button */}
            <ActionButton 
                variant="default" 
                fullWidth 
                size="sm"
                className="h-10 rounded-xl text-sm font-bold bg-purple-600 text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all"
                onClick={() => router.push("/home/refrigerator-cleanup")}
            >
                오늘의 냉장고 파먹기
            </ActionButton>
        </div>
    );
}
