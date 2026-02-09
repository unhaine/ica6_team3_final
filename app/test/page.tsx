"use client";

import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { HomeRecommendations, RefrigeratorToday } from "@/components/modules";
import { Typography, IconButton } from "@/components/elements";
import { Sparkles } from "lucide-react";

export default function TestPage() {
    // 헤더 제어 - AI 추천
    useHeader({
        isVisible: true,
        center: (
            <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <Typography variant="h4" weight="bold">AI 추천</Typography>
            </div>
        ),
        right: <IconButton icon="Bell" variant="ghost" ariaLabel="알림" />,
    });

    useFooter({
        isVisible: true,
    });

    return (
        <div className="flex flex-col h-full overflow-y-auto scrollbar-hide bg-white">
            {/* AI Recommendations Section */}
            <HomeRecommendations />

            {/* Refrigerator Today Section */}
            <div className="px-4 pb-6">
                <RefrigeratorToday />
            </div>
        </div>
    );
}
