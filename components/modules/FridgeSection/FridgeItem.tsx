"use client";

import { PenLine, FileText, Check, AlertTriangle, AlertCircle } from "lucide-react";

import Image from "next/image";
import { ActionCard, DataRow } from "@/components/elements";
import { FridgeItem as FridgeItemType } from "../../../hooks/useFridge";
import { getIngredientIcon } from "@/lib/getIngredientIcon";

interface FridgeItemProps {
  item: FridgeItemType;
  isSelected?: boolean;
  onToggle?: (id: string) => void;
  onEdit: (item: FridgeItemType) => void;
  onUse: (item: FridgeItemType) => void;
}

export const FridgeItem = ({ item, isSelected = false, onToggle, onEdit, onUse }: FridgeItemProps) => {
  const diffDays = (() => {
    if (!item.expiryDate) return null;
    const expiry = new Date(item.expiryDate);
    const now = new Date();
    expiry.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  })();

  const isExpired = diffDays !== null && diffDays < 0;
  const isUrgent = diffDays !== null && diffDays >= 0 && diffDays <= 3;
  const isWarning = diffDays !== null && diffDays >= 4 && diffDays <= 7;

  let bgClass = "bg-white border-gray-100";
  if (isExpired || isUrgent) bgClass = "bg-red-100 border-red-200";
  else if (isWarning) bgClass = "bg-orange-100 border-orange-200";

  return (
    <ActionCard className={`overflow-hidden border shadow-sm rounded-xl py-0 transition-colors ${bgClass}`}>
      <DataRow
        className="px-2"
        left={
          <div className="flex items-center gap-3">
            {onToggle && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(item.id);
                }}
                className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "border-orange-500 bg-orange-500 text-white" : "border-gray-300 bg-white"
                  }`}
              >
                {isSelected && (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                )}
              </button>
            )}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden relative shrink-0 ${isExpired || isUrgent || isWarning ? '' : ''}`}>
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

            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md ${(() => {
              if (isExpired) return 'bg-red-200 text-red-600 font-bold'; // 지남
              if (isUrgent) return 'bg-red-100 text-red-500 font-bold'; // 임박
              if (isWarning) return 'bg-orange-200 text-orange-500'; // 주의
              return 'bg-gray-100 text-gray-500'; // 안전
            })()}`}>
              {(isExpired || isUrgent) && <AlertTriangle className="w-3 h-3 text-red-500" />}
              {isWarning && <AlertCircle className="w-3 h-3 text-orange-500" />}
              {(() => {
                if (diffDays === null) return '기한미정';
                if (diffDays === 0) return '오늘까지';
                if (diffDays < 0) return `D+${Math.abs(diffDays)}`;
                return `D-${diffDays}`;
              })()}
            </span>
          </div>
        }
        subTitle={
          <span className={`text-xs font-bold ${item.quantity ? 'text-gray-500' : 'text-primary'}`}>
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
          </div>
        }
      />
    </ActionCard>
  );
};
