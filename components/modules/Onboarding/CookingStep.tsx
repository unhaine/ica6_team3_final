"use client";

import Image from 'next/image';
import { Typography } from '@/components/elements/Typography';
import { COOKING_STYLE_OPTIONS } from '@/data/constants/cookingSituations';


interface CookingStepProps {
  value: string | null;
  onChange: (value: string) => void;
}

export const CookingStep = ({ value, onChange }: CookingStepProps) => {
  return (
    <>
      <div className="mb-10 text-center space-y-3">
        <Typography variant="h3" weight="bold" className="text-slate-900 leading-tight" style={{ fontFamily: 'var(--font-title)' }}>
          어떤 요리 스타일을<br />선호하세요?
        </Typography>
        <Typography variant="caption" className="text-slate-400 font-medium whitespace-pre-line leading-relaxed">
          가장 중요하게 생각하는 요리 기준을 선택해 주세요.{"\n"}
          설정은 마이메뉴에서 언제든 변경할 수 있어요.
        </Typography>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {COOKING_STYLE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              relative p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-4
              ${value === option.value
                ? 'border-primary bg-primary/5'
                : 'border-slate-50 bg-white hover:border-primary/10 shadow-sm shadow-slate-200/50'
              }
            `}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-24 h-24">
                <Image
                  src={option.imageSrc}
                  alt={option.label}
                  fill
                  className="object-contain" // 이미지 비율 유지
                />
              </div>
              <Typography
                variant="body2"
                weight="bold"
                className={value === option.value ? 'text-primary' : 'text-slate-600'}
              >
                {option.label}
              </Typography>
            </div>
          </button>
        ))}
      </div>
    </>
  );
};
