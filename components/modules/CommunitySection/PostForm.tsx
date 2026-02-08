"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/elements/Icon';
import RichTextEditor from '@/components/custom/RichTextEditor';
import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";

interface PostFormProps {
    title: string;
    setTitle: (val: string) => void;
    content: string;
    setContent: (val: string) => void;
    onSubmit: () => void;
    loading: boolean;
    headerTitle: string;
    submitLabel: string;
    loadingLabel: string;
    showRecipeLink?: boolean;
}

export function PostForm({
    title,
    setTitle,
    content,
    setContent,
    onSubmit,
    loading,
    headerTitle,
    submitLabel,
    loadingLabel,
    showRecipeLink = false
}: PostFormProps) {
    const router = useRouter();

    // Use global header instead of local header tag
    useHeader({
        isVisible: true,
        title: headerTitle,
        left: (
            <button
                onClick={() => router.back()}
                className="p-2 -ml-2 text-slate-900 transition-colors"
                aria-label="뒤로가기"
            >
                <Icon name="ChevronLeft" size={24} />
            </button>
        ),
        right: (
            <button
                onClick={onSubmit}
                disabled={loading}
                className={`
                    px-4 py-1.5 rounded-full text-sm font-bold transition-all
                    ${loading
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm active:scale-95'}
                `}
            >
                {loading ? loadingLabel : submitLabel}
            </button>
        ),
    });

    useFooter({ isVisible: false });

    return (
        <div className="flex flex-col h-full bg-[#F9FAFB] relative max-h-screen">
            <main className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide max-w-2xl mx-auto w-full pt-4">
                <section className="space-y-4">
                    {/* Title Card Container */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm transition-all focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
                        <input
                            type="text"
                            placeholder="제목을 입력하세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full text-xl font-bold placeholder:text-slate-300 border-none outline-none bg-transparent"
                        />
                    </div>

                    {/* Content Editor area */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm min-h-[300px]">
                        <RichTextEditor
                            content={content}
                            onChange={setContent}
                            placeholder="오늘의 요리는 어떠셨나요? 사진과 함께 이야기를 들려주세요!"
                        />
                    </div>
                </section>

                {showRecipeLink && (
                    <div className="mt-6">
                        <button className="w-full py-4 px-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all group shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform">
                                    <Icon name="Link" size={20} />
                                </div>
                                <span className="font-medium">레시피 연결하기 (선택)</span>
                            </div>
                            <Icon name="ChevronRight" size={20} className="text-slate-400" />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
