import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const username = 'otheruser';

        // Find the existing "Other User"
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' });
        }

        // Create another post
        const post = await prisma.communityPost.create({
            data: {
                userId: user.id,
                title: '맛있는 저녁 식사 🥗',
                content: '<p>오늘 저녁은 샐러드와 파스타를 해먹었어요! 정말 맛있네요.</p>',
                imageUrl: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=800&q=80',
            },
        });

        return NextResponse.json({ success: true, post });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
