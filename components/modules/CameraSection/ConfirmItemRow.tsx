import Image from "next/image";
import { ActionCard, DataRow } from "@/components/elements";
import { PenLine, Trash2 } from "lucide-react";
import { DetectedItem } from "./types";
import { getIngredientIcon } from "@/lib/getIngredientIcon";

interface ConfirmItemRowProps {
    item: DetectedItem;
    onEdit: () => void;
    onDelete: () => void;
}

export const ConfirmItemRow = ({ item, onEdit, onDelete }: ConfirmItemRowProps) => {
    return (
        <ActionCard className="bg-white overflow-hidden border border-gray-100 shadow-sm rounded-xl py-0">
            <DataRow
                className="px-2"
                left={
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 overflow-hidden relative shrink-0">
                        {(() => {
                            const iconUrl = getIngredientIcon(item.label);
                            if (iconUrl) {
                                return (
                                    <div className="p-1 w-full h-full relative">
                                        <Image
                                            src={iconUrl}
                                            alt={item.label}
                                            fill
                                            className="object-contain p-1.5"
                                            sizes="40px"
                                        />
                                    </div>
                                );
                            }
                            return <span className="text-xl">🥗</span>;
                        })()}
                    </div>
                }
                title={<span className="font-bold text-gray-900">{item.label}</span>}
                subTitle={
                    <span className="text-xs font-bold text-gray-400">
                        신뢰도 {(item.confidence * 100).toFixed(0)}%
                    </span>
                }
                right={
                    <div className="flex items-center gap-1">
                        <button
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                        >
                            <PenLine className="w-4 h-4" />
                        </button>
                        <button
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                }
            />
        </ActionCard>
    );
};
