"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Typography } from '@/components/elements/Typography';
import { ActionButton } from '@/components/elements/ActionButton';
import { Icon } from '@/components/elements/Icon';
import { toast } from 'sonner';
import { COOKING_SITUATION_OPTIONS } from '@/data/constants/cookingSituations';

const HOUSEHOLD_OPTIONS = [
  { value: 1, label: '1인', icon: 'User' },
  { value: 2, label: '2인', icon: 'Users' },
  { value: 3, label: '3인', icon: 'Users' },
  { value: 4, label: '4인+', icon: 'UserPlus' },
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

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1); // 1: 인원, 2: 알러지, 3: 요리 선호
  const [householdSize, setHouseholdSize] = useState<number | null>(null);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [cookingPreference, setCookingPreference] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  // 로그인 여부 및 설문조사 완료 여부 확인
  useEffect(() => {
    const checkSurveyStatus = async () => {
      console.log('[Onboarding] Status:', status);
      console.log('[Onboarding] Session:', session);

      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        // 로그인하지 않은 경우 로그인 페이지로 이동
        console.log('[Onboarding] Unauthenticated, redirecting to login');
        router.push('/login');
        return;
      }

      if (session?.user?.email) {
        try {
          console.log('[Onboarding] Checking survey status for:', session.user.email);
          // 사용자의 설문조사 완료 여부 확인
          const response = await fetch('/api/user/profile');
          console.log('[Onboarding] Profile API response status:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('[Onboarding] Profile data:', data);
            if (data.user?.surveyCompleted) {
              // 이미 설문조사를 완료한 경우 홈으로 이동
              console.log('[Onboarding] Survey already completed, redirecting to /test');
              router.push('/test'); // 임시로 테스트 페이지로 이동
              return;
            }
          } else {
            // 404나 401 에러는 정상 - 신규 사용자이거나 DB에 아직 없는 경우
            console.log('[Onboarding] Profile not found or unauthorized - proceeding with survey');
          }
        } catch (error) {
          console.error('[Onboarding] Failed to check survey status:', error);
          // 에러가 발생해도 설문조사는 진행
        }
      }

      console.log('[Onboarding] Loading complete, showing survey');
      setIsLoading(false);
    };

    checkSurveyStatus();
  }, [session, status, router]);

  const handleSkip = async () => {
    // 건너뛰기: 설문조사 완료 처리 (데이터 없이)
    try {
      const response = await fetch('/api/user/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skip: true,
        }),
      });

      if (response.ok) {
        router.push('/test'); // 임시로 테스트 페이지로 이동
      } else {
        toast.error('건너뛰기 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Skip error:', error);
      toast.error('건너뛰기 처리 중 오류가 발생했습니다.');
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!householdSize) {
        toast.error('인원을 선택해주세요.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (!cookingPreference) {
        toast.error('요리 선호를 선택해주세요.');
        return;
      }
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/user/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          householdSize,
          allergies,
          cookingPreference,
        }),
      });

      if (response.ok) {
        toast.success('설문조사가 완료되었습니다!');
        router.push('/test'); // 임시로 테스트 페이지로 이동
      } else {
        const error = await response.json();
        toast.error(error.message || '설문조사 저장 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Survey submission error:', error);
      toast.error('설문조사 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAllergy = (allergy: string) => {
    if (allergies.includes(allergy)) {
      setAllergies(allergies.filter(a => a !== allergy));
    } else {
      setAllergies([...allergies, allergy]);
    }
  };

  // 로딩 중
  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Typography variant="body1" color="muted">
          잠시만 기다려주세요...
        </Typography>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col max-w-md mx-auto w-full shadow-sm">
      {/* Header with Skip Button */}
      <div className="flex justify-between items-center p-6">
        <div className="w-20" /> {/* Spacer for centering */}

        {/* Step Indicator */}
        <div className="flex gap-2">
          <div className={`w-2 h-2 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`w-2 h-2 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`w-2 h-2 rounded-full transition-colors ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
        </div>

        <button
          onClick={handleSkip}
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          건너뛰기
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 py-12">
        {step === 1 && (
          <>
            <div className="mb-12">
              <Typography variant="h2" weight="bold" className="mb-2">
                몇 명을 위한
              </Typography>
              <Typography variant="h2" weight="bold">
                요리를 하시나요?
              </Typography>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {HOUSEHOLD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setHouseholdSize(option.value)}
                  className={`
                    relative p-8 rounded-3xl border-2 transition-all
                    ${householdSize === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-4">
                    <Icon
                      name={option.icon as any}
                      size={64}
                      className={householdSize === option.value ? 'text-primary' : 'text-muted-foreground'}
                    />
                    <Typography
                      variant="h4"
                      weight="semibold"
                      className={householdSize === option.value ? 'text-primary' : ''}
                    >
                      {option.label}
                    </Typography>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-12">
              <Typography variant="h2" weight="bold" className="mb-2">
                못 먹는 재료가
              </Typography>
              <Typography variant="h2" weight="bold">
                있나요?
              </Typography>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {ALLERGY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleAllergy(option.value)}
                  className={`
                    py-4 px-6 rounded-full border-2 transition-all
                    ${allergies.includes(option.value)
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/30'
                    }
                  `}
                >
                  <Typography
                    variant="body1"
                    weight={allergies.includes(option.value) ? 'semibold' : 'medium'}
                  >
                    {option.label}
                  </Typography>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="mb-12">
              <Typography variant="h2" weight="bold" className="mb-2">
                선호하는 요리 상황을
              </Typography>
              <Typography variant="h2" weight="bold">
                선택해주세요
              </Typography>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {COOKING_SITUATION_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => setCookingPreference(option)}
                  className={`
                    py-4 px-6 rounded-xl border-2 transition-all text-left
                    ${cookingPreference === option
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/30'
                    }
                  `}
                >
                  <Typography
                    variant="body1"
                    weight={cookingPreference === option ? 'semibold' : 'medium'}
                  >
                    {option}
                  </Typography>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Bottom Button */}
        <div className="mt-auto">
          <ActionButton
            size="lg"
            variant="default"
            className="w-full h-14 text-lg font-semibold rounded-2xl"
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {step === 1 ? '다음' : step === 2 ? '다음' : step === 3 ? '완료' : '시작하기'}
          </ActionButton>
        </div>
      </div>
    </main>
  );
}
