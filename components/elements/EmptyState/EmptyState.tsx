import React from "react";
import { cn } from "@/lib/utils";
import { PackageOpen } from "lucide-react";
import { STYLES } from "./EmptyState.style";
import { EmptyStateProps } from "./EmptyState.type";

/**
 * EmptyState Element
 * @description 데이터가 없을 때 보여주는 표준화된 빈 상태 UI
 */
export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = "데이터가 없습니다",
  description,
  className,
  action,
}: EmptyStateProps) => {
  return (
    <div className={cn(STYLES.container, className)}>
      <div className={STYLES.iconWrapper}>
        <Icon className={STYLES.icon} />
      </div>
      {title && <h3 className={STYLES.title}>{title}</h3>}
      {description && <p className={STYLES.description}>{description}</p>}
      
      {action && <div className={STYLES.action}>{action}</div>}
    </div>
  );
};
