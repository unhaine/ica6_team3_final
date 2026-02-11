"use client";

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
  EditModal
} from "../../components/modules/FridgeSection";

export default function FridgePage() {
  const router = useRouter();

  // 테스트 모드 설정 (true일 경우 목업 데이터 사용)
  const isTestMode = false;

  const {
    filteredItems,
    isLoading,
    activeFilter,
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

  // 헤더 설정
  useHeader({
    isVisible: true,
    title: "나의 냉장고",
    left: (
      <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-900">
        <ChevronLeft size={24} />
      </button>
    ),
    right: <IconButton icon="Search" variant="ghost" size="lg" ariaLabel="검색" />,
  });

  useFooter({
    isVisible: true,
  });

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#F9FAFB]">
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

      <FloatingCameraButton />

      <EditModal
        isOpen={editingItem !== null}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={(id, name, quantity) => {
          if (id) {
            handleSaveEdit(id, name, quantity);
          } else {
            handleAdd(name, quantity);
          }
        }}
      />
    </div>
  );
}
