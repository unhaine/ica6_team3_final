"use client";

import { Typography } from '@/components/elements/Typography';

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps: number;
  onSkip: () => void;
}

export const OnboardingHeader = ({ currentStep, totalSteps, onSkip }: OnboardingHeaderProps) => {
  return (
    <div className="flex justify-between items-center p-6">
      <div className="w-20" /> {/* Spacer for centering */}

      {/* Step Indicator */}
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`w-6 h-1.5 rounded-full transition-colors ${
              currentStep >= i + 1 ? 'bg-purple-700' : 'bg-slate-100'
            }`}
          />
        ))}
      </div>

      <button
        onClick={onSkip}
        className="text-slate-500 hover:text-purple-600 transition-colors text-sm font-medium"
      >
        건너뛰기
      </button>
    </div>
  );
};
