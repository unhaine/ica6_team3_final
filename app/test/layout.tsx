"use client";

import { ReactNode, useMemo } from "react";
import { HeaderProvider, Header } from "@/components/modules/Header";
import { FooterProvider, Footer } from "@/components/modules/Footer";

// ... imports ...
// ... imports ...
import * as LucideIcons from "lucide-react";
import { useFooter } from "@/components/modules/Footer"; // Import hook
import { NAV_ITEMS } from "./constants";
import { usePathname } from "next/navigation";

// Helper component to initialize Footer state once
const GlobalFooterController = () => {
  const pathname = usePathname();
  // Map string icons to actual components (memoized)
  const footerItems = useMemo(() => NAV_ITEMS.map((item) => ({
      ...item,
      icon: LucideIcons[item.icon as keyof typeof LucideIcons] as React.ElementType
  })), []);

  useFooter({
    isVisible: !pathname.includes("/test/camera"),
    items: footerItems,
  });
  return null;
};

export default function MobileTestLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <HeaderProvider>
      <FooterProvider>
        {/* Initialize Global Footer State */}
        <GlobalFooterController />
        
        {/* Viewport Container: 100vh height, no window scroll */}
        <div className="h-screen w-full bg-surface-alt flex justify-center overflow-hidden font-sans">
          {/* Mobile App Shell */}
          <div className="w-full max-w-[480px] bg-surface h-full relative shadow-2xl flex flex-col">
            
            {/* 1. Header: Fixed at top */}
            <Header className="flex-none relative z-50 shadow-sm" /> 
            
            {/* 2. Main Content: Scrollable Area */}
            <main className="flex-1 w-full relative bg-surface-alt flex flex-col overflow-hidden">
                {children}
            </main>
            
            {/* 3. Footer: Fixed at bottom */}
            <Footer className="flex-none relative z-50 border-t bg-surface/80 backdrop-blur-lg" />

          </div>
        </div>
      </FooterProvider>
    </HeaderProvider>
  );
}
