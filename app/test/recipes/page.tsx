"use client";

import { useState } from "react";
import { Heart, Bookmark, Eye, Clock, ChefHat } from "lucide-react";
import { useHeader } from "@/components/modules/Header";
import { DataList, FilterCarousel } from "@/components/modules";
import { SelectableChip, MediaCard } from "@/components/elements"; // MediaCard Import
import { EmptyState } from "@/components/elements/EmptyState"; // EmptyState Import
import { IconButton } from "@/components/elements/IconButton";
import { MOCK_RECIPES, Recipe } from "./data";

// --- Filters ---
const RECIPE_FILTERS = [
  { id: "all", label: "전체" },
  { id: "korean", label: "🍚 한식" },
  { id: "western", label: "🍝 양식" },
  { id: "chinese", label: "🥘 중식" },
  { id: "japanese", label: "🍣 일식" },
  { id: "easy", label: "⏱️ 초간단" },
];

export default function RecipeTestPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [recipes] = useState<Recipe[]>(MOCK_RECIPES);

  // 1. 헤더 설정
  useHeader({
    isVisible: true,
    title: "추천 레시피",
    right: <IconButton icon="Search" variant="ghost" ariaLabel="레시피 검색" />,
  });

  // 2. 필터링 로직 (Mock)
  const filteredRecipes = recipes.filter(recipe => {
      if (activeFilter === "all") return true;
      if (activeFilter === "korean") return recipe.ckgKndActoNm === "한식";
      if (activeFilter === "western") return recipe.ckgKndActoNm === "양식";
      if (activeFilter === "easy") return recipe.ckgDodfNm === "초급";
      return true; 
  });

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      
      {/* 1. Fixed Filter Area */}
      <div className="shrink-0 z-10 bg-white/95 backdrop-blur shadow-sm pt-2 pb-2 border-b">
        <FilterCarousel
          data={RECIPE_FILTERS}
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

      {/* 2. Scrollable Recipe List */}
      <DataList
        data={filteredRecipes}
        className="flex-1 overflow-y-auto space-y-4 p-4 pb-24 scrollbar-hide"
        
        ListEmptyComponent={
          <EmptyState 
            icon={ChefHat}
            title="조건에 맞는 레시피가 없습니다."
            description="다른 검색어 필터를 선택해보세요."
          />
        }

        renderItem={(recipe) => (
          <MediaCard
            key={recipe.rcpSno}
            imageUrl={recipe.rcpImgUrl}
            title={recipe.rcpTtl}
            description={recipe.ckgIpdc}
            onClick={() => alert(`${recipe.rcpTtl} 상세 보기`)}
            
            // Badge: 카테고리 (한식/양식 등)
            badge={
                <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded">
                    {recipe.ckgKndActoNm}
                </span>
            }

            // Overlay: 시간 & 난이도
            overlay={
                <>
                    <span className="bg-black/50 backdrop-blur text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {recipe.ckgTimeNm}
                    </span>
                    <span className="bg-black/50 backdrop-blur text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                        <ChefHat className="w-3 h-3" /> {recipe.ckgDodfNm}
                    </span>
                </>
            }

            // Footer Left: 작성자
            footerLeft={<span>{recipe.rgtrNm}</span>}

            // Footer Right: 통계 아이콘
            footerRight={
                <>
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {recipe.rcmmCnt}</span>
                    <span className="flex items-center gap-1"><Bookmark className="w-3 h-3" /> {recipe.srapCnt}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {recipe.inqCnt}</span>
                </>
            }
          />
        )}
      />
    </div>
  );
}
