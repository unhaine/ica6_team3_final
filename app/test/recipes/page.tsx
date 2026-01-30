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
            layout="horizontal"
            onClick={() => alert(`${recipe.rcpTtl} 상세 보기`)}
            aspectRatio="square"
            imageClassName="w-24 h-24" // 이미지 크기를 세밀하게 조정
            
            // 이제 태그들을 데이터로만 넘깁니다. 스타일은 안에서 처리함!
            badge={recipe.ckgKndActoNm} 
            metadata={[
                { icon: Clock, label: recipe.ckgTimeNm },
                { icon: ChefHat, label: recipe.ckgDodfNm }
            ]}

            footerLeft={<strong>{recipe.rgtrNm}</strong>}

            footerRight={
                <div className="flex gap-2">
                    <span className="flex items-center gap-0.5"><Heart className="w-3 h-3 fill-red-400 stroke-red-400" /> {recipe.rcmmCnt}</span>
                    <span className="flex items-center gap-0.5"><Bookmark className="w-3 h-3 fill-amber-400 stroke-amber-400" /> {recipe.srapCnt}</span>
                    <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {recipe.inqCnt}</span>
                </div>
            }
          />
        )}
      />
    </div>
  );
}
