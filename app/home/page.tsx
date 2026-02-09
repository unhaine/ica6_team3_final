"use client";

import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { HomeRecommendations, RefrigeratorToday, RecipeCard } from "@/components/modules";
import { Typography, IconButton } from "@/components/elements";
import { Sparkles } from "lucide-react";

export default function HomePage() {
    // 헤더 제어 - AI 추천
    useHeader({
        isVisible: true,
        title: "홈",
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
