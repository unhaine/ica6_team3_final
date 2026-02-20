"use client";

import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { Typography, IconBox, ActionButton } from "@/components/elements";
import { Settings, ChevronRight, Heart, HeartOff, Home, Refrigerator, MessageSquare, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Mock Data
const LIKED_RECIPES = [
    { id: "1", title: "우삼겹 덮밥", ingredient: "우삼겹", dDay: 1 },
    { id: "2", title: "떡볶이", ingredient: "떡", dDay: 2 },
    { id: "3", title: "만두전골", ingredient: "만두", dDay: 2 },
    { id: "4", title: "김치볶음밥", ingredient: "김치", dDay: 5 },
];

const COMMUNITY_POSTS = [
    {
        id: "1",
        title: "냉털로 15분만에 만든 우삼겹 덮밥!",
        content: "냉장고에 남은 우삼겹으로 후다닥 만들었는데 너무 맛있어요. 숙주랑 궁합이 최고네요!",
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200&auto=format&fit=crop",
        likes: 24,
        nickname: "요리왕"
    },
    {
        id: "2",
        title: "주말 브런치로 시금치 프리타타",
        content: "시금치가 시들어가서 급하게 만들었는데 생각보다 그럴싸해요 ㅋㅋ",
        imageUrl: "https://images.unsplash.com/photo-1590412200988-a436970781fa?q=80&w=200&auto=format&fit=crop",
        likes: 15,
        nickname: "자취생"
    },
];

export default function MyPage() {
    useHeader({
        isVisible: true,
        title: "마이페이지",
        right: <IconBox icon={<Settings />} variant="ghost" />,
    });

    useFooter({
        isVisible: true,
        items: [
            { label: '홈', icon: Home, href: '/test' },
            { label: '냉장고', icon: Refrigerator, href: '/inventory' },
            { label: '커뮤니티', icon: MessageSquare, href: '/community' },
            { label: '마이', icon: User, href: '/test/mypage' },
        ]
    });

    const [activeTab, setActiveTab] = useState<'liked' | 'posts'>('liked');

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Profile Section */}
            <div className="bg-white p-6 mb-2">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden relative">
                        <Image
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"
                            alt="Profile"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <Typography variant="h3" weight="bold">김수미</Typography>
                        <Typography variant="body2" color="secondary">오늘도 맛있는 하루 되세요!</Typography>
                    </div>
                </div>
            </div>

            {/* Liked Menus */}
            <section className="bg-white p-6 mb-2">
                <div className="flex items-center justify-between mb-4">
                    <Typography variant="h4" weight="bold">오늘 좋아한 메뉴</Typography>
                    <button className="text-xs text-gray-400 flex items-center">더보기 <ChevronRight className="w-3 h-3" /></button>
                </div>

                <div className="space-y-3">
                    {LIKED_RECIPES.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className={`px-2 py-1 text-xs font-bold rounded-md bg-white border shadow-sm
                                    ${item.dDay <= 2 ? 'text-red-500 border-red-100' : 'text-gray-500 border-gray-200'}
                                `}>
                                    D-{item.dDay}
                                </div>
                                <Typography variant="body1" weight="medium">{item.title}</Typography>
                            </div>
                            <button className="text-gray-300 hover:text-red-500 transition-colors">
                                <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Community Section */}
            <section className="bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                    <Typography variant="h4" weight="bold">커뮤니티</Typography>
                    <button className="text-xs text-gray-400 flex items-center">전체보기 <ChevronRight className="w-3 h-3" /></button>
                </div>

                <div className="space-y-4">
                    {COMMUNITY_POSTS.map((post) => (
                        <div key={post.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            {/* Left: Image */}
                            <div className="w-24 h-24 rounded-xl overflow-hidden relative shrink-0 bg-gray-100">
                                <Image
                                    src={post.imageUrl}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Right: Content */}
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div className="space-y-1">
                                    <Typography variant="body1" weight="bold" className="line-clamp-1">{post.title}</Typography>
                                    <Typography variant="caption" color="secondary" className="line-clamp-2 leading-relaxed">
                                        {post.content}
                                    </Typography>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-1 text-xs text-red-500 font-medium">
                                        <Heart className="w-3 h-3 fill-current" />
                                        <span>{post.likes}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">{post.nickname}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
