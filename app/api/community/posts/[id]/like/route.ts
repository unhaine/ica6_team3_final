import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import prisma from '@/lib/prisma';

// POST /api/community/posts/[id]/like - 좋아요 토글
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authResult = await requireAuth();
        if ('error' in authResult) return authResult.error;
        const user = authResult.user;

        const postId = params.id;

        // 기존 좋아요 확인
        const existingLike = await prisma.postLike.findUnique({
            where: {
                userId_postId: {
                    userId: user.id,
                    postId: postId,
                },
            },
        });

        if (existingLike) {
            // 좋아요 취소
            await prisma.postLike.delete({
                where: { id: existingLike.id },
            });
            return NextResponse.json({ success: true, liked: false });
        } else {
            // 좋아요 추가
            await prisma.postLike.create({
                data: {
                    userId: user.id,
                    postId: postId,
                },
            });
            return NextResponse.json({ success: true, liked: true });
        }
    } catch (error) {
        console.error('Like toggle error:', error);
        return NextResponse.json(
            { success: false, error: '좋아요 처리에 실패했습니다.' },
            { status: 500 }
        );
    }
}
