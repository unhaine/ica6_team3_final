"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { AppHeader } from '@/components/modules/AppHeader';
import { BottomNav } from '@/components/modules/BottomNav';
import { ActionButton } from '@/components/elements/ActionButton';
import { Typography } from '@/components/elements/Typography';
import { Icon } from '@/components/elements/Icon';
import { useSimulation } from '@/providers/SimulationProvider';
import { useEffect, useState, Suspense } from 'react';
import { BoundingBox, Ingredient, IngredientUnit } from '@/types/ingredient';
import Image from 'next/image';
import { NumberInput } from '@/components/elements/NumberInput';
import { Card, CardContent } from '@/components/ui/card';

function ReviewContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'fridge';
  const router = useRouter();
  const { analysis, storage } = useSimulation();
  const [localBoxes, setLocalBoxes] = useState<BoundingBox[]>([]);
  const [localIngredients, setLocalIngredients] = useState<Ingredient[]>([]);

  // Adjust state during render
  const [prevResult, setPrevResult] = useState(analysis.result);
  if (analysis.result !== prevResult) {
    setPrevResult(analysis.result);
    if (analysis.result) {
      if (type === 'fridge') {
        setLocalBoxes(analysis.result.boundingBoxes || []);
      } else {
        setLocalIngredients(analysis.result.ingredients || []);
      }
    }
  }

  useEffect(() => {
    if (!analysis.result && analysis.status !== 'ANALYZING') {
      router.replace('/test/upload');
    }
  }, [analysis.result, analysis.status, router]);

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

  return (
    <div className="flex-1 flex flex-col p-4 gap-6">
      <div className="space-y-1">
        <Typography variant="h3" weight="bold">식재료를 확인해주세요</Typography>
        <Typography variant="body2" color="muted">
          {type === 'fridge' 
            ? "라벨을 눌러 이름을 수정하거나 박스를 삭제할 수 있습니다." 
            : "수량과 단위를 확인하고 잘못된 항목은 수정해주세요."}
        </Typography>
      </div>

      {type === 'fridge' ? (
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden border bg-muted">
          <Image 
            src={analysis.result.imageUrl} 
            alt="Analyzed Image" 
            fill 
            className="object-contain" 
          />
          
          {localBoxes.map(box => (
            <div 
              key={box.id}
              className="absolute border-2 border-primary bg-primary/10 rounded-sm"
              style={{
                left: `${box.x * 100}%`,
                top: `${box.y * 100}%`,
                width: `${box.width * 100}%`,
                height: `${box.height * 100}%`,
              }}
            >
              <div className="absolute -top-7 left-0 flex items-center bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-t-sm whitespace-nowrap gap-1">
                <input 
                  type="text" 
                  value={box.label} 
                  onChange={(e) => handleUpdateBoxLabel(box.id, e.target.value)}
                  className="bg-transparent border-none outline-none w-12 font-bold focus:w-20 transition-all text-white"
                />
                <button onClick={() => handleRemoveBox(box.id)} className="hover:text-red-300">
                  <Icon name="X" size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
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
      )}

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
