"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CameraHeader } from './CameraHeader';
import { RecipeCard } from '@/components/modules/HomeSection';
import { MockRecipe } from '@/data/mock';
import { useHomeRecommendations } from '@/hooks/useHomeRecommendations';

interface FloatingRecipesProps {
    recipes?: any[];
    isVisible: boolean;
    onClose: () => void;
    onSelect: (recipe: any, rank?: number) => void;
}

export const FloatingRecipes = ({ recipes = [], isVisible, onClose, onSelect }: FloatingRecipesProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const { recipes: homeRecipes, isLoading, refresh } = useHomeRecommendations();

    useEffect(() => {
        if (isVisible) {
            refresh();
        }
    }, [isVisible, refresh]);

    const displayRecipes = (homeRecipes.length > 0 ? homeRecipes : recipes).slice(0, 5);

    const handleDragEnd = (event: any, info: PanInfo) => {
        const swipeThreshold = 50;
        if (info.offset.x < -swipeThreshold) {
            // Swipe Left -> Next
            if (currentIndex < displayRecipes.length - 1) {
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

    if (!isVisible) return null;

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
                            subtitle={
                                isLoading
                                    ? "레시피를 찾는 중..."
                                    : displayRecipes.length > 0
                                        ? `${currentIndex + 1} / ${displayRecipes.length}`
                                        : "추천 결과 없음"
                            }
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
                        {isLoading ? (
                            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[32px] p-6 text-center space-y-4 shadow-2xl">
                                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                <div className="space-y-1">
                                    <p className="font-bold text-gray-800 text-lg">AI가 레시피를 분석 중입니다</p>
                                    <p className="text-gray-500 text-sm">잠시만 기다려주세요...</p>
                                </div>
                            </div>
                        ) : displayRecipes.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[32px] p-6 text-center space-y-6 shadow-2xl">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl">
                                    🤔
                                </div>
                                <div className="space-y-2">
                                    <p className="font-bold text-gray-800 text-xl">추천할 레시피가 없어요</p>
                                    <p className="text-gray-500">인식된 재료로 만들 수 있는<br />레시피를 찾지 못했습니다.</p>
                                </div>
                                <button
                                    onClick={onClose} // Just close/save
                                    className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
                                >
                                    재료만 저장하기
                                </button>
                            </div>
                        ) : (
                            <>
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
                                                    rank={currentIndex + 1}
                                                    onSelect={(r, rank) => onSelect(r, rank)}
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
                                            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/30'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
