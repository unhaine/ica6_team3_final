"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Typography, ActionButton, IconBox } from "@/components/elements";
import { useHeader } from "@/components/modules/Header";
import { ChevronLeft, Share2, Heart, Clock, Users, Zap, CheckCircle2, ShoppingCart } from "lucide-react";
import { CommerceModal } from "@/components/modules/CommerceModal";
import { cn } from "@/lib/utils";

interface RecipeDetailProps {
    params: Promise<{ id: string }>;
}

interface RecipeDetail {
    rcpSno: string;
    rcpTtl: string;
    ckgNm: string;
    rcpImgUrl: string;
    ckgInbunNm: string;
    ckgTimeNm: string;
    ckgDodfNm: string;
    ckgMtrlCn: string;
    ckgIpdc: string;
    recommendReason?: string;
    steps?: { description: string; imageUrl?: string }[];
}

// Temporary parser for steps since DB might not have structured steps
function parseSteps(ingredientsText: string, intro: string): { description: string }[] {
    // This is a placeholder. In a real app, steps should be in a separate table or JSON column.
    // For now, we'll just use the intro as a single step or split by newlines if applicable.
    return [{ description: intro || "맛있는 요리를 시작해보세요!" }];
}

function parseIngredients(text: string): string[] {
    if (!text) return [];
    // Basic splitting by brackets or commas
    return text.split(/\[|\]|,/).map(s => s.trim()).filter(Boolean);
}

export default function RecipeDetailPage({ params }: RecipeDetailProps) {
    const { id } = use(params);
    const router = useRouter();
    const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);

    useHeader({
        isVisible: true,
        left: <IconBox icon={<ChevronLeft />} onClick={() => router.back()} variant="ghost" />,
        title: "레시피 상세",
        right: <IconBox icon={<Share2 />} variant="ghost" />,
    });

    useEffect(() => {
        // Fetch recipe detail
        // For now, we might need a separate API endpoint for details or reuse the list one
        // Simulating fetch for now using the same recommendation API or a specific detail API
        const fetchDetail = async () => {
            try {
                // In a real app, use /api/recipes/[id]
                // Constructing a query to get specific recipe or just fetching list and finding it
                // For MVP, letting's assume we fetch from the list API with a filter or just use mock data if API not ready
                // Actually, let's use the DB directly via a new API route usually, but here I'll try to fetch from the list
                // Update: I should probably create a specific API route for detail if it doesn't exist.
                // Or just use the recommend API and find it? No, that's inefficient.
                // Checking previous file list... no specific detail API seen.
                // I will assume I need to implement basic fetching or just use mock data for the UI structure demonstration
                // as requested by the user.

                // Let's implement a basic fetch using available APIs
                const res = await fetch(`/api/recipes`);
                // This returns a list. I'll filter client side for now (inefficient but works for demo)
                // Better: Create /api/recipes/[id] route. 
                // But I'm in the UI task. I'll try to find it in the list for now.

                const data = await res.json();
                if (data.data) {
                    const found = data.data.find((r: any) => String(r.rcpSno) === id);
                    if (found) setRecipe(found);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (isLoading) return <div className="h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>;
    if (!recipe) return <div className="h-screen flex items-center justify-center">레시피를 찾을 수 없습니다.</div>;

    const ingredients = parseIngredients(recipe.ckgMtrlCn);
    // Determine keywords based on content
    const keywords = [
        recipe.ckgMtrlCn?.includes('돼지') ? '돼지고기' : null,
        recipe.ckgMtrlCn?.includes('닭') ? '닭고기' : null,
        recipe.ckgDodfNm,
        recipe.ckgTimeNm
    ].filter(Boolean);

    return (
        <div className="min-h-screen bg-surface pb-20">
            {/* Hero Image */}
            <div className="relative w-full aspect-square md:aspect-video">
                <Image
                    src={recipe.rcpImgUrl || "/placeholder-recipe.jpg"}
                    alt={recipe.rcpTtl}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                    <div className="flex gap-2 mb-2">
                        {keywords.slice(0, 3).map((k, i) => (
                            <span key={i} className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-medium">
                                #{k}
                            </span>
                        ))}
                    </div>
                    <Typography variant="h2" weight="bold" className="text-2xl leading-tight">
                        {recipe.ckgNm || recipe.rcpTtl}
                    </Typography>
                    <Typography variant="body2" className="text-white/80 line-clamp-2">
                        {recipe.ckgIpdc || "맛있는 요리를 만들어보세요."}
                    </Typography>
                </div>
            </div>

            {/* Content Container */}
            <div className="px-5 py-8 space-y-8 -mt-6 bg-surface rounded-t-[2rem] relative z-10">

                {/* Info Bar */}
                <div className="flex justify-between items-center bg-surface-alt p-4 rounded-2xl border border-border">
                    <div className="flex flex-col items-center gap-1 flex-1 border-r border-border/50 last:border-0">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="text-xs text-text-secondary">{recipe.ckgTimeNm || "15분"}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1 border-r border-border/50 last:border-0">
                        <Zap className="w-5 h-5 text-primary" />
                        <span className="text-xs text-text-secondary">{recipe.ckgDodfNm || "쉬움"}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-1">
                        <Users className="w-5 h-5 text-primary" />
                        <span className="text-xs text-text-secondary">{recipe.ckgInbunNm || "2인분"}</span>
                    </div>
                </div>

                {/* Ingredients */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Typography variant="h3" weight="bold">재료 준비</Typography>
                        <span className="text-sm text-primary font-medium">{ingredients.length}개</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {ingredients.map((ing, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-surface-alt/50 border border-border">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-primary/40" />
                                    <span className="font-medium text-text-primary">{ing}</span>
                                </div>
                                <button
                                    onClick={() => setSelectedIngredient(ing)}
                                    className="p-2 hover:bg-primary/10 rounded-full transition-colors group"
                                >
                                    <ShoppingCart className="w-4 h-4 text-text-tertiary group-hover:text-primary" />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Steps */}
                <section className="space-y-6">
                    <Typography variant="h3" weight="bold">요리 순서</Typography>

                    <div className="space-y-6">
                        {/* Mock steps since DB structure uses ckgIpdc mostly currently. 
                            In real impl, populate from step table */}
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-1">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">1</span>
                                <div className="w-0.5 h-full bg-border -my-1" />
                            </div>
                            <div className="pb-8 space-y-3">
                                <Typography variant="body1" className="text-text-primary leading-relaxed">
                                    {recipe.ckgIpdc || "재료를 손질하고 준비해주세요."}
                                </Typography>
                            </div>
                        </div>
                        {/* Add more mock steps for visual structure */}
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-1">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">2</span>
                            </div>
                            <div>
                                <Typography variant="body1" className="text-text-primary leading-relaxed">
                                    맛있게 요리해서 즐기세요!
                                </Typography>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Bottom Action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border z-20 safe-area-bottom">
                <ActionButton fullWidth size="lg" className="rounded-xl shadow-lg">
                    요리 시작하기
                </ActionButton>
            </div>

            <CommerceModal
                isOpen={!!selectedIngredient}
                onClose={() => setSelectedIngredient(null)}
                ingredientName={selectedIngredient || ""}
            />
        </div>
    );
}
