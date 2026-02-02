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
  } | null;
  onClose: () => void;
  onSave: (id: string, name: string, quantity: string) => void;
}

export const EditModal = ({ isOpen, item, onClose, onSave }: EditModalProps) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantity(item.quantity || "");
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSave = () => {
    if (!name.trim()) {
      alert("재료 이름을 입력해주세요.");
      return;
    }
    onSave(item.id, name.trim(), quantity.trim());
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
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Typography variant="h3" weight="bold">
            재료 수정
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
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              재료 이름
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 우유"
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              수량
            </label>
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
        </div>

        {/* 액션 버튼 */}
        <div className="p-6 pt-0 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            variant="default"
            className="flex-1"
            onClick={handleSave}
          >
            저장
          </Button>
        </div>
      </div>
    </div>
  );
};
