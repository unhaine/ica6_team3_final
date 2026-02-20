"use client";

import React, { useEffect } from "react";
import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { RecipeCard } from "@/components/modules/HomeSection";
import { CommerceModal } from "@/components/modules/CommerceModal";
import { Typography, IconButton } from "@/components/elements";
import { useHomeRecommendations } from "@/hooks/useHomeRecommendations";
import { Skeleton } from "@/components/ui";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { useUrgentIngredients } from "@/hooks/useUrgentIngredients";

export default function RefrigeratorCleanupPage() {
    const { recipes, isLoading: isRecipeLoading, refresh } = useHomeRecommendations();
    const { items: urgentItems, isLoading: isIngredientsLoading } = useUrgentIngredients();
    const router = useRouter();

    // State for shopping modal
    const [shoppingItem, setShoppingItem] = React.useState<string | null>(null);

    useHeader({
        isVisible: true,
        title: "오늘의 냉장고 파먹기",
        left: (
            <IconButton
                icon="ChevronLeft"
                onClick={() => router.back()}
                variant="ghost"
                ariaLabel="뒤로 가기"
            />
        ),
    });

    useFooter({
        isVisible: true,
    });

    const isLoading = isRecipeLoading || isIngredientsLoading;

    // Map urgent items to the format expected by RecipeCard
    const ingredients = urgentItems.map(item => {
        const expiry = new Date(item.expiryDate!);
        const now = new Date();
        expiry.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);
        const diffTime = expiry.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
            name: item.name,
            dDay: diffDays,
            emoji: item.category === 'meat' ? '🥩' :
                item.category === 'vegetable' ? '🥬' :
                    item.category === 'fruit' ? '🍎' :
                        item.category === 'seafood' ? '🐟' :
                            item.category === 'dairy' ? '🥛' : '🍱'
        };
    });

    // 유통기한 임박 재료가 로드되면 해당 재료를 기반으로 레시피 다시 추천
    useEffect(() => {
        if (!isIngredientsLoading && urgentItems.length > 0) {
            const ingredientNames = urgentItems.map(item => item.name);
            refresh(ingredientNames);
        }
    }, [isIngredientsLoading, urgentItems, refresh]);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 p-4 pb-24 overflow-y-auto bg-gray-50/50 h-full">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-[320px] shrink-0">
                        <Skeleton className="h-full w-full rounded-3xl" />
                    </div>
                ))}
            </div>
        );
    }



    // Take top 5 recipes.
    const displayRecipes = recipes.slice(0, 5);

    return (
        <div className="flex flex-col gap-6 p-4 pb-24 overflow-y-auto bg-gray-50/50 h-full">
            <div className="space-y-1 pt-2">
                <Typography variant="h2" weight="bold">
                    맞춤형 레시피 추천
                </Typography>
                <Typography variant="body2" color="secondary">
                    유통기한이 임박한 재료들을 활용해보세요!
                </Typography>
            </div>

            <div className="flex flex-col gap-6">
                {displayRecipes.map((recipe, index) => {
                    // Find the urgent ingredient that matches this recipe
                    const matchedIngredient = ingredients.find(ing => {
                        const normalize = (text: string) => text.replace(/\s+/g, "").toLowerCase();
                        const recipeText = normalize(_getRecipeIngredients(recipe));
                        const ingName = normalize(ing.name);
                        return recipeText.includes(ingName);
                    });

                    // If no match found, do NOT show any urgent ingredient badge.
                    const displayIngredient = matchedIngredient || undefined;

                    return (
                        <div key={recipe.rcpSno || index} className="h-[380px] shrink-0">
                            <RecipeCard
                                recipe={recipe}
                                rank={index + 1}
                                ingredient={displayIngredient}
                                onSelect={(r) => {
                                    const id = r.rcpSno || r.id;
                                    if (id) router.push(`/recipe/${id}`);
                                }}
                                onShop={(name) => setShoppingItem(name)}
                            />
                        </div>
                    );
                })}

                {displayRecipes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                        <Typography variant="body1" color="secondary">
                            추천할 레시피가 없습니다.
                        </Typography>
                    </div>
                )}
            </div>
            {/* Shopping Modal */}
            {shoppingItem && (
                <CommerceModal
                    isOpen={!!shoppingItem}
                    onClose={() => setShoppingItem(null)}
                    ingredientName={shoppingItem}
                />
            )}
        </div>
    );
}

// Helper to get ingredient text from recipe object
function _getRecipeIngredients(recipe: any): string {
    if (recipe.ckgMtrlCn) return recipe.ckgMtrlCn;
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
        return recipe.ingredients.map((i: any) => i.ingName).join(" ");
    }
    return "";
}
