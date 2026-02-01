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
        title: "프로필 사진 선택",
        left: (
            <button onClick={() => router.back()} className="p-2">
                <ChevronLeft className="w-6 h-6" />
            </button>
        ),
    });

    useFooter({
        isVisible: false,
    });

    const handleGenerateRandom = async () => {
        setIsGenerating(true);
        
        // 랜덤 동물 선택 - 다양하고 재미있는 동물들!
        const animals = [
            // 귀여운 동물들
            "penguin", "polar bear", "seal", "fox", "rabbit", "squirrel", "panda", "koala",
            "otter", "hedgehog", "hamster", "red panda", "sloth", "raccoon", "chinchilla", "meerkat",
            
            // 독특한 동물들
            "axolotl", "capybara", "platypus", "quokka", "fennec fox", "sugar glider",
            "armadillo", "pangolin", "tapir", "okapi",
            
            // 바다 생물
            "octopus", "jellyfish", "sea turtle", "dolphin", "narwhal", "seahorse",
            "pufferfish", "starfish", "clownfish", "manta ray", "whale shark",
            
            // 새들
            "owl", "flamingo", "toucan", "parrot", "peacock", "hummingbird",
            "kiwi bird", "puffin", "cockatoo", "crow",
            
            // 신화/판타지
            "dragon", "unicorn", "phoenix", "griffin", "pegasus", "mermaid",
            "fairy", "elf", "gnome", "goblin", "troll",
            
            // 재미있는 선택
            "dinosaur", "alien", "robot", "ghost", "yeti", "bigfoot", "loch ness monster",
            "zombie", "vampire", "werewolf", "frankenstein",
            
            // 음식 캐릭터 (냉장고니까!)
            "avocado", "broccoli", "strawberry", "mushroom", "egg", "milk carton",
            "cheese", "sushi", "dumpling", "cookie",
            
            // 인터넷 밈/캐릭터
            "doge", "pepe frog", "nyan cat", "grumpy cat", "keyboard cat",
            
            // 애니메이션/게임 캐릭터 스타일
            "totoro", "pikachu", "kirby", "among us crewmate", "minecraft creeper",
            
            // 완전 랜덤/황당한 것들
            "cactus with sunglasses", "dancing banana", "flying spaghetti monster",
            "sentient pickle", "disco ball", "rubber duck", "sock puppet"
        ];
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        setCurrentAnimal(randomAnimal);
        
        try {
            // 서버 액션을 통해 AI 이미지 생성
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
                    image: generatedImageUrl,
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
            // 서버 액션을 통해 프로필 이미지 업데이트
            const result = await updateProfileImage(imageSrc);
            
            if (result.success) {
                // 세션 업데이트 (NextAuth)
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
        <div className="flex flex-col h-full overflow-y-auto pb-20 scrollbar-hide bg-background">
            {/* 설명 섹션 */}
            <div className="p-6 bg-surface border-b border-border">
                <Typography variant="body1" color="secondary" className="text-center">
                    마음에 드는 프로필 사진을 선택하거나
                    <br />
                    AI로 새로운 프로필을 생성해보세요!
                </Typography>
            </div>

            {/* 프로필 이미지 그리드 */}
            <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                    {PROFILE_IMAGES.map((image) => (
                        <ActionCard
                            key={image.id}
                            className={`
                                relative aspect-square overflow-hidden cursor-pointer
                                transition-all duration-300
                                ${selectedImage === image.id 
                                    ? 'ring-4 ring-primary shadow-xl scale-[0.98]' 
                                    : 'hover:scale-[1.02] hover:shadow-lg'
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
                            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3">
                                <Typography 
                                    variant="caption" 
                                    weight="semibold" 
                                    className="text-white text-center"
                                >
                                    {image.name}
                                </Typography>
                            </div>
                        </ActionCard>
                    ))}

                    {/* AI 생성 버튼 */}
                    <ActionCard
                        className={`
                            relative aspect-square overflow-hidden cursor-pointer
                            bg-linear-to-br from-primary/20 via-primary/10 to-primary/5
                            border-2 border-dashed border-primary/40
                            flex flex-col items-center justify-center gap-3
                            transition-all duration-300
                            hover:scale-[1.02] hover:shadow-lg hover:border-primary/60
                            ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        onClick={handleGenerateRandom}
                    >
                        <div className={`
                            bg-primary/20 p-4 rounded-full
                            ${isGenerating ? 'animate-pulse' : ''}
                        `}>
                            <Sparkles className={`
                                w-8 h-8 text-primary
                                ${isGenerating ? 'animate-spin' : ''}
                            `} />
                        </div>
                        <Typography 
                            variant="body2" 
                            weight="bold" 
                            className="text-primary text-center px-2"
                        >
                            {isGenerating ? "생성 중..." : "AI로 생성하기"}
                        </Typography>
                        <Typography 
                            variant="caption" 
                            color="secondary" 
                            className="text-center px-2"
                        >
                            랜덤 동물 프로필
                        </Typography>
                    </ActionCard>
                </div>
            </div>

            {/* 안내 메시지 */}
            <div className="p-6 mt-4">
                <div className="bg-surface-alt rounded-xl p-4 border border-border-subtle">
                    <Typography variant="caption" color="tertiary" className="text-center">
                        {isSaving ? "💾 프로필 사진을 저장하는 중..." : "💡 프로필 사진을 탭하면 바로 적용됩니다"}
                    </Typography>
                </div>
            </div>

            {/* AI 생성 이미지 모달 */}
            {showGeneratedModal && generatedImageUrl && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setShowGeneratedModal(false)}
                >
                    <div 
                        className="bg-surface rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 모달 헤더 */}
                        <div className="p-6 border-b border-border">
                            <Typography variant="h3" weight="bold" className="text-center">
                                🎨 AI 프로필 생성 완료!
                            </Typography>
                            <Typography variant="body2" color="secondary" className="text-center mt-2">
                                {currentAnimal} 프로필이 생성되었습니다
                            </Typography>
                        </div>

                        {/* 생성된 이미지 */}
                        <div className="p-6">
                            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-surface-alt border-2 border-primary/20">
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
                        <div className="p-6 pt-0 flex gap-3">
                            <ActionCard
                                className="flex-1 bg-surface-alt hover:bg-surface-alt/80 border border-border cursor-pointer transition-all duration-200 hover:scale-[0.98]"
                                onClick={handleRegenerateImage}
                            >
                                <div className="p-4 flex items-center justify-center gap-2">
                                    <Sparkles className="w-5 h-5 text-foreground-secondary" />
                                    <Typography variant="body2" weight="semibold">
                                        다시 만들기
                                    </Typography>
                                </div>
                            </ActionCard>
                            
                            <ActionCard
                                className="flex-1 bg-primary hover:bg-primary/90 cursor-pointer transition-all duration-200 hover:scale-[0.98]"
                                onClick={handleSelectGeneratedImage}
                            >
                                <div className="p-4 flex items-center justify-center gap-2">
                                    <Typography variant="body2" weight="semibold" className="text-white">
                                        {isSaving ? "저장 중..." : "선택하기"}
                                    </Typography>
                                </div>
                            </ActionCard>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
