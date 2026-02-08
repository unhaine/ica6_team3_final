"use client";

import { Trash2, PenLine, FileText } from "lucide-react";

import { ActionCard, DataRow } from "@/components/elements";
import { FridgeItem as FridgeItemType } from "../../../hooks/useFridge";

interface FridgeItemProps {
  item: FridgeItemType;
  onEdit: (item: FridgeItemType) => void;
  onDelete: (id: string) => void;
  onUse: (item: FridgeItemType) => void;
}

export const FridgeItem = ({ item, onEdit, onDelete, onUse }: FridgeItemProps) => {
  return (
    <ActionCard className="bg-white overflow-hidden border border-gray-100 shadow-sm rounded-xl py-0">
      <DataRow
        className="px-2"
        left={
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl">
            {/* TODO: Emoji mapping based on category */}
            🧀
          </div>
        }
        title={<span className="font-bold text-gray-900">{item.name}</span>}
        subTitle={
          <span className={`text-xs font-bold ${item.quantity ? 'text-gray-500' : 'text-purple-600'}`}>
            {item.quantity || '입력필요'}
          </span>
        }
        right={
          <div className="flex items-center gap-1">
            <button 
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
            >
              <PenLine className="w-4 h-4" />
            </button>
            <button 
              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
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
