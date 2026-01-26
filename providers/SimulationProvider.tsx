"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthSimulation } from '@/hooks/useAuthSimulation';
import { useAnalysis } from '@/hooks/useAnalysis';
import { useRecipeSimulation } from '@/hooks/useRecipeSimulation';
import { useIngredientStorage } from '@/hooks/useIngredientStorage';

interface SimulationContextType {
  auth: ReturnType<typeof useAuthSimulation>;
  analysis: ReturnType<typeof useAnalysis>;
  recipe: ReturnType<typeof useRecipeSimulation>;
  storage: ReturnType<typeof useIngredientStorage>;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthSimulation();
  const analysis = useAnalysis();
  const recipe = useRecipeSimulation();
  const storage = useIngredientStorage();

  return (
    <SimulationContext.Provider value={{ auth, analysis, recipe, storage }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
