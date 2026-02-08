"use client";

import { Typography } from '@/components/elements/Typography';
import { Icon } from '@/components/elements/Icon';

const HOUSEHOLD_OPTIONS = [
  { value: 1, label: '1인', icon: 'User' },
  { value: 2, label: '2인', icon: 'Users' },
  { value: 3, label: '3인', icon: 'Users' },
  { value: 4, label: '4인 이상', icon: 'UserPlus' },
];

interface HouseholdStepProps {
  value: number | null;
  onChange: (value: number) => void;
}

export const HouseholdStep = ({ value, onChange }: HouseholdStepProps) => {
  return (
    <>
      <div className="mb-6 text-center space-y-2">
        <Typography variant="h3" weight="bold" className="text-slate-900 leading-tight">
          몇 명을 위한 식사를<br />준비하시나요?
        </Typography>
        <Typography variant="caption" className="text-slate-400 font-medium whitespace-pre-line">
          인원에 따라 메뉴 구성이 달라져요.{"\n"}
          설정은 언제든 변경할 수 있어요.
        </Typography>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {HOUSEHOLD_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3
              ${value === option.value
                ? 'border-purple-600 bg-purple-50'
                : 'border-slate-50 bg-white hover:border-purple-100 shadow-sm shadow-slate-200/50'
              }
            `}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 flex items-center justify-center">
                <Icon
                  name={option.icon as any}
                  size={40}
                  className={value === option.value ? 'text-purple-600' : 'text-slate-300'}
                />
              </div>
              <Typography
                variant="body2"
                weight="bold"
                className={value === option.value ? 'text-purple-600' : 'text-slate-600'}
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
