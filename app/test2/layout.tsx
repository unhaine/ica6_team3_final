import { ReactNode } from "react";
import { BottomNavBar } from "@/components/modules/BottomNavBar";

export default function MobileLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl overflow-x-hidden pb-20">
        {/* Main Content Area */}
        <main className="h-full w-full">
            {children}
        </main>
        
        {/* Navigation - Logic to hide on specific pages is handled within components or route groups, 
            but for now we include it globally. Detailed visibility control can be added later. */}
        <BottomNavBar />
      </div>
    </div>
  );
}
