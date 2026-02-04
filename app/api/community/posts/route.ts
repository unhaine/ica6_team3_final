import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import prisma from '@/lib/prisma';

// Helper to get the community post model safely
const getPostModel = (p: any) => p.communityPost || p.CommunityPost || p.post || p.Post;

// GET /api/community/posts - 커뮤니티 피드 조회
export async function GET(req: NextRequest) {
    try {
        const postModel = getPostModel(prisma);
        if (!postModel) {
            const availableModels = Object.keys(prisma).filter(k => !k.startsWith('_'));
            console.error('CommunityPost model not found on prisma client. Available:', availableModels);
            return NextResponse.json(
                { success: false, error: 'Database model not found', availableModels },
                { status: 500 }
            );
        }

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        const cursor = searchParams.get('cursor');

        const posts = await postModel.findMany({
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
                recipe: {
                    select: {
                        rcpSno: true,
                        ckgNm: true,
                    },
                },
            },
        });

        // BigInt 변환 (Recipe ID가 BigInt일 수 있음)
        const serializedPosts = posts.map((post: any) => ({
            ...post,
            recipe: post.recipe ? {
                ...post.recipe,
                rcpSno: post.recipe.rcpSno.toString()
            } : null,
            recipeId: post.recipeId ? post.recipeId.toString() : null,
        }));

        return NextResponse.json({
            success: true,
            data: serializedPosts,
            nextCursor: posts.length === limit ? posts[posts.length - 1].id : null,
        });
    } catch (error) {
        console.error('Community Feed error:', error);
        return NextResponse.json(
            { success: false, error: '피드를 불러오는 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// POST /api/community/posts - 게시글 작성
export async function POST(req: NextRequest) {
    try {
        const authResult = await requireAuth();
        if ('error' in authResult) return authResult.error;
        const user = authResult.user;

        const body = await req.json();
        const { content, imageUrl, recipeId } = body;

        if (!content || !imageUrl) {
            return NextResponse.json(
                { success: false, error: '내용과 이미지는 필수입니다.' },
                { status: 400 }
            );
        }

        const postModel = getPostModel(prisma);
        if (!postModel) {
            return NextResponse.json(
                { success: false, error: 'Database model not found' },
                { status: 500 }
            );
        }

        const post = await postModel.create({
            data: {
                userId: user.id,
                content,
                imageUrl,
                recipeId: recipeId ? BigInt(recipeId) : null,
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                ...post,
                recipeId: post.recipeId ? post.recipeId.toString() : null,
            },
        });
    } catch (error) {
        console.error('Post Creation error:', error);
        return NextResponse.json(
            { success: false, error: '게시글 작성 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
