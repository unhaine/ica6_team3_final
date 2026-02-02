"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { IconButton } from "@/components/elements";
import { AnimatePresence } from "framer-motion";
import { Step, DetectedItem } from "./components/types";
import { CaptureStep } from "./components/CaptureStep";
import { DetectStep } from "./components/DetectStep";
import { ConfirmStep } from "./components/ConfirmStep";

export default function CameraTestPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("capture");
    const [, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
    const [editingItem, setEditingItem] = useState<DetectedItem | null>(null);
    
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

            const data = await response.json() as { detectedItems: Omit<DetectedItem, "quantity">[] };
            setDetectedItems(data.detectedItems.map((item) => ({
                ...item,
                quantity: 1
            })));
        } catch (error) {
            console.error("분석 에러:", error);
            alert("이미지 분석 중 오류가 발생했습니다.");
            setStep("capture");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSaveEdit = (newLabel: string, quantity: number) => {
        if (!editingItem) return;
        handleEditLabel(editingItem.id, newLabel, quantity);
        setEditingItem(null);
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

    // 아이템 이름 및 수량 수정
    const handleEditLabel = (id: string, newLabel: string, quantity: number) => {
        setDetectedItems((prev) => 
            prev.map(item => item.id === id ? { ...item, label: newLabel, quantity } : item)
        );
    };

    // 저장 완료 처리
    const handleConfirmSave = async () => {
        try {
            // 재료 저장 API 호출
            const response = await fetch('/api/ingredients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: detectedItems.map(item => ({
                        name: item.label,
                        quantity: item.quantity || 1,
                        category: null, // 카테고리는 나중에 추가 가능
                        source: 'fridge-photo', // 냉장고 사진에서 추출
                    })),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '재료 저장에 실패했습니다.');
            }

            alert(`✅ ${detectedItems.length}개의 재료가 냉장고에 저장되었습니다.`);
            router.push("/test/fridge");
        } catch (error) {
            console.error('재료 저장 에러:', error);
            alert(`❌ 재료 저장 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-black overflow-hidden relative">
            <AnimatePresence mode="wait">
                {/* Step 1: Capture */}
                {step === "capture" && (
                    <CaptureStep 
                        onImageChange={handleImageChange} 
                        onClose={() => router.push("/test")} 
                    />
                )}

                {/* Step 2: Detect */}
                {step === "detect" && (
                    <DetectStep
                        previewUrl={previewUrl}
                        isAnalyzing={isAnalyzing}
                        detectedItems={detectedItems}
                        onConfirm={() => setStep("confirm")}
                        onUpdateItem={handleUpdateItem}
                        onEditItem={setEditingItem}
                        editingItem={editingItem}
                        setEditingItem={setEditingItem}
                        handleSaveEdit={handleSaveEdit}
                        handleDeleteItem={handleDeleteItem}
                    />
                )}

                {/* Step 3: Confirm */}
                {step === "confirm" && (
                    <ConfirmStep
                        detectedItems={detectedItems}
                        setDetectedItems={setDetectedItems}
                        onEditLabel={handleEditLabel}
                        onDeleteItem={handleDeleteItem}
                        onSave={handleConfirmSave}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
