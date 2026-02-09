"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export const useOnboarding = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1); // 1: 인원, 2: 알러지, 3: 요리 선호
  const [householdSize, setHouseholdSize] = useState<number | null>(null);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [cookingPreference, setCookingPreference] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 테스트 모드 플래그: true일 경우 인증 체크를 건너뜁니다.
  const IS_TEST_MODE = false;

  // 로그인 여부 및 설문조사 완료 여부 확인
  useEffect(() => {
    const checkSurveyStatus = async () => {
      if (IS_TEST_MODE) {
        setIsLoading(false);
        return;
      }

      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        router.push('/login');
        return;
      }

      if (session?.user?.email) {
        try {
          const response = await fetch('/api/user/profile');
          if (response.ok) {
            const data = await response.json();
            if (data.user?.surveyCompleted) {
              router.push('/home'); // 임시로 테스트 페이지로 이동
              return;
            }
          }
        } catch (error) {
          console.error('[Onboarding] Failed to check survey status:', error);
        }
      }
      setIsLoading(false);
    };

    checkSurveyStatus();
  }, [session, status, router, IS_TEST_MODE]);

  const handleSkip = async () => {
    try {
      if (IS_TEST_MODE) {
        router.push('/home');
        return;
      }

      const response = await fetch('/api/user/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skip: true }),
      });

      if (response.ok) {
        router.push('/home');
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
      if (IS_TEST_MODE) {
        toast.success('설문조사가 완료되었습니다! (테스트 모드)');
        router.push('/home');
        return;
      }

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
        router.push('/home');
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
    setAllergies((prev: string[]) => 
      prev.includes(allergy) 
        ? prev.filter((a: string) => a !== allergy) 
        : [...prev, allergy]
    );
  };

  return {
    step,
    householdSize,
    allergies,
    cookingPreference,
    isSubmitting,
    isLoading,
    setHouseholdSize,
    setCookingPreference,
    handleSkip,
    handleNext,
    toggleAllergy,
  };
}; 
