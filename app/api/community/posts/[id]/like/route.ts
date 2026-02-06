import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import prisma from '@/lib/prisma';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await requireAuth();
        if ('error' in authResult) return authResult.error;
        const user = authResult.user;
        const { id } = await params;

        // Check if already liked
        const existingLike = await prisma.postLike.findUnique({
            where: {
                userId_postId: {
                    userId: user.id,
                    postId: id,
                },
            },
        });

        let liked = false;

        if (existingLike) {
            // Unlink
            await prisma.postLike.delete({
                where: {
                    userId_postId: {
                        userId: user.id,
                        postId: id,
                    },
                },
            });
            liked = false;
        } else {
            // Like
            await prisma.postLike.create({
                data: {
                    userId: user.id,
                    postId: id,
                },
            });
            liked = true;
        }

        // Get updated count
        const likeCount = await prisma.postLike.count({
            where: { postId: id },
        });

        return NextResponse.json({
            success: true,
            data: {
                liked,
                likeCount,
            },
        });
    } catch (error) {
        console.error('Like toggle error:', error);
        return NextResponse.json(
            { success: false, error: '좋아요 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
