import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import prisma from '@/lib/prisma';

// GET /api/community/posts/[id]/comments
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const comments = await prisma.postComment.findMany({
            where: { postId: id },
            orderBy: { createdAt: 'asc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            data: comments,
        });

    } catch (error) {
        console.error('Get Comments Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/community/posts/[id]/comments
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await requireAuth();
        if ('error' in authResult) return authResult.error;
        const user = authResult.user;
        const { id } = await params;

        const body = await req.json();
        const { content } = body;

        if (!content || !content.trim()) {
            return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
        }

        const comment = await prisma.postComment.create({
            data: {
                userId: user.id,
                postId: id,
                content,
            },
            include: {
                user: {
                    select: {
                        id: true,
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
        console.error('Create Comment Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
