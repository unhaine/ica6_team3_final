"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { Typography } from "@/components/elements";
import { Icon } from "@/components/elements/Icon";
import { COOKING_SITUATION_OPTIONS, COOKING_STYLE_OPTIONS } from "@/data/constants/cookingSituations";

const HOUSEHOLD_OPTIONS = [
  { value: 1, label: '1인', imageSrc: '/images/household01.png' },
  { value: 2, label: '2인', imageSrc: '/images/household02.png' },
  { value: 3, label: '3인', imageSrc: '/images/household03.png' },
  { value: 4, label: '4인 이상', imageSrc: '/images/household04.png' },
];


const ALLERGY_OPTIONS = [
  { value: '계란', label: '계란' },
  { value: '우유', label: '우유' },
  { value: '땅콩', label: '땅콩' },
  { value: '갑각류', label: '갑각류' },
  { value: '밀', label: '밀' },
  { value: '대두', label: '대두' },
  { value: '견과류', label: '견과류' },
  { value: '생선', label: '생선' },
];

interface EditSurveyModalProps {
  isOpen: boolean;
  type: 'household' | 'allergies' | 'cookingPreference';
  currentValue: number | string[] | string | null;
  onClose: () => void;
  onSave: (value: number | string[] | string) => void;
}

export const EditSurveyModal = ({
  isOpen,
  type,
  currentValue,
  onClose,
  onSave
}: EditSurveyModalProps) => {
  const [householdSize, setHouseholdSize] = useState<number | null>(
    type === 'household' ? (currentValue as number | null) : null
  );
  const [allergies, setAllergies] = useState<string[]>(
    type === 'allergies' ? (currentValue as string[] || []) : []
  );
  const [cookingPreference, setCookingPreference] = useState<string | null>(
    type === 'cookingPreference' ? (currentValue as string | null) : null
  );
  const [customAllergy, setCustomAllergy] = useState("");


  useEffect(() => {
    if (type === 'household') {
      setHouseholdSize(currentValue as number | null);
    } else if (type === 'allergies') {
      setAllergies(currentValue as string[] || []);
    } else if (type === 'cookingPreference') {
      setCookingPreference(currentValue as string | null);
    }
  }, [type, currentValue]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (type === 'household') {
      if (!householdSize) {
        alert('인원을 선택해주세요.');
        return;
      }
      onSave(householdSize);
    } else if (type === 'allergies') {
      onSave(allergies);
    } else if (type === 'cookingPreference') {
      if (!cookingPreference) {
        alert('요리 선호를 선택해주세요.');
        return;
      }
      onSave(cookingPreference);
    }
  };

  const toggleAllergy = (allergy: string) => {
    if (allergies.includes(allergy)) {
      setAllergies(allergies.filter(a => a !== allergy));
    } else {
      setAllergies([...allergies, allergy]);
    }
  };

  const handleAddCustomAllergy = () => {
    const trimmed = customAllergy.trim();
    if (!trimmed) return;
    if (allergies.includes(trimmed)) {
      setCustomAllergy("");
      return;
    }
    setAllergies([...allergies, trimmed]);
    setCustomAllergy("");
  };


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Typography variant="h3" weight="bold" className="font-title">
            {type === 'household'
              ? '가구 인원 수정'
              : type === 'allergies'
                ? '알러지/비선호 수정'
                : '요리 선호 수정'}
          </Typography>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-active rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto p-6">
          {type === 'household' ? (
            <div className="space-y-4">
              <Typography variant="body1" color="secondary" className="mb-4">
                몇 명을 위한 요리를 하시나요?
              </Typography>
              <div className="grid grid-cols-2 gap-4">
                {HOUSEHOLD_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setHouseholdSize(option.value)}
                    className={`
                      relative p-6 rounded-2xl border-2 transition-all
                      ${householdSize === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-16 h-16">
                        <Image
                          src={option.imageSrc}
                          alt={option.label}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <Typography
                        variant="body1"
                        weight="semibold"
                        className={householdSize === option.value ? 'text-primary' : ''}
                      >
                        {option.label}
                      </Typography>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : type === 'allergies' ? (
            <div className="space-y-4">
              <Typography variant="body1" color="secondary" className="mb-4">
                못 먹는 재료를 선택해주세요.
              </Typography>
              <div className="grid grid-cols-3 gap-3">
                {ALLERGY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => toggleAllergy(option.value)}
                    className={`
                      py-3 px-2 rounded-full border-2 transition-all
                      ${allergies.includes(option.value)
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/30'
                      }
                    `}
                  >
                    <Typography
                      variant="caption"
                      weight={allergies.includes(option.value) ? 'semibold' : 'medium'}
                      className="whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {option.label}
                    </Typography>
                  </button>
                ))}

                {/* 직접 입력한 항목들 표시 */}
                {allergies.filter(a => !ALLERGY_OPTIONS.find(o => o.value === a)).map((custom) => (
                  <button
                    key={custom}
                    onClick={() => toggleAllergy(custom)}
                    className="py-3 px-2 rounded-full border-2 border-primary bg-primary/5 text-primary transition-all"
                  >
                    <Typography
                      variant="caption"
                      weight="semibold"
                      className="whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {custom}
                    </Typography>
                  </button>
                ))}
              </div>

              {/* 직접 입력 필드 */}
              <div className="pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customAllergy}
                    onChange={(e) => setCustomAllergy(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomAllergy();
                      }
                    }}
                    placeholder="재료 직접 입력 (예: 고수)"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:border-primary text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddCustomAllergy}
                    className="shrink-0 rounded-xl"
                  >
                    추가
                  </Button>
                </div>
              </div>
            </div>
          ) : type === 'cookingPreference' ? (
            <div className="space-y-4">
              <Typography variant="body1" color="secondary" className="mb-4">
                선호하는 요리 상황을 선택해주세요.
              </Typography>
              <div className="grid grid-cols-2 gap-4">
                {COOKING_STYLE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setCookingPreference(option.value)}
                    className={`
                      relative p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-4
                      ${cookingPreference === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-16 h-16">
                        <Image
                          src={option.imageSrc}
                          alt={option.label}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <Typography
                        variant="body1"
                        weight="semibold"
                        className={cookingPreference === option.value ? 'text-primary' : ''}
                      >
                        {option.label}
                      </Typography>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* 액션 버튼 */}
        <div className="p-6 pt-0 flex gap-3 border-t border-border">
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
