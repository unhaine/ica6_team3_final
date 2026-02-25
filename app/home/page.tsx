"use client";

import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { HomeRecommendations, RefrigeratorToday, RecipeCard } from "@/components/modules";
import { Typography, IconButton } from "@/components/elements";
import { Sparkles } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
    // 헤더 제어 - AI 추천
    useHeader({
        isVisible: true,
        title: (
            <div className="flex items-center gap-2">
                <Image src="/ai_star.png" alt="AI 추천" width={24} height={24} className="object-contain" />
                <span className="font-bold text-lg">Ai 추천</span>
            </div>
        ),
    });

    useFooter({
        isVisible: true,
    });

    return (
        <div className="absolute inset-0 flex flex-col overflow-hidden">
            {/* AI Recommendations Section - Fills available space with scroll */}
            <div className="flex-1 overflow-y-auto bg-gray-50/50">
                <HomeRecommendations />
            </div>

            {/* Refrigerator Today Section - Fixed at the bottom */}
            <div className="shrink-0 bg-white border-t border-gray-100 p-4 pb-6 z-10 safe-area-bottom shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
                <RefrigeratorToday />
            </div>
        </div>
    );
}
