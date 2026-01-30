"use client";

import { useHeader } from "@/components/modules/Header";
import { Typography, IconButton, ActionCard, ActionButton, Tag } from "@/components/elements";
import { Timer, Flame, Users, RefreshCw, Sparkles } from "lucide-react";

export default function TestPage() {
    // 1. 헤더 제어
    useHeader({
        isVisible: true,
        title: "태규님, 오늘의 메뉴 👨‍🍳",
        left: <IconButton icon="Camera" variant="ghost" ariaLabel="카메라" onClick={() => alert("카메라 스캔")} />,
        right: <IconButton icon="Bell" variant="ghost" ariaLabel="알림" />,
    });

    return (
        <div className="flex flex-col h-full bg-gray-50/50 overflow-y-auto pb-10">
            {/* AI Recommendation Section */}
            <section className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <Typography variant="h4" weight="bold">AI 추천</Typography>
                </div>

                {/* 1st Recommendation Card */}
                <ActionCard className="bg-white border-2 border-primary/20 shadow-lg p-0 overflow-hidden">
                    <div className="p-5 space-y-4">
                        <div className="flex justify-between items-start">
                            <Tag label="🥇 1순위" variant="default" className="bg-primary text-white" />
                        </div>
                        
                        <div className="py-2 text-center">
                            <Typography variant="h2" weight="bold" className="text-2xl">
                                계란 프라이 덮밥
                            </Typography>
                        </div>

                        <div className="flex items-center justify-center gap-6 text-slate-600 font-medium">
                            <div className="flex items-center gap-1.5">
                                <Timer className="w-4 h-4 text-slate-400" />
                                <span className="text-sm">15분</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Flame className="w-4 h-4 text-slate-400" />
                                <span className="text-sm">쉬움</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-slate-400" />
                                <span className="text-sm">1인분</span>
                            </div>
                        </div>
                    </div>
                </ActionCard>

                {/* Expiration Logic Card */}
                <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
                    <div className="bg-blue-200 p-2.5 rounded-xl shadow-inner">
                        <Typography variant="body2" className="text-xl">🤖</Typography>
                    </div>
                    <div className="space-y-1">
                        <Typography weight="bold" className="text-blue-900 text-sm">
                            유통기한 임박 재료 활용!
                        </Typography>
                        <Typography variant="body2" weight="medium" className="text-blue-800">
                            우유(D-2), 계란(D-5)을 활용해요
                        </Typography>
                    </div>
                </div>

                {/* Decide Button */}
                <ActionButton 
                    variant="default" 
                    fullWidth 
                    size="lg"
                    className="h-14 rounded-2xl text-lg font-bold shadow-md bg-primary text-white"
                    onClick={() => alert("메뉴 결정!")}
                >
                    🍳 이 메뉴로 결정!
                </ActionButton>

                {/* Other Rankings */}
                <div className="grid grid-cols-2 gap-3">
                    <ActionCard className="bg-white p-4 space-y-2">
                        <Typography variant="caption" weight="bold" className="text-gray-400">🥈 2순위</Typography>
                        <Typography weight="bold" className="truncate">참치김치찌개</Typography>
                        <Typography variant="caption" className="text-gray-500">25분 | 2인분</Typography>
                    </ActionCard>
                    <ActionCard className="bg-white p-4 space-y-2">
                        <Typography variant="caption" weight="bold" className="text-gray-400">🥉 3순위</Typography>
                        <Typography weight="bold" className="truncate">사음만 국수</Typography>
                        <Typography variant="caption" className="text-gray-500">10분 | 1인분</Typography>
                    </ActionCard>
                </div>

                {/* Refresh Recommendations */}
                <button className="w-full py-4 flex items-center justify-center gap-2 text-gray-500 hover:text-primary transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-sm font-medium">다른 추천 받기 (2/3 남음)</span>
                </button>
            </section>
        </div>
    );
}
