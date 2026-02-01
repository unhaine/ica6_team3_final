"use client";

import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { AvatarThumbnail, Typography, ActionCard } from "@/components/elements";
import { ChevronRight, LogOut, MessageSquare, Users, Utensils, AlertTriangle, Edit2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
    const { data: session } = useSession();
    const user = session?.user;
    const router = useRouter();
    const [isHovering, setIsHovering] = useState(false);

    useHeader({
        isVisible: true,
        title: "프로필",
        left: null,
    });

    useFooter({
        isVisible: true,
    });

    const SETTINGS = [
        { icon: Users, label: "가구 인원", value: "2명" },
        { icon: Utensils, label: "요리 선호", value: "간편 요리" },
        { icon: AlertTriangle, label: "알러지/비선호", value: "땅콩" },
    ];

    const MENU = [
        { icon: MessageSquare, label: "피드백 보내기" },
    ];

    return (
        <div className="flex flex-col h-full overflow-y-auto pb-20 scrollbar-hide">
            {/* 1. Header Section */}
            <section className="bg-surface p-6 flex flex-col items-center border-b border-border shadow-sm">
                <div 
                    className="relative mb-4 cursor-pointer"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onClick={() => router.push('/test/profile/select')}
                >
                    <AvatarThumbnail 
                        size="lg" 
                        className="w-24 h-24 ring-8 ring-surface-alt shadow-lg transition-all"
                        src={user?.image || ""}
                        fallback={user?.name?.[0] || "?"}
                    />
                    {isHovering && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition-all">
                            <div className="bg-white rounded-full p-3 shadow-lg">
                                <Edit2 className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                    )}
                </div>
                <Typography variant="h3" weight="bold" color="primary">
                    {user?.name || "사용자"}님
                </Typography>
                <Typography variant="body2" color="secondary" className="mt-1 font-medium italic">
                    {user?.email || "로그인이 필요합니다."}
                </Typography>
            </section>

            {/* 2. Settings Section */}
            <div className="p-4 space-y-6">
                <div className="space-y-2">
                    {SETTINGS.map((item, idx) => (
                        <ActionCard key={idx} className="bg-surface p-4 flex flex-row items-center justify-between border-border-subtle shadow-sm hover:bg-surface-active transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="bg-surface-alt p-2.5 rounded-xl">
                                    <item.icon className="w-5 h-5 text-text-secondary" />
                                </div>
                                <Typography weight="semibold" color="primary">{item.label}</Typography>
                            </div>
                            <div className="flex items-center gap-2">
                                <Typography className="text-primary font-bold">{item.value}</Typography>
                                <ChevronRight className="w-4 h-4 text-text-tertiary" />
                            </div>
                        </ActionCard>
                    ))}
                </div>

                <div className="space-y-2 pt-4">
                    {MENU.map((item, idx) => (
                        <ActionCard key={idx} className="bg-surface p-4 flex flex-row items-center justify-between border-border-subtle shadow-sm hover:bg-surface-active transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="bg-surface-alt p-2.5 rounded-xl">
                                    <item.icon className="w-5 h-5 text-text-secondary" />
                                </div>
                                <Typography weight="semibold" color="primary">{item.label}</Typography>
                            </div>
                            <ChevronRight className="w-4 h-4 text-text-tertiary" />
                        </ActionCard>
                    ))}

                    <ActionCard 
                        className="bg-surface p-4 flex flex-row items-center justify-between border-destructive/20 shadow-sm hover:bg-destructive/5 transition-colors group mt-4 cursor-pointer"
                        onClick={() => signOut({ callbackUrl: "/" })}
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-destructive/10 p-2.5 rounded-xl group-hover:bg-destructive/20 transition-colors">
                                <LogOut className="w-5 h-5 text-destructive" />
                            </div>
                            <Typography weight="bold" className="text-destructive">로그아웃</Typography>
                        </div>
                    </ActionCard>
                </div>
            </div>
            
            <div className="py-10 flex justify-center">
                <Typography variant="caption" color="tertiary">앱 버전 1.0.0 (MVP)</Typography>
            </div>
        </div>
    );
}
