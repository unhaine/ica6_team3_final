"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/modules/AppHeader';
import { BottomNav } from '@/components/modules/BottomNav';
import { ActionButton } from '@/components/elements/ActionButton';
import { Typography } from '@/components/elements/Typography';
import { Icon } from '@/components/elements/Icon';
import { useSimulation } from '@/providers/SimulationProvider';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressBar } from '@/components/elements/ProgressBar';

export default function VerifyPage() {
  const router = useRouter();
  const { analysis } = useSimulation();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setPreviewImage(URL.createObjectURL(file));
      }
    };
    input.click();
  };

  const handleVerify = async () => {
    if (!previewImage) return;
    
    // 분석 시뮬레이션 활용 (동일하게 진행)
    await analysis.simulateAnalysis('fridge', previewImage);
    
    // 결과 전 시뮬레이션 점수 (랜덤 85~98)
    setScore(Math.floor(Math.random() * 14) + 85);
  };

  return (
    <main className="flex flex-col min-h-screen bg-background pb-20">
      <AppHeader title="요리 인증" showBack />

      <div className="flex-1 flex flex-col p-4 gap-6">
        {!score ? (
          <>
            <div className="space-y-1">
              <Typography variant="h3" weight="bold">완성된 요리를 보여주세요!</Typography>
              <Typography variant="body2" color="muted">AI가 레시피와 얼마나 비슷한지 평가해드려요.</Typography>
            </div>

            <div 
              onClick={handleUpload}
              className={cn(
                "relative flex-1 min-h-[300px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 transition-all cursor-pointer",
                previewImage ? "border-solid border-primary/20 bg-muted/30" : "hover:bg-muted/50 border-muted-foreground/30"
              )}
            >
              {previewImage ? (
                <div className="relative w-full h-full p-4">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border shadow-inner">
                    <Image src={previewImage} alt="Dish Preview" fill className="object-cover" />
                  </div>
                  <div className="absolute top-6 right-6">
                    <button className="bg-background/80 backdrop-blur p-2 rounded-full shadow-lg" onClick={(e) => { e.stopPropagation(); handleUpload(); }}>
                      <Icon name="RotateCcw" size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="rounded-full bg-primary/10 p-6 text-primary">
                    <Icon name="Camera" size={48} />
                  </div>
                  <Typography weight="semibold">사진 찍기 또는 업로드</Typography>
                </>
              )}
            </div>

            <ActionButton 
              fullWidth 
              size="lg" 
              disabled={!previewImage || analysis.status === 'ANALYZING'}
              loading={analysis.status === 'ANALYZING'}
              onClick={handleVerify}
            >
              싱크로율 분석하기
            </ActionButton>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
              <div className="relative w-48 h-48 rounded-full border-8 border-primary flex flex-col items-center justify-center bg-background shadow-2xl">
                <Typography variant="h1" weight="black" className="text-5xl text-primary">{score}</Typography>
                <Typography variant="caption" weight="bold" color="muted">SYNC RATE</Typography>
              </div>
            </div>

            <div className="text-center space-y-2">
              <Typography variant="h3" weight="bold">🎉 대단한 실력이에요!</Typography>
              <Typography variant="body1" color="muted">셰프급의 싱크로율을 보여주셨네요!</Typography>
            </div>

            <Card className="w-full border-none bg-muted/30 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <ProgressBar value={score} label="비주얼 점수" showLabel variant="gradient" />
                <ProgressBar value={score - 5} label="구성 완성도" showLabel variant="success" />
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4 w-full pt-4">
              <ActionButton variant="outline" icon="Share2" fullWidth>공유하기</ActionButton>
              <ActionButton icon="House" fullWidth onClick={() => router.push('/test')}>메인으로</ActionButton>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
