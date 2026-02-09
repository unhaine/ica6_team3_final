"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CameraHeader } from './CameraHeader';
import { RecipeCard } from '@/components/modules/HomeSection';
import { MockRecipe } from '@/data/mock';

interface FloatingRecipesProps {
    recipes?: MockRecipe[];
    isVisible: boolean;
    onClose: () => void;
    onSelect: (recipe: MockRecipe) => void;
}

export const FloatingRecipes = ({ recipes = [], isVisible, onClose, onSelect }: FloatingRecipesProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [recommendedRecipes, setRecommendedRecipes] = useState<MockRecipe[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // API에서 추천 레시피 가져오기
    useEffect(() => {
        if (isVisible && recipes.length === 0) {
            const fetchRecommendations = async () => {
                try {
                    setIsLoading(true);
                    const response = await fetch('/api/recommend');
                    if (response.ok) {
                        const data = await response.json();
                        if (data.recommendations && Array.isArray(data.recommendations)) {
                            // RecipeScoreDetail을 MockRecipe 형식으로 변환
                            const converted = data.recommendations.map((rec: any) => ({
                                rcpSno: rec.recipe.rcpSno || rec.recipe.id,
                                rcpTtl: rec.recipe.rcpTtl || rec.recipe.ckgNm || '레시피',
                                rcpImgUrl: rec.recipe.rcpImgUrl || '/default-recipe.png',
                                ckgIpdc: rec.recipe.ckgIpdc || rec.recipe.ckgMtrlCn || '',
                                ckgTimeNm: rec.recipe.ckgTimeNm || '정보없음',
                                ckgDodfNm: rec.recipe.ckgDodfNm || '정보없음',
                                inqCnt: rec.recipe.viewCount || 0,
                                rcmmCnt: rec.score?.totalScore || 0,
                                srapCnt: 0,
                                rgtrNm: '냉파고수',
                                ckgNm: rec.recipe.ckgNm,
                                ckgKndActoNm: rec.recipe.ckgKndActoNm,
                                ckgStaActoNm: rec.recipe.ckgStaActoNm,
                                ckgMtrlCn: rec.recipe.ckgMtrlCn,
                            }));
                            setRecommendedRecipes(converted);
                        }
                    }
                } catch (error) {
                    console.error('추천 레시피 로딩 실패:', error);
                    setRecommendedRecipes(recipes);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchRecommendations();
        } else if (recipes.length > 0) {
            setRecommendedRecipes(recipes);
        }
    }, [isVisible, recipes]);

    const displayRecipes = recommendedRecipes.length > 0 ? recommendedRecipes : recipes;

    const handleDragEnd = (event: any, info: PanInfo) => {
        const swipeThreshold = 50;
        if (info.offset.x < -swipeThreshold) {
            // Swipe Left -> Next
            if (currentIndex < recipes.length - 1) {
                setDirection(1);
                setCurrentIndex(currentIndex + 1);
            }
        } else if (info.offset.x > swipeThreshold) {
            // Swipe Right -> Prev
            if (currentIndex > 0) {
                setDirection(-1);
                setCurrentIndex(currentIndex - 1);
            }
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
        })
    };

    if (!isVisible || displayRecipes.length === 0) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-100 flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* App Header Positioned Header */}
                    <div className="absolute top-0 left-0 right-0 z-20">
                        <CameraHeader 
                            title="추천 레시피" 
                            subtitle={`${currentIndex + 1} / ${displayRecipes.length}`} 
                            onClose={onClose} 
                        />
                    </div>

                    {/* Content Container (Card) */}
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-sm aspect-[3/4.5] z-10 flex flex-col px-6"
                    >
                        {/* Carousel Wrapper */}
                        <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                            <motion.div
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={handleDragEnd}
                                className="w-full h-full relative"
                            >
                                <AnimatePresence initial={false} custom={direction}>
                                    <motion.div
                                        key={currentIndex}
                                        custom={direction}
                                        variants={variants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        className="w-full h-full absolute inset-0"
                                    >
                                        <RecipeCard 
                                            recipe={displayRecipes[currentIndex]} 
                                            onSelect={() => onSelect(displayRecipes[currentIndex])}
                                            className="rounded-[32px] shadow-2xl"
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>

                            {/* Navigation Arrows */}
                            {currentIndex > 0 && (
                                <button 
                                    onClick={() => {
                                        setDirection(-1);
                                        setCurrentIndex(currentIndex - 1);
                                    }}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-md z-20 hidden sm:flex"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            )}
                            {currentIndex < displayRecipes.length - 1 && (
                                <button 
                                    onClick={() => {
                                        setDirection(1);
                                        setCurrentIndex(currentIndex + 1);
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-md z-20 hidden sm:flex"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Indicators */}
                        <div className="flex justify-center gap-1.5 mt-4">
                            {displayRecipes.map((_, i) => (
                                <div 
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        i === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/30'
                                    }`}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
