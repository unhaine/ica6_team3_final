"use client";

import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/modules/AppHeader";
import { TopAppBarProps } from "./TopAppBar.type";

const PAGE_TITLES: Record<string, string> = {
  "/mobile/fridge": "나의 냉장고",
  "/mobile/recipes": "추천 레시피",
  "/mobile/profile": "프로필",
  "/mobile/scan": "냉장고 촬영",
  "/mobile/checklist": "장보기 목록",
};

/**
 * TopAppBar Module
 * @description A smart wrapper around AppHeader that automatically determines
 * the title and back button state based on the current route.
 */
export const TopAppBar = ({
  title,
  showBack,
  onBack,
  rightAction,
  transparent,
  hidden = false,
}: TopAppBarProps) => {
  const pathname = usePathname();

  if (hidden) return null;

  // 1. Determine Title
  // If explicitly provided, use it.
  // Otherwise, look up the path map.
  // If dashboard, title is undefined (AppHeader will show Logo).
  let displayTitle = title;
  if (!displayTitle) {
    displayTitle = PAGE_TITLES[pathname];
  }

  // 2. Determine Back Button
  // Show back button if explicitly requested or if we are in a sub-page (detail).
  // Simple heuristic: path segments > 3 (e.g. /mobile/recipes/123)
  const isDeepRoute = pathname.split("/").length > 3;
  const shouldShowBack = showBack ?? isDeepRoute;

  return (
    <AppHeader
      title={displayTitle}
      showBack={shouldShowBack}
      onBack={onBack}
      rightAction={rightAction}
      transparent={transparent}
    />
  );
};
