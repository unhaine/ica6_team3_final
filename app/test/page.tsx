"use client";

import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { Typography, IconButton, ActionCard, ActionButton, Tag } from "@/components/elements";
import { Timer, Flame, Users, RefreshCw, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TestPage() {
    const router = useRouter();
    // 1. 헤더 제어
    useHeader({
        isVisible: true,
        title: "홈",
        left: <IconButton icon="Camera" variant="ghost" ariaLabel="카메라" onClick={() => router.push("/test/camera")} />,
        right: <IconButton icon="Bell" variant="ghost" ariaLabel="알림" />,
    });

    useFooter({
        isVisible: true,
    });

    return (
        <div className="flex flex-col h-full overflow-y-auto pb-10 scrollbar-hide">
            {/* AI Recommendation Section */}
            <section className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <Typography variant="h4" weight="bold">AI 추천</Typography>
                </div>

                {/* 1st Recommendation Card */}
                <ActionCard className="bg-linear-to-br from-surface to-primary/5 border-2 border-primary/10 shadow-xl shadow-primary/5 p-0 overflow-hidden rounded-[2.5rem]">
                    <div className="p-6 space-y-5">
                        <div className="flex justify-between items-center">
                            <Tag label="🥇 1순위" variant="default" className="bg-primary text-white px-3 py-1 text-xs font-bold" />
                            <div className="bg-primary/10 p-1.5 rounded-full">
                                <Sparkles className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                        
                        <div className="py-2 text-center space-y-1">
                            <Typography variant="h2" weight="bold" className="text-2xl tracking-tight" color="primary">
                                계란 프라이 덮밥
                            </Typography>
                            <Typography variant="body2" color="secondary">
                                오늘 점심으로 어때요?
                            </Typography>
                        </div>

                        <div className="flex items-center justify-center gap-6 text-text-tertiary font-semibold bg-surface-alt py-3 rounded-2xl border border-border-subtle">
                            <div className="flex items-center gap-1.5">
                                <Timer className="w-4 h-4 text-primary/60" />
                                <span className="text-xs">15분</span>
                            </div>
                            <div className="flex items-center gap-1.5 border-x border-slate-200 px-6">
                                <Flame className="w-4 h-4 text-primary/60" />
                                <span className="text-xs">쉬움</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-primary/60" />
                                <span className="text-xs">1인분</span>
                            </div>
                        </div>
                    </div>
                </ActionCard>

                {/* Expiration Logic Card */}
                <div className="bg-destructive/5 border border-destructive/10 rounded-3xl p-5 flex items-center gap-4 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-destructive/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                    <div className="bg-surface p-3 rounded-2xl shadow-sm z-10">
                        <Typography variant="body2" className="text-2xl">⏰</Typography>
                    </div>
                    <div className="space-y-0.5 z-10">
                        <Typography variant="caption" weight="bold" className="text-destructive uppercase tracking-wider">
                            Urgent Ingredients
                        </Typography>
                        <Typography variant="body1" weight="bold" color="primary">
                            우유(D-2), 계란(D-5)이 기다려요
                        </Typography>
                    </div>
                </div>

                {/* Decide Button */}
                <ActionButton 
                    variant="default" 
                    fullWidth 
                    size="lg"
                    className="h-16 rounded-[2rem] text-lg font-bold shadow-xl shadow-primary/20 bg-primary text-white hover:scale-[1.02] transition-transform active:scale-95"
                    onClick={() => alert("메뉴 결정!")}
                >
                    🍳 이 메뉴로 결정!
                </ActionButton>

                {/* Other Rankings */}
                <div className="grid grid-cols-2 gap-3">
                    <ActionCard className="bg-surface p-4 space-y-2">
                        <Typography variant="caption" weight="bold" color="tertiary">🥈 2순위</Typography>
                        <Typography weight="bold" className="truncate">참치김치찌개</Typography>
                        <Typography variant="caption" color="secondary">25분 | 2인분</Typography>
                    </ActionCard>
                    <ActionCard className="bg-surface p-4 space-y-2">
                        <Typography variant="caption" weight="bold" color="tertiary">🥉 3순위</Typography>
                        <Typography weight="bold" className="truncate">사음만 국수</Typography>
                        <Typography variant="caption" color="secondary">10분 | 1인분</Typography>
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
