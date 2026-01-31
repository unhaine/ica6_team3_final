"use client";

import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { AvatarThumbnail, Typography, ActionCard } from "@/components/elements";
import { ChevronRight, LogOut, MessageSquare, Users, Utensils, AlertTriangle } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function ProfilePage() {
    const { data: session } = useSession();
    const user = session?.user;

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
        <div className="flex flex-col h-full bg-slate-50/30 overflow-y-auto pb-20">
            {/* 1. Header Section */}
            <section className="bg-white p-6 flex flex-col items-center border-b shadow-sm">
                <AvatarThumbnail 
                    size="lg" 
                    className="w-24 h-24 mb-4 ring-8 ring-slate-100 shadow-lg"
                    src={user?.image || ""}
                    fallback={user?.name?.[0] || "?"}
                />
                <Typography variant="h3" weight="bold" className="text-slate-900">
                    {user?.name || "사용자"}님
                </Typography>
                <Typography variant="body2" className="text-slate-500 mt-1 font-medium italic">
                    {user?.email || "로그인이 필요합니다."}
                </Typography>
            </section>

            {/* 2. Settings Section */}
            <div className="p-4 space-y-6">
                <div className="space-y-2">
                    {SETTINGS.map((item, idx) => (
                        <ActionCard key={idx} className="bg-white p-4 flex flex-row items-center justify-between border-slate-100 shadow-sm hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-100 p-2.5 rounded-xl">
                                    <item.icon className="w-5 h-5 text-slate-700" />
                                </div>
                                <Typography weight="semibold" className="text-slate-800">{item.label}</Typography>
                            </div>
                            <div className="flex items-center gap-2">
                                <Typography className="text-primary font-bold">{item.value}</Typography>
                                <ChevronRight className="w-4 h-4 text-slate-300" />
                            </div>
                        </ActionCard>
                    ))}
                </div>

                <div className="space-y-2 pt-4">
                    {MENU.map((item, idx) => (
                        <ActionCard key={idx} className="bg-white p-4 flex flex-row items-center justify-between border-slate-100 shadow-sm hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-100 p-2.5 rounded-xl">
                                    <item.icon className="w-5 h-5 text-slate-700" />
                                </div>
                                <Typography weight="semibold" className="text-slate-800">{item.label}</Typography>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                        </ActionCard>
                    ))}

                    <ActionCard 
                        className="bg-white p-4 flex flex-row items-center justify-between border-red-100 shadow-sm hover:bg-red-50 transition-colors group mt-4 cursor-pointer"
                        onClick={() => signOut({ callbackUrl: "/" })}
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-red-50 p-2.5 rounded-xl group-hover:bg-red-100 transition-colors">
                                <LogOut className="w-5 h-5 text-red-500" />
                            </div>
                            <Typography weight="bold" className="text-red-600">로그아웃</Typography>
                        </div>
                    </ActionCard>
                </div>
            </div>
            
            <div className="py-10 flex justify-center">
                <Typography variant="caption" className="text-slate-300">앱 버전 1.0.0 (MVP)</Typography>
            </div>
        </div>
    );
}
