"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Refrigerator, Plus, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { BottomNavBarProps } from "./BottomNavBar.type";
import { STYLES } from "./BottomNavBar.style";

const NAV_ITEMS = [
  { label: "홈", icon: Home, href: "/test2" },
  { label: "내 냉장고", icon: Refrigerator, href: "/test2/fridge" },
  { label: "추가", icon: Plus, href: "/test2/scan", isFab: true },
  { label: "레시피", icon: BookOpen, href: "/test2/recipes" },
  { label: "프로필", icon: User, href: "/test2/profile" },
];

/**
 * BottomNavBar Module
 * @description Fixed bottom navigation for mobile application.
 * Highlights the active route.
 */
export const BottomNavBar = ({ className, currentPath, ...props }: BottomNavBarProps) => {
  const pathname = usePathname();
  const activePath = currentPath || pathname;

  // Routes where the bottom nav should be hidden
  const isHidden = 
    pathname === "/mobile" || 
    pathname.startsWith("/mobile/onboarding") || 
    pathname.startsWith("/mobile/login") ||
    pathname.startsWith("/mobile/scan");

  if (isHidden) return null;

  return (
    <nav className={cn(STYLES.container, className)} {...props}>
      {NAV_ITEMS.map((item) => {
        const isActive = activePath === item.href;
        
        if (item.isFab) {
          return (
            <div key={item.href} className={STYLES.fabContainer}>
              <Link href={item.href} className={STYLES.fab}>
                <item.icon className="h-7 w-7" />
                <span className="sr-only">{item.label}</span>
              </Link>
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={STYLES.item(isActive)}
            aria-current={isActive ? "page" : undefined}
          >
            <item.icon className={STYLES.icon} />
            <span className={STYLES.label}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
