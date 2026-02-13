"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, Clock, Zap, Users, Bookmark, Share2, Star } from "lucide-react";
import { Typography, IconBox, ActionButton, Spinner, IconButton } from "@/components/elements";
import { useHeader } from "@/components/modules/Header";
import { cn } from "@/lib/utils";

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
}

export default function RecipeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
        <div className="flex-1 overflow-y-auto bg-white scrollbar-hide">
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
            <div className="px-5 mt-8 space-y-10 pb-32">
                {/* Ingredients */}
                <section className="space-y-3">
                    <Typography variant="h3" className="font-bold text-gray-900">[재료]</Typography>
                    <div className="p-0">
                        <Typography variant="body1" className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {recipe.ckgMtrlCn}
                        </Typography>
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
                                    {/* Step Visual Placeholder as shown in original image */}
                                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group">
                                        <Image
                                            src={recipe.rcpImgUrl} // DB에 단계별 이미지가 없어 메인 이미지를 블러 처리해 활용 (디자인적 요소)
                                            alt={`Step ${index + 1}`}
                                            fill
                                            className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/5" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>

        </div>
    );
}
