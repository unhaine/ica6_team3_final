"use client";

import { useState, useEffect, useCallback } from "react";

export function useHomeRecommendations() {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [groceryCount, setGroceryCount] = useState<number | null>(null);

    const fetchRecommendations = useCallback(async (ingredients?: string[]) => {
        setIsLoading(true);
        try {
            // 새로운 추천 API 호출
            let url = '/api/recommend';
            if (ingredients && ingredients.length > 0) {
                const query = ingredients.join(',');
                url += `?ingredients=${encodeURIComponent(query)}`;
            }
            const response = await fetch(url);

            if (response.status === 401) {
                // 인증 실패 시 일반 레시피 반환
                const fallbackResponse = await fetch('/api/recipes?limit=5');
                const fallbackResult = await fallbackResponse.json();
                if (fallbackResult.success) {
                    setRecipes(fallbackResult.data);
                    setGroceryCount(null);
                } else {
                    setRecipes([]);
                }
                return;
            }

            const result = await response.json();

            if (result.success && result.recommendations && Array.isArray(result.recommendations)) {
                // 추천 결과에서 recipe 객체 추출
                const extractedRecipes = result.recommendations.map((item: any) => {
                    // 각 recipe 객체가 이미 전체 필드를 가지고 있음
                    return item.recipe;
                });
                setRecipes(extractedRecipes);
                setGroceryCount(result.user?.groceryCount || null);
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
        otherRecipes: recipes.length > 1 ? recipes.slice(1, 6) : []
    };
}
