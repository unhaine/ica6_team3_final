import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Post, Comment } from '@/types/community';
import { useSession } from 'next-auth/react';

export function useCommunity() {
    const { data: session } = useSession();

    const handleLike = useCallback(async (
        post: Post, 
        setPosts?: React.Dispatch<React.SetStateAction<Post[]>>,
        setPostState?: (isLiked: boolean, count: number) => void
    ) => {
        if (!session) {
            toast.error("로그인이 필요합니다.");
            return;
        }

        const prevLiked = post.isLiked;
        const prevCount = post._count.likes;

        // Optimistic UI update for lists
        if (setPosts) {
            setPosts(prev => prev.map(p => {
                if (p.id === post.id) {
                    return {
                        ...p,
                        isLiked: !prevLiked,
                        _count: {
                            ...p._count,
                            likes: prevLiked ? prevCount - 1 : prevCount + 1
                        }
                    };
                }
                return p;
            }));
        }

        // Optimistic UI update for detail
        if (setPostState) {
            setPostState(!prevLiked, prevLiked ? prevCount - 1 : prevCount + 1);
        }

        try {
            const res = await fetch(`/api/community/posts/${post.id}/like`, {
                method: 'POST',
            });
            if (!res.ok) throw new Error();
        } catch (error) {
            // Revert on error
            if (setPosts) {
                setPosts(prev => prev.map(p => {
                    if (p.id === post.id) {
                        return {
                            ...p,
                            isLiked: prevLiked,
                            _count: { ...p._count, likes: prevCount }
                        };
                    }
                    return p;
                }));
            }
            if (setPostState) {
                setPostState(prevLiked, prevCount);
            }
            toast.error("오류가 발생했습니다.");
        }
    }, [session]);

    const handleDelete = useCallback(async (postId: string, onSuccess?: () => void) => {
        if (!confirm('정말로 삭제하시겠습니까?')) return;

        try {
            const res = await fetch(`/api/community/posts/${postId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success('게시글이 삭제되었습니다.');
                onSuccess?.();
            } else {
                toast.error('삭제 실패');
            }
        } catch (error) {
            console.error(error);
            toast.error('오류가 발생했습니다.');
        }
    }, []);

    const handleFollow = useCallback(async (userId: string, currentFollowing: boolean, setIsFollowing: (val: boolean) => void) => {
        if (!session) {
            toast.error("로그인이 필요합니다.");
            return;
        }

        setIsFollowing(!currentFollowing); // Optimistic

        try {
            const res = await fetch(`/api/users/${userId}/follow`, {
                method: 'POST',
            });
            if (!res.ok) throw new Error();
        } catch (error) {
            setIsFollowing(currentFollowing); // Revert
            toast.error("팔로우 처리 중 오류가 발생했습니다.");
        }
    }, [session]);

    return {
        handleLike,
        handleDelete,
        handleFollow,
        session
    };
}
