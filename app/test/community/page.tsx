"use client";

import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { useHeader } from "@/components/modules/Header";
import { FilterCarousel } from "@/components/modules";
import { MediaCard, SelectableChip, IconButton, AvatarThumbnail, Typography } from "@/components/elements";

const COMMUNITY_FILTERS = [
    { id: "all", label: "전체" },
    { id: "new", label: "NEW" },
    { id: "trending", label: "TRENDING" },
    { id: "hot", label: "HOT" },
];

const MOCK_POSTS = [
    {
        id: 1,
        user: { name: "요리왕김씨", avatar: "" },
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80",
        likes: 128,
        comments: 24,
        caption: "오늘 만든 제육볶음~ 너무 맛있었어요! 상추에 싸먹으니까 꿀맛입니다. 다들 저녁 뭐 드세요?",
    },
    {
        id: 2,
        user: { name: "집밥요정", avatar: "" },
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80",
        likes: 89,
        comments: 12,
        caption: "냉장고 파먹기 성공! 남은 야채 다 넣고 비빔밥 해먹었네요 ㅎㅎ",
    },
];

export default function CommunityPage() {
    const [activeFilter, setActiveFilter] = useState("all");

    useHeader({
        isVisible: true,
        title: "커뮤니티",
        right: <IconButton icon="Search" variant="ghost" ariaLabel="검색" />,
    });

    return (
        <div className="flex flex-col h-full bg-slate-50/30 overflow-y-auto pb-20">
            {/* Filter Section */}
            <div className="shrink-0 z-10 bg-white border-b py-2 pr-4">
                <FilterCarousel
                    data={COMMUNITY_FILTERS}
                    keyExtractor={(it) => it.id}
                    className="px-4"
                    renderItem={(filter) => (
                        <SelectableChip
                            label={filter.label}
                            selected={activeFilter === filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                        />
                    )}
                />
            </div>

            {/* Posts List */}
            <div className="p-4 space-y-6">
                {MOCK_POSTS.map((post) => (
                    <div key={post.id} className="space-y-3">
                        {/* User Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AvatarThumbnail src={post.user.avatar} fallback={post.user.name[0]} size="sm" />
                                <Typography weight="bold" variant="body2">{post.user.name}</Typography>
                            </div>
                            <IconButton icon="MoveHorizontal" ariaLabel="더보기" size="sm" />
                        </div>

                        {/* Image Post */}
                        <MediaCard
                            imageUrl={post.image}
                            title={null}
                            aspectRatio="square"
                            className="bg-white border-none shadow-none overflow-hidden rounded-2xl"
                            contentClassName="px-0 pt-0"
                            footerLeft={
                                <div className="flex items-center gap-4 mt-2">
                                    <button className="flex items-center gap-1.5 text-slate-600 active:scale-90 transition-transform">
                                        <Heart className="w-5 h-5" />
                                        <span className="text-sm font-medium">{post.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-1.5 text-slate-600 active:scale-90 transition-transform">
                                        <MessageCircle className="w-5 h-5" />
                                        <span className="text-sm font-medium">{post.comments}</span>
                                    </button>
                                </div>
                            }
                        />

                        {/* Caption */}
                        <div className="px-1 pb-10">
                            <Typography variant="body2" className="text-slate-800 leading-relaxed font-medium">
                                {post.caption}
                            </Typography>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
