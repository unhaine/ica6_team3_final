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

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  matchRate: number; // 0-100
  matchCount: number; // 일치하는 식재료 수
  totalIngredientCount: number; // 필요한 총 식재료 수
  cookingTime: number; // 분 단위
  servings: number; // 인분
  category: RecipeCategory;
  ingredients: RecipeIngredient[];
  steps: CookingStep[];
  youtubeUrl?: string;
  difficulty: '쉬움' | '보통' | '어려움';
}
