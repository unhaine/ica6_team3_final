export interface RecommendedRecipe {
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

export interface HomeRecommendationsProps {
    onRefresh?: () => void;
}

export interface RefrigeratorTodayProps {
    onNavigateToFridge?: () => void;
}
