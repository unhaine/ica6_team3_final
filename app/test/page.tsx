"use client";

import { useState, useEffect } from "react";
import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { Typography, IconButton, ActionCard, ActionButton, Tag } from "@/components/elements";
import { Timer, Flame, Users, RefreshCw, Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface RecommendedRecipe {
    recipe: {
        rcpSno: string;
        rcpTtl: string | null;
        ckgNm: string | null;
        ckgIpdc: string | null;
        ckgInbunNm: string | null;
        ckgDodfNm: string | null;
        ckgTimeNm: string | null;
        ckgStaActoNm: string | null;
        rcpImgUrl: string | null;
    };
    matchedIngredients: string[];
    missingIngredients: string[];
    ingredientMatchRate: number;
    totalScore: number;
    filterReasons: string[];
}

export default function TestPage() {
    const router = useRouter();
    const [recipes, setRecipes] = useState<RecommendedRecipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
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

    // 2. 레시피 추천 API 호출
    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/recipes/recommend-rule-based');
            
            if (!response.ok) {
                throw new Error('추천 레시피를 가져오는데 실패했습니다.');
            }
            
            const data = await response.json();
            setRecipes(data.recipes || []);
        } catch (err) {
            console.error('레시피 추천 에러:', err);
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-y-auto pb-10 scrollbar-hide">
            {/* AI Recommendation Section */}
            <section className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <Typography variant="h4" weight="bold">AI 추천</Typography>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-5 text-center">
                        <Typography variant="body2" color="secondary">
                            {error}
                        </Typography>
                        <ActionButton 
                            variant="outline" 
                            size="sm"
                            className="mt-3"
                            onClick={fetchRecommendations}
                        >
                            다시 시도
                        </ActionButton>
                    </div>
                )}

                {/* No Recipes State */}
                {!isLoading && !error && recipes.length === 0 && (
                    <div className="bg-surface border border-border rounded-2xl p-8 text-center space-y-3">
                        <Typography variant="body1" color="secondary">
                            추천할 레시피가 없습니다.
                        </Typography>
                        <Typography variant="caption" color="tertiary">
                            냉장고에 식재료를 추가하거나 설문조사를 완료해주세요.
                        </Typography>
                        <ActionButton 
                            variant="default" 
                            size="sm"
                            onClick={() => router.push("/test/fridge")}
                        >
                            냉장고로 이동
                        </ActionButton>
                    </div>
                )}

                {/* Recipes List */}
                {!isLoading && !error && recipes.length > 0 && (
                    <>
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
                                        {recipes[0].recipe.ckgNm || recipes[0].recipe.rcpTtl || '레시피'}
                                    </Typography>
                                    <Typography variant="body2" color="secondary">
                                        오늘 점심으로 어때요?
                                    </Typography>
                                    {recipes[0].matchedIngredients.length > 0 && (
                                        <Typography variant="caption" color="tertiary">
                                            💚 보유 재료 {recipes[0].matchedIngredients.length}개 사용
                                        </Typography>
                                    )}
                                </div>

                                <div className="flex items-center justify-center gap-6 text-text-tertiary font-semibold bg-surface-alt py-3 rounded-2xl border border-border-subtle">
                                    <div className="flex items-center gap-1.5">
                                        <Timer className="w-4 h-4 text-primary/60" />
                                        <span className="text-xs">{recipes[0].recipe.ckgTimeNm || '15분'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 border-x border-slate-200 px-6">
                                        <Flame className="w-4 h-4 text-primary/60" />
                                        <span className="text-xs">{recipes[0].recipe.ckgDodfNm || '보통'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users className="w-4 h-4 text-primary/60" />
                                        <span className="text-xs">{recipes[0].recipe.ckgInbunNm || '1인분'}</span>
                                    </div>
                                </div>
                            </div>
                        </ActionCard>

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
                        {recipes.length > 1 && (
                            <div className="grid grid-cols-2 gap-3">
                                {recipes.slice(1, 3).map((rec, index) => (
                                    <ActionCard key={rec.recipe.rcpSno} className="bg-surface p-4 space-y-2">
                                        <Typography variant="caption" weight="bold" color="tertiary">
                                            {index === 0 ? '🥈 2순위' : '🥉 3순위'}
                                        </Typography>
                                        <Typography weight="bold" className="truncate">
                                            {rec.recipe.ckgNm || rec.recipe.rcpTtl || '레시피'}
                                        </Typography>
                                        <Typography variant="caption" color="secondary">
                                            {rec.recipe.ckgTimeNm || '15분'} | {rec.recipe.ckgInbunNm || '1인분'}
                                        </Typography>
                                    </ActionCard>
                                ))}
                            </div>
                        )}

                        {/* Refresh Recommendations */}
                        <button 
                            className="w-full py-4 flex items-center justify-center gap-2 text-gray-500 hover:text-primary transition-colors"
                            onClick={fetchRecommendations}
                        >
                            <RefreshCw className="w-4 h-4" />
                            <span className="text-sm font-medium">다른 추천 받기</span>
                        </button>
                    </>
                )}
            </section>
        </div>
    );
}
