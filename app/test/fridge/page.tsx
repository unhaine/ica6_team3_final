"use client";

import { useState } from "react";
import { Search, Trash2, PenLine, ScrollText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { DataList, FilterCarousel, SwipeableRow } from "@/components/modules";
import { ActionCard, DataRow, AvatarThumbnail, SelectableChip, IconButton } from "@/components/elements";
import { STYLES } from "@/components/modules/FilterCarousel/FilterCarousel.style";
import { FILTERS, MOCK_ITEMS } from "./data";

// --- Page Component ---
export default function FridgeTestPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const [items, setItems] = useState(MOCK_ITEMS);

  // 1. 헤더 설정
  useHeader({
    isVisible: true,
    title: "나의 냉장고",
    right: <IconButton icon="Search" variant="ghost" ariaLabel="검색" />,
  });

  useFooter({
    isVisible: true,
  });

  // 필터링 로직
  const filteredItems = activeFilter === "all" 
    ? items 
    : items.filter(item => item.type === activeFilter);

  // 삭제 핸들러
  const handleDelete = (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* 1. Category Filter Area */}
      <div className={STYLES.stickySection}>
        <FilterCarousel
          data={FILTERS}
          keyExtractor={(item) => item.id}
          renderItem={(filter) => (
            <SelectableChip
              label={filter.label}
              selected={activeFilter === filter.id}
              onClick={() => setActiveFilter(filter.id)}
            />
          )}
        />
      </div>

      {/* 2. Scrollable List Area */}
      <DataList
        data={filteredItems}
        className="flex-1 overflow-y-auto space-y-3 p-4 pb-24 scrollbar-hide" 
        
        ListEmptyComponent={
          <div className="flex flex-col items-center justify-center py-20 text-text-tertiary">
            <Search className="w-12 h-12 mb-2 opacity-20" />
            <p>보관 중인 식재료가 없습니다.</p>
          </div>
        }

        renderItem={(item) => (
          <SwipeableRow
            key={item.id}
            actionWidth={180} // 60px * 3 buttons
            
            // Right Action: 사용(초록) + 수정(파랑) + 삭제(빨강)
            rightAction={
              <div className="flex h-full w-full">
                <button 
                  className="flex-1 flex items-center justify-center bg-emerald-500 text-white shadow-inner active:bg-emerald-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`${item.name} 사용`);
                  }}
                >
                  <ScrollText className="w-5 h-5" />
                </button>
                <button 
                  className="flex-1 flex items-center justify-center bg-blue-500 text-white shadow-inner active:bg-blue-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`${item.name} 수정`);
                  }}
                >
                  <PenLine className="w-5 h-5" />
                </button>
                <button 
                  className="flex-1 flex items-center justify-center bg-red-500 text-white shadow-inner active:bg-red-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            }
          >
            {/* Front Card Content */}
            <ActionCard className="bg-surface overflow-hidden border-border-subtle shadow-sm">
              <DataRow
                left={<AvatarThumbnail src={item.image} fallback={item.name[0]} />}
                title={item.name}
                subTitle={<span className="text-text-secondary font-medium">{item.quantity}</span>}
                right={
                  <div className={`text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${
                    parseInt(item.remaining.replace('D-', '')) <= 3 
                      ? 'bg-rose-500 text-white' 
                      : 'bg-emerald-500 text-white'
                  }`}>
                     {item.remaining}
                  </div>
                }
              />
            </ActionCard>
          </SwipeableRow>
        )}
      />

      {/* 3. Floating Camera Button */}
      <div className="absolute bottom-6 right-6 z-30">
        <IconButton 
          icon="Camera" 
          variant="default" 
          className="rounded-full shadow-xl w-16 h-16 flex items-center justify-center text-white bg-primary hover:bg-primary/90 transition-all active:scale-95"
          onClick={() => router.push("/test/camera")}
          ariaLabel="카메라"
        />
      </div>
    </div>
  );
}
