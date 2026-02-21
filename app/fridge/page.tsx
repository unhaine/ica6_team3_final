"use client";

import { useState } from "react";
import { ChevronLeft, Plus, Check } from "lucide-react";
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
    items,
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
    sortedItems,
  } = useFridge(isTestMode ? MOCK_INGREDIENTS : undefined);

  // 선택 상태 관리
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const allGroupedIds = sortedItems.map((item) => item.id);
  const isAllSelected = allGroupedIds.length > 0 && selectedItems.length === allGroupedIds.length;

  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allGroupedIds);
    }
  };

  const handleToggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (confirm(`선택한 ${selectedItems.length}개의 재료를 정말 삭제하시겠습니까?`)) {
      selectedItems.forEach((id) => handleDelete(id));
      setSelectedItems([]);
    }
  };

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

      {/* Sticky Selection Toolbar */}
      {!isLoading && sortedItems.length > 0 && (
        <div className="shrink-0 bg-[#F9FAFB] px-5 py-3 border-b border-gray-100 flex items-center justify-between z-10 shadow-sm">
          <button
            onClick={handleToggleAll}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <div
              className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                isAllSelected ? "border-orange-500 bg-orange-500 text-white" : "border-gray-300 bg-white"
              }`}
            >
              {isAllSelected && (
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              )}
            </div>
            전체 선택
          </button>
          <div className="h-5">
            {selectedItems.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="text-sm font-semibold text-red-500 hover:text-red-700 transition"
              >
                선택 삭제 ({selectedItems.length})
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        {isLoading ? (
          <EmptyState isLoading={true} />
        ) : sortedItems.length === 0 ? (
          <EmptyState isLoading={false} />
        ) : (
            <div className="space-y-2 mb-6">
              {sortedItems.map((item) => (
                <FridgeItem
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.includes(item.id)}
                  onToggle={handleToggleItem}
                  onEdit={handleEdit}
                  onUse={handleUse}
                />
              ))}
            </div>
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
