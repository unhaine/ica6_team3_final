"use client";

import { useEffect } from "react";

import { Typography, ActionButton, IconBox, MediaCard } from "@/components/elements";
import { RecipeCard } from "./RecipeCard";
import { Skeleton } from "@/components/ui";
import { Sparkles, Bookmark } from "lucide-react";
import { useHomeRecommendations } from "@/hooks/useHomeRecommendations";
import { cn } from "@/lib/utils";

export function HomeRecommendations() {
    const { recipes, isLoading, groceryCount, mainRecipe, otherRecipes } = useHomeRecommendations();

    // 로딩 중 스크롤바 숨김 처리
    useEffect(() => {
        const main = document.querySelector('main');
        if (isLoading) {
            main?.classList.add('scrollbar-hide');
        } else {
            main?.classList.remove('scrollbar-hide');
        }
        return () => main?.classList.remove('scrollbar-hide');
    }, [isLoading]);

    if (isLoading) return <HomeRecommendationsSkeleton />;

    // 냉장고가 비어있거나(로그인 유저 기준), 레시피가 아예 없는 경우
    const isEmpty = recipes.length === 0 || (groceryCount !== null && groceryCount === 0);

    return (
        <div className="h-full flex flex-col px-4 pt-2 pb-6 gap-4">
            {/* Main Recipe - Dynamic Height */}
            <div className="flex-1 min-h-0 relative">
                <RecipeCard 
                    recipe={mainRecipe} 
                    isEmpty={isEmpty}
                />
            </div>
            
            {/* Other Recipes - Fixed at Bottom */}
            <div className="shrink-0 grid grid-cols-4 gap-2">
                {isEmpty ? (
                    [1, 2, 3, 4].map((i) => (
                        <RecipeCard 
                            key={`empty-${i}`} 
                            recipe={null} 
                            index={i + 1}
                            isEmpty={true}
                            variant="compact"
                        />
                    ))
                ) : (
                    otherRecipes.map((rec, index) => (
                        <RecipeCard 
                            key={String(rec.rcpSno ?? rec.id ?? index)} 
                            recipe={rec} 
                            index={index + 2} 
                            variant="compact"
                        />
                    ))
                )}
            </div>
        </div>
    );
}

// --- Sub-components ---

function HomeRecommendationsSkeleton() {
    return (
        <div className="h-full flex flex-col px-4 pt-2 pb-6 gap-4">
            {/* Main Card Skeleton - Dynamic Height */}
            <div className="flex-1 min-h-0 relative">
                <RecipeCard.Skeleton variant="main" />
            </div>

            {/* Grid Skeleton - Fixed Bottom */}
            <div className="shrink-0 grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                    <RecipeCard.Skeleton key={i} variant="compact" />
                ))}
            </div>
        </div>
    );
}



