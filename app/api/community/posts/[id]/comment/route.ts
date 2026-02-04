import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import prisma from '@/lib/prisma';

// POST /api/community/posts/[id]/comment - 댓글 작성
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await requireAuth();
        if ('error' in authResult) return authResult.error;
        const user = authResult.user;

        const { id } = await params;
        const postId = id;
        const { content } = await req.json();

        if (!content) {
            return NextResponse.json(
                { success: false, error: '댓글 내용을 입력해주세요.' },
                { status: 400 }
            );
        }

        const comment = await prisma.postComment.create({
            data: {
                userId: user.id,
                postId: postId,
                content: content,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            data: comment,
        });
    } catch (error) {
        console.error('Comment creation error:', error);
        return NextResponse.json(
            { success: false, error: '댓글 작성에 실패했습니다.' },
            { status: 500 }
        );
    }
}
