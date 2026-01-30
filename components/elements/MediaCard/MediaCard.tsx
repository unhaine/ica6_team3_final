import React from "react";
import { ActionCard } from "@/components/elements/ActionCard";
import { MediaCardProps } from "./MediaCard.type";
import { STYLES } from "./MediaCard.style";
import { cn } from "@/lib/utils";

/**
 * MediaCard Element (Generic)
 * @description 이미지(미디어)가 상단에 있고 하단에 정보가 있는 표준 카드 UI.
 * 레시피, 뉴스, 블로그, 상품 등 다양한 용도로 사용 가능.
 */
export const MediaCard = ({
    imageUrl,
    title,
    badge,
    description,
    overlay,
    footer,
    footerLeft,
    footerRight,
    aspectRatio = "video",
    className,
    ...props
}: MediaCardProps) => {
    return (
        <ActionCard className={cn(STYLES.container, className)} {...props}>
            {/* 1. Media Section */}
            {imageUrl && (
                <div className={STYLES.imageWrapper(aspectRatio)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src={imageUrl} 
                        alt={typeof title === 'string' ? title : "Media Thumbnail"} 
                        className={STYLES.image}
                    />
                    
                    {/* Overlay Badges */}
                    {overlay && (
                        <div className={STYLES.overlay}>
                            {overlay}
                        </div>
                    )}
                </div>
            )}

            {/* 2. Content Section */}
            <div className={STYLES.content}>
                {/* Header: Title + Badge */}
                <div className={STYLES.header}>
                    <h3 className={STYLES.title}>{title}</h3>
                    {badge && <div className={STYLES.badge}>{badge}</div>}
                </div>
                
                {/* Description */}
                {description && (
                    <div className={STYLES.description}>
                        {description}
                    </div>
                )}

                {/* Footer */}
                {(footer || footerLeft || footerRight) && (
                    <div className={STYLES.footer}>
                        {footer ? footer : (
                            <>
                                <div className={STYLES.footerLeft}>{footerLeft}</div>
                                <div className={STYLES.footerRight}>{footerRight}</div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </ActionCard>
    );
};
