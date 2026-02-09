export interface Post {
    id: string;
    userId: string;
    title: string;
    content: string;
    imageUrl: string;
    createdAt: string;
    recipeId: string | null;
    user: {
        id?: string;
        name: string | null;
        image: string | null;
        isFollowing?: boolean;
    };
    recipe?: {
        ckgNm: string;
    };
    _count: {
        likes: number;
        comments: number;
    };
    isLiked: boolean;
}

export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
}

export interface CommunityFilter {
    id: string;
    label: string;
}

export const COMMUNITY_FILTERS: CommunityFilter[] = [
    { id: "all", label: "All" },
    { id: "new", label: "New ✨" },
    { id: "hot", label: "Hot 🔥" },
    { id: "following", label: "Following 🤝" },
];
