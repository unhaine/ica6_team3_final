import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import prisma from '@/lib/prisma';

// Helper to get the community post model safely
const getPostModel = (p: any) => p.communityPost || p.CommunityPost || p.post || p.Post;

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const postModel = getPostModel(prisma);

        if (!postModel) {
            return NextResponse.json({ success: false, error: 'Database model not found' }, { status: 500 });
        }

        // Check auth for isLiked
        const authResult = await requireAuth();
        const user = 'user' in authResult ? authResult.user : null;

        const post = await postModel.findUnique({
            where: { id },
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
                likes: user ? {
                    where: { userId: user.id },
                    select: { userId: true }
                } : false,
            },
        });

        if (!post) {
            return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        }

        // BigInt serialization
        const serializedPost = {
            ...post,
            recipe: post.recipe ? {
                ...post.recipe,
                rcpSno: post.recipe.rcpSno.toString()
            } : null,
            recipeId: post.recipeId ? post.recipeId.toString() : null,
            isLiked: user && post.likes?.length > 0,
            likes: undefined,
            user: {
                ...post.user,
                isFollowing: user && post.user.followedBy?.length > 0,
                followedBy: undefined,
            }
        };

        return NextResponse.json({ success: true, data: serializedPost });
    } catch (error) {
        console.error('Fetch Post Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await requireAuth();
        if ('error' in authResult) return authResult.error;
        const user = authResult.user;
        const { id } = await params;

        const body = await req.json();
        const { title, content, imageUrl } = body;

        const postModel = getPostModel(prisma);

        const existingPost = await postModel.findUnique({ where: { id } });

        if (!existingPost) {
            return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        }

        if (existingPost.userId !== user.id) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        const updatedPost = await postModel.update({
            where: { id },
            data: {
                title,
                content,
                imageUrl, // Optional update
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                ...updatedPost,
                recipeId: updatedPost.recipeId ? updatedPost.recipeId.toString() : null,
            }
        });

    } catch (error) {
        console.error('Update Post Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await requireAuth();
        if ('error' in authResult) return authResult.error;
        const user = authResult.user;
        const { id } = await params;

        const postModel = getPostModel(prisma);
        const existingPost = await postModel.findUnique({ where: { id } });

        if (!existingPost) {
            return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        }

        if (existingPost.userId !== user.id) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        await postModel.delete({ where: { id } });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Delete Post Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
