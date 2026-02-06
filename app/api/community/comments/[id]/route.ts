import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import prisma from '@/lib/prisma';

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await requireAuth();
        if ('error' in authResult) return authResult.error;
        const user = authResult.user;
        const { id } = await params;

        // Verify ownership
        const comment = await prisma.postComment.findUnique({
            where: { id },
        });

        if (!comment) {
            return NextResponse.json({ success: false, error: 'Comment not found' }, { status: 404 });
        }

        if (comment.userId !== user.id) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        await prisma.postComment.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Delete Comment Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
