"use client";

import { useState, useEffect, useCallback } from "react";

export function useHomeRecommendations() {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [groceryCount, setGroceryCount] = useState<number | null>(null);

    const fetchRecommendations = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/recipes/recommend-rule-based');
            
            if (response.status === 401) {
                const fallbackResponse = await fetch('/api/recipes?limit=5');
                const fallbackResult = await fallbackResponse.json();
                if (fallbackResult.success) {
                    setRecipes(fallbackResult.data);
                    setGroceryCount(null); // 로그인 안됨
                } else {
                    setRecipes([]);
                }
                return;
            }

            const result = await response.json();
            
            if (result.user) {
                setGroceryCount(result.user.groceryCount);
            }

            if (result.recipes && result.recipes.length > 0) {
                const extractedRecipes = result.recipes.map((item: any) => item.recipe);
                setRecipes(extractedRecipes);
            } else {
                setRecipes([]);
            }
        } catch (err) {
            console.error('레시피 추천 에러:', err);
            setRecipes([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecommendations();
    }, [fetchRecommendations]);

    return {
        recipes,
        isLoading,
        groceryCount,
        refresh: fetchRecommendations,
        mainRecipe: recipes[0] || null,
        otherRecipes: recipes.length > 1 ? recipes.slice(1, 5) : []
    };
}
