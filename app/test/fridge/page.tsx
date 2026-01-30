"use client";

import { useState } from "react";
import { Search, Camera, Trash2, PenLine } from "lucide-react";
import { useHeader } from "@/components/modules/Header";
import { DataList, FilterCarousel, SwipeableRow } from "@/components/modules";
import { ActionCard, DataRow, AvatarThumbnail, SelectableChip } from "@/components/elements";
import { IconButton } from "@/components/elements/IconButton";
import { FILTERS, MOCK_ITEMS } from "./data";

// --- Page Component ---
export default function FridgeTestPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [items, setItems] = useState(MOCK_ITEMS);

  // 1. 헤더 설정
  useHeader({
    isVisible: true,
    title: "나의 냉장고",
    right: <IconButton icon="Search" variant="ghost" ariaLabel="검색" />,
  });

  // 2. 푸터 설정 (Global Layout에서 처리됨)
  // useFooter 제거됨 ✨

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
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* 1. Fixed Filter Area (Not Sticky anymore) */}
      <div className="shrink-0 z-10 bg-white/95 backdrop-blur shadow-sm pt-2 pb-2">
        <FilterCarousel
          data={FILTERS}
          keyExtractor={(item) => item.id}
          className="px-4"
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
        // flex-1 to take remaining space, overflow-y-auto to scroll internally
        className="flex-1 overflow-y-auto space-y-3 p-4 pb-24 scrollbar-hide" 
        
        ListEmptyComponent={
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Search className="w-12 h-12 mb-2 opacity-20" />
            <p>보관 중인 식재료가 없습니다.</p>
          </div>
        }

        renderItem={(item) => (
          <SwipeableRow
            key={item.id}
            actionWidth={140} // 두 개의 버튼을 위한 너비 (70px * 2)
            
            // Right Action: 수정(파랑) + 삭제(빨강)
            rightAction={
              <div className="flex h-full w-full">
                <button 
                  className="flex-1 flex items-center justify-center bg-blue-500 text-white shadow-inner active:bg-blue-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation(); // 카드 클릭 방지
                    alert(`${item.name} 수정`);
                  }}
                >
                  <PenLine className="w-5 h-5" />
                </button>
                <button 
                  className="flex-1 flex items-center justify-center bg-red-500 text-white shadow-inner active:bg-red-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation(); // 카드 클릭 방지
                    handleDelete(item.id);
                  }}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            }
          >
            {/* Front Card Content */}
            <ActionCard className="bg-white">
              <DataRow
                left={<AvatarThumbnail src={item.image} fallback={item.name[0]} />}
                title={item.name}
                subTitle={`${item.quantity} • ${item.remaining}`}
                right={
                  <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                    item.type === 'frozen' ? 'bg-blue-100 text-blue-600' :
                    item.type === 'room' ? 'bg-orange-100 text-orange-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                     D-{item.id} 
                  </div>
                }
              />
            </ActionCard>
          </SwipeableRow>
        )}

        // 마지막 Footer: 카메라 추가 카드
        ListFooterComponent={
          <ActionCard 
            variant="dashed" 
            className="mt-3 flex flex-row items-center justify-center gap-3 py-6 text-gray-500 hover:text-primary hover:bg-primary/5 hover:border-primary/50 transition-colors"
            onClick={() => alert("카메라 촬영 시작")}
          >
            <Camera className="w-6 h-6" />
            <span className="font-medium">식재료 촬영하여 추가하기</span>
          </ActionCard>
        }
      />
    </div>
  );
}
