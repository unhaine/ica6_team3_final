import Image from 'next/image';
import { Typography } from '@/components/elements/Typography';
// import { Icon } from '@/components/elements/Icon'; // Icon not used anymore

const HOUSEHOLD_OPTIONS = [
  { value: 1, label: '1인', imageSrc: '/images/household01.png' },
  { value: 2, label: '2인', imageSrc: '/images/household02.png' },
  { value: 3, label: '3인', imageSrc: '/images/household03.png' },
  { value: 4, label: '4인 이상', imageSrc: '/images/household04.png' },
];

interface HouseholdStepProps {
  value: number | null;
  onChange: (value: number) => void;
}

export const HouseholdStep = ({ value, onChange }: HouseholdStepProps) => {
  return (
    <>
      <div className="mb-6 text-center space-y-2">
        <Typography variant="h3" weight="bold" className="text-slate-900 leading-tight" style={{ fontFamily: 'var(--font-title)' }}>
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
              relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 h-40
              ${value === option.value
                ? 'border-purple-600 bg-purple-50'
                : 'border-slate-50 bg-white hover:border-purple-100 shadow-sm shadow-slate-200/50'
              }
            `}
          >
            <div className="flex flex-col items-center gap-2">
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
