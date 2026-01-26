export type IngredientUnit = 'g' | 'kg' | 'ml' | 'L' | '개' | '팩' | '줌' | '봉' | '컵';

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: IngredientUnit;
  category?: string;
  addedAt: string; // ISO Date
  expiryDate?: string; // ISO Date
}

export interface BoundingBox {
  id: string;
  label: string;
  x: number; // percentage 0-1
  y: number; // percentage 0-1
  width: number; // percentage 0-1
  height: number; // percentage 0-1
}
