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

const getMedalPath = (rank: number) => {
    if (rank >= 1 && rank <= 6) return `/icons/Medal/Medal_${rank}.png`;
    return null;
};

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

    const currentRank = rank || index;
    const medalPath = currentRank ? getMedalPath(currentRank) : null;

    const renderMedal = () => {
        if (!medalPath) return null;

        if (variant === "main") {
            return (
                <div className="absolute top-4 left-4 z-40 flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-[#ffefeb] px-2.5 py-1.5 rounded-xl shadow-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={medalPath} alt="1st Rank" className="w-6 h-6 object-contain" />
                        <span className="text-[#ff7a00] text-[13px] font-extrabold">추천</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-lg">
                        <div className="flex items-center gap-1 text-white">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-medium">{recipe.ckgTimeNm?.replace('분', '') || '15'}분</span>
                        </div>
                        <div className="flex items-center gap-1 text-white">
                            <Zap className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-medium">{recipe.ckgDodfNm || '쉬움'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-white">
                            <Users className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-medium">{recipe.ckgInbunNm?.replace('인분', '') || '1'}인분</span>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="absolute top-2 left-2 z-40 w-6 h-6 pointer-events-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={medalPath} alt={`Rank ${currentRank}`} className="w-full h-full object-contain drop-shadow-md" />
            </div>
        );
    };

    if (variant === "compact") {
        return (
            <div className={cn("relative w-full h-full", className)}>
                {renderMedal()}
                <MediaCard
                    imageUrl={recipe.rcpImgUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop"}
                    title={
                        <span
                            className="text-[10px] text-center block w-full truncate font-normal text-white drop-shadow-sm"
                            style={{ fontFamily: 'var(--font-title)' }}
                        >
                            {recipe.ckgNm || recipe.rcpTtl || '레시피'}
                        </span>
                    }
                    layout="full"
                    aspectRatio="square"
                    className="rounded-2xl border-none shadow-md overflow-hidden bg-white"
                    contentClassName="p-2 pb-2 flex flex-col justify-end"
                    onClick={() => onSelect?.(recipe)}
                />
            </div>
        );
    }

    return (
        <div className={cn("relative w-full h-full", className)}>
            {renderMedal()}
            <MediaCard
                imageUrl={recipe.rcpImgUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop"}
                title={
                    <div className="flex flex-col gap-0.5 items-center">
                        <Typography
                            variant="h2"
                            as="span"
                            className="text-white font-medium leading-tight text-5xl [text-shadow:_0_2px_10px_rgba(0,0,0,0.8),_0_4px_20px_rgba(0,0,0,0.4)]"
                            style={{ fontFamily: 'var(--font-title)' }}
                        >
                            {recipe.ckgNm || recipe.rcpTtl || '맛있는 레시피'}
                        </Typography>
                    </div>
                }
                description={
                    <div className="flex flex-col gap-1.5 items-center w-full">
                        {ingredient && (
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
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
                        )}

                        {recipe?.recommendReason && (
                            <div className="w-full px-4 my-0.5">
                                <Typography className="text-white/90 font-medium whitespace-pre-line leading-tight break-keep text-[11px]">
                                    {recipe.recommendReason.replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2194}-\u{2199}\u{21A9}-\u{21AA}\u{3297}\u{3299}\u{303D}\u{231A}\u{231B}\u{23E9}-\u{23EC}\u{23F0}\u{23F3}]/gu, '')}
                                </Typography>
                            </div>
                        )}

                        {/* Ingredient List Display */}
                        <div className="flex flex-wrap gap-1 justify-center max-h-14 overflow-hidden w-full px-2 mt-1">
                            {(() => {
                                let ings: { ingName: string; isOwned?: boolean }[] = [];
                                if (recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0) {
                                    ings = recipe.ingredients;
                                } else if (recipe.ckgMtrlCn) {
                                    ings = recipe.ckgMtrlCn
                                        .split(/,|\[|\]|\n/)
                                        .map((s: string) => ({ ingName: s.trim() }))
                                        .filter((i: any) => i.ingName && !i.ingName.match(/^재료/));
                                }

                                return ings.slice(0, 6).map((ing, idx) => (
                                    <span
                                        key={idx}
                                        className={cn(
                                            "text-[10px] px-1.5 py-0.5 rounded-md backdrop-blur-sm transition-colors",
                                            ing.isOwned
                                                ? "bg-primary text-white font-bold border border-primary/50"
                                                : "bg-black/30 text-white/70"
                                        )}
                                    >
                                        {ing.ingName.split(/\s|\d/).shift()}
                                    </span>
                                ));
                            })()}
                        </div>
                    </div>
                }
                overlay={
                    <div className="flex justify-end w-full">
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
                        className="h-12 rounded-xl bg-[#FFEFEB] text-primary border-[0.5px] border-primary font-bold text-base shadow-lg active:scale-95 hover:bg-[#FAD9DC] transition-all w-full"
                        onClick={() => onSelect?.(recipe)}
                    >
                        이 메뉴로 결정
                    </ActionButton>
                }
                layout="full"
                aspectRatio="auto"
                className="h-full rounded-3xl overflow-hidden border-none shadow-xl text-[#ffffff]"
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
        </div>
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
