import { useState, useCallback } from 'react';
import { Ingredient } from '@/types/ingredient';

const STORAGE_KEY = 'refrigerai_ingredients';

export const useIngredientStorage = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse ingredients from localStorage', e);
        return [];
      }
    }
    return [];
  });

  // 저장 함수
  const saveIngredients = useCallback((newIngredients: Ingredient[]) => {
    setIngredients(newIngredients);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newIngredients));
  }, []);

  const addIngredient = useCallback((ingredient: Ingredient) => {
    const next = [...ingredients, ingredient];
    saveIngredients(next);
  }, [ingredients, saveIngredients]);

  const updateIngredient = useCallback((id: string, updates: Partial<Ingredient>) => {
    const next = ingredients.map(ing => ing.id === id ? { ...ing, ...updates } : ing);
    saveIngredients(next);
  }, [ingredients, saveIngredients]);

  const deleteIngredient = useCallback((id: string) => {
    const next = ingredients.filter(ing => ing.id !== id);
    saveIngredients(next);
  }, [ingredients, saveIngredients]);

  return { 
    ingredients, 
    addIngredient, 
    updateIngredient, 
    deleteIngredient, 
    saveIngredients 
  };
};
