import { LoadingOverlay } from "@/components/elements";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { DetectedItem } from "./types";
import { SearchModal } from "@/components/modules/SearchModal";
import { SAMPLE_INGREDIENTS } from "@/data/mock/ingredients";

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
    handleDeleteItem
}: DetectStepProps) => {
    if (!previewUrl) return null;

    return (
        <motion.div 
            key="detect"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex-1 flex flex-col bg-black"
        >
            <div className="flex-1 relative bg-black flex items-center justify-center">
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

            <div className="p-6">
                <button 
                    className="w-full h-16 bg-primary rounded-2xl flex items-center justify-center relative active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100"
                    disabled={isAnalyzing}
                    onClick={onConfirm}
                >
                    <span className="font-bold text-white text-lg">결과 저장하기</span>
                    <ArrowRight className="absolute right-6 w-6 h-6 text-white" />
                </button>
            </div>
        </motion.div>
    );
};
