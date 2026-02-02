"use client";

import { useState, useEffect } from "react";
import { Search, Trash2, PenLine, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { DataList, FilterCarousel, SwipeableRow } from "@/components/modules";
import { ActionCard, DataRow, AvatarThumbnail, SelectableChip, IconButton } from "@/components/elements";
import { STYLES } from "@/components/modules/FilterCarousel/FilterCarousel.style";
import { FILTERS } from "./data";
import { EditModal } from "./components/EditModal";

// --- Page Component ---
export default function FridgeTestPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");
  const [items, setItems] = useState<Array<{
    id: string;
    name: string;
    quantity: string | null;
    category: string | null;
    createdAt: Date;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<{
    id: string;
    name: string;
    quantity: string | null;
  } | null>(null);

  // 1. 헤더 설정
  useHeader({
    isVisible: true,
    title: "나의 냉장고",
    right: <IconButton icon="Search" variant="ghost" ariaLabel="검색" />,
  });

  useFooter({
    isVisible: true,
  });

  // 재료 목록 불러오기
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/ingredients');
        const data = await response.json();
        
        if (data.success) {
          setItems(data.data);
        } else {
          console.error('재료 목록 조회 실패:', data.error);
        }
      } catch (error) {
        console.error('재료 목록 조회 에러:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  // 필터링 로직
  const filteredItems = activeFilter === "all" 
    ? items 
    : items.filter(item => item.category === activeFilter);

  // 삭제 핸들러
  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`/api/ingredients?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setItems(prev => prev.filter(item => item.id !== id));
        alert('✅ 재료가 삭제되었습니다.');
      } else {
        alert(`❌ 삭제 실패: ${data.error}`);
      }
    } catch (error) {
      console.error('삭제 에러:', error);
      alert('❌ 삭제 중 오류가 발생했습니다.');
    }
  };

  // 수정 핸들러
  const handleEdit = (item: { id: string; name: string; quantity: string | null }) => {
    setEditingItem(item);
  };

  // 수정 저장 핸들러
  const handleSaveEdit = async (id: string, name: string, quantity: string) => {
    try {
      const response = await fetch(`/api/ingredients?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          quantity: quantity || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setItems(prev => prev.map(item => 
          item.id === id 
            ? { ...item, name, quantity: quantity || null }
            : item
        ));
        setEditingItem(null);
        alert('✅ 재료가 수정되었습니다.');
      } else {
        alert(`❌ 수정 실패: ${data.error}`);
      }
    } catch (error) {
      console.error('수정 에러:', error);
      alert('❌ 수정 중 오류가 발생했습니다.');
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
            <p>{isLoading ? '재료를 불러오는 중...' : '보관 중인 식재료가 없습니다.'}</p>
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
                  <FileText className="w-5 h-5" />
                </button>
                <button 
                  className="flex-1 flex items-center justify-center bg-blue-500 text-white shadow-inner active:bg-blue-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(item);
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
                left={<AvatarThumbnail src={null} fallback={item.name[0]} />}
                title={item.name}
                subTitle={<span className="text-text-secondary font-medium">{item.quantity || '수량 없음'}</span>}
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

      {/* 수정 모달 */}
      <EditModal
        isOpen={editingItem !== null}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
