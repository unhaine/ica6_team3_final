"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/modules/AppHeader';
import { BottomNav } from '@/components/modules/BottomNav';
import { ActionButton } from '@/components/elements/ActionButton';
import { Typography } from '@/components/elements/Typography';
import { Icon } from '@/components/elements/Icon';
import { useSimulation } from '@/providers/SimulationProvider';
import { AnalysisType } from '@/types/analysis';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function UploadPage() {
  const router = useRouter();
  const { analysis } = useSimulation();
  const [selectedType, setSelectedType] = useState<AnalysisType | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleTypeSelect = (type: AnalysisType) => {
    setSelectedType(type);
    // 실제 파일 선택창을 시뮬레이션하기 위해 가상 클릭 처리
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewImage(url);
      }
    };
    input.click();
  };

  const handleStartAnalysis = async () => {
    if (!selectedType || !previewImage) return;
    
    await analysis.simulateAnalysis(selectedType, previewImage);
    
    // 분석 완료 후 결과 페이지로 이동
    router.push(`/test/review?type=${selectedType}`);
  };

  const handleReset = () => {
    setPreviewImage(null);
    setSelectedType(null);
    analysis.reset();
  };

  return (
    <main className="flex flex-col min-h-screen bg-background pb-20">
      <AppHeader title={previewImage ? "사진 확인" : "식재료 등록"} showBack={!!previewImage} onBack={handleReset} />

      <div className="flex-1 flex flex-col p-4 gap-6">
        {!previewImage ? (
          <>
            <div className="space-y-2 mt-4">
              <Typography variant="h3" weight="bold">무엇을 등록할까요?</Typography>
              <Typography variant="body2" color="muted">분석할 사진의 종류를 선택해주세요.</Typography>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4">
              <button
                onClick={() => handleTypeSelect('fridge')}
                className="group relative overflow-hidden rounded-2xl border-2 border-transparent bg-card p-6 text-left transition-all hover:border-primary/50 hover:shadow-lg active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Typography variant="h4" weight="bold">🧊 냉장고 사진</Typography>
                    <Typography variant="body2" color="muted">냉장고 안을 촬영한 사진</Typography>
                  </div>
                  <div className="rounded-full bg-primary/10 p-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon name="Camera" size={24} />
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleTypeSelect('receipt')}
                className="group relative overflow-hidden rounded-2xl border-2 border-transparent bg-card p-6 text-left transition-all hover:border-primary/50 hover:shadow-lg active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Typography variant="h4" weight="bold">📄 영수증 / 내역</Typography>
                    <Typography variant="body2" color="muted">구매한 식재료 영수증 사진</Typography>
                  </div>
                  <div className="rounded-full bg-primary/10 p-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon name="FileText" size={24} />
                  </div>
                </div>
              </button>
            </div>
          </>
        ) : (
          <div className="relative flex-1 flex flex-col gap-4">
            <div className="relative flex-1 rounded-2xl overflow-hidden border bg-muted min-h-[400px]">
              <Image 
                src={previewImage} 
                alt="Upload Preview" 
                fill 
                className={cn(
                  "object-contain transition-all duration-500",
                  analysis.status === 'ANALYZING' && "blur-sm opacity-50"
                )} 
              />
              
              {analysis.status === 'IDLE' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ActionButton 
                    size="lg" 
                    icon="Search" 
                    onClick={handleStartAnalysis}
                    className="shadow-2xl scale-110 active:scale-100"
                  >
                    AI 분석 시작하기
                  </ActionButton>
                </div>
              )}

              {analysis.status === 'ANALYZING' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-background/20">
                  <div className="w-full max-w-xs space-y-6 text-center">
                    <div className="relative inline-flex items-center justify-center">
                      <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                      <div className="relative rounded-full bg-background p-4 shadow-xl">
                        <Icon name="Cpu" size={40} className="text-primary animate-pulse" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Typography variant="h4" weight="bold">AI가 분석 중입니다</Typography>
                      <Typography variant="body2" color="muted">식재료를 꼼꼼하게 찾아내고 있어요.</Typography>
                    </div>

                    <div className="space-y-2">
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300 ease-out"
                          style={{ width: `${analysis.progress}%` }}
                        />
                      </div>
                      <Typography variant="caption" weight="bold" color="primary">
                        {analysis.progress}%
                      </Typography>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {analysis.status === 'IDLE' && (
              <ActionButton 
                variant="ghost" 
                fullWidth 
                onClick={handleReset}
              >
                다른 사진 선택하기
              </ActionButton>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
