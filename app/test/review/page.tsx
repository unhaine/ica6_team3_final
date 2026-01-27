"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { AppHeader } from '@/components/modules/AppHeader';
import { BottomNav } from '@/components/modules/BottomNav';
import { ActionButton } from '@/components/elements/ActionButton';
import { Typography } from '@/components/elements/Typography';
import { Icon } from '@/components/elements/Icon';
import { useSimulation } from '@/providers/SimulationProvider';
import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { BoundingBox, Ingredient, IngredientUnit } from '@/types/ingredient';
import { NumberInput } from '@/components/elements/NumberInput';
import { Card, CardContent } from '@/components/ui/card';

const BoundingBoxCanvas = dynamic(() => import('@/components/BoundingBoxCanvas'), { 
    ssr: false,
    loading: () => <div className="w-full aspect-square bg-muted animate-pulse rounded-xl" />
});

function ReviewContent() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || 'fridge';
    const router = useRouter();
    const { analysis, storage } = useSimulation();
    const [localBoxes, setLocalBoxes] = useState<BoundingBox[]>(
        analysis.result?.type === 'fridge' ? (analysis.result.boundingBoxes || []) : []
    );
    const [localIngredients, setLocalIngredients] = useState<Ingredient[]>(
        analysis.result?.type === 'receipt' ? (analysis.result.ingredients || []) : []
    );


    useEffect(() => {
        if (analysis.result) {
            if (type === 'fridge') {
                const newBoxes = analysis.result.boundingBoxes || [];
                // 간단한 길이 비교로 불필요한 업데이트 방지 (완벽하진 않지만 무한 루프 방지)
                setLocalBoxes(prev => prev.length !== newBoxes.length ? newBoxes : prev);
            } else {
                const newIngs = analysis.result.ingredients || [];
                setLocalIngredients(prev => prev.length !== newIngs.length ? newIngs : prev);
            }
        } else if (analysis.status !== 'ANALYZING') {
            router.replace('/test/upload');
        }
    }, [analysis.result, analysis.status, router, type]);

    const handleConfirm = () => {
        if (type === 'fridge') {
            const newIngredients: Ingredient[] = localBoxes.map(box => ({
                id: box.id,
                name: box.label,
                quantity: 1,
                unit: '개',
                addedAt: new Date().toISOString(),
            }));
            storage.saveIngredients([...storage.ingredients, ...newIngredients]);
        } else {
            storage.saveIngredients([...storage.ingredients, ...localIngredients]);
        }
        router.push('/test/recipes');
    };

    const handleUpdateBoxLabel = (id: string, newLabel: string) => {
        setLocalBoxes(prev => prev.map(box => box.id === id ? { ...box, label: newLabel } : box));
    };

    const handleRemoveBox = (id: string) => {
        setLocalBoxes(prev => prev.filter(box => box.id !== id));
    };

    const handleUpdateIngredient = (id: string, updates: Partial<Ingredient>) => {
        setLocalIngredients(prev => prev.map(ing => ing.id === id ? { ...ing, ...updates } : ing));
    };

    const handleRemoveIngredient = (id: string) => {
        setLocalIngredients(prev => prev.filter(ing => ing.id !== id));
    };

    if (!analysis.result) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <Typography color="muted">분석 정보를 불러오는 중입니다...</Typography>
            </div>
        );
    }

    if (type === 'fridge') {
        return (
            <div className="flex-1 flex flex-col w-full relative h-[calc(100vh-140px)]">
            {/* Canvas Area - Full Screen */}
                <div className="flex-1 relative w-full bg-black/5 overflow-hidden flex flex-col items-center justify-center">
                    <BoundingBoxCanvas 
                        imageUrl={analysis.result.imageUrl}
                        items={localBoxes}
                        onUpdateItem={(id, newBox) => {
                            setLocalBoxes(prev => prev.map(box => box.id === id ? { ...box, ...newBox } : box));
                        }}
                        onRemoveItem={handleRemoveBox}
                        onLabelChange={handleUpdateBoxLabel}
                    />
                </div>

                {/* Content Bar */}
                <div className="h-20 bg-background border-t flex items-center justify-around px-8 shrink-0 gap-4 z-10">
                    {/* Reset Button */}
                    <button 
                        onClick={() => setLocalBoxes(analysis.result?.boundingBoxes || [])}
                        className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary active:scale-95 transition-all"
                    >
                        <div className="p-3 rounded-full bg-muted hover:bg-primary/10 transition-colors">
                            <Icon name="RotateCcw" size={24} />
                        </div>
                        <span className="text-[10px] font-medium">초기화</span>
                    </button>

                    {/* Add Box Button */}
                    <button 
                        className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary active:scale-95 transition-all"
                    >
                        <div className="p-3 rounded-full bg-muted hover:bg-primary/10 transition-colors">
                            <Icon name="Plus" size={24} />
                        </div>
                        <span className="text-[10px] font-medium">박스추가</span>
                    </button>

                    {/* Confirm Button */}
                    <button 
                        onClick={handleConfirm}
                        className="flex flex-col items-center gap-1 p-2 text-primary hover:text-primary/80 active:scale-95 transition-all"
                    >
                        <div className="p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all">
                            <Icon name="Check" size={24} />
                        </div>
                        <span className="text-[10px] font-bold">확인</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col p-4 gap-6">
            <div className="space-y-1">
                <Typography variant="h3" weight="bold">사진을 확인해주세요</Typography>
                <Typography variant="body2" color="muted">
                    수량과 단위를 확인하고 잘못된 항목은 수정해주세요.
                </Typography>
            </div>

            <div className="space-y-3">
                {localIngredients.map(ing => (
                    <Card key={ing.id} className="overflow-hidden border-none shadow-sm bg-muted/30">
                        <CardContent className="p-4 flex items-center justify-between gap-4">
                            <div className="flex-1 space-y-2">
                                <input 
                                    type="text" 
                                    value={ing.name} 
                                    onChange={(e) => handleUpdateIngredient(ing.id, { name: e.target.value })}
                                    className="text-base font-bold bg-transparent border-none outline-none w-full"
                                />
                                <div className="flex items-center gap-2">
                                    <NumberInput 
                                        value={ing.quantity} 
                                        onChange={(val: number) => handleUpdateIngredient(ing.id, { quantity: val })} 
                                    />
                                    <select 
                                        value={ing.unit} 
                                        onChange={(e) => handleUpdateIngredient(ing.id, { unit: e.target.value as IngredientUnit })}
                                        className="bg-transparent text-sm text-muted-foreground outline-none border rounded px-1"
                                    >
                                        <option value="개">개</option>
                                        <option value="g">g</option>
                                        <option value="kg">kg</option>
                                        <option value="ml">ml</option>
                                        <option value="L">L</option>
                                    </select>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleRemoveIngredient(ing.id)}
                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                            >
                                <Icon name="Trash2" size={20} />
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
                <ActionButton variant="outline" icon="Plus" fullWidth>
                    추가
                </ActionButton>
                <ActionButton icon="Check" fullWidth onClick={handleConfirm}>
                    완료
                </ActionButton>
            </div>
        </div>
    );
}

export default function ReviewPage() {
    return (
        <main className="flex flex-col min-h-screen bg-background pb-20">
            <AppHeader title="분석 결과 확인" showBack />
            <Suspense fallback={<div className="p-8 text-center text-muted-foreground">불러오는 중...</div>}>
                <ReviewContent />
            </Suspense>
            <BottomNav />
        </main>
    );
}
