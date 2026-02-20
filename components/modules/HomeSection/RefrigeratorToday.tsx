"use client";

import React from "react";

import Image from "next/image";
import { Typography, ActionButton } from "@/components/elements";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";



import { useUrgentIngredients } from "@/hooks/useUrgentIngredients";

export function RefrigeratorToday() {
    const router = useRouter();
<<<<<<< HEAD
    const [ingredients, setIngredients] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchUrgentIngredients = async () => {
            try {
                // 유통기한 임박한 재료 3개 조회
                const res = await fetch('/api/ingredients?sort=expiry&limit=3');
                const data = await res.json();

                if (data.success && Array.isArray(data.data)) {
                    const mapped = data.data.map((item: any) => {
                        const today = new Date();
                        const expiry = new Date(item.expiryDate);
                        // D-Day 계산
                        const diffTime = expiry.getTime() - today.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        // 이모지 매핑 (임시)
                        let emoji = "🥬";
                        if (item.category === "육류") emoji = "🥩";
                        if (item.category === "유제품") emoji = "🥛";
                        if (item.category === "과일") emoji = "🍎";

                        return {
                            name: item.name,
                            dDay: diffDays,
                            emoji: emoji
                        };
                    });
                    setIngredients(mapped);
                }
            } catch (error) {
                console.error("Failed to fetch urgent ingredients:", error);
            }
        };

        fetchUrgentIngredients();
    }, []);

    // 재료가 없으면 빈 상태 표시
    if (ingredients.length === 0) {
=======
    const { items, isLoading } = useUrgentIngredients();

    // 빈 상태 보여주기 (로딩중이거나 아이템이 없을 때)
    if (!isLoading && items.length === 0) {
>>>>>>> ee167defcafd346d324d02e5abb44f8f3334e61b
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-1.5 px-1">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <Typography variant="body2" weight="bold" className="text-gray-800">
                        먼저 먹어야하는 재료
                    </Typography>
                </div>
<<<<<<< HEAD
=======

>>>>>>> ee167defcafd346d324d02e5abb44f8f3334e61b
                <div className="flex flex-col items-center justify-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <span className="text-2xl mb-2">🥬</span>
                    <Typography variant="caption" className="text-gray-400 font-medium text-center">
                        냉장고가 비어있어요! <br />
                        재료를 추가해보세요.
                    </Typography>
                </div>

                {/* Action Button */}
                <ActionButton
                    variant="default"
                    fullWidth
                    size="sm"
                    className="h-10 rounded-xl text-sm font-bold bg-purple-600 text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all"
<<<<<<< HEAD
                    onClick={() => router.push("/home/refrigerator-cleanup")}
                >
                    오늘의 냉장고 파먹기
=======
                    onClick={() => router.push("/camera")}
                >
                    재료 채우러 가기
>>>>>>> ee167defcafd346d324d02e5abb44f8f3334e61b
                </ActionButton>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Section Title */}
            <div className="flex items-center gap-1.5 px-1">
                <div className="relative w-4 h-4">
                    <Image
                        src="/images/tool/Alarm.png"
                        alt="Alarm"
                        fill
                        className="object-contain"
                    />
                </div>
                <Typography variant="body2" weight="bold" className="text-gray-800">
                    먼저 먹어야하는 재료
                </Typography>
            </div>

            {/* Ingredients Grid */}
            <div className="flex justify-around items-start py-1">
                {ingredients.map((ingredient: any, idx: number) => (
                    <div key={idx} className="flex flex-col items-center gap-1">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-purple-50 border border-purple-100/50">
                            <span className="text-xl">{ingredient.emoji}</span>
                        </div>
<<<<<<< HEAD
                        <div className="text-center flex flex-col -space-y-0.5">
                            <Typography
                                variant="caption"
                                weight="bold"
                                className={`text-[10px]
                                    ${ingredient.dDay <= 3 ? 'text-red-500' :
                                        ingredient.dDay <= 7 ? 'text-orange-500' :
                                            'text-blue-500'}
                                `}
                            >
                                {ingredient.dDay === 0 ? "D-Day" : `D-${ingredient.dDay}`}
                            </Typography>
                            <Typography variant="caption" color="secondary" className="text-[10px]">
                                {ingredient.name}
                            </Typography>
                        </div>
                    </div>
                ))}
=======
                    );
                })}
>>>>>>> ee167defcafd346d324d02e5abb44f8f3334e61b
            </div>

            {/* Action Button */}
            <ActionButton
                variant="default"
                fullWidth
                size="sm"
                className="h-10 rounded-xl text-sm font-bold bg-purple-600 text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all"
                onClick={() => router.push("/home/refrigerator-cleanup")}
            >
                오늘의 냉장고 파먹기
            </ActionButton>
        </div>
    );
}
