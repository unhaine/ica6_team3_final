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
import dynamic from 'next/dynamic';
import Image from 'next/image';


const BoundingBoxCanvas = dynamic(() => import('@/components/BoundingBoxCanvas'), { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-muted/20 animate-pulse" />
});

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

    await analysis.performAnalysis(selectedType, previewImage);

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


            {!previewImage ? (
                <div className="flex-1 flex flex-col items-center p-4 gap-2">
                    <Image
                        src="/wow.png"
                        alt="고양이"
                        width={300}
                        height={300}
                    />
                    <button 
                        onClick={() => handleTypeSelect('fridge')}
                        className="group flex items-center gap-4 p-4 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-md transition-all text-left w-full"
                    >
                        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            <Icon name="Refrigerator" size={28} />
                        </div>
                        <div className="flex-1">
                            <Typography variant="subtitle2" weight="bold">냉장고 사진</Typography>
                            <Typography variant="caption" color="muted">냉장고 안을 촬영한 사진</Typography>
                        </div>
                        <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                    </button>
                    <button 
                        onClick={() => handleTypeSelect('receipt')}
                        className="group flex items-center gap-4 p-4 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-md transition-all text-left w-full"
                    >
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <Icon name="ReceiptText" size={28} />
                        </div>
                        <div className="flex-1">
                            <Typography variant="subtitle2" weight="bold">영수증 / 내역</Typography>
                            <Typography variant="caption" color="muted">구매한 식재료 영수증 사진</Typography>
                        </div>
                        <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                    </button>
                    <div className="space-y-2 mt-2">
                    <Typography variant="body2" color="muted">분석할 사진의 종류를 선택해주세요.</Typography>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col w-full relative h-[calc(100vh-140px)]">
                    {/* Canvas Area - Full Screen using BoundingBoxCanvas for consistent rendering */}
                    <div className="flex-1 relative w-full bg-black/5 overflow-hidden flex flex-col items-center justify-center">
                        <BoundingBoxCanvas 
                            imageUrl={previewImage}
                            items={[]} // No items in preview mode
                            onUpdateItem={() => {}} 
                            onRemoveItem={() => {}}
                            onLabelChange={() => {}}
                        />

                        {/* Floating Overlay for Actions/Status */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">

                            {/* Analyzing State */}
                            {analysis.status === 'ANALYZING' && (
                                <div className="bg-background/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-primary/20 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                                    <div className="p-4 bg-primary/10 rounded-full animate-pulse">
                                        <Icon name="Loader" size={32} className="text-primary animate-spin" />
                                    </div>
                                    <div className="text-center space-y-1">
                                        <Typography variant="h4" weight="bold">AI 분석 중...</Typography>
                                        <Typography variant="body2" color="muted">잠시만 기다려주세요</Typography>
                                    </div>
                                </div>
                            )}

                            {/* Idle State - Start Button */}
                            {analysis.status === 'IDLE' && (
                                <div className="pointer-events-auto flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <button 
                                        onClick={handleStartAnalysis}
                                        className="group relative flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
                                    >
                                        <Icon name="Search" size={24} />
                                        <span className="text-lg font-bold">AI 분석 시작하기</span>
                                        <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
                                    </button>

                                    <button 
                                        onClick={handleReset}
                                        className="text-white/80 hover:text-white text-sm font-medium bg-black/40 hover:bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm transition-all flex items-center gap-2"
                                    >
                                        <Icon name="RotateCcw" size={14} />
                                        다시 선택하기
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Dark Overlay when analyzing */}
                        {analysis.status === 'ANALYZING' && (
                            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-all z-10" />
                        )}
                    </div>
                </div>
            )}

            <BottomNav />
        </main>
    );
}
