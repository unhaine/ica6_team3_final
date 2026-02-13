"use client";

import { useMemo, useRef, useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "@/components/ui/Skeleton";

interface RecipeRecommendationRowProps {
    recipes: any[];
    isLoading: boolean;
}

export const RecipeRecommendationRow = ({ recipes, isLoading }: RecipeRecommendationRowProps) => {
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Drag State
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isClick, setIsClick] = useState(true);

    const displayedRecipes = useMemo(() => {
        return recipes.slice(0, 10); // 최대 10개만 표시
    }, [recipes]);

    // Mouse Event Handlers
    const onMouseDown = (e: MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setIsClick(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const onMouseLeave = () => {
        setIsDragging(false);
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollRef.current.scrollLeft = scrollLeft - walk;

        if (Math.abs(walk) > 5) {
            setIsClick(false);
        }
    };

    const handleItemClick = (recipeId: string) => {
        if (isClick) {
            router.push(`/recipe/${recipeId}`);
        }
    };

    if (isLoading) {
        return (
            <div className="py-3 px-4 bg-white border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-5 w-24" />
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="min-w-[100px] h-[130px] rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (displayedRecipes.length === 0) return null;

    return (
        <div className="py-3 bg-white border-t border-gray-100">
            <div className="px-4 flex items-center justify-between mb-2">
                <div className="flex flex-col">
                    <h2 className="text-[15px] font-bold text-gray-900 leading-tight">오늘의 추천 요리 🍽️</h2>
                    <span className="text-[10px] text-gray-400">남은 재료로 만들 수 있어요</span>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto pb-1 snap-x flex-nowrap scrollbar-hide cursor-grab active:cursor-grabbing"
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
            >
                {/* Leading Spacer to match px-4 header padding */}
                <div className="min-w-[4px] w-[4px]" />

                {displayedRecipes.map((recipe) => (
                    <div
                        key={recipe.id}
                        className="min-w-[100px] w-[100px] snap-start select-none group flex flex-col pointer-events-auto"
                        onClick={() => handleItemClick(recipe.id)}
                        onDragStart={(e) => e.preventDefault()}
                    >
                        <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-1.5 bg-gray-100 shadow-sm border border-gray-100">
                            {recipe.rcpImgUrl ? (
                                <Image
                                    src={recipe.rcpImgUrl}
                                    alt={recipe.rcpTtl}
                                    fill
                                    sizes="100px"
                                    className="object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                    <span className="text-xl">🍳</span>
                                </div>
                            )}

                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        <h3 className="text-[12px] font-medium text-gray-900 leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                            {recipe.rcpTtl}
                        </h3>
                    </div>
                ))}

                {/* Trailing Spacer */}
                <div className="min-w-[4px] w-[4px]" />
            </div>
        </div>
    );
};
