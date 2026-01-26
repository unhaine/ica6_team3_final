"use client";

import { useParams, useRouter } from 'next/navigation';
import { AppHeader } from '@/components/modules/AppHeader';
import { BottomNav } from '@/components/modules/BottomNav';
import { ActionButton } from '@/components/elements/ActionButton';
import { Typography } from '@/components/elements/Typography';
import { Icon } from '@/components/elements/Icon';
import { useSimulation } from '@/providers/SimulationProvider';
import { useMemo } from 'react';
import type { Recipe } from '@/types/recipe';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { recipe, storage } = useSimulation();
  const selectedRecipe = useMemo((): Recipe | null => {
    const found = recipe.recipes.find(r => r.id === id);
    return found || (recipe.recipes.length > 0 ? recipe.recipes[0] : null);
  }, [id, recipe.recipes]);

  if (!selectedRecipe) return null;

  return (
    <main className="flex flex-col min-h-screen bg-background pb-20">
      <AppHeader title={selectedRecipe.title} showBack />

      <div className="flex-1 flex flex-col gap-0">
        <div className="relative h-64 w-full">
          <Image src={selectedRecipe.thumbnailUrl} alt={selectedRecipe.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <Typography variant="h2" weight="bold">{selectedRecipe.title}</Typography>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-xs"><Icon name="Clock" size={14} /> {selectedRecipe.cookingTime}분</span>
              <span className="flex items-center gap-1 text-xs"><Icon name="Users" size={14} /> {selectedRecipe.servings}인분</span>
              <span className="flex items-center gap-1 text-xs"><Icon name="Target" size={14} /> {selectedRecipe.difficulty}</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-8">
          {/* 필요 재료 섹션 */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <Typography variant="h4" weight="bold">필요한 재료</Typography>
              <Typography variant="caption" color="primary" weight="bold">
                {selectedRecipe.matchCount} / {selectedRecipe.totalIngredientCount} 보유 중
              </Typography>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {selectedRecipe.ingredients.map((ing, idx) => {
                const isOwned = storage.ingredients.some(si => si.name.includes(ing.name) || ing.name.includes(si.name));
                return (
                  <Card key={idx} className={cn("border-none shadow-none bg-muted/30", !isOwned && "opacity-60")}>
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isOwned ? <Icon name="CircleCheck" size={16} className="text-green-500" /> : <Icon name="Circle" size={16} className="text-muted-foreground" />}
                        <Typography variant="body2" weight={isOwned ? "semibold" : "normal"}>{ing.name}</Typography>
                      </div>
                      <Typography variant="caption" color="muted">{ing.quantity}{ing.unit}</Typography>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* 조리 순서 섹션 */}
          <section className="space-y-4 pb-8">
            <Typography variant="h4" weight="bold">조리 순서</Typography>
            <div className="space-y-6">
              {selectedRecipe.steps.map((step) => (
                <div key={step.order} className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {step.order}
                  </div>
                  <div className="space-y-2 flex-1">
                    <Typography variant="body2" className="leading-relaxed">
                      {step.description}
                    </Typography>
                    {step.imageUrl && (
                      <div className="relative h-40 w-full rounded-xl overflow-hidden border">
                        <Image src={step.imageUrl} alt={`Step ${step.order}`} fill className="object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="fixed bottom-20 left-4 right-4">
        <ActionButton 
          fullWidth 
          size="lg" 
          icon="Play"
          onClick={() => router.push('/test/verify')}
          className="shadow-xl"
        >
          요리 시작 & 인증하기
        </ActionButton>
      </div>

      <BottomNav />
    </main>
  );
}
