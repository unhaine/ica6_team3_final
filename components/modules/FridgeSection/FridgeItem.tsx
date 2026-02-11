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
        title={
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">{item.name}</span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-md">
              {(() => {
                const created = new Date(item.createdAt);
                const now = new Date();
                created.setHours(0, 0, 0, 0);
                now.setHours(0, 0, 0, 0);
                const diffTime = now.getTime() - created.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 0) return '오늘';
                return `D+${diffDays}`;
              })()}
            </span>
          </div>
        }
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
