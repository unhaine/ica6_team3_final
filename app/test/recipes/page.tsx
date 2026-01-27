"use client";

import { useEffect } from 'react';
import { AppHeader } from '@/components/modules/AppHeader';
import { BottomNav } from '@/components/modules/BottomNav';
import { Typography } from '@/components/elements/Typography';
import { Icon } from '@/components/elements/Icon';
import { Tag } from '@/components/elements/Tag';
import { useSimulation } from '@/providers/SimulationProvider';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/elements/Spinner';

export default function RecipesPage() {
    const { recipe, storage } = useSimulation();

    useEffect(() => {
        // 식재료가 있을 때만 레시피 페칭 시뮬레이션
        recipe.fetchRecipes();
    }, []);

    return (
        <main className="flex flex-col min-h-screen bg-background pb-20">
            <AppHeader title="추천 레시피" />

            <div className="flex-1 flex flex-col p-4 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Typography variant="h3" weight="bold">맞춤 요리 추천</Typography>
                        <Typography variant="caption" color="primary" weight="bold">
                            보유 식재료 {storage.ingredients.length}개
                        </Typography>
                    </div>

                    {recipe.loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Spinner size="lg" />
                            <Typography color="muted">냉장고 속 재료로 만들 수 있는 요리를 찾는 중...</Typography>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {recipe.recipes.map((r) => (
                                <Link key={r.id} href={`/test/recipes/${r.id}`}>
                                    <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow group">
                                        <div className="relative h-48 w-full">
                                            <Image 
                                                src={r.thumbnailUrl} 
                                                alt={r.title} 
                                                fill 
                                                className="object-cover transition-transform group-hover:scale-105 duration-500" 
                                            />
                                            <div className="absolute top-3 right-3">
                                                <div className="bg-primary/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                    <Icon name="Target" size={12} />
                                                    {r.matchRate}% 일치
                                                </div>
                                            </div>
                                        </div>
                                        <CardContent className="p-4 space-y-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Tag label={r.category} size="sm" variant="outline" className="text-[10px]" />
                                                    <Tag label={r.difficulty} size="sm" variant="outline" className="text-[10px]" />
                                                </div>
                                                <Typography variant="h4" weight="bold" className="group-hover:text-primary transition-colors">
                                                    {r.title}
                                                </Typography>
                                                <Typography variant="body2" color="muted" className="line-clamp-1">
                                                    {r.description}
                                                </Typography>
                                            </div>

                                            <div className="flex items-center gap-4 pt-1">
                                                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                                                    <Icon name="Clock" size={14} />
                                                    {r.cookingTime}분
                                                </div>
                                                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                                                    <Icon name="Users" size={14} />
                                                    {r.servings}인분
                                                </div>
                                                <div className="flex items-center gap-1 text-primary text-xs font-semibold ml-auto">
                                                    재료 {r.matchCount}/{r.totalIngredientCount}개 보유
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <BottomNav />
        </main>
    );
}
