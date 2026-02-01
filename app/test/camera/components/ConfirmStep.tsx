import { Typography } from "@/components/elements";
import { Check, Plus, Utensils } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { DetectedItem } from "./types";
import { DataList } from "@/components/modules/DataList";
import { ConfirmItemRow } from "./ConfirmItemRow";
import { ConfirmModals } from "./ConfirmModals";

interface ConfirmStepProps {
    detectedItems: DetectedItem[];
    setDetectedItems: React.Dispatch<React.SetStateAction<DetectedItem[]>>;
    onEditLabel: (id: string, newLabel: string, quantity: number) => void;
    onDeleteItem: (id: string) => void;
    onSave: () => void;
    onRecommend?: () => void;
}

export const ConfirmStep = ({ 
    detectedItems, 
    setDetectedItems, 
    onEditLabel, 
    onDeleteItem, 
    onSave,
    onRecommend
}: ConfirmStepProps) => {
    const [activeModal, setActiveModal] = useState<'none' | 'edit' | 'add'>('none');
    const [selectedItem, setSelectedItem] = useState<DetectedItem | null>(null);

    const handleCloseModal = () => {
        setActiveModal('none');
        setSelectedItem(null);
    };

    return (
        <motion.div 
            key="confirm"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="flex-1 flex flex-col bg-surface-alt overflow-hidden"
        >
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3">
                    <div className="p-2 bg-emerald-500 rounded-full text-white">
                        <Check className="w-4 h-4" />
                    </div>
                    <Typography weight="bold" color="success">
                        총 {detectedItems.length}개의 재료를 불러왔습니다.
                    </Typography>
                </div>

                <DataList
                    data={detectedItems}
                    keyExtractor={(item) => item.id}
                    className="gap-3"
                    renderItem={(item) => (
                        <ConfirmItemRow 
                            item={item}
                            onEdit={() => {
                                setSelectedItem(item);
                                setActiveModal('edit');
                            }}
                            onDelete={() => onDeleteItem(item.id)}
                        />
                    )}
                    ListFooterComponent={
                        <button 
                            className="w-full py-4 border-2 border-dashed border-border rounded-2xl flex items-center justify-center gap-2 text-text-secondary hover:border-primary hover:text-primary transition-all active:scale-[0.98]"
                            onClick={() => setActiveModal('add')}
                        >
                            <Plus className="w-5 h-5" />
                            <span className="font-bold">재료 직접 추가</span>
                        </button>
                    }
                />
            </div>

            <div className="p-6 bg-surface border-t border-border flex gap-3">
                <button 
                    className="flex-1 h-14 rounded-2xl font-bold border border-border text-text-secondary hover:bg-surface-active relative flex items-center justify-center transition-colors active:scale-[0.98]"
                    onClick={() => {
                        if (onRecommend) onRecommend();
                        else alert("레시피 추천 기능 준비 중입니다.");
                    }}
                >
                    <Utensils className="absolute left-4 w-5 h-5" />
                    <span>레시피 추천</span>
                </button>
                
                <button 
                    className="flex-1 h-14 rounded-2xl font-bold bg-primary text-white relative flex items-center justify-center transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
                    onClick={onSave}
                >
                    <Check className="absolute left-4 w-5 h-5" />
                    <span>냉장고에 넣기</span>
                </button>
            </div>

            <AnimatePresence>
                <ConfirmModals 
                    activeModal={activeModal}
                    selectedItem={selectedItem}
                    onClose={handleCloseModal}
                    onSaveEdit={(newLabel, quantity) => {
                        if (selectedItem) onEditLabel(selectedItem.id, newLabel, quantity);
                        handleCloseModal();
                    }}
                    onDelete={() => {
                        if (selectedItem) onDeleteItem(selectedItem.id);
                        handleCloseModal();
                    }}
                    onSaveAdd={(label, quantity) => {
                        setDetectedItems(prev => [
                            ...prev, 
                            { 
                                id: `manual-${Date.now()}`, 
                                label, 
                                confidence: 1.0, 
                                quantity,
                                isContainer: false,
                                boundingBox: { x: 0.1, y: 0.1, width: 0.2, height: 0.2 } 
                            }
                        ]);
                        handleCloseModal();
                    }}
                />
            </AnimatePresence>
        </motion.div>
    );
};
