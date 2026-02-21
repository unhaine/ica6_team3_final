"use client";

import React from "react";

import Image from "next/image";
import { Typography, ActionButton } from "@/components/elements";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { getIngredientIcon } from "@/lib/getIngredientIcon";

import { useUrgentIngredients } from "@/hooks/useUrgentIngredients";

export function RefrigeratorToday() {
    const router = useRouter();
    const { items, isLoading } = useUrgentIngredients();

    // 빈 상태 보여주기 (로딩중이거나 아이템이 없을 때)
    if (!isLoading && items.length === 0) {
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-1.5 px-1">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <Typography variant="body2" weight="bold" className="text-gray-800">
                        먼저 먹어야하는 재료
                    </Typography>
                </div>

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
                    onClick={() => router.push("/camera")}
                >
                    재료 채우러 가기
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
                {items.map((item, idx) => {
                    const expiry = new Date(item.expiryDate!);
                    const now = new Date();
                    expiry.setHours(0, 0, 0, 0);
                    now.setHours(0, 0, 0, 0);
                    const diffTime = expiry.getTime() - now.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    return (
                        <div key={item.id} className="flex flex-col items-center gap-1" onClick={() => router.push('/fridge')}>
                            <div className="w-11 h-11 rounded-2xl flex flex-col items-center justify-center bg-purple-50 border border-purple-100/50 overflow-hidden relative shrink-0">
                                {(() => {
                                    const iconUrl = getIngredientIcon(item.name);
                                    if (iconUrl) {
                                        return (
                                            <div className="p-1 w-full h-full relative">
                                                <Image
                                                    src={iconUrl}
                                                    alt={item.name}
                                                    fill
                                                    className="object-contain p-1.5"
                                                    sizes="44px"
                                                />
                                            </div>
                                        );
                                    }
                                    return (
                                        <span className="text-xl">
                                            {/* Category based emoji fallback */}
                                            {item.category === 'meat' ? '🥩' :
                                                item.category === 'vegetable' ? '🥬' :
                                                    item.category === 'fruit' ? '🍎' :
                                                        item.category === 'seafood' ? '🐟' :
                                                            item.category === 'dairy' ? '🥛' : '🍱'}
                                        </span>
                                    );
                                })()}
                            </div>
                            <div className="text-center flex flex-col -space-y-0.5">
                                <Typography
                                    variant="caption"
                                    weight="bold"
                                    className={`text-[10px]
                                        ${diffDays <= 3 ? 'text-red-500' :
                                            diffDays <= 7 ? 'text-orange-500' :
                                                'text-blue-500'}
                                    `}
                                >
                                    {diffDays < 0 ? `D+${Math.abs(diffDays)}` : diffDays === 0 ? "D-Day" : `D-${diffDays}`}
                                </Typography>
                                <Typography variant="caption" color="secondary" className="text-[10px] truncate w-12 text-center">
                                    {item.name}
                                </Typography>
                            </div>
                        </div>
                    );
                })}
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
