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
        const currentUser = authResult.user;
        const { id: targetUserId } = await params;

        if (currentUser.id === targetUserId) {
            return NextResponse.json(
                { success: false, error: 'Self-following is not allowed' },
                { status: 400 }
            );
        }

        // Check if already following
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: currentUser.id,
                    followingId: targetUserId,
                },
            },
        });

        let isFollowing = false;

        if (existingFollow) {
            // Unfollow
            await prisma.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId: currentUser.id,
                        followingId: targetUserId,
                    },
                },
            });
            isFollowing = false;
        } else {
            // Follow
            await prisma.follow.create({
                data: {
                    followerId: currentUser.id,
                    followingId: targetUserId,
                },
            });
            isFollowing = true;
        }

        // Get updated follower count
        const followerCount = await prisma.follow.count({
            where: { followingId: targetUserId },
        });

        return NextResponse.json({
            success: true,
            data: {
                isFollowing,
                followerCount,
            },
        });
    } catch (error) {
        console.error('Follow toggle error:', error);
        return NextResponse.json(
            { success: false, error: '팔로우 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
