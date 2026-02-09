'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { PostForm } from '@/components/modules/CommunitySection';
import { extractThumbnail } from '@/utils/community-utils';

function CreatePostContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Layout management is now handled inside PostForm

    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const strippedContent = content.replace(/<[^>]+>/g, '').trim();
        const hasImage = content.includes('<img');

        if (!title.trim()) {
            toast.error('제목을 입력해주세요.');
            return;
        }

        if (!strippedContent && !hasImage) {
            toast.error('내용을 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            const imageUrl = extractThumbnail(content);

            const res = await fetch('/api/community/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    imageUrl,
                    recipeId: searchParams.get('recipeId'),
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || '게시글 작성 실패');
            }

            toast.success('게시글이 등록되었습니다!');
            router.push('/community');
        } catch (error: any) {
            toast.error(error.message || '게시글 등록 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PostForm
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            onSubmit={handleSubmit}
            loading={loading}
            headerTitle="글쓰기"
            submitLabel="등록"
            loadingLabel="등록 중..."
            showRecipeLink={true}
        />
    );
}

export default function CreatePostPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
            <CreatePostContent />
        </Suspense>
    );
}
