"use client";

import { Typography, ActionButton, Spinner } from '@/components/elements';
import { 
  OnboardingHeader, 
  HouseholdStep, 
  AllergyStep, 
  CookingStep,
  useOnboarding
} from '@/components/modules/Onboarding';

export default function OnboardingPage() {
  const {
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
  } = useOnboarding();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <Typography variant="body1" color="secondary">
          잠시만 기다려주세요...
        </Typography>
      </main>
    );
  }

  return (
    <main className="h-dvh bg-white text-slate-900 flex flex-col max-w-md mx-auto w-full relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-20%] w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute top-[20%] right-[-10%] w-72 h-72 bg-emerald-50/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[10%] left-[-10%] w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10" />

      <OnboardingHeader 
        currentStep={step} 
        totalSteps={3} 
        onSkip={handleSkip} 
      />

      <div className="flex-1 flex flex-col px-6 pt-4 pb-10 overflow-y-auto scrollbar-hide">
        <div className="flex-1 flex flex-col justify-center">
          {step === 1 && (
            <HouseholdStep 
              value={householdSize} 
              onChange={setHouseholdSize} 
            />
          )}

          {step === 2 && (
            <AllergyStep 
              selectedAllergies={allergies} 
              onToggle={toggleAllergy} 
            />
          )}

          {step === 3 && (
            <CookingStep 
              value={cookingPreference} 
              onChange={setCookingPreference} 
            />
          )}
        </div>

        {/* Bottom Button */}
        <div className="mt-8 pt-4">
          <ActionButton
            size="lg"
            fullWidth
            className="h-14 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleNext}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {step === 3 ? '시작하기' : '다음'}
          </ActionButton>
        </div>
      </div>
    </main>
  );
}

