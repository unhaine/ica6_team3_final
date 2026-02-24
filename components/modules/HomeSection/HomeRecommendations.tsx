"use client";

import { useEffect, useState, useRef } from "react";

import { ActionButton, IconBox, MediaCard } from "@/components/elements";
import { RecipeCard } from "./RecipeCard";
import { Skeleton } from "@/components/ui";
import { Sparkles, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { useHomeRecommendations } from "@/hooks/useHomeRecommendations";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function HomeRecommendations() {
    const { recipes, isLoading, groceryCount } = useHomeRecommendations();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

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

    const router = useRouter();

    const handleRecipeClick = (recipe: any) => {
        const id = recipe?.rcpSno || recipe?.id;
        if (id) {
            router.push(`/recipe/${id}`);
        }
    };

    if (isLoading) return <HomeRecommendationsSkeleton />;

    const displayRecipes = recipes.slice(0, 6);
    const mainRecipe = displayRecipes[0] || null;
    const otherRecipes = displayRecipes.slice(1);

    // 냉장고가 비어있거나(로그인 유저 기준), 레시피가 아예 없는 경우
    const isEmpty = displayRecipes.length === 0 || (groceryCount !== null && groceryCount === 0);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const scrollPosition = container.scrollLeft;
        const width = container.offsetWidth;
        const newIndex = Math.round(scrollPosition / width);
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < displayRecipes.length) {
            setCurrentIndex(newIndex);
        }
    };

    const scrollTo = (index: number) => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        container.scrollTo({
            left: index * container.offsetWidth,
            behavior: 'smooth'
        });
        setCurrentIndex(index);
    };

    return (
        <div className="h-full flex flex-col px-4 pt-2 pb-6 gap-4">
            {/* Main Recipe - Swipeable Carousel */}
            <div className="flex-1 min-h-[300px] relative group">
                <div
                    ref={scrollContainerRef}
                    className="h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                    onScroll={handleScroll}
                >
                    {isEmpty ? (
                        <div className="w-full h-full flex-shrink-0 snap-center">
                            <RecipeCard recipe={null} isEmpty={true} onSelect={handleRecipeClick} />
                        </div>
                    ) : (
                        displayRecipes.map((recipe, idx) => (
                            <div key={idx} className="w-full h-full flex-shrink-0 snap-center px-1">
                                <RecipeCard
                                    recipe={recipe}
                                    rank={idx === 0 ? 1 : idx + 1}
                                    isEmpty={false}
                                    onSelect={handleRecipeClick}
                                />
                            </div>
                        ))
                    )}
                </div>

                {/* Floating Arrows */}
                {!isEmpty && displayRecipes.length > 1 && (
                    <>
                        <button
                            onClick={() => scrollTo(Math.max(0, currentIndex - 1))}
                            className={cn(
                                "absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white/80 transition-opacity z-10",
                                currentIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-100 hover:bg-black/40"
                            )}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => scrollTo(Math.min(displayRecipes.length - 1, currentIndex + 1))}
                            className={cn(
                                "absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white/80 transition-opacity z-10",
                                currentIndex === displayRecipes.length - 1 ? "opacity-0 pointer-events-none" : "opacity-100 hover:bg-black/40"
                            )}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}
            </div>

            {/* Other Recipes - Fixed at Bottom */}
            <div className="shrink-0 grid grid-cols-5 gap-2">
                {isEmpty ? (
                    [1, 2, 3, 4, 5].map((i) => (
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
                            onSelect={handleRecipeClick}
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
            <div className="flex-1 min-h-[300px] relative">
                <RecipeCard.Skeleton variant="main" />
            </div>

            {/* Grid Skeleton - Fixed Bottom */}
            <div className="shrink-0 grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                    <RecipeCard.Skeleton key={i} variant="compact" />
                ))}
            </div>
        </div>
    );
}

