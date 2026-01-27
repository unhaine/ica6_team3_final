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
import Image from 'next/image';

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
      <AppHeader title={"메인화면"} />

        <div className="flex-1 flex flex-col items-center p-4 gap-2">
        <Image
          src="/rat.png"
          alt="고양이"
          width={300}
          height={300}
        />
          <button 
            onClick={() => router.push('/test/upload')}
            className="group flex items-center gap-4 p-4 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-md transition-all text-left w-full"
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
      </div>

      <BottomNav />
    </main>
  );
}
