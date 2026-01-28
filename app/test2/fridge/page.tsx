"use client";

import { useState } from "react";
import { TopAppBar } from "@/components/modules/TopAppBar";
import { CategoryFilter } from "@/components/modules/CategoryFilter";
import { FridgeList } from "@/components/modules/FridgeList";
import { IconButton } from "@/components/elements/IconButton"; // Correct import based on barrel

// Mock Data
const ITEMS = [
    { id: "1", name: "우유", quantity: "1개", expiryDate: "2026-01-30", category: "냉장", imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=100&q=80" },
    { id: "2", name: "계란", quantity: "10구", expiryDate: "2026-02-05", category: "냉장", imageUrl: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=100&q=80"  },
    { id: "3", name: "사과", quantity: "2개", expiryDate: "2026-01-31", category: "냉장", imageUrl: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&w=100&q=80" },
    { id: "4", name: "냉동만두", quantity: "1봉지", expiryDate: "2026-05-20", category: "냉동" },
    { id: "5", name: "양파", quantity: "3개", expiryDate: "2026-02-10", category: "실온", imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=100&q=80" },
];

const CATEGORIES = [
    { id: "all", label: "전체" },
    { id: "cold", label: "냉장", count: 3 },
    { id: "frozen", label: "냉동", count: 1 },
    { id: "room", label: "실온", count: 1 },
];

export default function MobileFridgePage() {
    const [selectedCat, setSelectedCat] = useState("all");

    // Simple Client-side filtering
    const filteredItems = selectedCat === "all" 
        ? ITEMS 
        : ITEMS.filter(i => {
            if (selectedCat === "cold") return i.category === "냉장";
            if (selectedCat === "frozen") return i.category === "냉동";
            if (selectedCat === "room") return i.category === "실온";
            return true;
        });

    return (
        <div className="flex flex-col h-full pb-20 bg-white min-h-screen">
             <TopAppBar 
                title="나의 냉장고"
                rightAction={<IconButton icon="Search" variant="ghost" size="sm" ariaLabel="Search" />}
             />
             
             {/* Sticky Category Header */}
             <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm pt-2 pb-2 border-b border-gray-100/50">
                <CategoryFilter 
                    categories={CATEGORIES}
                    selectedId={selectedCat}
                    onSelect={setSelectedCat}
                />
             </div>

             <div className="flex-1 px-4 py-2">
                {/* Total Count Header */}
                <div className="py-3 text-xs text-gray-400 font-medium">
                    총 {filteredItems.length}개의 식재료
                </div>
                
                <FridgeList 
                    items={filteredItems} 
                    onItemClick={(id) => console.log("Clicked item:", id)}
                    emptyMessage={
                        selectedCat === "all" 
                            ? "냉장고가 텅 비었어요!" 
                            : "이 카테고리에는 식재료가 없어요."
                    }
                />
             </div>
        </div>
    )
}
