"use client";

import { use } from "react";
import { Clock, ChefHat, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/Checkbox";
import { Separator } from "@/components/ui/Separator";
import { AppHeader } from "@/components/modules/AppHeader";
import { AvatarThumbnail } from "@/components/elements/AvatarThumbnail";
import { Typography } from "@/components/elements/Typography";
import { RatingStars } from "@/components/elements/RatingStars";
import { DataRow } from "@/components/elements/DataRow";

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  // Unwrap params using React.use()
  use(params);

  // Mock Data
  const recipe = {
    title: "김치 볶음밥",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    time: "10분",
    difficulty: "쉬움",
    servings: "2인분",
    ingredients: [
      { name: "김치", amount: "1컵", inStock: true },
      { name: "밥", amount: "2공기", inStock: true },
      { name: "대파", amount: "1줌", inStock: false },
      { name: "참기름", amount: "1큰술", inStock: true }
    ],
    steps: [
       "달궈진 팬에 기름을 두르고 대파를 볶아 파기름을 냅니다.",
       "김치를 넣고 달달 볶다가 설탕을 조금 넣어줍니다.",
       "밥을 넣고 뭉치지 않게 잘 섞어가며 볶아줍니다.",
       "마지막으로 참기름을 둘러 마무리합니다."
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      <AppHeader transparent showBack onBack={() => router.back()} className="fixed top-0 left-0 right-0 z-50 text-white" />

      {/* Hero Image */}
      <div className="w-full h-80 relative shrink-0">
         <AvatarThumbnail 
            src={recipe.image}
            alt={recipe.title}
            shape="square"
            className="w-full h-full"
         />
         <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/30" />
         <div className="absolute bottom-8 left-6 text-white pr-6">
            <Typography variant="h3" weight="bold" className="mb-2 leading-tight">{recipe.title}</Typography>
            <div className="flex items-center gap-2">
                <RatingStars rating={recipe.rating} className="text-yellow-400" />
                <span className="text-sm font-medium opacity-90">({recipe.rating})</span>
            </div>
         </div>
      </div>

      <div className="px-6 py-8 -mt-6 bg-white rounded-t-[32px] relative z-20 flex flex-col gap-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
         {/* Meta Info */}
         <div className="flex justify-between items-center py-4 px-6 bg-gray-50 rounded-2xl">
            <MetaItem icon={<Clock />} label={recipe.time} />
            <div className="w-px h-8 bg-gray-200" />
            <MetaItem icon={<ChefHat />} label={recipe.difficulty} />
            <div className="w-px h-8 bg-gray-200" />
            <MetaItem icon={<User />} label={recipe.servings} />
         </div>

         {/* Ingredients */}
         <div>
            <div className="flex items-center justify-between mb-4">
                <Typography variant="h6" weight="bold">준비 재료</Typography>
                <Typography variant="caption" className="text-gray-400">4개 재료</Typography>
            </div>
            <div className="space-y-0 divide-y divide-gray-50">
                {recipe.ingredients.map((ing, idx) => (
                    <DataRow 
                        key={idx}
                        left={<Checkbox defaultChecked={ing.inStock} className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" />}
                        className="py-3"
                    >
                        <div className="flex justify-between w-full pl-1">
                             <span className={ing.inStock ? "font-medium text-gray-800" : "text-gray-400 line-through decoration-gray-400"}>
                                {ing.name}
                             </span>
                             <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 font-medium">{ing.amount}</span>
                                {!ing.inStock && (
                                    <Badge variant="destructive" className="text-[10px] h-5 px-1.5 rounded-md">부족</Badge>
                                )}
                             </div>
                        </div>
                    </DataRow>
                ))}
            </div>
         </div>

         <Separator className="bg-gray-100" />

         {/* Steps */}
         <div>
            <Typography variant="h6" weight="bold" className="mb-6">조리 순서</Typography>
            <div className="space-y-8">
                {recipe.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 group">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm ring-4 ring-white shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                            {idx + 1}
                        </div>
                        <Typography variant="body2" className="pt-1 text-gray-700 leading-relaxed text-[15px]">
                            {step}
                        </Typography>
                    </div>
                ))}
            </div>
         </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 max-w-md mx-auto z-50 pb-8">
           <Button size="lg" className="w-full font-bold h-14 text-lg rounded-xl shadow-lg shadow-primary/25">
               요리 시작하기
           </Button>
      </div>
    </div>
  )
}

const MetaItem = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <div className="flex flex-col items-center gap-1.5 min-w-[60px]">
        <div className="text-gray-400 [&>svg]:w-5 [&>svg]:h-5">{icon}</div>
        <span className="text-xs font-bold text-gray-700">{label}</span>
    </div>
)
