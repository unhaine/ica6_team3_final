"use client";

import React, { useEffect } from "react";
import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { RecipeCard } from "@/components/modules/HomeSection";
import { Typography, IconButton } from "@/components/elements";
import { useHomeRecommendations } from "@/hooks/useHomeRecommendations";
import { Skeleton } from "@/components/ui";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RefrigeratorCleanupPage() {
    const { recipes, isLoading } = useHomeRecommendations();
    const router = useRouter();

    useHeader({
        isVisible: true,
        title: "오늘의 냉장고 파먹기",
        left: (
            <IconButton 
                icon="ChevronLeft" 
                onClick={() => router.back()}
                variant="ghost"
                ariaLabel="뒤로 가기"
            />
        ),
    });

    useFooter({
        isVisible: true,
    });

    // Mock ingredients matching RefrigeratorToday.tsx
    const ingredients = [
        { name: "햄", dDay: 1, emoji: "🥓" },
        { name: "우유", dDay: 2, emoji: "🥛" },
        { name: "달걀", dDay: 5, emoji: "🥚" },
    ];

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 p-4 pb-24 overflow-y-auto bg-gray-50/50 h-full">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-[320px] shrink-0">
                        <Skeleton className="h-full w-full rounded-3xl" />
                    </div>
                ))}
            </div>
        );
    }

    // Take top 5 recipes for the 5 ingredients
    const displayRecipes = recipes.slice(0, 5);

    return (
        <div className="flex flex-col gap-6 p-4 pb-24 overflow-y-auto bg-gray-50/50 h-full">
            <div className="space-y-1 pt-2">
                <Typography variant="h2" weight="bold">
                    맞춤형 레시피 추천
                </Typography>
                <Typography variant="body2" color="secondary">
                    유통기한이 임박한 재료들을 활용해보세요!
                </Typography>
            </div>

            <div className="flex flex-col gap-6">
                {displayRecipes.map((recipe, index) => (
                    <div key={recipe.rcpSno || index} className="h-[380px] shrink-0">
                        <RecipeCard 
                            recipe={recipe}
                            rank={index + 1}
                            ingredient={ingredients[index]}
                            onSelect={(r) => console.log("Selected:", r)}
                        />
                    </div>
                ))}
                
                {displayRecipes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                        <Typography variant="body1" color="secondary">
                            추천할 레시피가 없습니다.
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    );
}
