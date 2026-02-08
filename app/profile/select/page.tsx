"use client";

import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { Typography, ActionCard } from "@/components/elements";
import { ChevronLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { generateProfileImage, updateProfileImage } from "@/app/actions/profile";
import { useSession } from "next-auth/react";

const PROFILE_IMAGES = [
    { id: "cat", src: "/profile/fridgeCat.png", name: "냉장고양이" },
    { id: "elk", src: "/profile/fridgeElk.png", name: "냉장고라니" },
    { id: "gorilla", src: "/profile/fridgeGorilla.png", name: "냉장고릴라" },
    { id: "godzilla", src: "/profile/fridgeGodzilla.png", name: "냉장고질라" },
    { id: "goblin", src: "/profile/fridgeGoblin.png", name: "냉장고블린" },
];

export default function ProfileSelectPage() {
    const router = useRouter();
    const { update } = useSession();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showGeneratedModal, setShowGeneratedModal] = useState(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [currentAnimal, setCurrentAnimal] = useState<string>("");

    useHeader({
        isVisible: true,
        title: "프로필 사진",
        left: (
            <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-900">
                <ChevronLeft size={24} />
            </button>
        ),
    });

    useFooter({
        isVisible: false,
    });

    const handleGenerateRandom = async () => {
        setIsGenerating(true);
        
        const animals = [
            "penguin", "polar bear", "fox", "rabbit", "panda", "koala",
            "otter", "axolotl", "capybara", "octopus", "sea turtle",
            "owl", "flamingo", "dragon", "unicorn", "dinosaur", 
            "avocado", "broccoli", "strawberry", "sushi", "cookie"
        ];
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        setCurrentAnimal(randomAnimal);
        
        try {
            const result = await generateProfileImage(randomAnimal);

            if (result.success && result.imageUrl) {
                setGeneratedImageUrl(result.imageUrl);
                setShowGeneratedModal(true);
            } else {
                throw new Error(result.error || '이미지 생성 실패');
            }
        } catch (error) {
            console.error("이미지 생성 실패:", error);
            alert("❌ 이미지 생성에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSelectGeneratedImage = async () => {
        if (!generatedImageUrl) return;
        
        setIsSaving(true);
        try {
            const result = await updateProfileImage(generatedImageUrl);
            
            if (result.success) {
                await update({
                    image: result.savedUrl || generatedImageUrl,
                });
                
                alert("✅ AI 생성 프로필이 적용되었습니다!");
                setShowGeneratedModal(false);
                router.back();
            } else {
                throw new Error(result.error || '프로필 업데이트 실패');
            }
        } catch (error) {
            console.error("프로필 업데이트 실패:", error);
            alert("❌ 프로필 사진 변경에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRegenerateImage = () => {
        setShowGeneratedModal(false);
        setGeneratedImageUrl(null);
        handleGenerateRandom();
    };

    const handleSelectImage = async (imageId: string, imageSrc: string) => {
        setSelectedImage(imageId);
        setIsSaving(true);
        
        try {
            const result = await updateProfileImage(imageSrc);
            
            if (result.success) {
                await update({
                    image: imageSrc,
                });
                
                alert("✅ 프로필 사진이 변경되었습니다!");
                router.back();
            } else {
                throw new Error(result.error || '프로필 업데이트 실패');
            }
        } catch (error) {
            console.error("프로필 업데이트 실패:", error);
            alert("❌ 프로필 사진 변경에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="absolute inset-0 flex flex-col overflow-hidden bg-gray-50/50">
            <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
                {/* 설명 섹션 */}
                <div className="p-8 bg-surface border-b border-border shadow-sm">
                    <Typography variant="body1" color="secondary" className="text-center leading-relaxed font-medium">
                        마음에 드는 프로필 사진을 선택하거나
                        <br />
                        <span className="text-primary font-bold">AI</span>로 나만의 특별한 프로필을 생성해보세요!
                    </Typography>
                </div>

                {/* 프로필 이미지 그리드 */}
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-5">
                        {PROFILE_IMAGES.map((image) => (
                            <ActionCard
                                key={image.id}
                                className={`
                                    relative aspect-square overflow-hidden cursor-pointer
                                    transition-all duration-300 rounded-3xl
                                    ${selectedImage === image.id 
                                        ? 'ring-4 ring-primary shadow-2xl scale-[0.98]' 
                                        : 'hover:scale-[1.02] hover:shadow-xl border-border-subtle'
                                    }
                                    ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                                onClick={() => !isSaving && handleSelectImage(image.id, image.src)}
                            >
                                <Image
                                    src={image.src}
                                    alt={image.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <Typography 
                                        variant="caption" 
                                        weight="bold" 
                                        className="text-white text-center tracking-tight"
                                    >
                                        {image.name}
                                    </Typography>
                                </div>
                            </ActionCard>
                        ))}

                        {/* AI 생성 버튼 */}
                        <ActionCard
                            className={`
                                relative aspect-square overflow-hidden cursor-pointer rounded-3xl
                                bg-linear-to-br from-primary/10 via-primary/5 to-white
                                border-2 border-dashed border-primary/30
                                flex flex-col items-center justify-center gap-4
                                transition-all duration-300
                                hover:scale-[1.02] hover:shadow-xl hover:border-primary/50
                                ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                            onClick={handleGenerateRandom}
                        >
                            <div className={`
                                bg-white p-5 rounded-full shadow-lg
                                ${isGenerating ? 'animate-pulse' : ''}
                            `}>
                                <Sparkles className={`
                                    w-8 h-8 text-primary
                                    ${isGenerating ? 'animate-spin' : ''}
                                `} />
                            </div>
                            <div className="text-center px-3">
                                <Typography 
                                    variant="body2" 
                                    weight="bold" 
                                    className="text-primary"
                                >
                                    {isGenerating ? "생성 중..." : "AI 프로필 생성"}
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    color="tertiary" 
                                    className="mt-1 font-medium"
                                >
                                    랜덤 동물 캐릭터
                                </Typography>
                            </div>
                        </ActionCard>
                    </div>
                </div>

                {/* 안내 메시지 */}
                <div className="px-6 pb-12">
                    <div className="bg-white rounded-2xl p-5 border border-border-subtle shadow-sm flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <Typography variant="caption" color="secondary" className="font-medium">
                            {isSaving ? "설정을 저장하고 있습니다..." : "원하는 사진을 탭하면 즉시 반영됩니다"}
                        </Typography>
                    </div>
                </div>
            </div>

            {/* AI 생성 이미지 모달 */}
            {showGeneratedModal && generatedImageUrl && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
                    onClick={() => setShowGeneratedModal(false)}
                >
                    <div 
                        className="bg-surface rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 모달 헤더 */}
                        <div className="p-8 pb-4 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-4">
                                <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                            <Typography variant="h3" weight="bold">
                                AI 프로필 완성!
                            </Typography>
                            <Typography variant="body2" color="secondary" className="mt-2 font-medium">
                                귀여운 <span className="text-primary font-bold">{currentAnimal}</span> 캐릭터가 탄생했어요
                            </Typography>
                        </div>

                        {/* 생성된 이미지 */}
                        <div className="p-8 pt-4">
                            <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden bg-surface-alt ring-1 ring-border shadow-inner">
                                <Image
                                    src={generatedImageUrl}
                                    alt="Generated Profile"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 400px"
                                />
                            </div>
                        </div>

                        {/* 액션 버튼 */}
                        <div className="p-8 pt-0 flex gap-4">
                            <button
                                className="flex-1 h-14 rounded-2xl bg-surface-alt hover:bg-border transition-colors font-bold text-text-secondary active:scale-95"
                                onClick={handleRegenerateImage}
                            >
                                다시 생성
                            </button>
                            
                            <button
                                className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 transition-all font-bold text-white shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
                                onClick={handleSelectGeneratedImage}
                                disabled={isSaving}
                            >
                                {isSaving ? "저장 중..." : "적용하기"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
