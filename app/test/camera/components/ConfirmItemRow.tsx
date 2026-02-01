import { DataRow } from "@/components/elements";
import { Edit2, Trash2 } from "lucide-react";
import { DetectedItem } from "./types";

interface ConfirmItemRowProps {
    item: DetectedItem;
    onEdit: () => void;
    onDelete: () => void;
}

export const ConfirmItemRow = ({ item, onEdit, onDelete }: ConfirmItemRowProps) => {
    return (
        <DataRow
            className="bg-surface rounded-2xl shadow-sm border border-border"
            left={
                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-xl">
                    🥗
                </div>
            }
            title={item.label}
            subTitle={`확률 ${(item.confidence * 100).toFixed(0)}%`}
            right={
                <div className="flex items-center gap-1">
                    <button 
                        className="p-2 text-text-tertiary hover:text-primary transition-colors"
                        onClick={onEdit}
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                        className="p-2 text-text-tertiary hover:text-destructive transition-colors"
                        onClick={onDelete}
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            }
        />
    );
};
