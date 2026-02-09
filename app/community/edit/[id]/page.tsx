'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { PostForm } from '@/components/modules/CommunitySection';
import { extractThumbnail } from '@/utils/community-utils';

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const { data: session } = useSession();

    // Layout management is now handled inside PostForm

    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (params?.id) fetchPost(params.id as string);
    }, [params]);

    const fetchPost = async (id: string) => {
        try {
            const res = await fetch(`/api/community/posts/${id}`);
            const data = await res.json();
            if (data.success) {
                if (session?.user?.id && data.data.userId !== session.user.id) {
                    toast.error('수정 권한이 없습니다.');
                    router.back();
                    return;
                }
                setContent(data.data.content);
                setTitle(data.data.title || '');
            } else {
                toast.error('게시글을 불러오지 못했습니다.');
                router.back();
            }
        } catch (error) {
            toast.error('오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

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
            setSaving(true);
            const imageUrl = extractThumbnail(content);

            const res = await fetch(`/api/community/posts/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, imageUrl }),
            });

            if (!res.ok) throw new Error('게시글 수정 실패');

            toast.success('게시글이 수정되었습니다!');
            window.location.href = '/community';
        } catch (error: any) {
            toast.error(error.message || '게시글 수정 중 오류가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-full">로딩 중...</div>;

    return (
        <PostForm
            title={title}
            setTitle={setTitle}
            content={content}
            setContent={setContent}
            onSubmit={handleSubmit}
            loading={saving}
            headerTitle="글 수정"
            submitLabel="완료"
            loadingLabel="저장 중..."
        />
    );
}
