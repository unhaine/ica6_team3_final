"use client";

import { ReactNode } from "react";
import { HeaderProvider, Header } from "@/components/modules/Header";
import { FooterProvider, Footer } from "@/components/modules/Footer";

// ... imports ...
// ... imports ...
import * as LucideIcons from "lucide-react";
import { useFooter } from "@/components/modules/Footer"; // Import hook
import { NAV_ITEMS } from "./constants";

// Helper component to initialize Footer state once
const GlobalFooterController = () => {
    
  // Map string icons to actual components
  const footerItems = NAV_ITEMS.map(item => ({
      ...item,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: (LucideIcons as any)[item.icon]
  }));

  useFooter({
    isVisible: true,
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
        <div className="h-screen w-full bg-slate-100 flex justify-center overflow-hidden font-sans">
          {/* Mobile App Shell */}
          <div className="w-full max-w-[480px] bg-white h-full relative shadow-2xl flex flex-col border-x border-slate-200">
            
            {/* 1. Header: Fixed at top */}
            <Header className="flex-none relative z-50 shadow-sm" /> 
            
            {/* 2. Main Content: Scrollable Area */}
            <main className="flex-1 w-full relative bg-slate-50/30 flex flex-col overflow-hidden">
                {children}
            </main>
            
            {/* 3. Footer: Fixed at bottom */}
            <Footer className="flex-none relative z-50 border-t bg-white/80 backdrop-blur-lg" />

          </div>
        </div>
      </FooterProvider>
    </HeaderProvider>
  );
}
