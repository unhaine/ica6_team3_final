"use client";

import { useRouter } from 'next/navigation';
import { Icon } from '@/components/elements/Icon';
import { Typography } from '@/components/elements/Typography';
import { ActionButton } from '@/components/elements/ActionButton';

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: 'Camera',
      title: '자동 인식',
      description: '냉장고를 찍으면\nAI가 자동으로 인식'
    },
    {
      icon: 'Bell',
      title: '유통기한 알림',
      description: '식재료 유통기한을\n미리 알려드려요'
    },
    {
      icon: 'BookOpen',
      title: '레시피 추천',
      description: '내 식재료로\n만들 수 있는 요리'
    }
  ];

  const foodEmojis = [
    { emoji: '🥕', top: '25%', left: '15%', delay: 0 },
    { emoji: '🍎', top: '20%', right: '15%', delay: 0.2 },
    { emoji: '🥚', bottom: '35%', left: '12%', delay: 0.4 },
    { emoji: '🥤', bottom: '30%', right: '12%', delay: 0.6 },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="ChefHat" className="text-primary" size={24} />
          </div>
          <Typography variant="h4" weight="bold" className="text-primary">
            냉파고수
          </Typography>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* Hero Section with Floating Food Emojis */}
        <div className="relative mb-12 w-full max-w-md aspect-square flex items-center justify-center">
          {/* Background Circle */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-[60px] backdrop-blur-sm" />
          
          {/* Food Emojis */}
          {foodEmojis.map((item, index) => (
            <div
              key={index}
              className="absolute text-5xl animate-float"
              style={{
                top: item.top,
                bottom: item.bottom,
                left: item.left,
                right: item.right,
                animationDelay: `${item.delay}s`,
              }}
            >
              <div className="bg-white rounded-full p-4 shadow-lg">
                {item.emoji}
              </div>
            </div>
          ))}

          {/* Center Camera Icon */}
          <div className="relative z-10 w-48 h-48 rounded-3xl border-4 border-primary/30 bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-xl">
            <Icon name="Camera" className="text-primary" size={80} strokeWidth={1.5} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <Typography variant="h1" weight="bold" className="mb-2 text-4xl">
            냉장고 파먹기,
          </Typography>
          <Typography variant="h1" weight="bold" className="text-4xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI로 3초 만에
          </Typography>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-6 mb-16 w-full max-w-lg">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Icon name={feature.icon as any} className="text-primary" size={28} />
              </div>
              <Typography variant="body2" weight="semibold" className="whitespace-pre-line">
                {feature.title}
              </Typography>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <ActionButton
          size="lg"
          variant="default"
          className="w-full max-w-md h-14 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
          onClick={() => router.push('/login')}
        >
          시작하기
        </ActionButton>
      </div>

      {/* Add floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
