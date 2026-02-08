"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Post, Comment } from "@/types/community";
import { useCommunity } from "./useCommunity";

export function usePostDetail(postId: string | undefined) {
    const { session, handleLike, handleDelete, handleFollow } = useCommunity();
    
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const fetchComments = useCallback(async (id: string) => {
        try {
            const res = await fetch(`/api/community/posts/${id}/comments`);
            const data = await res.json();
            if (data.success) setComments(data.data);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    }, []);

    const fetchPost = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/community/posts/${id}`);
            const data = await response.json();
            if (data.success) {
                setPost(data.data);
                setIsLiked(data.data.isLiked);
                setLikeCount(data.data._count.likes);
                setIsFollowing(data.data.user.isFollowing || false);
                fetchComments(id);
            } else {
                toast.error("게시글을 찾을 수 없습니다.");
                return false;
            }
            return true;
        } catch (error) {
            console.error('Failed to fetch post:', error);
            toast.error("오류가 발생했습니다.");
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchComments]);

    useEffect(() => {
        if (postId) {
            fetchPost(postId);
        }
    }, [postId, fetchPost]);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !session || !post) return;

        setSubmittingComment(true);
        try {
            const res = await fetch(`/api/community/posts/${post.id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: commentText }),
            });
            const data = await res.json();
            if (data.success) {
                setComments(prev => [...prev, data.data]);
                setCommentText("");
                toast.success("댓글이 등록되었습니다.");
            }
        } catch (error) {
            console.error(error);
            toast.error("댓글 등록 실패");
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm("댓글을 삭제하시겠습니까?")) return;
        try {
            const res = await fetch(`/api/community/comments/${commentId}`, { method: 'DELETE' });
            if (res.ok) {
                setComments(prev => prev.filter(c => c.id !== commentId));
                toast.success("댓글이 삭제되었습니다.");
            }
        } catch (error) {
            toast.error("삭제 실패");
        }
    };

    const onLike = useCallback(() => {
        if (!post) return;
        handleLike(post, undefined, (liked, count) => {
            setIsLiked(liked);
            setLikeCount(count);
        });
    }, [post, handleLike]);

    const onFollow = useCallback(() => {
        if (!post) return;
        handleFollow(post.userId, isFollowing, setIsFollowing);
    }, [post, handleFollow, isFollowing]);

    return {
        post,
        loading,
        isLiked,
        likeCount,
        comments,
        commentText,
        setCommentText,
        submittingComment,
        isFollowing,
        session,
        handleSubmitComment,
        handleDeleteComment,
        onLike,
        onFollow,
        handleDelete,
        refreshPost: () => postId && fetchPost(postId)
    };
}
