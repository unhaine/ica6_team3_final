import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import prisma from '@/lib/prisma';

// Helper to get the community post model safely
const getPostModel = (p: any) => p.communityPost || p.CommunityPost || p.post || p.Post;

// GET /api/community/posts - 커뮤니티 피드 조회
export async function GET(req: NextRequest) {
    try {
        const postModel = getPostModel(prisma);
        console.log('API: Using post model:', postModel ? 'found' : 'missing', Object.keys(prisma).filter(k => k.toLowerCase().includes('post')));
        if (!postModel) {
            // ... error handling
            return NextResponse.json({ success: false, error: 'Database model not found' }, { status: 500 });
        }

        // Check auth for isLiked status (optional)
        const authResult = await requireAuth();
        const user = 'user' in authResult ? authResult.user : null;

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        const cursor = searchParams.get('cursor');
        const sort = searchParams.get('sort') || 'all';

        let whereClause: any = {};
        let orderByClause: any = { createdAt: 'desc' };

        if (sort === 'new') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            whereClause = {
                createdAt: {
                    gte: today,
                },
            };
            orderByClause = { createdAt: 'desc' };
        } else if (sort === 'hot') {
            orderByClause = {
                likes: {
                    _count: 'desc',
                },
            };
        } else if (sort === 'following') {
            if (!user) {
                return NextResponse.json(
                    { success: false, error: 'Unauthorized' },
                    { status: 401 }
                );
            }
            // Get IDs of users I follow
            const following = await (prisma as any).follow.findMany({
                where: { followerId: user.id },
                select: { followingId: true },
            });
            const followingIds = following.map((f: any) => f.followingId);

            whereClause = {
                userId: {
                    in: followingIds,
                },
            };
        }

        const posts = await postModel.findMany({
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            where: whereClause,
            orderBy: orderByClause,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        // Check if I follow this author
                        followedBy: user ? {
                            where: { followerId: user.id },
                            select: { followerId: true }
                        } : false
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
                // Include likes for current user if logged in
                likes: user ? {
                    where: { userId: user.id },
                    select: { userId: true }
                } : false,
            },
        });

        // BigInt 변환 & isLiked/isFollowing mapping
        const serializedPosts = posts.map((post: any) => ({
            ...post,
            recipe: post.recipe ? {
                ...post.recipe,
                rcpSno: post.recipe.rcpSno.toString()
            } : null,
            recipeId: post.recipeId ? post.recipeId.toString() : null,
            isLiked: user && post.likes?.length > 0, // Add isLiked boolean
            likes: undefined, // Remove raw likes array
            user: {
                ...post.user,
                isFollowing: user && post.user.followedBy?.length > 0, // Add isFollowing boolean
                followedBy: undefined, // Cleanup
            }
        }));

        const jsonResponse = JSON.stringify(
            {
                success: true,
                data: serializedPosts,
                nextCursor: posts.length === limit ? posts[posts.length - 1].id : null,
            },
            (key, value) => (typeof value === 'bigint' ? value.toString() : value)
        );

        return new NextResponse(jsonResponse, {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Community Feed error:', error);
        return new NextResponse(
            JSON.stringify(
                { success: false, error: '피드를 불러오는 중 오류가 발생했습니다.' },
                (key, value) => (typeof value === 'bigint' ? value.toString() : value)
            ),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
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
        console.log('API: Received post creation request:', { ...body, content: body.content?.substring(0, 50) + '...' });
        const { title, content, imageUrl, recipeId } = body;

        if (!title || !content) {
            return NextResponse.json(
                { success: false, error: '제목과 내용은 필수입니다.' },
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
                title,
                content,
                imageUrl,
                recipeId: recipeId ? BigInt(recipeId) : null,
            },
        });
        console.log('API: Post created successfully:', post.id);

        const jsonResponse = JSON.stringify(
            {
                success: true,
                data: {
                    ...post,
                    recipeId: post.recipeId ? post.recipeId.toString() : null,
                },
            },
            (key, value) => (typeof value === 'bigint' ? value.toString() : value)
        );
        return new NextResponse(jsonResponse, {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Post Creation error:', error);
        return new NextResponse(
            JSON.stringify(
                { success: false, error: '게시글 작성 중 오류가 발생했습니다.' },
                (key, value) => (typeof value === 'bigint' ? value.toString() : value)
            ),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
