"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { Typography, IconButton, ActionButton } from "@/components/elements";
import { Camera, Upload, X, Check, ArrowRight, Loader2, Plus, Trash2, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Konva-based BoundingBox component (SSR disabled)
const BoundingBoxCanvas = dynamic(() => import("@/components/modules/BoundingBox"), {
    ssr: false,
});

type Step = "capture" | "detect" | "confirm";

interface DetectedItem {
    id: string;
    label: string;
    confidence: number;
    boundingBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    source?: string;
}

export default function CameraTestPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("capture");
    const [, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
    
    // 1. 헤더 및 푸터 제어
    useHeader({
        isVisible: step !== "capture", // 캡처 단계에서는 헤더 숨김 (UI 스펙)
        title: step === "detect" ? "객체 탐지" : "인식 결과 확인",
        left: (
            <IconButton 
                icon="ArrowLeft" 
                variant="ghost" 
                ariaLabel="뒤로 가기"
                onClick={() => {
                    if (step === "detect") setStep("capture");
                    else if (step === "confirm") setStep("detect");
                }} 
            />
        ),
        right: <IconButton icon="X" variant="ghost" ariaLabel="닫기" onClick={() => router.push("/test")} />,
    });

    useFooter({
        isVisible: false, // 카메라 페이지는 전체 화면 스펙이므로 푸터 숨김
    });

    // 이미지 선택 처리
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setStep("detect");
            handleAnalyze(file);
        }
    };

    // 분석 요청
    const handleAnalyze = async (file: File) => {
        setIsAnalyzing(true);
        try {
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve) => {
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });
            
            const base64Image = await base64Promise;

            const response = await fetch(`/api/vision/analyze/gemini-flash`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64Image }),
            });

            if (!response.ok) throw new Error("분석 실패");

            const data = await response.json();
            setDetectedItems(data.detectedItems);
        } catch (error) {
            console.error("분석 에러:", error);
            alert("이미지 분석 중 오류가 발생했습니다.");
            setStep("capture");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // 아이템 업데이트 (드래그/리사이즈)
    const handleUpdateItem = useCallback((id: string, newBox: { x: number; y: number; width: number; height: number }) => {
        setDetectedItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, boundingBox: newBox } : item))
        );
    }, []);

    // 아이템 삭제
    const handleDeleteItem = (id: string) => {
        setDetectedItems((prev) => prev.filter(item => item.id !== id));
    };

    // 아이템 이름 수정
    const handleEditLabel = (id: string, newLabel: string) => {
        setDetectedItems((prev) => 
            prev.map(item => item.id === id ? { ...item, label: newLabel } : item)
        );
    };

    // 저장 완료 처리
    const handleConfirmSave = () => {
        // 실제로는 여기서 DB 저장 API 호출
        alert(`${detectedItems.length}개의 재료가 냉장고에 저장되었습니다.`);
        router.push("/test/fridge");
    };

    return (
        <div className="flex-1 flex flex-col bg-black overflow-hidden relative">
            <AnimatePresence mode="wait">
                {/* Step 1: Capture */}
                {step === "capture" && (
                    <motion.div 
                        key="capture"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col justify-between p-6 relative"
                    >
                        <button 
                            className="absolute top-6 left-6 z-10 p-2 bg-white/20 backdrop-blur-md rounded-full text-white"
                            onClick={() => router.push("/test")}
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                            <div className="w-64 h-64 border-2 border-dashed border-white/30 rounded-3xl flex items-center justify-center">
                                <Camera className="w-16 h-16 text-white/50" />
                            </div>
                            <div className="text-center space-y-2">
                                <Typography variant="h3" weight="bold" className="text-white">
                                    냉장고 안을 찍어주세요!
                                </Typography>
                                <Typography variant="body2" className="text-white/60">
                                    AI가 재료를 자동으로 찾아드릴게요.
                                </Typography>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleImageChange}
                                />
                                <div className="w-full h-16 bg-white rounded-2xl flex items-center justify-center gap-3 cursor-pointer active:scale-95 transition-transform">
                                    <Upload className="w-5 h-5 text-black" />
                                    <span className="font-bold text-black">사진 업로드</span>
                                </div>
                            </label>
                            
                            <ActionButton 
                                variant="outline" 
                                fullWidth 
                                className="h-16 rounded-2xl border-white/30 text-white hover:bg-white/10"
                                onClick={() => alert("카메라 기능은 모바일 브라우저에서 지원될 예정입니다. 사진 업로드를 이용해주세요.")}
                            >
                                <Camera className="w-5 h-5 mr-3" />
                                카메라 촬영
                            </ActionButton>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Detect */}
                {step === "detect" && previewUrl && (
                    <motion.div 
                        key="detect"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex-1 flex flex-col bg-slate-900"
                    >
                        <div className="flex-1 relative bg-black flex items-center justify-center">
                            {isAnalyzing && (
                                <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center space-y-4">
                                    <div className="relative">
                                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                                    </div>
                                    <Typography weight="bold" className="text-white">
                                        AI 분석 중...
                                    </Typography>
                                </div>
                            )}
                            
                            <BoundingBoxCanvas
                                imageUrl={previewUrl}
                                items={detectedItems.map(item => ({
                                    id: item.id,
                                    label: item.label,
                                    confidence: item.confidence,
                                    ...item.boundingBox
                                }))}
                                onUpdateItem={handleUpdateItem}
                            />
                        </div>

                        <div className="p-6 bg-white rounded-t-3xl shadow-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="space-y-1">
                                    <Typography variant="h4" weight="bold">
                                        {isAnalyzing ? "분석 중..." : `${detectedItems.length}개의 재료 발견`}
                                    </Typography>
                                    {!isAnalyzing && (
                                        <Typography variant="caption" className="text-slate-500">
                                            박스를 움직여 위치를 조정할 수 있습니다.
                                        </Typography>
                                    )}
                                </div>
                            </div>
                            
                            <ActionButton 
                                variant="default" 
                                fullWidth 
                                size="lg"
                                className="rounded-2xl h-14 font-bold"
                                disabled={isAnalyzing}
                                onClick={() => setStep("confirm")}
                            >
                                결과 확인하기 <ArrowRight className="w-5 h-5 ml-2" />
                            </ActionButton>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Confirm */}
                {step === "confirm" && (
                    <motion.div 
                        key="confirm"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="flex-1 flex flex-col bg-slate-50 overflow-hidden"
                    >
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
                                <div className="p-2 bg-emerald-500 rounded-full text-white">
                                    <Check className="w-4 h-4" />
                                </div>
                                <Typography weight="bold" className="text-emerald-900">
                                    총 {detectedItems.length}개의 재료를 불러왔습니다.
                                </Typography>
                            </div>

                            <div className="grid gap-3">
                                {detectedItems.map((item) => (
                                    <div 
                                        key={item.id}
                                        className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl">
                                                🥗
                                            </div>
                                            <div className="space-y-0.5">
                                                <Typography weight="bold">{item.label}</Typography>
                                                <Typography variant="caption" className="text-slate-400">
                                                    확률 {(item.confidence * 100).toFixed(0)}%
                                                </Typography>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                className="p-2 text-slate-400 hover:text-primary transition-colors"
                                                onClick={() => {
                                                    const newLabel = prompt("새 이름을 입력하세요", item.label);
                                                    if (newLabel) handleEditLabel(item.id, newLabel);
                                                }}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                onClick={() => handleDeleteItem(item.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button 
                                    className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:border-primary hover:text-primary transition-all active:scale-[0.98]"
                                    onClick={() => {
                                        const label = prompt("재료 이름을 입력하세요");
                                        if (label) {
                                            setDetectedItems(prev => [
                                                ...prev, 
                                                { 
                                                    id: `manual-${Date.now()}`, 
                                                    label, 
                                                    confidence: 1.0, 
                                                    boundingBox: { x: 0.1, y: 0.1, width: 0.2, height: 0.2 } 
                                                }
                                            ]);
                                        }
                                    }}
                                >
                                    <Plus className="w-5 h-5" />
                                    <span className="font-bold">재료 직접 추가</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 bg-white border-t border-slate-200">
                            <ActionButton 
                                variant="default" 
                                fullWidth 
                                size="lg"
                                className="rounded-2xl h-14 font-bold shadow-lg shadow-primary/20"
                                onClick={handleConfirmSave}
                            >
                                냉장고에 저장하기
                            </ActionButton>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
