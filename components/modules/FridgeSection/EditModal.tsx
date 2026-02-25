"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Typography } from "@/components/elements";

interface EditModalProps {
  isOpen: boolean;
  item: {
    id: string;
    name: string;
    quantity: string | null;
    expiryDate?: Date | string | null;
  } | null;
  onClose: () => void;
  onSave: (id: string, name: string, quantity: string, expiryDate?: string) => void;
}

export const EditModal = ({ isOpen, item, onClose, onSave }: EditModalProps) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  // item 변경 시 state 업데이트
  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setQuantity(item.quantity || "");

      // expiryDate가 있으면 YYYY-MM-DD 형식으로 변환하여 설정
      if (item.expiryDate) {
        try {
          const date = new Date(item.expiryDate);
          if (!isNaN(date.getTime())) {
            setExpiryDate(date.toISOString().split('T')[0]);
          } else {
            setExpiryDate("");
          }
        } catch (e) {
          setExpiryDate("");
        }
      } else {
        setExpiryDate("");
      }
    } else {
      // 새 항목 추가 시 초기화
      setName("");
      setQuantity("");
      setExpiryDate("");
    }
  }, [item]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) {
      alert("재료 이름을 입력해주세요.");
      return;
    }
    // expiryDate를 Date 객체나 string으로 전달
    onSave(item?.id || "", name.trim(), quantity.trim(), expiryDate);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="p-6 flex items-center justify-between">
          <Typography variant="h3" weight="bold">
            {item?.id ? "재료 수정" : "재료 추가"}
          </Typography>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-active rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* 본문 */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Typography variant="caption" weight="bold" color="secondary" className="uppercase tracking-wider">
              재료 이름
            </Typography>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 우유"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Typography variant="caption" weight="bold" color="secondary" className="uppercase tracking-wider">
              수량
            </Typography>
            <Input
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="예: 500g, 2개, 1L"
              className="h-12"
            />
            <Typography variant="caption" color="tertiary" className="ml-1">
              예: 500g, 2개, 1L, 1통 등
            </Typography>
          </div>

          <div className="space-y-2">
            <Typography variant="caption" weight="bold" color="secondary" className="uppercase tracking-wider">
              유통기한 (선택)
            </Typography>
            <Input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="h-12"
            />
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="p-6 pt-0 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12"
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            variant="default"
            className="flex-1 h-12"
            onClick={handleSave}
          >
            저장
          </Button>
        </div>
      </div>
    </div>
  );
};
