"use client";

import { useEffect, useState, useRef } from "react";

import { RecipeCard } from "./RecipeCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHomeRecommendations } from "@/hooks/useHomeRecommendations";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function HomeRecommendations() {
    const { recipes, isLoading, groceryCount } = useHomeRecommendations();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // 마우스 드래그 스와이프 상태
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const hasDragged = useRef(false);

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

    const handleRecipeClick = (recipe: any, rank?: number) => {
        // 드래그 후 클릭 방지
        if (hasDragged.current) return;
        const id = recipe?.rcpSno || recipe?.id;
        if (id) {
            const url = rank ? `/recipe/${id}?rank=${rank}` : `/recipe/${id}`;
            router.push(url);
        }
    };

    if (isLoading) return <HomeRecommendationsSkeleton />;

    const displayRecipes = recipes.slice(0, 6);

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

    // --- 마우스 드래그로 스와이프 지원 (데스크톱 웹) ---
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollContainerRef.current) return;
        isDragging.current = true;
        hasDragged.current = false;
        startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
        scrollLeft.current = scrollContainerRef.current.scrollLeft;
        scrollContainerRef.current.style.scrollSnapType = 'none';
        scrollContainerRef.current.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.2; // 드래그 감도
        if (Math.abs(walk) > 5) hasDragged.current = true;
        scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const handleMouseUp = () => {
        if (!isDragging.current || !scrollContainerRef.current) return;
        isDragging.current = false;
        scrollContainerRef.current.style.scrollSnapType = 'x mandatory';
        scrollContainerRef.current.style.cursor = '';
        // snap-x가 다시 활성화되면서 가장 가까운 카드로 스냅됨
    };

    const handleMouseLeave = () => {
        if (isDragging.current) handleMouseUp();
    };

    return (
        <div className="h-full flex flex-col px-4 pt-2 pb-6 gap-4">
            {/* Main Recipe - Swipeable Carousel */}
            <div className="flex-1 min-h-[300px] relative group">
                <div
                    ref={scrollContainerRef}
                    className="h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide select-none"
                    style={{ cursor: 'grab' }}
                    onScroll={handleScroll}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
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
        </div>
    );
}

