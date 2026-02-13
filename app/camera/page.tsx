"use client";

import { useRouter } from "next/navigation";
import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { IconButton } from "@/components/elements";
import { AlertModal } from "@/components/elements/AlertModal";
import { AnimatePresence } from "framer-motion";
import { CaptureStep, DetectStep, ConfirmStep } from "@/components/modules/CameraSection";
import { useCamera } from "@/hooks/useCamera";

export default function CameraPage() {
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
        showDuplicateAlert,
        setShowDuplicateAlert,
        duplicateMessage,
        handleForceSave,
    } = useCamera();

    // 1. 헤더 및 푸터 제어
    useHeader({
        isVisible: false, // 모든 단계에서 커스텀 헤더 사용
    });

    useFooter({
        isVisible: false, // 카메라 페이지는 전체 화면 스펙이므로 푸터 숨김
    });

    return (
        <div className="flex-1 flex flex-col bg-purple-800 overflow-hidden relative">
            <AnimatePresence mode="wait">
                {/* Step 1: Capture */}
                {step === "capture" && (
                    <CaptureStep
                        onImageChange={handleImageChange}
                        onClose={() => router.push("/fridge")}
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
                        onBack={() => setStep("capture")}
                        onClose={() => router.push("/fridge")}
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

            <AlertModal
                isOpen={showDuplicateAlert}
                title="중복 아이템 감지"
                message={duplicateMessage}
                confirmLabel="저장하기"
                cancelLabel="취소"
                onConfirm={handleForceSave}
                onClose={() => setShowDuplicateAlert(false)}
            />
        </div>
    );
}
