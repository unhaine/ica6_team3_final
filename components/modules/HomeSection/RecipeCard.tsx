"use client";

import React, { useState } from "react";
import { Typography, ActionButton, IconBox, MediaCard, AlertModal } from "@/components/elements";
import { Share2, Sparkles, Zap, Clock, Users, ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface RecipeCardProps {
    recipe: any | null;
    variant?: "main" | "compact";
    isEmpty?: boolean;
    rank?: number;
    index?: number; // For compact index overlay
    ingredient?: {
        name: string;
        dDay: number;
        emoji: string;
    };
    onSelect?: (recipe: any) => void;
    onShop?: (ingredientName: string) => void;
    className?: string;
}

export function RecipeCard({
    recipe,
    variant = "main",
    isEmpty,
    rank,
    index,
    ingredient,
    onSelect,
    onShop,
    className
}: RecipeCardProps) {
    const [showShareConfirm, setShowShareConfirm] = useState(false);
    const [showCopySuccess, setShowCopySuccess] = useState(false);

    if (isEmpty || !recipe) {
        if (variant === "compact") {
            return (
                <div className={cn("aspect-square rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden", className)}>
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-[9px] font-bold">{index}</span>
                    </div>
                </div>
            );
        }

        return (
            <div className={cn("h-full w-full rounded-3xl bg-gray-100 flex flex-col items-center justify-center p-6 text-center gap-4 border-2 border-dashed border-gray-200", className)}>
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <div className="space-y-1">
                    <Typography variant="h3" className="text-gray-400 font-bold">
                        준비된 고기/재료가 부족해요
                    </Typography>
                    <Typography variant="body2" className="text-gray-400">
                        식재료를 추가하고 다시 시도해보세요
                    </Typography>
                </div>
            </div>
        );
    }

    if (variant === "compact") {
        return (
            <MediaCard
                imageUrl={recipe.rcpImgUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop"}
                title={
                    <span
                        className="text-[10px] text-center block w-full truncate font-medium text-white drop-shadow-sm"
                        style={{ fontFamily: 'var(--font-title)' }}
                    >
                        {recipe.ckgNm || recipe.rcpTtl || '레시피'}
                    </span>
                }
                overlay={
                    index ? (
                        <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center shadow-lg border border-white/20">
                            <span className="text-white text-[9px] font-bold">{index}</span>
                        </div>
                    ) : undefined
                }
                layout="full"
                aspectRatio="square"
                className={cn("rounded-2xl border-none shadow-md overflow-hidden bg-white", className)}
                contentClassName="p-2 pb-3 flex items-center justify-center"
                onClick={() => onSelect?.(recipe)}
            />
        );
    }

    return (
        <>
            <MediaCard
                imageUrl={recipe.rcpImgUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop"}
                title={
                    <div className="flex flex-col gap-1 items-center">
                        {rank && (
                            <div className="bg-purple-600/90 backdrop-blur-sm px-3 py-1 rounded-full mb-1">
                                <Typography variant="caption" className="text-white font-bold">
                                    {rank}순위 추천
                                </Typography>
                            </div>
                        )}
                        <Typography
                            variant="h2"
                            as="span"
                            className="text-white font-bold leading-tight drop-shadow-md text-2xl"
                            style={{ fontFamily: 'var(--font-title)' }}
                        >
                            {recipe.ckgNm || recipe.rcpTtl || '맛있는 레시피'}
                        </Typography>
                    </div>
                }
                description={
                    <div className="flex flex-col gap-2 items-center w-full">
                        {ingredient ? (
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 mb-1">
                                <span className="text-base">{ingredient.emoji}</span>
                                <Typography variant="caption" className="text-white font-medium">
                                    {ingredient.name} (D-{ingredient.dDay})
                                </Typography>
                                {onShop && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onShop(ingredient.name);
                                        }}
                                        className="ml-1 p-1 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        <ShoppingBag className="w-3 h-3 text-white" />
                                    </button>
                                )}
                            </div>
                        ) : (
                            recipe?.recommendReason ? (
                                <Typography variant="body2" className="text-white/90 font-medium whitespace-pre-line mb-1">
                                    {recipe.recommendReason}
                                </Typography>
                            ) : null
                        )}

                        {/* Ingredient List Display */}
                        <div className="flex flex-wrap gap-1 justify-center max-h-16 overflow-hidden w-full px-2">
                            {(() => {
                                let ings: { ingName: string; isOwned?: boolean }[] = [];
                                if (recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0) {
                                    ings = recipe.ingredients;
                                } else if (recipe.ckgMtrlCn) {
                                    // Fallback without ownership info if ingredients array missing
                                    ings = recipe.ckgMtrlCn
                                        .split(/,|\[|\]|\n/)
                                        .map((s: string) => ({ ingName: s.trim() }))
                                        .filter((i: any) => i.ingName && !i.ingName.match(/^재료/));
                                }

                                // Take top 6
                                return ings.slice(0, 6).map((ing, idx) => (
                                    <span
                                        key={idx}
                                        className={cn(
                                            "text-[10px] px-1.5 py-0.5 rounded-md backdrop-blur-sm transition-colors",
                                            ing.isOwned
                                                ? "bg-green-500/80 text-white font-bold border border-green-400/50"
                                                : "bg-black/30 text-white/70"
                                        )}
                                    >
                                        {ing.ingName.split(/\s|\d/).shift()}
                                    </span>
                                ));
                            })()}
                        </div>

                        <div className="flex gap-3 mt-1">
                            <div className="flex items-center gap-1 text-white/80">
                                <Clock className="w-3 h-3" />
                                <Typography variant="caption" className="text-[10px]">{recipe.ckgTimeNm?.replace('분', '') || '15'}분</Typography>
                            </div>
                            <div className="flex items-center gap-1 text-white/80">
                                <Zap className="w-3 h-3" />
                                <Typography variant="caption" className="text-[10px]">{recipe.ckgDodfNm || '쉬움'}</Typography>
                            </div>
                            <div className="flex items-center gap-1 text-white/80">
                                <Users className="w-3 h-3" />
                                <Typography variant="caption" className="text-[10px]">{recipe.ckgInbunNm?.replace('인분', '') || '1'}인분</Typography>
                            </div>
                        </div>
                    </div>
                }
                overlay={
                    <div className="flex gap-2">
                        <IconBox
                            variant="ghost"
                            size="sm"
                            icon={<Share2 className="w-4 h-4 text-white" />}
                            className="bg-white/20 backdrop-blur-md border border-white/30 cursor-pointer hover:bg-white/30 transition-colors shadow-sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowShareConfirm(true);
                            }}
                        />
                    </div>
                }
                footer={
                    <ActionButton
                        variant="default"
                        fullWidth
                        size="lg"
                        className="h-12 rounded-xl bg-white text-purple-600 hover:bg-purple-50 border-none font-bold text-base shadow-lg active:scale-95 transition-all w-full"
                        onClick={() => onSelect?.(recipe)}
                    >
                        이 메뉴로 결정
                    </ActionButton>
                }
                layout="full"
                aspectRatio="auto"
                className={cn("h-full rounded-3xl overflow-hidden border-none shadow-xl", className)}
                contentClassName="p-6 items-center text-center gap-3 pb-8"
                footerClassName="border-t-0 mt-0 pt-0"
                onClick={() => onSelect?.(recipe)}
            />

            <AlertModal
                isOpen={showShareConfirm}
                title="레시피 공유"
                message="이 레시피의 링크를 복사하시겠습니까?"
                confirmLabel="복사하기"
                cancelLabel="취소"
                onConfirm={() => {
                    const id = recipe.rcpSno || recipe.id;
                    const url = `${window.location.origin}/recipe/${id}`;
                    navigator.clipboard.writeText(url).then(() => {
                        setShowShareConfirm(false);
                        setShowCopySuccess(true);
                    });
                }}
                onClose={() => setShowShareConfirm(false)}
            />

            <AlertModal
                isOpen={showCopySuccess}
                title="공유 완료"
                message="레시피 링크가 클립보드에 복사되었습니다. 원하시는 곳에 붙여넣어 공유해 보세요!"
                confirmLabel="확인"
                showCancel={false}
                onConfirm={() => setShowCopySuccess(false)}
                onClose={() => setShowCopySuccess(false)}
            />
        </>
    );
}

// --- Sub-components (Skeletons) ---

RecipeCard.Skeleton = function RecipeCardSkeleton({ variant = "main" }: { variant?: "main" | "compact" }) {
    if (variant === "compact") {
        return (
            <Skeleton className="aspect-square rounded-2xl relative shadow-md overflow-hidden">
                <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-black/5" />
            </Skeleton>
        );
    }

    return (
        <Skeleton className="h-full w-full rounded-3xl overflow-hidden p-5 flex flex-col items-center justify-end space-y-5 shadow-lg">
            <div className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/5" />
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/5" />

            <div className="space-y-2 w-full flex flex-col items-center">
                <Skeleton className="h-8 w-3/4 bg-black/5" />
                <Skeleton className="h-4 w-1/2 bg-black/5" />
            </div>
            <Skeleton className="h-12 w-full max-w-xs rounded-xl bg-black/5" />
        </Skeleton>
    );
};
