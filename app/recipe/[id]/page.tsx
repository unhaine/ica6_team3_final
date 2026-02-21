"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, Clock, Zap, Users, Bookmark, Share2, Star, ShoppingCart, Check, Search } from "lucide-react";
import { Typography, IconBox, ActionButton, Spinner, IconButton } from "@/components/elements";
import { useHeader } from "@/components/modules/Header";
import { cn } from "@/lib/utils";
import { CommerceModal, CommerceMultiModal } from "@/components/modules/CommerceModal";

interface IngredientItem {
    name: string;
    ingredientName: string;
    amount: string;
    isOwned: boolean;
    isUrgent?: boolean;
    imageUrl?: string | null;
}

interface IngredientSection {
    sectionTitle: string;
    items: IngredientItem[];
}

interface RecipeDetail {
    rcpSno: string;
    rcpTtl: string;
    ckgNm: string;
    ckgIpdc: string;
    ckgMtrlCn: string;
    rcpImgUrl: string;
    ckgMthActoNm: string;
    ckgStaActoNm: string;
    ckgMtrlActoNm: string;
    ckgKndActoNm: string;
    ckgInbunNm: string;
    ckgDodfNm: string;
    ckgTimeNm: string;
    steps: {
        stepId: number;
        stepDesc: string;
    }[];
    structuredIngredients?: IngredientSection[];
}

export default function RecipeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Shopping Modal State
    const [isCommerceModalOpen, setIsCommerceModalOpen] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState<string>("");
    const [isMultiModalOpen, setIsMultiModalOpen] = useState(false);

    // Custom Header
    useHeader({
        isVisible: true,
        transparent: true,
        title: "",
        left: (
            <IconButton
                icon="ChevronLeft"
                onClick={() => router.back()}
                className="bg-white/80 backdrop-blur-md rounded-full shadow-md hover:bg-white transition-colors text-gray-900"
                variant="ghost"
                ariaLabel="뒤로 가기"
            />
        ),
        right: (
            <div className="flex gap-2">
                <IconButton
                    icon="Bookmark"
                    className="bg-white/80 backdrop-blur-md rounded-full shadow-md hover:bg-white transition-colors text-gray-900"
                    variant="ghost"
                    ariaLabel="북마크 추가"
                />
                <IconButton
                    icon="Share2"
                    className="bg-white/80 backdrop-blur-md rounded-full shadow-md hover:bg-white transition-colors text-gray-900"
                    variant="ghost"
                    ariaLabel="공유하기"
                />
            </div>
        )
    });

    useEffect(() => {
        const fetchRecipe = async () => {
            if (!params?.id) return;
            try {
                const res = await fetch(`/api/recipes/${params.id}`);
                const data = await res.json();
                if (data.success) {
                    setRecipe(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch recipe:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecipe();
    }, [params?.id]);

    // Handle single ingredient shopping
    const handleShopIngredient = (name: string) => {
        setSelectedIngredient(name);
        setIsCommerceModalOpen(true);
    };

    // Calculate missing ingredients for "Shop All"
    const missingIngredients = useMemo(() => {
        if (!recipe?.structuredIngredients) return [];
        return recipe.structuredIngredients.flatMap(section =>
            section.items.filter(item => !item.isOwned).map(item => item.ingredientName)
        );
    }, [recipe]);

    const handleShopAllMissing = () => {
        setIsMultiModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <Spinner size="lg" color="primary" />
                    <Typography variant="body2" color="muted">레시피를 요리하는 중...</Typography>
                </div>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-6 bg-white">
                <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center">
                    <Zap className="w-10 h-10 text-orange-400" />
                </div>
                <div className="space-y-2">
                    <Typography variant="h2" weight="bold">레시피를 찾을 수 없어요</Typography>
                    <Typography variant="body1" color="muted">삭제되었거나 존재하지 않는 레시피입니다.</Typography>
                </div>
                <ActionButton size="lg" onClick={() => router.push('/home')}>홈으로 가기</ActionButton>
            </div>
        );
    }

    const tags = [
        recipe.ckgMthActoNm,
        recipe.ckgStaActoNm,
        recipe.ckgMtrlActoNm,
        recipe.ckgKndActoNm
    ].filter(Boolean);

    return (
        <div className="flex-1 overflow-y-auto bg-white scrollbar-hide pb-24">
            {/* 1. Header Hero Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-5 pt-4 pb-6 space-y-4"
            >
                {/* Ranking & Categories */}
                <div className="flex items-center gap-3">
                    <div className="bg-gray-100 flex items-center px-2 py-0.5 rounded-sm">
                        <Typography variant="caption" className="font-bold text-gray-500 text-[11px]">1순위</Typography>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <Typography variant="caption" className="text-gray-400 font-medium whitespace-nowrap overflow-ellipsis">
                            {tags.join(' / ')}
                        </Typography>
                    </div>
                </div>

                {/* Title & Introduction */}
                <div className="space-y-1.5">
                    <Typography variant="h1" className="text-[28px] font-bold text-gray-900 tracking-tight leading-tight">
                        {recipe.ckgNm || recipe.rcpTtl}
                    </Typography>
                    <Typography variant="body1" className="text-gray-500 font-medium leading-relaxed">
                        {recipe.ckgIpdc}
                    </Typography>
                </div>
            </motion.div>

            {/* 2. Main Visual */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="px-5"
            >
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
                    <Image
                        src={recipe.rcpImgUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop"}
                        alt={recipe.ckgNm || "Recipe Image"}
                        fill
                        priority
                        className="object-cover"
                    />
                </div>
            </motion.div>

            {/* 3. Quick Info & Action */}
            <div className="px-5 mt-8 space-y-10 pb-10">
                {/* Ingredients */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Typography variant="h3" className="font-bold text-gray-900">[재료]</Typography>
                        {missingIngredients.length > 0 && (
                            <button
                                onClick={handleShopAllMissing}
                                className="flex items-center gap-1 text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                부족한 재료 한 번에 구매
                            </button>
                        )}
                    </div>

                    <div className="space-y-6">
                        {recipe.structuredIngredients ? (
                            recipe.structuredIngredients.map((section, idx) => (
                                <div key={idx} className="space-y-3">
                                    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                                        <table className="w-full text-left text-[14px]">
                                            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium text-[13px]">
                                                <tr>
                                                    <th className="py-3 px-4 w-12 text-center whitespace-nowrap">보유</th>
                                                    <th className="py-3 px-4">재료명</th>
                                                    <th className="py-3 px-4">필요량</th>
                                                    <th className="py-3 px-4 w-12 text-center whitespace-nowrap">구매</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {section.items.map((item, itemIdx) => (
                                                    <tr key={itemIdx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                                        <td className="py-3 px-4 text-center">
                                                            {item.isOwned ? (
                                                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mx-auto shadow-sm">
                                                                    <Check className="w-3 h-3 text-green-600" />
                                                                </div>
                                                            ) : (
                                                                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-3">
                                                                {item.imageUrl ? (
                                                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center p-1.5 shrink-0 border border-gray-100 overflow-hidden relative">
                                                                        <Image
                                                                            src={item.imageUrl}
                                                                            alt={item.ingredientName}
                                                                            fill
                                                                            sizes="32px"
                                                                            className="object-contain"
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                                                        <span className="text-xs text-gray-400">?</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-2">
                                                                    <span className={cn(
                                                                        "font-medium",
                                                                        item.isOwned ? "text-gray-900" : "text-gray-500"
                                                                    )}>
                                                                        {item.ingredientName}
                                                                    </span>
                                                                    {item.isUrgent && (
                                                                        <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full animate-pulse shadow-sm whitespace-nowrap">
                                                                            임박
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 text-gray-500 font-medium">
                                                            {item.amount || '-'}
                                                        </td>
                                                        <td className="py-3 px-4 text-center">
                                                            {!item.isOwned && (
                                                                <button
                                                                    onClick={() => handleShopIngredient(item.ingredientName)}
                                                                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-full transition-colors mx-auto"
                                                                    aria-label={`${item.ingredientName} 구매하기`}
                                                                >
                                                                    <ShoppingCart className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Fallback for raw text if structuredIngredients is missing (should not happen with new API)
                            <Typography variant="body1" className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {recipe.ckgMtrlCn}
                            </Typography>
                        )}
                    </div>
                </section>

                {/* Cooking Steps */}
                <section className="space-y-6">
                    <Typography variant="h3" className="font-bold text-gray-900">[조리 방법]</Typography>

                    <div className="space-y-8">
                        {recipe.steps.map((step, index) => (
                            <motion.div
                                key={step.stepId}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                className="flex gap-4"
                            >
                                <div className="shrink-0">
                                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                                        <Typography variant="caption" className="text-white font-bold">{index + 1}</Typography>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <Typography variant="body1" className="text-gray-800 leading-relaxed pt-0.5">
                                        {step.stepDesc}
                                    </Typography>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>

            {/* 4. Bottom Fixed Button */}
            <div className="fixed bottom-0 inset-x-0 p-5 bg-linear-to-t from-white via-white/80 to-transparent pt-10 px-6 z-10">
                <ActionButton
                    fullWidth
                    size="lg"
                    className="h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg shadow-2xl shadow-purple-200 active:scale-[0.97] transition-all"
                >
                    결정한 메뉴로 요리 시작
                </ActionButton>
            </div>

            {/* Shopping Modals */}
            <CommerceModal
                isOpen={isCommerceModalOpen}
                onClose={() => setIsCommerceModalOpen(false)}
                ingredientName={selectedIngredient}
            />
            <CommerceMultiModal
                isOpen={isMultiModalOpen}
                onClose={() => setIsMultiModalOpen(false)}
                ingredients={missingIngredients}
            />
        </div>
    );
}
