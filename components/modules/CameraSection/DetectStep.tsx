import { LoadingOverlay, Typography } from "@/components/elements";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { DetectedItem } from "./types";
import { SearchModal } from "@/components/modules/SearchModal";
import { SAMPLE_INGREDIENTS } from "@/data/mock/ingredients";
import { CameraHeader } from "./CameraHeader";

const BoundingBoxCanvas = dynamic(() => import("@/components/modules/BoundingBox"), {
    ssr: false,
});

interface DetectStepProps {
    previewUrl: string | null;
    isAnalyzing: boolean;
    detectedItems: DetectedItem[];
    onConfirm: () => void;
    onUpdateItem: (id: string, newBox: { x: number; y: number; width: number; height: number }) => void;
    onEditItem: (item: DetectedItem) => void;
    editingItem: DetectedItem | null;
    setEditingItem: (item: DetectedItem | null) => void;
    handleSaveEdit: (newLabel: string, quantity: number) => void;
    handleDeleteItem: (id: string) => void;
    onBack: () => void;
    onClose: () => void;
}

export const DetectStep = ({
    previewUrl,
    isAnalyzing,
    detectedItems,
    onConfirm,
    onUpdateItem,
    onEditItem,
    editingItem,
    setEditingItem,
    handleSaveEdit,
    handleDeleteItem,
    onBack,
    onClose
}: DetectStepProps) => {
    if (!previewUrl) return null;

    return (
        <motion.div 
            key="detect"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col relative bg-linear-to-b from-purple-900/40 via-black to-purple-900/40 overflow-hidden"
        >
            {/* Header */}
            <CameraHeader onBack={onBack} onClose={onClose} backIcon="arrow" />

            {/* Instruction Text */}
            <div className="text-center space-y-2 px-6 pb-2 pt-2 z-20">
                <Typography variant="h3" weight="bold" className="text-white drop-shadow-lg text-xl leading-tight">
                    라벨을 눌러서<br/>내용을 수정할 수 있어요
                </Typography>
            </div>

            {/* Viewfinder Area */}
            <div className="flex-1 w-full px-4 flex items-center justify-center relative z-10">
                <div className="w-full aspect-2/3 relative rounded-[32px] overflow-hidden border-2 border-white/20 shadow-2xl bg-black/50">
                    <LoadingOverlay isVisible={isAnalyzing} message="AI 분석 중..." />
                    <BoundingBoxCanvas
                        imageUrl={previewUrl}
                        items={detectedItems.map(item => ({
                            id: item.id,
                            label: item.label,
                            confidence: item.confidence,
                            isContainer: item.isContainer,
                            ...item.boundingBox
                        }))}
                        onUpdateItem={onUpdateItem}
                        onEditItem={(item) => {
                            const original = detectedItems.find(i => i.id === item.id);
                            if (original) onEditItem(original);
                        }}
                    />
                </div>
            </div>

            {/* Bottom Instruction Spacer (keeping layout consistent) */}
            <div className="text-center space-y-2 px-6 pb-2 pt-2 z-20">
                <Typography variant="body2" className="text-white/70 text-sm">
                    탐지된 재료가 정확한지 확인해주세요
                </Typography>
            </div>

            {/* Padding for Bottom Action Bar - adjusted to match CaptureStep's controls height (136px) */}
            <div className="h-[136px]" />

            <AnimatePresence>
                {editingItem && (
                    <SearchModal 
                        initialValue={editingItem.label}
                        initialQuantity={editingItem.quantity}
                        onClose={() => setEditingItem(null)}
                        onSave={handleSaveEdit}
                        onDelete={() => handleDeleteItem(editingItem.id)}
                        data={SAMPLE_INGREDIENTS}
                        title="재료 수정"
                        subtitle="이름을 변경하거나 삭제할 수 있습니다."
                        placeholder="재료 검색..."
                    />
                )}
            </AnimatePresence>

            {/* Bottom Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-12 pt-6 z-20 bg-linear-to-t from-black/90 to-transparent">
                <button 
                    className="w-full h-14 bg-white text-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100"
                    disabled={isAnalyzing}
                    onClick={onConfirm}
                >
                    <span className="font-bold text-lg">결과 저장하기</span>
                </button>
            </div>
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-3xl" />
        </motion.div>
    );
};
