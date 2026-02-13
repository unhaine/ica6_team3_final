"use client";

import { useState } from "react";
import { ChevronLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { DataList } from "@/components/modules";
import { IconButton } from "@/components/elements";

import { MOCK_INGREDIENTS } from "../../data/mock/fridge";
import { useFridge } from "../../hooks/useFridge";
import {
  FridgeFilter,
  FridgeItem,
  EmptyState,
  FloatingCameraButton,
  EditModal,
  RecipeRecommendationRow
} from "../../components/modules/FridgeSection";
import { useHomeRecommendations } from "../../hooks/useHomeRecommendations";

export default function FridgePage() {
  const router = useRouter();
  const [isSearchMode, setIsSearchMode] = useState(false);

  // 테스트 모드 설정 (true일 경우 목업 데이터 사용)
  const isTestMode = false;

  const {
    filteredItems,
    isLoading,
    activeFilter,
    searchQuery,
    setSearchQuery,
    editingItem,
    setActiveFilter,
    handleDelete,
    handleEdit,
    handleSaveEdit,
    handleAdd,
    handleUse,
    setEditingItem,
    groupedItems,
  } = useFridge(isTestMode ? MOCK_INGREDIENTS : undefined);

  // 추천 레시피 가져오기
  const { recipes: recommendedRecipes, isLoading: isRecipeLoading } = useHomeRecommendations();

  // 헤더 설정
  useHeader({
    isVisible: true,
    title: isSearchMode ? (
      <div className="w-full pr-4">
        <input
          autoFocus
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="재료 이름을 검색하세요"
          className="w-full bg-transparent border-none text-lg placeholder:text-gray-300 focus:ring-0 px-0 py-1"
        />
      </div>
    ) : "나의 냉장고",
    left: !isSearchMode ? (
      <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-900">
        <ChevronLeft size={24} />
      </button>
    ) : null,
    right: isSearchMode ? (
      <button
        onClick={() => {
          setIsSearchMode(false);
          setSearchQuery("");
        }}
        className="text-sm font-medium text-gray-500 hover:text-gray-900 px-2"
      >
        취소
      </button>
    ) : (
      <IconButton
        icon="Search"
        variant="ghost"
        size="lg"
        ariaLabel="검색"
        onClick={() => setIsSearchMode(true)}
      />
    ),
  });

  useFooter({
    isVisible: true,
  });

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#F9FAFB]">
      {/* Top Section Removed (Moved to Bottom) */}

      <FridgeFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        {isLoading ? (
          <EmptyState isLoading={true} />
        ) : groupedItems.length === 0 ? (
          <EmptyState isLoading={false} />
        ) : (
          groupedItems.map((group) => (
            <div key={group.date} className="mb-6">
              <h3 className="text-sm font-bold text-gray-500 mb-3 sticky top-0 bg-[#F9FAFB] py-2 z-10">
                {group.date}
              </h3>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <FridgeItem
                    key={item.id}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onUse={handleUse}
                  />
                ))}
              </div>
            </div>
          ))
        )}

        {/* Footer Button */}
        <button
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:border-primary hover:text-primary transition-all active:scale-[0.98] mt-2 mb-4 bg-white/50"
          onClick={() => setEditingItem({ id: '', name: '', quantity: '' })}
        >
          <Plus className="w-5 h-5" />
          <span className="font-bold">재료 직접 추가</span>
        </button>
      </div>

      {/* Recipe Recommendations (Fixed at Bottom) */}
      <div className="flex-none bg-white z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <RecipeRecommendationRow
          recipes={recommendedRecipes}
          isLoading={isRecipeLoading}
        />
      </div>

      <FloatingCameraButton />

      <EditModal
        isOpen={editingItem !== null}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={(id, name, quantity, expiryDate) => {
          if (id) {
            handleSaveEdit(id, name, quantity, expiryDate);
          } else {
            handleAdd(name, quantity, expiryDate);
          }
        }}
      />
    </div>
  );
}
