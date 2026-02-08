/**
 * HTML 내용에서 썸네일 URL 추출
 * (data-is-thumbnail="true" 우선, 그 다음 첫 번째 img)
 */
export const extractThumbnail = (htmlContent: string): string | null => {
    try {
        // 1. Check for data-is-thumbnail="true"
        const thumbnailMatch = htmlContent.match(/<img[^>]+data-is-thumbnail="true"[^>]+src="([^">]+)"/i) ||
            htmlContent.match(/<img[^>]+src="([^">]+)"[^>]+data-is-thumbnail="true"/i);
        if (thumbnailMatch) return thumbnailMatch[1];

        // 2. Fallback to first image
        const firstImgMatch = htmlContent.match(/<img[^>]+src="([^">]+)"/i);
        return firstImgMatch ? firstImgMatch[1] : null;
    } catch (e) {
        console.error('Thumbnail extraction error:', e);
        return null;
    }
};
