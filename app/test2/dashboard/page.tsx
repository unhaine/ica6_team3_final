"use client";

import { Snowflake, IceCream, UtensilsCrossed, Milk } from "lucide-react";
import { TopAppBar } from "@/components/modules/TopAppBar";
import { FridgeStatusCard } from "@/components/modules/FridgeStatusCard";
import { RecipeCarousel } from "@/components/modules/RecipeCarousel";
import { Typography } from "@/components/elements/Typography";
import { IconButton } from "@/components/elements/IconButton";

// Mock Data for Recipes
const RECIPES = [
  { 
      id: "1", 
      title: "매운 두부 조림", 
      matchPercentage: 95, 
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80", 
      cookingTime: "20분", 
      rating: 4.5 
  },
  { 
      id: "2", 
      title: "버섯 볶음", 
      matchPercentage: 88, 
      imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=400&q=80", 
      cookingTime: "15분", 
      rating: 4.0 
  },
  { 
      id: "3", 
      title: "김치 볶음밥", 
      matchPercentage: 100, 
      imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=400&q=80", 
      cookingTime: "10분", 
      rating: 4.8 
  },
   { 
      id: "4", 
      title: "된장찌개", 
      matchPercentage: 75, 
      imageUrl: "https://images.unsplash.com/photo-1583089862943-e36696c4322b?auto=format&fit=crop&w=400&q=80", 
      cookingTime: "25분", 
      rating: 4.7 
  },
];

export default function MobileDashboard() {
  return (
    <div className="pb-20">
      <TopAppBar 
        // Using explicit undefined title implies "Logo Mode" if AppHeader supports it (based on my previous check, AppHeader does show Logo if title is missing)
        rightAction={<IconButton icon="Bell" variant="ghost" size="sm" ariaLabel="Notifications" />}
      />

      <div className="px-5 py-4 space-y-8">
        {/* Greeting Section */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
           <Typography variant="h5" weight="bold">안녕하세요, 태규님! 👨‍🍳</Typography>
           <Typography variant="body2" className="text-gray-500">오늘 소비해야 할 재료가 2개 있어요</Typography>
        </div>

        {/* Status Card */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <FridgeStatusCard 
                fillPercentage={80} 
                urgentItems={["우유", "두부"]}
            />
        </div>

        {/* Categories Grid */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <Typography variant="body1" weight="bold" className="mb-4">보관소별 보기</Typography>
            <div className="grid grid-cols-4 gap-2">
                <CategoryButton 
                    icon={<Snowflake className="w-6 h-6" />} 
                    label="냉장" 
                    bgClass="bg-blue-50" 
                    textClass="text-blue-500" 
                />
                <CategoryButton 
                    icon={<IceCream className="w-6 h-6" />} 
                    label="냉동" 
                    bgClass="bg-cyan-50" 
                    textClass="text-cyan-500" 
                />
                <CategoryButton 
                    icon={<UtensilsCrossed className="w-6 h-6" />} 
                    label="실온" 
                    bgClass="bg-orange-50" 
                    textClass="text-orange-500" 
                />
                <CategoryButton 
                    icon={<Milk className="w-6 h-6" />} 
                    label="조미료" 
                    bgClass="bg-purple-50" 
                    textClass="text-purple-500" 
                />
            </div>
        </div>
      </div>
      
      {/* Recipe Carousel */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <RecipeCarousel recipes={RECIPES} />
      </div>
    </div>
  );
}

// Helper Component for Categories
const CategoryButton = ({ 
    icon, 
    label, 
    bgClass, 
    textClass 
}: { 
    icon: React.ReactNode; 
    label: string; 
    bgClass: string; 
    textClass: string; 
}) => (
    <button className="flex flex-col items-center gap-2 group">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-active:scale-95 ${bgClass} ${textClass}`}>
            {icon}
        </div>
        <span className="text-xs font-semibold text-gray-600">{label}</span>
    </button>
);
