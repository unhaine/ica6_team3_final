"use client";

import { Typography } from '@/components/elements/Typography';
import { SelectableChip } from '@/components/elements/SelectableChip';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/elements/Icon';

const ALLERGY_OPTIONS = [
  { value: '우유', label: '우유' },
  { value: '계란', label: '계란' },
  { value: '밀', label: '밀' },
  { value: '땅콩', label: '땅콩' },
  { value: '갑각류', label: '갑각류' },
  { value: '알콜', label: '알콜' },
  { value: '고등어', label: '고등어' },
  { value: '복숭아', label: '복숭아' },
  { value: '토마토', label: '토마토' },
  { value: '버섯', label: '버섯' },
];

interface AllergyStepProps {
  selectedAllergies: string[];
  onToggle: (allergy: string) => void;
}

export const AllergyStep = ({ selectedAllergies, onToggle }: AllergyStepProps) => {
  return (
    <>
      <div className="mb-8 text-center space-y-3">
        <Typography variant="h3" weight="bold" className="text-slate-900 leading-tight" style={{ fontFamily: 'var(--font-title)' }}>
          알레르기 재료를<br />선택해주세요
        </Typography>
        <Typography variant="caption" className="text-slate-400 font-medium whitespace-pre-line leading-relaxed">
          알레르기 재료는 이후 메뉴 추천에서 자동으로 제외돼요.{"\n"}
          설정은 마이메뉴에서 언제든 변경할 수 있어요.
        </Typography>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6 px-2">
        {ALLERGY_OPTIONS.map((option) => (
          <SelectableChip
            key={option.value}
            label={option.label}
            selected={selectedAllergies.includes(option.value)}
            onClick={() => onToggle(option.value)}
            size="sm"
            className={cn(
              "w-full justify-center py-2.5 text-xs transition-all rounded-full border",
              selectedAllergies.includes(option.value) 
                ? "bg-purple-600 border-purple-600 text-white shadow-sm shadow-purple-100" 
                : "bg-white border-slate-100 text-slate-500 hover:border-purple-100"
            )}
          />
        ))}
        {/* Plus Button */}
        <button className="w-full flex items-center justify-center py-2.5 bg-white border border-slate-100 rounded-full text-slate-300 hover:border-purple-200 transition-all">
          <Icon name="Plus" size={14} />
        </button>
      </div>
    </>
  );
};
