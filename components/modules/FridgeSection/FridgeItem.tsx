"use client";

import { Trash2, PenLine, FileText } from "lucide-react";

import Image from "next/image";
import { ActionCard, DataRow } from "@/components/elements";
import { FridgeItem as FridgeItemType } from "../../../hooks/useFridge";
import { getIngredientIcon } from "@/lib/getIngredientIcon";

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
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 overflow-hidden relative shrink-0">
            {(() => {
              const iconUrl = getIngredientIcon(item.name);
              if (iconUrl) {
                return (
                  <div className="p-1 w-full h-full relative">
                    <Image
                      src={iconUrl}
                      alt={item.name}
                      fill
                      className="object-contain p-1.5"
                      sizes="40px"
                    />
                  </div>
                );
              }
              return <span className="text-xl">🧀</span>;
            })()}
          </div>
        }
        title={
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">{item.name}</span>
            {/* New Badge: 24시간 이내 생성 */}
            {(() => {
              const created = new Date(item.createdAt);
              const now = new Date();
              const diffTime = now.getTime() - created.getTime();
              const diffHours = diffTime / (1000 * 60 * 60);
              if (diffHours < 24) {
                return (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-green-100 text-green-600 rounded-md animate-pulse">
                    New
                  </span>
                );
              }
              return null;
            })()}

            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${(() => {
              if (!item.expiryDate) return 'bg-gray-100 text-gray-500';

              const expiry = new Date(item.expiryDate);
              const now = new Date();
              expiry.setHours(0, 0, 0, 0);
              now.setHours(0, 0, 0, 0);
              const diffTime = expiry.getTime() - now.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              if (diffDays < 0) return 'bg-red-100 text-red-600 font-bold'; // 지남
              if (diffDays <= 3) return 'bg-red-50 text-red-500 font-bold'; // 임박
              if (diffDays <= 7) return 'bg-orange-50 text-orange-500'; // 주의
              return 'bg-gray-100 text-gray-500'; // 안전
            })()}`}>
              {(() => {
                if (!item.expiryDate) return '기한미정';

                const expiry = new Date(item.expiryDate);
                const now = new Date();
                expiry.setHours(0, 0, 0, 0);
                now.setHours(0, 0, 0, 0);
                const diffTime = expiry.getTime() - now.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 0) return '오늘까지';
                if (diffDays < 0) return `D+${Math.abs(diffDays)}`;
                return `D-${diffDays}`;
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
