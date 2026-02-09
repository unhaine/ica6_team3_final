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
    layout = "vertical",
    imageClassName,
    contentClassName,
    footerClassName,
    metadata,
    className,
    ...props
}: MediaCardProps) => {
    return (
        <ActionCard className={cn(STYLES.container(layout, aspectRatio), className)} {...props}>
            {/* 1. Media Section */}
            {imageUrl && (
                <div className={cn(STYLES.imageWrapper(aspectRatio, layout), imageClassName)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src={imageUrl} 
                        alt={typeof title === 'string' ? title : "Media Thumbnail"} 
                        className={STYLES.image}
                    />
                    
                    {/* Background Gradient for Full Layout */}
                    {layout === "full" && <div className={STYLES.gradient} />}

                    {/* Overlay Badges */}
                    {overlay && (
                        <div className={STYLES.overlay}>
                            {overlay}
                        </div>
                    )}
                </div>
            )}

            {/* 2. Content Section */}
            <div className={cn(STYLES.content(layout), contentClassName)}>
                {/* Header: Title */}
                <div className={STYLES.header}>
                    <h3 className={STYLES.title}>{title}</h3>
                </div>
                
                {/* Metadata & Tag Area (Badge + Metadata inside) */}
                {(badge || metadata) && (
                    <div className="flex flex-wrap gap-1.5 mt-1 mb-2">
                        {badge && (
                            <div className="text-[10px] text-primary font-bold bg-primary/10 px-1.5 py-0.5 rounded shrink-0">
                                {badge}
                            </div>
                        )}
                        {metadata?.map((meta, idx) => {
                            const Icon = meta.icon;
                            return (
                                <div key={idx} className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
                                    {Icon && <Icon className="w-2.5 h-2.5" />}
                                    {meta.label}
                                </div>
                            );
                        })}
                    </div>
                )}
                
                {/* Description */}
                {description && (
                    <div className={STYLES.description}>
                        {description}
                    </div>
                )}

                {/* Footer */}
                {(footer || footerLeft || footerRight) && (
                    <div className={cn(STYLES.footer, footerClassName)}>
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
