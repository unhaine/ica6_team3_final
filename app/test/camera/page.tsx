"use client";

import { useRouter } from "next/navigation";
import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { IconButton } from "@/components/elements";
import { AnimatePresence } from "framer-motion";
import { CaptureStep } from "./components/CaptureStep";
import { DetectStep } from "./components/DetectStep";
import { ConfirmStep } from "./components/ConfirmStep";
import { useCamera } from "./useCamera";

export default function CameraTestPage() {
    const router = useRouter();
    const {
        step,
        setStep,
        previewUrl,
        isAnalyzing,
        detectedItems,
        setDetectedItems,
        editingItem,
        setEditingItem,
        handleImageChange,
        handleUpdateItem,
        handleDeleteItem,
        handleEditLabel,
        handleSaveEdit,
        handleConfirmSave,
    } = useCamera();
    
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
