import { Ingredient } from './ingredient';

export type RecipeCategory = '한식' | '양식' | '중식' | '일식' | '기타' | '디저트';

export interface CookingStep {
  order: number;
  description: string;
  imageUrl?: string;
}

export interface RecipeIngredient extends Partial<Ingredient> {
  name: string;
  isOwned?: boolean; // 보유 여부 표시용
  displayAmount?: string; // "200g", "1/2개" 등 표시용 텍스트
}

export interface User {
  id: string;
  householdSize: number | null;
  cookingPreference: string | null;
  allergies: string[];
}

export interface GroceryItem {
  name: string;
}

export interface Recipe {
  id: string;
  // Prisma 필드명 (camelCase)
  rcpSno?: string | number | bigint;  // 레시피 일련번호 (고유 ID, String으로 직렬화됨)
  rcpTtl?: string | null;    // 레시피 제목
  ckgNm?: string | null;     // 요리명
  rcpImgUrl?: string | null; // 레시피 이미지 URL
  // 데이터베이스 필드명
  ckgInbunNm?: string | null;  // 분량
  ckgStaActoNm?: string | null;  // 상태(예: 밥, 국, 반찬)
  ckgTimeNm?: string | null;  // 조리시간
  ckgDodfNm?: string | null;  // 난이도
  ckgKndActoNm?: string | null;  // 종류
  ckgIpdc?: string | null;  // 소개
  ckgMtrlCn?: string | null;  // 재료내용
  viewCount?: number;  // 조회수
  likeCount?: number;  // 좋아요수
  // UI용 필드 (선택사항)
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  matchRate?: number; // 0-100
  matchCount?: number; // 일치하는 식재료 수
  totalIngredientCount?: number; // 필요한 총 식재료 수
  cookingTime?: number; // 분 단위
  servings?: number; // 인분
  category?: RecipeCategory;
  ingredients?: Array<{ recipeId: string; ingName: string }>;
  steps?: CookingStep[];
  youtubeUrl?: string;
  difficulty?: '쉬움' | '보통' | '어려움';
}

export type IngredientSynonymMap = Record<string, string[]>;

export interface RecipeScoreDetail {
  recipeId: string;
  totalScore: number;
  ingredientScore: number;
  householdScore: number;
  preferenceScore: number;
  popularityScore: number;
}

export interface RecommendOptions {
  limit?: number;
  synonymMap?: IngredientSynonymMap;
}

export interface RecommendedRecipe {
  recipe: Recipe;
  score: RecipeScoreDetail;
}
