"use client";

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/modules/AppHeader';
import { BottomNav } from '@/components/modules/BottomNav';
import { ActionButton } from '@/components/elements/ActionButton';
import { Typography } from '@/components/elements/Typography';
import { Icon } from '@/components/elements/Icon';
import { useSimulation } from '@/providers/SimulationProvider';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressBar } from '@/components/elements/ProgressBar';
import { cn } from '@/lib/utils';

export default function TestHomePage() {
  const router = useRouter();
  const { storage, recipe } = useSimulation();

  // 식재료 카테고리별 통계
  const stats = useMemo(() => {
    const total = storage.ingredients.length;
    const today = new Date();
    
    // 소비기한 임박 (3일 이내)
    const expiringSoon = storage.ingredients.filter(ing => {
      if (!ing.expiryDate) return false;
      const expiry = new Date(ing.expiryDate);
      const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays >= 0;
    });

    // 이미 만료된 것
    const expired = storage.ingredients.filter(ing => {
      if (!ing.expiryDate) return false;
      const expiry = new Date(ing.expiryDate);
      return expiry < today;
    });

    // 최근 추가 (3일 이내)
    const recentlyAdded = storage.ingredients.filter(ing => {
      const added = new Date(ing.addedAt);
      const diffDays = Math.ceil((today.getTime() - added.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 3;
    }).slice(0, 5);

    return { total, expiringSoon, expired, recentlyAdded };
  }, [storage.ingredients]);

  // 냉장고 활용도 (Mock - 실제로는 레시피와 매칭 가능 비율)
  const utilizationRate = useMemo(() => {
    if (stats.total === 0) return 0;
    // 활용 가능한 식재료 비율을 시뮬레이션
    return Math.min(100, Math.floor((stats.total / 10) * 100));
  }, [stats.total]);

  return (
    <main className="flex flex-col min-h-screen bg-background pb-20">
      <AppHeader />

      <div className="flex-1 flex flex-col p-4 gap-6">
        {/* 환영 메시지 */}
        <div className="space-y-1">
          <Typography variant="h3" weight="bold">
            우리집 냉장고 🧊
          </Typography>
          <Typography variant="body2" color="muted">
            오늘도 맛있는 요리를 준비해볼까요?
          </Typography>
        </div>

        {/* 빠른 액션 버튼 */}
        <div className="grid grid-cols-2 gap-3">
          <ActionButton 
            fullWidth 
            size="lg"
            icon="Camera"
            onClick={() => router.push('/test/upload')}
            className="h-14"
          >
            식재료 등록
          </ActionButton>
          <ActionButton 
            fullWidth 
            size="lg"
            variant="outline"
            icon="Utensils"
            onClick={() => router.push('/test/recipes')}
            className="h-14"
          >
            레시피 추천
          </ActionButton>
        </div>

        {/* 냉장고 현황 카드 */}
        <Card className="overflow-hidden border-none shadow-lg bg-linear-to-br from-primary/10 via-background to-primary/5">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Typography variant="subtitle1" weight="bold">냉장고 현황</Typography>
              <div className="flex items-center gap-1 text-primary">
                <Icon name="Package" size={18} />
                <Typography variant="h4" weight="black" color="primary">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="muted">개</Typography>
              </div>
            </div>
            
            <ProgressBar 
              value={utilizationRate} 
              label="활용 가능률" 
              showLabel 
              variant="gradient" 
            />

            {stats.total === 0 ? (
              <div className="text-center py-4 space-y-2">
                <div className="text-4xl">📦</div>
                <Typography variant="body2" color="muted">
                  아직 등록된 식재료가 없어요
                </Typography>
                <Typography variant="caption" color="muted">
                  냉장고 사진을 찍어 식재료를 등록해보세요!
                </Typography>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="text-center p-3 rounded-xl bg-background/50">
                  <Typography variant="h4" weight="bold" className="text-emerald-500">
                    {stats.total - stats.expired.length - stats.expiringSoon.length}
                  </Typography>
                  <Typography variant="caption" color="muted">신선</Typography>
                </div>
                <div className="text-center p-3 rounded-xl bg-background/50">
                  <Typography variant="h4" weight="bold" className="text-amber-500">
                    {stats.expiringSoon.length}
                  </Typography>
                  <Typography variant="caption" color="muted">임박</Typography>
                </div>
                <div className="text-center p-3 rounded-xl bg-background/50">
                  <Typography variant="h4" weight="bold" className="text-red-500">
                    {stats.expired.length}
                  </Typography>
                  <Typography variant="caption" color="muted">만료</Typography>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 소비기한 임박 알림 */}
        {stats.expiringSoon.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Icon name="TriangleAlert" size={20} />
                <Typography variant="subtitle2" weight="bold">소비기한 임박!</Typography>
              </div>
              <div className="space-y-2">
                {stats.expiringSoon.slice(0, 3).map(ing => {
                  const expiry = new Date(ing.expiryDate!);
                  const today = new Date();
                  const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={ing.id} className="flex items-center justify-between">
                      <Typography variant="body2">{ing.name}</Typography>
                      <Typography variant="caption" weight="semibold" className={cn(
                        diffDays <= 1 ? "text-red-500" : "text-amber-600 dark:text-amber-400"
                      )}>
                        {diffDays === 0 ? '오늘까지' : diffDays === 1 ? '내일까지' : `${diffDays}일 남음`}
                      </Typography>
                    </div>
                  );
                })}
              </div>
              {stats.expiringSoon.length > 3 && (
                <Typography variant="caption" color="muted" className="block text-center">
                  +{stats.expiringSoon.length - 3}개 더 있음
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {/* 최근 등록된 식재료 */}
        {stats.recentlyAdded.length > 0 && (
          <section className="space-y-3">
            <Typography variant="subtitle1" weight="bold">최근 등록 식재료</Typography>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {stats.recentlyAdded.map(ing => (
                <div 
                  key={ing.id} 
                  className="shrink-0 px-4 py-3 rounded-2xl bg-muted/50 border flex flex-col items-center min-w-[80px]"
                >
                  <Typography variant="body2" weight="semibold" className="whitespace-nowrap">
                    {ing.name}
                  </Typography>
                  <Typography variant="caption" color="muted">
                    {ing.quantity}{ing.unit}
                  </Typography>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 추천 액션 카드들 */}
        <section className="space-y-3">
          <Typography variant="subtitle1" weight="bold">오늘 뭐 할까?</Typography>
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={() => router.push('/test/recipes')}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-md transition-all text-left"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon name="ChefHat" size={28} />
              </div>
              <div className="flex-1">
                <Typography variant="subtitle2" weight="bold">AI 레시피 추천</Typography>
                <Typography variant="caption" color="muted">보유 식재료로 만들 수 있는 요리를 찾아보세요</Typography>
              </div>
              <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
            </button>

            <button 
              onClick={() => router.push('/test/upload')}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-md transition-all text-left"
            >
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Icon name="ScanLine" size={28} />
              </div>
              <div className="flex-1">
                <Typography variant="subtitle2" weight="bold">식재료 스캔</Typography>
                <Typography variant="caption" color="muted">냉장고 사진이나 영수증을 촬영해보세요</Typography>
              </div>
              <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
            </button>

            <button 
              onClick={() => router.push('/test/verify')}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-md transition-all text-left"
            >
              <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500 group-hover:bg-violet-500 group-hover:text-white transition-colors">
                <Icon name="Award" size={28} />
              </div>
              <div className="flex-1">
                <Typography variant="subtitle2" weight="bold">요리 인증</Typography>
                <Typography variant="caption" color="muted">완성된 요리를 인증하고 점수를 받아보세요</Typography>
              </div>
              <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
            </button>
          </div>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
