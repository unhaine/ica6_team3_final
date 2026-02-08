import { SearchModal } from "@/components/modules/SearchModal";
import { SAMPLE_INGREDIENTS } from "@/data/mock/ingredients";
import { DetectedItem } from "./types";

interface ConfirmModalsProps {
    activeModal: 'none' | 'edit' | 'add';
    selectedItem: DetectedItem | null;
    onClose: () => void;
    onSaveEdit: (newLabel: string, quantity: number) => void;
    onDelete: () => void;
    onSaveAdd: (label: string, quantity: number) => void;
}

export const ConfirmModals = ({
    activeModal,
    selectedItem,
    onClose,
    onSaveEdit,
    onDelete,
    onSaveAdd
}: ConfirmModalsProps) => {
    if (activeModal === 'none') return null;

    return (
        <>
            {activeModal === 'edit' && selectedItem && (
                <SearchModal
                    title="재료 수정"
                    initialValue={selectedItem.label}
                    initialQuantity={selectedItem.quantity}
                    data={SAMPLE_INGREDIENTS}
                    onClose={onClose}
                    onSave={onSaveEdit}
                    onDelete={onDelete}
                />
            )}
            {activeModal === 'add' && (
                <SearchModal
                    title="재료 추가"
                    placeholder="추가할 재료 검색..."
                    data={SAMPLE_INGREDIENTS}
                    onClose={onClose}
                    onSave={onSaveAdd}
                />
            )}
        </>
    );
};
